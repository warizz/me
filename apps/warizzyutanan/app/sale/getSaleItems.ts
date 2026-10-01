import { readFileSync } from "fs";
import path from "path";

import matter from "gray-matter";
import { z } from "zod";

const itemSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  description: z.string().optional(),
  originalPrice: z.number().positive(),
  salePrice: z.number().positive(),
  note: z.string().optional(),
  status: z.enum(["available", "sold"]),
  addedAt: z.coerce.date(),
  photos: z.array(z.string()).optional(),
});

export type SaleItem = z.infer<typeof itemSchema>;

export function getSaleItems(): SaleItem[] {
  const yaml = readFileSync(
    path.join(process.cwd(), "resource", "sale", "items.yaml"),
    "utf8",
  );
  // gray-matter bundles js-yaml; frontmatter-wrapping is the cheapest way to
  // reuse it for a plain yaml file without a new dependency
  const { data } = matter(`---\n${yaml}\n---`);
  const parsed = z.array(itemSchema).parse(data);
  const rank = (item: SaleItem) => (item.status === "available" ? 0 : 1);
  return parsed.sort((a, b) => rank(a) - rank(b) || +b.addedAt - +a.addedAt);
}
