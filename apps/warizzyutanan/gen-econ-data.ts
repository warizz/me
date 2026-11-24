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

// --- GDP map: IMF WEO real growth (bubble color) + nominal GDP (bubble size) ---
const IMF = "https://www.imf.org/external/datamapper/api/v1";
const GROWTH_IND = "NGDP_RPCH"; // real GDP growth, % annual
const SIZE_IND = "NGDPD"; // nominal GDP, USD billions

const MAP_W = 720,
  MAP_H = 360;
const LON: [number, number] = [-170, 190],
  LAT: [number, number] = [-58, 84];

const px = (p: [number, number]): [number, number] => [
  ((p[0] - LON[0]) / (LON[1] - LON[0])) * MAP_W,
  (1 - (p[1] - LAT[0]) / (LAT[1] - LAT[0])) * MAP_H,
];

function ringPath(ring: number[][]): string {
  return (
    ring
      .map((pt, i) => {
        const [x, y] = px(pt as [number, number]);
        return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ") + "Z"
  );
}

// Polygon (outer + holes) or MultiPolygon -> one SVG d-string
function featurePath(geom: { type: string; coordinates: any }): string {
  const polys = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
  return polys
    .map((poly: number[][][]) => poly.map(ringPath).join(" "))
    .join(" ");
}

// centroid of the largest ring; good enough to place a label dot.
// ponytail: area-weighted is overkill for bubbles — the biggest ring IS the country.
function featureCentroid(geom: {
  type: string;
  coordinates: any;
}): [number, number] {
  const polys = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
  let best: number[][] = [],
    bestLen = 0;
  for (const poly of polys)
    if (poly[0].length > bestLen) {
      best = poly[0];
      bestLen = poly[0].length;
    }
  let sx = 0,
    sy = 0;
  for (const p of best) {
    sx += p[0];
    sy += p[1];
  }
  return px([sx / bestLen, sy / bestLen]);
}

async function fetchImf(
  ind: string,
): Promise<Record<string, Record<string, number>>> {
  // ponytail: node fetch fails TLS here; curl is fine (same as TiDE fetch)
  const raw = execFileSync("curl", ["-sm", "60", `${IMF}/${ind}`], {
    encoding: "utf8",
    maxBuffer: 128 * 1024 * 1024,
  });
  return JSON.parse(raw).values[ind];
}

// IMF datamapper returns aggregates (world, EU, blocs…) alongside countries.
// They'd poison the size scale (world GDP would shrink every real bubble) and
// render phantom bubbles — hardcode the ones observed in the NGDP* payloads.
const AGGREGATES = new Set([
  "ADVEC",
  "AFQ",
  "APQ",
  "AS5",
  "AZQ",
  "BKA",
  "CBQ",
  "CMQ",
  "CAQ",
  "DA",
  "EDE",
  "EMDA",
  "OEMDC",
  "EU",
  "EUQ",
  "EAQ",
  "EEQ",
  "EURO",
  "MAE",
  "MEQ",
  "MECA",
  "NAQ",
  "NMQ",
  "OAE",
  "PIQ",
  "PSQ",
  "SAQ",
  "SEQ",
  "SMQ",
  "SSA",
  "SSQ",
  "UVK",
  "WE",
  "WEQ",
  "WHDQ",
  "WHQ",
  "WLD",
  "WEOWORLD",
]);

// px-centroids for IMF members too small for the 1:110m geojson (SGP is a
// PEERS member — it must render). ponytail: hand list, add when a bubble is missing.
const MISSING: Record<string, [number, number]> = {
  SGP: px([103.8, 1.35]),
  MAC: px([113.5, 22.2]),
  HKG: px([114.2, 22.3]),
  MDV: px([73.5, 3.9]),
  BRB: px([-59.6, 13.2]),
  SYC: px([55.5, -4.6]),
  BHR: px([50.6, 26.2]),
  MUS: px([57.5, -20.3]),
  COM: px([43.3, -11.7]),
  CPV: px([-23.6, 15.1]),
  STP: px([6.7, 0.3]),
  DMA: px([-61.4, 15.3]),
  GRD: px([-61.7, 12.1]),
  KNA: px([-62.7, 17.3]),
  LCA: px([-61.0, 13.9]),
  VCT: px([-61.2, 13.2]),
  ATG: px([-61.8, 17.1]),
  NRU: px([166.9, -0.5]),
  KIR: px([173.0, 1.4]),
  TON: px([-175.2, -21.2]),
  TUV: px([179.2, -8.5]),
  WSM: px([-172.1, -13.6]),
  MHL: px([171.2, 7.1]),
  FSM: px([158.2, 6.9]),
  PLW: px([134.6, 7.5]),
  AND: px([1.5, 42.5]),
  LIE: px([9.5, 47.15]),
  SMR: px([12.5, 43.9]),
};

async function fetchWorld(): Promise<{
  paths: Record<string, string>;
  centers: Record<string, [number, number]>;
}> {
  const raw = execFileSync(
    "curl",
    [
      "-sm",
      "60",
      "-L",
      "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json",
    ],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
  );
  const paths: Record<string, string> = {};
  const centers: Record<string, [number, number]> = {};
  for (const f of JSON.parse(raw).features as { id: string; geometry: any }[]) {
    if (!f.id || f.id === "ATA" || !f.geometry) continue; // skip Antarctica + null ids
    paths[f.id] = featurePath(f.geometry);
    centers[f.id] = featureCentroid(f.geometry);
  }
  return { paths, centers };
}

// --- fetch + compute ---
const main = async () => {
  const results = await Promise.all([
    ...Object.values(SERIES).map(fetchTiDE),
    fetchImf(GROWTH_IND),
    fetchImf(SIZE_IND),
    fetchWorld(),
  ]);
  const [cpiIdx, unemp, gdpIdx, fx, rate, growth, sizes, world] = [
    results[0] as Series,
    results[1] as Series,
    results[2] as Series,
    results[3] as Series,
    results[4] as Series,
    results[5] as Record<string, Record<string, number>>,
    results[6] as Record<string, Record<string, number>>,
    results[7] as {
      paths: Record<string, string>;
      centers: Record<string, [number, number]>;
    },
  ];

  const cpiYoy = yoy(cpiIdx.data, 12);
  const gdpYoy = yoy(gdpIdx.data, 4);
  const rateMap = new Map(rate.data);
  const realRate = cpiYoy
    .filter(([p]) => rateMap.has(p))
    .map(([p, v]) => [p, round(rateMap.get(p)! - v)] as Pt);

  // GDP map: latest year Thailand has a growth value for, capped at the current
  // year (datamapper returns projections far past it — 2031 today)
  const nowYear = new Date().getFullYear();
  const year = [...Object.keys(growth.THA)]
    .reverse()
    .find((y) => growth.THA[y] != null && Number(y) <= nowYear)!;
  const gdpMap: Record<string, { g: number | null; size: number | null }> = {};
  for (const iso of new Set([...Object.keys(growth), ...Object.keys(sizes)])) {
    // skip IMF aggregates (world, EU, emerging-markets blocs…): only countries get bubbles
    if (!/^[A-Z]{3}$/.test(iso) || AGGREGATES.has(iso)) continue;
    const g = growth[iso]?.[year],
      size = sizes[iso]?.[year];
    if (g == null && size == null) continue;
    gdpMap[iso] = {
      g: g == null ? null : round(g),
      size: size == null ? null : round(size),
    };
    // microstates missing from the geojson (SGP…) still need a bubble position
    if (!world.centers[iso]) world.centers[iso] = MISSING[iso];
  }

  // hm3-matrix (user pick): SEA + peers, growth 1998..year — the full year
  // series for the heatmap matrix; only the countries the matrix shows.
  const MATRIX_COUNTRIES = [
    "USA",
    "CHN",
    "JPN",
    "DEU",
    "GBR",
    "KOR",
    "IND",
    "SGP",
    "IDN",
    "MYS",
    "VNM",
    "PHL",
    "THA",
  ];
  const matrixYears: string[] = [];
  for (let y = 1998; y <= Number(year); y++) matrixYears.push(String(y));
  const matrix: Record<string, Record<string, number | null>> = {};
  for (const iso of MATRIX_COUNTRIES) {
    if (!growth[iso]) continue;
    matrix[iso] = {};
    for (const y of matrixYears) matrix[iso][y] = growth[iso][y] ?? null;
  }

  // map year selector: per-year growth for ALL countries (not just the matrix)
  const series: Record<string, Record<string, number | null>> = {};
  for (const [iso, yrs] of Object.entries(growth)) {
    if (!/^[A-Z]{3}$/.test(iso) || AGGREGATES.has(iso)) continue;
    series[iso] = {};
    for (const y of matrixYears) series[iso][y] = yrs[y] ?? null;
  }
  // GDP size bars: nominal GDP by year for the matrix countries
  const sizeMatrix: Record<string, Record<string, number | null>> = {};
  for (const iso of MATRIX_COUNTRIES) {
    if (!sizes[iso]) continue;
    sizeMatrix[iso] = {};
    for (const y of matrixYears) sizeMatrix[iso][y] = sizes[iso][y] ?? null;
  }

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
    gdp_map: {
      year,
      countries: gdpMap, // iso -> { g: real growth %, size: nominal USD bn }
      paths: world.paths,
      centers: world.centers,
      matrix, // hm3 matrix: iso -> year -> real growth %
      series, // year selector: iso -> year -> real growth %
      sizeMatrix, // GDP bars: iso -> year -> nominal USD bn
    },
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
