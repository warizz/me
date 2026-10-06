"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CircleMarker, Map as LeafletMap } from "leaflet";

import "leaflet/dist/leaflet.css";

import {
  maxAlt,
  trekKm,
  tripPhotos,
  type TripPhoto,
} from "../../app/trips/fcs2026/data";

const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIB =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// dark mode: invert + desaturate the OSM raster tiles via CSS
const darkTilesCss = `
.fcs-dark-tiles .leaflet-tile-pane {
  filter: brightness(0.86) invert(1) contrast(0.85) hue-rotate(180deg) saturate(0.7);
}
.fcs-dark-tiles .leaflet-control-attribution {
  background: rgba(0,0,0,0.6);
  color: #bbb;
}
.fcs-dark-tiles .leaflet-control-attribution a {
  color: #7cb7ff;
}
.fcs-pin-active {
  filter: drop-shadow(0 0 6px #fff8b0) brightness(1.6);
  r: 7;
}
`;

function popupHtml(p: (typeof tripPhotos)[number]) {
  const alt = p.alt ? `<br/>${p.alt} m` : "";
  return `<div style="text-align:center">
    <img src="${p.thumb}" width="200" data-fcs-n="${p.n}" style="border-radius:6px;display:block;cursor:zoom-in" loading="lazy" alt="${p.section}" title="Click to enlarge" />
    <span style="font:12px/1.6 ui-monospace,monospace">${p.section}${alt}</span>
  </div>`;
}

function isDark() {
  return typeof document !== "undefined"
    ? document.documentElement.classList.contains("dark")
    : false;
}

function photoLabel(p: TripPhoto) {
  return p.id.replace(/^fcs2026-/, "").toUpperCase();
}

export default function TripJournal() {
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const photoMarkersRef = useRef<Map<number, CircleMarker>>(new Map());
  const openLightboxRef = useRef<(p: TripPhoto) => void>(() => {});
  const [ready, setReady] = useState(false);

  const trekPts = useMemo(
    () =>
      tripPhotos
        .filter((p) => p.seg === "trek" && p.lat != null)
        .map((p) => [p.lat, p.lon] as [number, number]),
    [],
  );

  useEffect(() => {
    let cancelled = false;
    let map: LeafletMap | null = null;
    const cleanup: { ro: ResizeObserver | null } = { ro: null };
    import("leaflet")
      .then((L) => {
        if (cancelled || !mapElRef.current) return;
        map = L.map(mapElRef.current, {
          scrollWheelZoom: false,
          attributionControl: true,
        });
        mapRef.current = map;
        L.tileLayer(TILE_URL, {
          attribution: ATTRIB,
          subdomains: "abc",
          maxZoom: 18,
        }).addTo(map);

        // bus leg Kiruna->Nikkaluokta (dashed) + walking track from Nikkaluokta
        const busPts = tripPhotos
          .filter((p) => p.seg === "bus" && p.lat != null)
          .map((p) => [p.lat, p.lon] as [number, number]);
        const kiruna = tripPhotos
          .filter((p) => p.seg === "kiruna" && p.lat != null)
          .map((p) => [p.lat, p.lon] as [number, number]);
        if (busPts.length)
          L.polyline([...kiruna.slice(-1), ...busPts], {
            color: "#2563eb",
            weight: 4,
            dashArray: "10 8",
            opacity: 0.9,
          }).addTo(map);
        L.polyline(trekPts, { color: "#ea580c", weight: 3 }).addTo(map);

        // trek end = last photo, real finish = Abisko (no photos on the last
        // ~14 km) — dotted continuation for the photoless stretch
        const FINISH: [number, number] = [68.3586, 18.7822]; // Abisko Turiststation
        if (trekPts.length)
          L.polyline([trekPts[trekPts.length - 1], FINISH], {
            color: "#ea580c",
            weight: 2,
            dashArray: "2 7",
            opacity: 0.7,
          }).addTo(map);

        // stage markers — labels must not eat clicks meant for photo pins
        const stage = (pt: [number, number], label: string) =>
          L.marker(pt, {
            interactive: false,
            keyboard: false,
            icon: L.divIcon({
              className: "",
              html: `<span style="pointer-events:none;font:700 11px ui-monospace,monospace;background:#1f2937;color:#fff;padding:2px 6px;border-radius:999px;white-space:nowrap;border:1px solid #4b5563">${label}</span>`,
              iconAnchor: [40, 8],
            }),
          }).addTo(map!);

        if (trekPts.length) stage(trekPts[0], "Nikkaluokta ▶ start");
        const pass = tripPhotos.find((p) => p.alt === maxAlt);
        if (pass?.lat != null && pass?.lon != null)
          stage([pass.lat, pass.lon], `Tjäktjapasset ${maxAlt} m`);
        stage(FINISH, "finish ■ Abisko");

        // photo pins — every photo with GPS is clickable (trek = orange,
        // kiruna/bus = blue so they read as not-walked); pin click opens a
        // thumbnail popover, clicking the popover image opens the lightbox
        for (const p of tripPhotos) {
          if (p.lat == null || p.lon == null) continue;
          const walked = p.seg === "trek";
          const m = L.circleMarker([p.lat, p.lon], {
            radius: walked ? 4 : 5,
            color: walked ? "#ea580c" : "#2563eb",
            fillColor: walked ? "#ea580c" : "#2563eb",
            weight: 2,
            fillOpacity: 0.9,
          })
            .bindPopup(popupHtml(p), { autoPan: true })
            .addTo(map);
          photoMarkersRef.current.set(p.n, m);
        }

        // popover image click -> lightbox
        map.on(
          "popupopen",
          (e: { popup: { getElement: () => HTMLElement } }) => {
            const el = e.popup.getElement();
            const img = el.querySelector("img[data-fcs-n]");
            img?.addEventListener("click", () => {
              const n = Number(img.getAttribute("data-fcs-n"));
              const photo = tripPhotos.find((x) => x.n === n);
              if (photo) {
                map!.closePopup();
                openLightboxRef.current(photo);
              }
            });
          },
        );

        const all = [...busPts, ...trekPts, FINISH];
        // initial view immediately, then fit once the container has real size
        // (a fixed timeout loses the race during first layout)
        const center = all[Math.floor(all.length / 2)];
        map.setView(center, 7);
        let fitted = false;
        const fit = () => {
          if (fitted || !map) return;
          const rect = mapElRef.current?.getBoundingClientRect();
          if (!rect || rect.width < 100) return;
          fitted = true;
          map.invalidateSize();
          map.fitBounds(L.latLngBounds(all).pad(0.15));
        };
        fit();
        cleanup.ro = new ResizeObserver(fit);
        if (mapElRef.current) cleanup.ro.observe(mapElRef.current);
        setReady(true);
      })
      .catch(() => setReady(false));
    return () => {
      cancelled = true;
      cleanup.ro?.disconnect();
      map?.remove();
      mapRef.current = null;
      photoMarkersRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // follow the site theme — same OSM tiles, dark = CSS filter on the tile pane
  useEffect(() => {
    if (!ready || !mapElRef.current) return;
    const el = mapElRef.current;
    const apply = () =>
      el.classList.toggle("fcs-dark-tiles", isDark());
    apply();
    const target = document.documentElement;
    const obs = new MutationObserver(apply);
    obs.observe(target, { attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, [ready]);

  const focus = (n: number) => {
    const p = tripPhotos.find((x) => x.n === n);
    const m = photoMarkersRef.current.get(n);
    const lat = p?.lat;
    const lon = p?.lon;
    if (lat != null && lon != null && mapRef.current) {
      mapElRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      window.setTimeout(() => {
        mapRef.current?.flyTo([lat, lon], 12, { duration: 0.8 });
        const el = m?.getElement();
        el?.classList.add("fcs-pin-active");
        window.setTimeout(() => el?.classList.remove("fcs-pin-active"), 2500);
        window.setTimeout(() => m?.openPopup(), 850);
      }, 350);
    } else if (p) {
      openLightbox(p);
    }
  };

  const sections = useMemo(() => {
    const out: { title: string; photos: typeof tripPhotos }[] = [];
    for (const p of tripPhotos) {
      const last = out[out.length - 1];
      if (last && last.title === p.section) last.photos.push(p);
      else out.push({ title: p.section, photos: [p] });
    }
    return out;
  }, []);

  // ---- lightbox ----
  const [lbIndex, setLbIndex] = useState<number | null>(null);
  const lbPhoto = lbIndex != null ? tripPhotos[lbIndex] : null;

  const closeLightbox = useCallback(() => setLbIndex(null), []);
  const stepLightbox = useCallback(
    (dir: 1 | -1) =>
      setLbIndex((i) =>
        i == null ? i : (i + dir + tripPhotos.length) % tripPhotos.length,
      ),
    [],
  );

  useEffect(() => {
    if (lbIndex == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") stepLightbox(1);
      else if (e.key === "ArrowLeft") stepLightbox(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lbIndex, closeLightbox, stepLightbox]);

  const openLightbox = useCallback((p: TripPhoto) => {
    const idx = tripPhotos.indexOf(p);
    if (idx >= 0) setLbIndex(idx);
  }, []);
  openLightboxRef.current = openLightbox;

  return (
    <div className="not-prose my-8 font-sans">
      <style>{darkTilesCss}</style>
      <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-gray-600 dark:text-gray-400">
        <span>📍 Nikkaluokta → Abisko (Kungsleden)</span>
        <span>🥾 ~110 km official</span>
        <span>⛰️ Tjäktjapasset {maxAlt} m (GPS)</span>
        <span>📸 {tripPhotos.length} photos</span>
      </div>

      <div
        ref={mapElRef}
        className="h-[420px] w-full overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700 lg:h-[520px]"
      />

      <p className="mt-2 font-mono text-xs text-gray-400">
        orange = walked track ({trekKm} km photo-to-photo) · blue dashed = bus
        Kiruna→Nikkaluokta · dotted orange tail = last stretch without photos ·
        dots = photos — click any (blue = Kiruna/bus, orange = trail)
      </p>

      {sections.map((s) => (
        <div key={s.title} className="mt-8">
          <h3 className="mb-2 font-mono text-sm font-bold text-primary dark:text-primary-invert">
            {s.title}
          </h3>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {s.photos.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => focus(p.n)}
                className="group relative cursor-zoom-in overflow-hidden rounded-md"
                style={{ aspectRatio: `${p.w} / ${p.h}` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.thumb}
                  alt={p.section}
                  loading="lazy"
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
                <span className="absolute bottom-1 right-1 hidden rounded bg-black/60 px-1 font-mono text-[10px] text-white group-hover:block">
                  {photoLabel(p)}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {lbPhoto ? (
        <div
          className="fixed inset-0 z-[1000] flex flex-col bg-black/90"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${photoLabel(lbPhoto)}`}
          onClick={closeLightbox}
        >
          <div className="flex items-center justify-between px-4 py-2 font-mono text-xs text-gray-200">
            <span>
              {photoLabel(lbPhoto)}
              {lbPhoto.alt ? ` · ${lbPhoto.alt} m` : ""} · {lbPhoto.section}
            </span>
            <span>
              {(lbIndex ?? 0) + 1}/{tripPhotos.length}
              <button
                type="button"
                className="ml-3 rounded border border-gray-500 px-2 py-0.5 hover:bg-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  closeLightbox();
                }}
              >
                ✕ close
              </button>
            </span>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lbPhoto.img}
              alt={lbPhoto.section}
              className="max-h-full max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              aria-label="Previous photo"
              className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 font-mono text-white hover:bg-black/80"
              onClick={(e) => {
                e.stopPropagation();
                stepLightbox(-1);
              }}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next photo"
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 font-mono text-white hover:bg-black/80"
              onClick={(e) => {
                e.stopPropagation();
                stepLightbox(1);
              }}
            >
              ›
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
