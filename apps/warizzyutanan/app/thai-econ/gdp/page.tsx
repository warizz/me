import fs from "node:fs";
import path from "node:path";

import GdpMap from "../../../components/GdpMap";
import ToolsBar from "../../../components/ToolsBar";

type GdpData = {
  gdp_map: {
    year: string;
    countries: Record<string, { g: number | null; size: number | null }>;
    paths: Record<string, string>;
    centers: Record<string, [number, number]>;
    matrix: Record<string, Record<string, number | null>>;
    series: Record<string, Record<string, number | null>>;
    sizeMatrix: Record<string, Record<string, number | null>>;
  };
};

const D = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "resource/econ/dashboard-data.json"),
    "utf8",
  ),
) as GdpData;

export default function GdpPage() {
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
          padding: 20,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <ToolsBar
            breadcrumbs={[
              { text: "home", href: "/" },
              { text: "thai economy", href: "/thai-econ" },
              { text: "gdp map", href: "/thai-econ/gdp" },
            ]}
          />
        </div>
        <h1 style={{ fontSize: 17, fontWeight: 600 }}>
          GDP world map{" "}
          <span
            style={{
              color: "var(--muted-foreground, #9a9a9a)",
              fontWeight: 400,
              fontSize: 12,
            }}
          >
            growth, size, and Thailand vs the world
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
          data: IMF World Economic Outlook {D.gdp_map.year} — refresh via{" "}
          <code>pnpm gen-econ-data</code>
        </p>
        <GdpMap
          year={D.gdp_map.year}
          countries={D.gdp_map.countries}
          paths={D.gdp_map.paths}
          matrix={D.gdp_map.matrix}
          series={D.gdp_map.series}
          sizeMatrix={D.gdp_map.sizeMatrix}
        />
      </main>
    </div>
  );
}
