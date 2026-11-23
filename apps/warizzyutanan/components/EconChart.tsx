"use client";
import { useRef, useState } from "react";

type Pt = [string, number];
const W = 440,
  H = 120;

export default function EconChart({
  vals,
  color,
  zero,
  band,
}: {
  vals: Pt[];
  color: string;
  zero?: boolean;
  band?: [number, number];
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tt, setTt] = useState<{
    x: number;
    y: number;
    text: string;
    cx: number;
    cy: number;
  } | null>(null);

  const vs = vals.map(([, v]) => v);
  let min = Math.min(...vs),
    max = Math.max(...vs);
  if (zero) {
    min = Math.min(min, 0);
    max = Math.max(max, 0);
  }
  if (band) {
    min = Math.min(min, band[0]);
    max = Math.max(max, band[1]);
  }
  if (max === min) max = min + 1;
  const x = (i: number) => 10 + (i * (W - 20)) / Math.max(vals.length - 1, 1);
  const y = (v: number) => 10 + (H - 25) * (1 - (v - min) / (max - min));
  const path = vals
    .map((_, i) => `${i ? "L" : "M"}${x(i)},${y(vs[i])}`)
    .join(" ");

  const onMove = (e: React.MouseEvent) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const s = Math.min(r.width / W, r.height / H);
    const ox = (r.width - W * s) / 2,
      oy = (r.height - H * s) / 2;
    const mx = (e.clientX - r.left - ox) / s;
    const my = (e.clientY - r.top - oy) / s;
    let best = 0,
      bd = Infinity;
    vals.forEach((p, i) => {
      const d = Math.hypot(x(i) - mx, y(vs[i]) - my);
      if (d < bd) {
        bd = d;
        best = i;
      }
    });
    setTt({
      x: e.clientX,
      y: e.clientY,
      text: `${vals[best][0]} · ${vs[best]}`,
      cx: x(best),
      cy: y(vs[best]),
    });
  };

  return (
    <div style={{ position: "relative" }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        style={{
          display: "block",
          width: "100%",
          height: 120,
          marginTop: 10,
          cursor: "crosshair",
        }}
        onMouseMove={onMove}
        onMouseLeave={() => setTt(null)}
      >
        {band && (
          <rect
            x={10}
            width={W - 20}
            y={y(band[1])}
            height={Math.max(y(band[0]) - y(band[1]), 1)}
            fill="rgba(250,204,21,.07)"
          />
        )}
        {zero && min < 0 && max > 0 && (
          <line
            x1={10}
            x2={W - 10}
            y1={y(0)}
            y2={y(0)}
            stroke="var(--border, #2a2a2a)"
            strokeDasharray="3 3"
          />
        )}
        <path d={path} fill="none" stroke={color} strokeWidth={1.5} />
        <circle
          cx={x(vals.length - 1)}
          cy={y(vs[vs.length - 1])}
          r={2.5}
          fill={color}
        />
        {tt && (
          <circle
            cx={tt.cx}
            cy={tt.cy}
            r={3.5}
            fill={color}
            stroke="#0d0d0d"
            strokeWidth={1.5}
          />
        )}
        <text
          x={10}
          y={H - 4}
          fill="var(--muted-foreground, #9a9a9a)"
          fontSize={9}
          fontFamily="ui-monospace, monospace"
        >
          {vals[0][0]}
        </text>
        <text
          x={W - 10}
          y={H - 4}
          textAnchor="end"
          fill="var(--muted-foreground, #9a9a9a)"
          fontSize={9}
          fontFamily="ui-monospace, monospace"
        >
          {vals[vals.length - 1][0]}
        </text>
        <text
          x={W - 10}
          y={9}
          textAnchor="end"
          fill="var(--muted-foreground, #9a9a9a)"
          fontSize={9}
          fontFamily="ui-monospace, monospace"
        >
          {vs[vs.length - 1]}
        </text>
      </svg>
      {tt && (
        <div
          style={{
            position: "fixed",
            pointerEvents: "none",
            zIndex: 10,
            left: Math.min(tt.x + 14, window.innerWidth - 130),
            top: tt.y - 36,
            background: "#1e1e1e",
            border: "1px solid var(--border, #2a2a2a)",
            borderRadius: 6,
            padding: "4px 8px",
            font: "11px ui-monospace, monospace",
            whiteSpace: "nowrap",
          }}
        >
          {tt.text}
        </div>
      )}
    </div>
  );
}
