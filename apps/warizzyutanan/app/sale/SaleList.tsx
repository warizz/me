"use client";

import { format } from "date-fns";
import { useState } from "react";

import { SaleItem } from "./getSaleItems";
import Lightbox from "./Lightbox";

type StatusFilter = "all" | SaleItem["status"];

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "available", label: "ยังไม่ขาย" },
  { value: "sold", label: "ขายแล้ว" },
];

function baht(price: number) {
  return `฿${price.toLocaleString("en-US")}`;
}

function diffPercent(item: SaleItem) {
  return Math.round((1 - item.salePrice / item.originalPrice) * 100);
}

function Row({ item }: { item: SaleItem }) {
  const sold = item.status === "sold";
  return (
    <tr
      className={`border-b border-black/10 dark:border-white/20 ${sold ? "opacity-50" : ""}`}
    >
      <td className="py-1.5 pr-3">
        <Lightbox photos={item.photos ?? []} title={item.title} compact />
      </td>
      <td className="py-1.5 pr-3 font-bold whitespace-nowrap">{item.title}</td>
      <td className="max-w-48 truncate py-1.5 pr-3">{item.description}</td>
      <td className="max-w-40 truncate py-1.5 pr-3 text-xs">{item.note}</td>
      <td className="py-1.5 pr-3 text-right font-mono">
        <s className="text-black/60 dark:text-white/60">
          {baht(item.originalPrice)}
        </s>
      </td>
      <td className="py-1.5 pr-3 text-right font-mono font-bold">
        {baht(item.salePrice)}
      </td>
      <td className="py-1.5 pr-3 text-right font-mono text-green-700 dark:text-green-400">
        -{diffPercent(item)}%
      </td>
      <td className="py-1.5 pr-3">
        {sold ? (
          <span className="text-xs font-black text-red-600 dark:text-red-400">
            ขายแล้ว
          </span>
        ) : (
          <span className="text-xs text-green-700 dark:text-green-400">
            ● ยังไม่ขาย
          </span>
        )}
      </td>
      <td className="py-1.5 text-right font-mono text-xs whitespace-nowrap text-black/60 dark:text-white/60">
        {format(item.addedAt, "d MMM yyyy")}
      </td>
    </tr>
  );
}

function MobileCard({ item }: { item: SaleItem }) {
  const sold = item.status === "sold";
  return (
    <li
      className={`flex gap-3 border-b border-black/10 py-2 dark:border-white/20 ${sold ? "opacity-50" : ""}`}
    >
      <div className="shrink-0">
        <Lightbox photos={item.photos ?? []} title={item.title} compact />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold">
          {item.title}
          {sold && (
            <span className="ml-2 text-xs font-black text-red-600 dark:text-red-400">
              ขายแล้ว
            </span>
          )}
        </p>
        {item.description && (
          <p className="truncate text-sm">{item.description}</p>
        )}
        {item.note && (
          <p className="truncate text-xs text-black/60 dark:text-white/60">
            note: {item.note}
          </p>
        )}
        <p className="font-mono text-sm">
          <s className="text-black/60 dark:text-white/60">
            {baht(item.originalPrice)}
          </s>{" "}
          <span className="font-bold">{baht(item.salePrice)}</span>{" "}
          <span className="text-green-700 dark:text-green-400">
            -{diffPercent(item)}%
          </span>
        </p>
        <p className="font-mono text-xs text-black/60 dark:text-white/60">
          added {format(item.addedAt, "d MMM yyyy")}
        </p>
      </div>
    </li>
  );
}

export default function SaleList({ items }: { items: SaleItem[] }) {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const visible = items.filter(
    (item) => filter === "all" || item.status === filter,
  );

  return (
    <>
      <div
        className="mb-3 flex gap-3 font-mono text-xs"
        data-testid="sale-filters"
      >
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`cursor-pointer ${
              filter === value
                ? "font-black text-primary dark:text-primary-invert"
                : "text-black/60 hover:text-primary dark:text-white/60 dark:hover:text-primary-invert"
            }`}
          >
            {`[ ${label} ]`}
          </button>
        ))}
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-black/20 text-left text-xs text-black/60 uppercase dark:border-white/30 dark:text-white/60">
              <th className="py-1.5 pr-3">Photo</th>
              <th className="py-1.5 pr-3">Title</th>
              <th className="py-1.5 pr-3">Description</th>
              <th className="py-1.5 pr-3">Note</th>
              <th className="py-1.5 pr-3 text-right">Original</th>
              <th className="py-1.5 pr-3 text-right">Sale</th>
              <th className="py-1.5 pr-3 text-right">Diff</th>
              <th className="py-1.5 pr-3">Status</th>
              <th className="py-1.5 text-right">Added</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <Row key={item.id} item={item} />
            ))}
          </tbody>
        </table>
      </div>
      <ul className="md:hidden">
        {visible.map((item) => (
          <MobileCard key={item.id} item={item} />
        ))}
      </ul>
    </>
  );
}
