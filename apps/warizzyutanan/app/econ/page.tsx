import fs from "node:fs";
import path from "node:path";

import EconChart from "../../components/EconChart";

type Pt = [string, number];
type Data = {
  ca: Pt[];
  cpi_yoy: Pt[];
  fx: Pt[];
  gdp: Pt[];
  policy_rate: Pt[];
  real_rate: Pt[];
  sahm: Pt[];
  unemp: Pt[];
  asof: Record<string, string>;
};

const D = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "resource/econ/dashboard-data.json"),
    "utf8",
  ),
) as Data;

type Card = {
  key: keyof Omit<Data, "asof">;
  title: string;
  unit: string;
  cut?: number;
  zero?: boolean;
  band?: [number, number];
  meaning: string;
  reading: string;
  status: (v: number) => [cls: "ok" | "warn" | "bad", label: string];
};

const CARDS: Card[] = [
  {
    key: "cpi_yoy",
    title: "Inflation (CPI YoY)",
    unit: "%",
    cut: 120,
    band: [1, 3],
    meaning:
      "How much the price of everyday stuff (food, rent, fuel) went up compared to the same month a year ago.",
    reading:
      "Prices rose 3.9% vs a year ago — just above the 1–3% comfort zone. Rising since mid-2025 (oil prices feed through).",
    status: (v) =>
      v < 0
        ? ["bad", "deflation"]
        : v > 3
          ? ["warn", "above target"]
          : ["ok", "within target"],
  },
  {
    key: "sahm",
    title: "Thai-Sahm Rule",
    unit: "pp",
    cut: 154,
    meaning:
      "Compares unemployment now with its lowest point in the past year. A jump means jobs are disappearing fast — a classic early sign of recession.",
    reading:
      "The job alarm reads 0.35 — yellow-watch. It was ~0.2 through 2025, now creeping up. Not recession-level (0.5+), but the trend matters.",
    status: (v) =>
      v >= 0.5
        ? ["bad", "recession signal"]
        : v >= 0.33
          ? ["warn", "watch"]
          : ["ok", "no signal"],
  },
  {
    key: "real_rate",
    title: "Real Policy Rate",
    unit: "%",
    cut: 154,
    meaning:
      "The interest rate minus inflation. Shows the REAL cost of borrowing — high slows the economy, negative means money is basically free.",
    reading:
      "At the last usable reading, loans cost 2.45% more than inflation — mildly tight. BOT hasn’t moved rates since mid-2025 while inflation rose, so the real rate is quietly falling.",
    status: (v) =>
      v > 3
        ? ["warn", "tight"]
        : v < 0
          ? ["ok", "accommodative"]
          : ["ok", "neutral"],
  },
  {
    key: "policy_rate",
    title: "Policy Rate",
    unit: "%",
    cut: 154,
    meaning:
      "The interest rate the central bank (BOT) charges. Their main knob — raise it to cool prices, cut it to boost spending.",
    reading:
      "BOT’s rate is 1.75% (unchanged since mid-2025). With inflation back above 3%, pressure to raise is building.",
    status: () => ["ok", "BOT policy rate"],
  },
  {
    key: "unemp",
    title: "Unemployment",
    unit: "%",
    cut: 154,
    meaning:
      "The share of people looking for work who can’t find any. Low = healthy job market.",
    reading:
      "0.86% of job-seekers can’t find work — but it has ticked up slightly in 2026, matching the rising job alarm.",
    status: (v) => (v > 2 ? ["warn", "elevated for TH"] : ["ok", "low"]),
  },
  {
    key: "fx",
    title: "USD/THB",
    unit: "฿",
    cut: 154,
    meaning:
      "How many baht one US dollar buys. Higher = weaker baht (imports cost more, exports cheaper for foreigners).",
    reading:
      "One dollar costs 33.7 baht — baht slightly weaker than its 2021–24 average (~32). Mild import inflation pressure.",
    status: (v) =>
      v > 37
        ? ["warn", "weak baht"]
        : v > 35
          ? ["warn", "soft"]
          : ["ok", "stable"],
  },
  {
    key: "gdp",
    title: "GDP Growth",
    unit: "%",
    cut: 131,
    zero: true,
    meaning:
      "The total value of everything Thailand produced. Going up = the economy is making more than last year.",
    reading:
      "The economy grew 2.87% in Q2 2026 vs a year earlier — steady, not booming. Thailand grows ~2–3% these days.",
    status: (v) =>
      v < 0
        ? ["bad", "contraction"]
        : v < 1
          ? ["warn", "stall"]
          : ["ok", "expanding"],
  },
  {
    key: "ca",
    title: "Current Account",
    unit: "% GDP",
    zero: true,
    meaning:
      "The country’s bank statement with the world — money earned from exports and tourists minus money spent on imports.",
    reading:
      "Thailand earns −1.15% of GDP less than it spends abroad (IMF estimate for 2026) — a small deficit, mostly the oil bill.",
    status: (v) => (v < 0 ? ["warn", "deficit"] : ["ok", "surplus"]),
  },
];

const COLORS = {
  ok: "var(--good, #4ade80)",
  warn: "var(--warn, #facc15)",
  bad: "var(--bad, #f87171)",
};

export default function EconPage() {
  return (
    <div
      style={{
        background: "#0d0d0d",
        minHeight: "100vh",
        color: "#e6e6e6",
      }}
    >
    <main
      style={{
        padding: "20px",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: 17, fontWeight: 600 }}>
        Thai Econ Dashboard{" "}
        <span
          style={{
            color: "var(--muted-foreground, #9a9a9a)",
            fontWeight: 400,
            fontSize: 12,
          }}
        >
          recession-style indicators, Thailand
        </span>
      </h1>
      <p
        style={{
          color: "var(--muted-foreground, #9a9a9a)",
          fontSize: 11,
          fontFamily: "ui-monospace, monospace",
          marginTop: 4,
        }}
      >
        as of: CPI {D.asof.cpi} · unemployment {D.asof.unemp} · FX {D.asof.fx} ·
        policy rate {D.asof.policy} (BOT) · GDP {D.asof.gdp} — data: TiDE
        (BOT/PIER); refresh via <code>pnpm gen-econ-data</code>
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))",
          gap: 14,
          marginTop: 16,
        }}
      >
        {CARDS.map((c) => {
          const all = D[c.key];
          const vals = all.slice(-(c.cut ?? all.length));
          const [cls, label] = c.status(vals[vals.length - 1][1]);
          return (
            <section
              key={c.key}
              className="econ-card"
              style={{
                background: "var(--card, #161616)",
                border: "1px solid var(--border, #2a2a2a)",
                borderRadius: 8,
                padding: 14,
              }}
            >
              <h2
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--muted-foreground, #9a9a9a)",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                }}
              >
                {c.title}
              </h2>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--muted-foreground, #9a9a9a)",
                  fontFamily: "ui-monospace, monospace",
                  marginTop: 2,
                }}
              >
                {vals[0][0]} – {vals[vals.length - 1][0]}
              </div>
              <p
                style={{
                  fontSize: 11.5,
                  lineHeight: 1.55,
                  color: "var(--muted-foreground, #9a9a9a)",
                  margin: "6px 0 2px",
                }}
              >
                {c.meaning}
              </p>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 600,
                  fontFamily: "ui-monospace, monospace",
                  marginTop: 6,
                }}
              >
                {vals[vals.length - 1][1]}
                <small
                  style={{
                    fontSize: 12,
                    color: "var(--muted-foreground, #9a9a9a)",
                    fontWeight: 400,
                  }}
                >
                  {" "}
                  {c.unit}
                </small>
              </div>
              <span
                className={`pill pill-${cls}`}
                style={{
                  display: "inline-block",
                  fontSize: 10,
                  fontFamily: "ui-monospace, monospace",
                  padding: "2px 8px",
                  borderRadius: 10,
                  marginTop: 6,
                  background:
                    cls === "ok"
                      ? "rgba(74,222,128,.12)"
                      : cls === "warn"
                        ? "rgba(250,204,21,.12)"
                        : "rgba(248,113,113,.12)",
                  color:
                    cls === "ok"
                      ? "#4ade80"
                      : cls === "warn"
                        ? "#facc15"
                        : "#f87171",
                }}
              >
                {label}
              </span>
              <EconChart
                vals={vals}
                color={COLORS[cls]}
                zero={c.zero}
                band={c.band}
              />
              <p
                style={{
                  fontSize: 12,
                  lineHeight: 1.55,
                  color: "var(--muted-foreground, #9a9a9a)",
                  marginTop: 8,
                }}
              >
                {c.reading}
              </p>
            </section>
          );
        })}
      </div>
    </main>
    </div>
  );
}
