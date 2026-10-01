import type { Metadata } from "next";

import ColorSchemeToggle from "../../components/ColorSchemeToggle";
import { getSaleItems } from "./getSaleItems";
import SaleList from "./SaleList";

export const metadata: Metadata = {
  title: "Garage sale",
  robots: { index: false, follow: false },
};

export default async function SalePage() {
  const items = getSaleItems();

  return (
    <main className="text-black dark:text-white">
      <div className="flex justify-end">
        <ColorSchemeToggle />
      </div>
      <h1 className="mb-3">Garage sale</h1>
      <SaleList items={items} />
    </main>
  );
}
