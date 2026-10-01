import { format } from "date-fns";
import type { Metadata } from "next";

import { getSaleItems, SaleItem } from "./getSaleItems";
import Lightbox from "./Lightbox";

export const metadata: Metadata = {
  title: "Garage sale",
  robots: { index: false, follow: false },
};

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
      <td className="py-1.5 pr-3 max-w-48 truncate">{item.description}</td>
      <td className="py-1.5 pr-3 max-w-40 truncate text-xs">{item.note}</td>
      <td className="py-1.5 pr-3 text-right font-mono">
        <s className="text-black/50 dark:text-white/50">
          {baht(item.originalPrice)}
        </s>
      </td>
      <td className="py-1.5 pr-3 text-right font-mono font-bold">
        {baht(item.salePrice)}
      </td>
      <td className="py-1.5 pr-3 text-right font-mono text-green-600 dark:text-green-400">
        -{diffPercent(item)}%
      </td>
      <td className="py-1.5 pr-3">
        {sold ? (
          <span className="text-xs font-black uppercase text-red-600 dark:text-red-400">
            sold
          </span>
        ) : (
          <span className="text-xs text-green-600 dark:text-green-400">●</span>
        )}
      </td>
      <td className="py-1.5 text-right font-mono text-xs text-black/50 dark:text-white/50 whitespace-nowrap">
        {format(item.addedAt, "d MMM yyyy")}
      </td>
    </tr>
  );
}

function MobileCard({ item }: { item: SaleItem }) {
  const sold = item.status === "sold";
  return (
    <li
      className={`flex gap-3 border-b border-black/10 dark:border-white/20 py-2 ${sold ? "opacity-50" : ""}`}
    >
      <div className="shrink-0">
        <Lightbox photos={item.photos ?? []} title={item.title} compact />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold">
          {item.title}
          {sold && (
            <span className="ml-2 text-xs font-black uppercase text-red-600 dark:text-red-400">
              sold
            </span>
          )}
        </p>
        {item.description && (
          <p className="text-sm truncate">{item.description}</p>
        )}
        {item.note && (
          <p className="text-xs truncate text-black/60 dark:text-white/60">
            note: {item.note}
          </p>
        )}
        <p className="font-mono text-sm">
          <s className="text-black/50 dark:text-white/50">
            {baht(item.originalPrice)}
          </s>{" "}
          <span className="font-bold">{baht(item.salePrice)}</span>{" "}
          <span className="text-green-600 dark:text-green-400">
            -{diffPercent(item)}%
          </span>
        </p>
        <p className="text-xs text-black/40 dark:text-white/40 font-mono">
          added {format(item.addedAt, "d MMM yyyy")}
        </p>
      </div>
    </li>
  );
}

export default async function SalePage() {
  const items = getSaleItems();

  return (
    <main>
      <h1 className="mb-3">Garage sale</h1>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-black/20 dark:border-white/30 text-left text-xs uppercase text-black/50 dark:text-white/50">
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
            {items.map((item) => (
              <Row key={item.id} item={item} />
            ))}
          </tbody>
        </table>
      </div>
      <ul className="md:hidden">
        {items.map((item) => (
          <MobileCard key={item.id} item={item} />
        ))}
      </ul>
    </main>
  );
}
