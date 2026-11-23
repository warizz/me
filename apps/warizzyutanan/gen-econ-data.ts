import { execFileSync } from "node:child_process";
// Fetches Thai economic series from TiDE (tide.pier.or.th, BOT/PIER) and
// computes the dashboard dataset. Run: npx tsx gen-econ-data.ts (or pnpm gen-econ-data)
// TiDE embeds Highcharts series as `data: [[ms, val], ...]` in the chart page HTML.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SERIES: Record<string, string> = {
  cpiIdx: "CPIA0", // Consumer Price Index (Whole Kingdom), monthly
  unemp: "RLLFSWKM00079", // Unemployment Rate Nationwide, monthly
  gdpIdx: "GDPA00R", // GDP CVM, quarterly
  fx: "XTRSV00000M00705", // THB per USD, end of period, monthly
  rate: "FMRTINTM00001", // BOT policy rate, monthly
};

type Pt = [string, number];
type Series = { name: string; data: Pt[] };

async function fetchTiDE(code: string): Promise<Series> {
  // ponytail: node fetch fails TLS on this machine (missing local CA); curl is fine
  const html = execFileSync(
    "curl",
    ["-sm", "40", `https://tide.pier.or.th/chart/${code}`],
    { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 },
  );
  const i = html.indexOf("data: [["); // first array literal is the series; config fns use `data: function`
  if (i < 0) throw new Error(`${code}: no series data in page`);
  const j = html.indexOf("]]", i);
  const raw: [number, number][] = JSON.parse(html.slice(i + 6, j + 2));
  // ms epoch (UTC+7 in source) -> YYYY-MM
  const data: Pt[] = raw.map(([ms, v]) => [
    new Date(ms - 7 * 3600 * 1000).toISOString().slice(0, 7),
    v,
  ]);
  const nm = html.match(/<title>([^<]+)<\/title>/);
  return { name: nm ? nm[1].trim() : code, data };
}

const yoy = (s: Pt[], lag: number): Pt[] =>
  s.slice(lag).map(([p, v], i) => [p, round((v / s[i][1] - 1) * 100)]);

const round = (n: number) => Math.round(n * 100) / 100;

function sahm(u: Pt[]): Pt[] {
  const out: Pt[] = [];
  for (let i = 13; i < u.length; i++) {
    const win = u.slice(i - 12, i + 1).map(([, v]) => v);
    out.push([
      u[i][0],
      round(win.slice(-3).reduce((a, b) => a + b) / 3 - Math.min(...win)),
    ]);
  }
  return out;
}

// --- fetch + compute ---
const main = async () => {
  const [cpiIdx, unemp, gdpIdx, fx, rate] = await Promise.all(
    Object.values(SERIES).map(fetchTiDE),
  );

  const cpiYoy = yoy(cpiIdx.data, 12);
  const gdpYoy = yoy(gdpIdx.data, 4);
  const rateMap = new Map(rate.data);
  const realRate = cpiYoy
    .filter(([p]) => rateMap.has(p))
    .map(([p, v]) => [p, round(rateMap.get(p)! - v)] as Pt);

  const payload = {
    // ponytail: current account snapshot pasted from IMF WEO (keyless API rate-limits);
    // re-check values at https://www.imf.org/external/datamapper/BCA_NGDPD@WEO/THA when refreshing
    ca: [
      ["2015", 8.14],
      ["2016", 10.72],
      ["2017", 11.19],
      ["2018", 6.67],
      ["2019", 7.05],
      ["2020", 3.99],
      ["2021", -2.32],
      ["2022", -3.43],
      ["2023", 1.64],
      ["2024", 2.19],
      ["2025", 3.02],
      ["2026", -1.15],
    ] as Pt[],
    cpi_yoy: cpiYoy,
    fx: fx.data,
    gdp: gdpYoy,
    policy_rate: rate.data,
    real_rate: realRate,
    sahm: sahm(unemp.data),
    unemp: unemp.data,
    asof: {
      cpi: cpiYoy.at(-1)![0],
      unemp: unemp.data.at(-1)![0],
      fx: fx.data.at(-1)![0],
      policy: rate.data.at(-1)![0],
      gdp: gdpYoy.at(-1)![0],
    },
  };

  const out = join(__dirname, "resource", "econ", "dashboard-data.json");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(payload) + "\n");
  console.log(
    `wrote ${out} — CPI ${payload.asof.cpi}, unemp ${payload.asof.unemp}, GDP ${payload.asof.gdp}`,
  );
};

main();
