"use client";
import { useState } from "react";

type Country = { g: number | null; size: number | null };

const NAMES: Record<string, string> = {
  THA: "Thailand",
  SGP: "Singapore",
  JPN: "Japan",
  KOR: "South Korea",
  TWN: "Taiwan",
  AUS: "Australia",
  USA: "United States",
  DEU: "Germany",
  GBR: "United Kingdom",
  MYS: "Malaysia",
  IDN: "Indonesia",
  VNM: "Vietnam",
  PHL: "Philippines",
  BRN: "Brunei",
  KHM: "Cambodia",
  LAO: "Laos",
  MMR: "Myanmar",
  TLS: "Timor-Leste",
  CHN: "China",
  IND: "India",
};

// hm 5 (user pick): continuous diverging gradient, centered at Thailand's growth.
// (g - THA_G) is the signal: negative = below THA (red), positive = above (green).
const THA_G = 2; // center of the scale, ~Thailand's growth; keep in sync with data
const lerpHex = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `#${pa
    .map((v, i) =>
      Math.round(v + (pb[i] - v) * t)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
};
const heat = (g: number | null) => {
  if (g == null) return "#2a2a2a";
  const v = g - THA_G;
  if (v < 0) return lerpHex("#f87171", "#7f1d1d", Math.min(Math.abs(v) / 6, 1));
  return lerpHex("#14532d", "#4ade80", Math.min(v / 6, 1));
};

const MUTED = "#9a9a9a",
  MONO = "ui-monospace, monospace";
const YearToggle = ({
  years,
  value,
  onChange,
}: {
  years: string[];
  value: string;
  onChange: (yr: string) => void;
}) => (
  <div
    data-testid="gdp-year-toggle"
    role="group"
    aria-label="year"
    style={{
      display: "inline-flex",
      flexWrap: "wrap",
      gap: 0,
      border: "1px solid #2a2a2a",
      borderRadius: 6,
      overflow: "hidden",
      marginTop: 8,
      maxWidth: "100%",
    }}
  >
    {years
      .slice()
      .reverse()
      .map((yr) => {
        const active = yr === value;
        return (
          <button
            key={yr}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(yr)}
            style={{
              background: active ? "#262626" : "transparent",
              color: active ? "#ffffff" : "#9a9a9a",
              border: "none",
              borderRight: "1px solid #2a2a2a",
              padding: "3px 7px",
              fontFamily: MONO,
              fontSize: 10.5,
              cursor: "pointer",
              lineHeight: 1.4,
            }}
          >
            {yr.slice(2)}
          </button>
        );
      })}
  </div>
);

export default function GdpMap({
  year,
  countries,
  paths,
  matrix,
  series,
  sizeMatrix,
}: {
  year: string;
  countries: Record<string, Country>;
  paths: Record<string, string>;
  matrix: Record<string, Record<string, number | null>>;
  series: Record<string, Record<string, number | null>>;
  sizeMatrix: Record<string, Record<string, number | null>>;
}) {
  const [selYear, setSelYear] = useState<string>(year);

  const money = (bn: number) =>
    bn >= 1000 ? `$${Math.round(bn / 100) / 10}t` : `$${Math.round(bn)}bn`;

  // hm3 matrix (user pick): SEA + peers, 1998..year
  const rows = Object.entries(matrix);
  const years = rows.length ? Object.keys(rows[0][1]) : [];

  // GDP size bars: same countries, values for the selected year
  const barRows = Object.entries(sizeMatrix)
    .map(([iso, byYear]) => [iso, byYear[selYear] ?? null] as const)
    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));
  const barMax = Math.max(...barRows.map(([, v]) => v ?? 0), 1);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(460px, 100%), 1fr))",
        gap: 14,
        marginTop: 16,
      }}
    >
      <section
        style={{
          background: "var(--card, #161616)",
          border: "1px solid var(--border, #2a2a2a)",
          borderRadius: 8,
          padding: 14,
          gridColumn: "1 / -1",
        }}
      >
        <h2
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: MUTED,
            textTransform: "uppercase",
            letterSpacing: "0.6px",
            margin: 0,
          }}
        >
          The world by GDP growth
        </h2>
        <YearToggle years={years} value={selYear} onChange={setSelYear} />
        <svg
          data-testid="gdp-map"
          viewBox="0 0 720 360"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            marginTop: 8,
          }}
        >
          {Object.entries(paths).map(([iso, d]) => {
            const th = iso === "THA";
            return (
              <path
                key={`p-${iso}`}
                data-iso={iso}
                d={d}
                fill={heat(series[iso]?.[selYear] ?? null)}
                fillOpacity={series[iso]?.[selYear] == null ? 0.5 : 1}
                stroke={th ? "#ffffff" : "#0d0d0d"}
                strokeWidth={th ? 1.2 : 0.4}
              >
                <title>
                  {`${NAMES[iso] ?? iso} — growth ${selYear}: ${
                    series[iso]?.[selYear] == null
                      ? "n/a"
                      : `${series[iso][selYear]}%`
                  } (Thailand: ${
                    series.THA?.[selYear] == null
                      ? "n/a"
                      : `${series.THA[selYear]}%`
                  }) · GDP: ${
                    countries[iso]?.size == null
                      ? "n/a"
                      : `$${Math.round(countries[iso].size!)}bn`
                  }`}
                </title>
              </path>
            );
          })}
          {Array.from({ length: 41 }, (_, i) => (
            <rect
              key={`lg-${i}`}
              x={8 + i * 3}
              y={386}
              width={3}
              height={7}
              fill={heat(THA_G - 6 + i * 0.3)}
            />
          ))}
          <text
            x={8}
            y={382}
            fontSize={7}
            fill="#888"
            textAnchor="start"
            style={{ fontFamily: MONO }}
          >
            {THA_G - 6}%
          </text>
          <text
            x={68}
            y={382}
            fontSize={7}
            fill="#888"
            textAnchor="middle"
            style={{ fontFamily: MONO }}
          >
            THA {THA_G}%
          </text>
          <text
            x={128}
            y={382}
            fontSize={7}
            fill="#888"
            textAnchor="end"
            style={{ fontFamily: MONO }}
          >
            +{THA_G + 6}%
          </text>
        </svg>
        <p
          style={{
            fontSize: 11,
            color: MUTED,
            margin: "6px 0 0",
            lineHeight: 1.5,
          }}
        >
          Real GDP growth, IMF WEO (projection for latest years) — {selYear},
          continuous scale centered on Thailand ({THA_G}%):{" "}
          <span style={{ color: "#f87171" }}>
            redder = growing slower than Thailand
          </span>
          , <span style={{ color: "#4ade80" }}>greener = growing faster</span>,
          gray = no data. Thailand outlined white. Hover any country for its
          numbers.
        </p>
        <div
          data-testid="gdp-size-bars"
          style={{
            marginTop: 18,
            paddingTop: 14,
            borderTop: "1px solid var(--border, #2a2a2a)",
          }}
        >
          <h2
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: MUTED,
              textTransform: "uppercase",
              letterSpacing: "0.6px",
              margin: 0,
            }}
          >
            GDP size · same countries
          </h2>
          <svg
            data-testid="gdp-size-svg"
            viewBox="0 0 520 264"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              marginTop: 8,
            }}
          >
            {barRows.map(([iso, v], i) => {
              const w = ((v ?? 0) / barMax) * 372;
              const y = 8 + i * 20;
              const th = iso === "THA";
              return (
                <g key={iso}>
                  <text
                    x="4"
                    y={y + 11}
                    fontSize={10}
                    fill={th ? "#ffffff" : MUTED}
                    textAnchor="start"
                    style={{ fontFamily: MONO }}
                  >
                    {th ? "Thailand" : (NAMES[iso] ?? iso)}
                  </text>
                  <rect
                    data-iso={iso}
                    x="108"
                    y={y}
                    width={w.toFixed(1)}
                    height={12}
                    rx={2}
                    fill={heat(matrix[iso]?.[selYear] ?? null)}
                    fillOpacity={0.9}
                    stroke={th ? "#ffffff" : "none"}
                    strokeWidth={th ? 1 : 0}
                  >
                    <title>
                      {`${NAMES[iso] ?? iso} — GDP ${selYear}: ${
                        v == null ? "n/a" : `$${Math.round(v)}bn`
                      } · growth: ${matrix[iso]?.[selYear] ?? "n/a"}%`}
                    </title>
                  </rect>
                  <text
                    x={114 + w}
                    y={y + 11}
                    fontSize={9}
                    fill={MUTED}
                    textAnchor="start"
                    style={{ fontFamily: MONO }}
                  >
                    {money(v ?? 0)}
                  </text>
                </g>
              );
            })}
          </svg>
          <p
            style={{
              fontSize: 11,
              color: MUTED,
              margin: "8px 0 0",
              lineHeight: 1.5,
            }}
          >
            Bar length = nominal GDP (USD, linear — the honest gap). Bar color =
            that year's growth on the same scale. Linear makes the US dwarf
            everyone; switch to 1998 to see Thailand's economy grow ~5x since.
          </p>
        </div>
      </section>

      <section
        data-testid="gdp-developed"
        style={{
          background: "var(--card, #161616)",
          border: "1px solid var(--border, #2a2a2a)",
          borderRadius: 8,
          padding: 14,
          gridColumn: "1 / -1",
        }}
      >
        <h2
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: MUTED,
            textTransform: "uppercase",
            letterSpacing: "0.6px",
            margin: 0,
          }}
        >
          SEA + peers · real GDP growth, 1998–{year}
        </h2>
        <div style={{ display: "flex", marginTop: 8 }}>
          <div style={{ flex: "0 0 auto", paddingRight: 4, paddingTop: 15 }}>
            {rows.map(([iso]) => (
              <div
                key={`rl-${iso}`}
                style={{
                  fontSize: 9,
                  lineHeight: "18px",
                  height: 18,
                  whiteSpace: "nowrap",
                  color: iso === "THA" ? "#ffffff" : "#bbb",
                  fontFamily: MONO,
                  textAlign: "right",
                }}
              >
                {NAMES[iso] ?? iso}
              </div>
            ))}
            <div style={{ height: 30 }} />
          </div>
          <div
            data-testid="gdp-matrix-scroll"
            style={{ overflowX: "auto", flex: "1 1 auto", minWidth: 0 }}
          >
            <svg
              data-testid="gdp-matrix"
              viewBox={`0 0 ${66 + years.length * 18 + 8} ${14 + rows.length * 18 + 34}`}
              width={66 + years.length * 18 + 8}
              style={{ display: "block" }}
            >
              {years.map((yr, c) => (
                <text
                  key={`y-${yr}`}
                  x={66 + c * 18 + 9}
                  y={10}
                  fontSize={7}
                  fill="#888"
                  textAnchor="middle"
                  style={{ fontFamily: MONO }}
                >
                  {yr.slice(2)}
                </text>
              ))}
              {rows.map(([iso], r) =>
                years.map((yr, c) => {
                  const v = matrix[iso]?.[yr] ?? null;
                  const th = iso === "THA";
                  return (
                    <rect
                      key={`c-${iso}-${yr}`}
                      data-iso={iso}
                      data-year={yr}
                      x={66 + c * 18 + 1}
                      y={14 + r * 18 + 1}
                      width={16}
                      height={16}
                      rx={2}
                      fill={heat(v)}
                      stroke={th ? "#ffffff" : "none"}
                      strokeWidth={th ? 0.8 : 0}
                    >
                      <title>
                        {`${NAMES[iso] ?? iso} ${yr}: ${v == null ? "n/a" : `${v}%`}`}
                      </title>
                    </rect>
                  );
                }),
              )}
              {Array.from({ length: 41 }, (_, i) => (
                <rect
                  key={`lg-${i}`}
                  x={66 + i * 3}
                  y={14 + rows.length * 18 + 12}
                  width={3}
                  height={7}
                  fill={heat(THA_G - 6 + i * 0.3)}
                />
              ))}
              <text
                x={66}
                y={14 + rows.length * 18 + 8}
                fontSize={7}
                fill="#888"
                textAnchor="start"
                style={{ fontFamily: MONO }}
              >
                {THA_G - 6}%
              </text>
              <text
                x={126}
                y={14 + rows.length * 18 + 8}
                fontSize={7}
                fill="#888"
                textAnchor="middle"
                style={{ fontFamily: MONO }}
              >
                THA {THA_G}%
              </text>
              <text
                x={186}
                y={14 + rows.length * 18 + 8}
                fontSize={7}
                fill="#888"
                textAnchor="end"
                style={{ fontFamily: MONO }}
              >
                +{THA_G + 6}%
              </text>
            </svg>
          </div>
        </div>
        <p
          style={{
            fontSize: 11,
            color: MUTED,
            margin: "8px 0 0",
            lineHeight: 1.5,
          }}
        >
          The same color scale as the map, 1998–{year}: the Asian crisis hits
          Thailand (−7.6%) and its neighbors, 2008 dents everyone, COVID sinks
          every row, and the last decade shows Thailand stuck at ~2% while
          Vietnam and India run 5–8%. Hover any cell for the number.
        </p>
      </section>
    </div>
  );
}
