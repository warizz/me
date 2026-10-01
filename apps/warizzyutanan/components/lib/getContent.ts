import fs from "fs";
import path from "path";

import matter from "gray-matter";

export const contentDirectory = path.join(process.cwd(), "resource", "content");

// Frontmatter values come from YAML untyped — coerce to string without
// risking "[object Object]" (objects fall back to "" so downstream
// fallback chains like extractHeading can kick in).
export function fmString(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  if (value instanceof Date) return value.toISOString();
  return "";
}

export interface RawContent {
  fileName: string;
  id: string;
  data: Record<string, unknown>;
  markdownString: string;
}

function hasTag(data: Record<string, unknown>, tag: string) {
  return Array.isArray(data.tags) && data.tags.includes(tag);
}

export function getContentFileNames(tag?: string) {
  return fs
    .readdirSync(contentDirectory)
    .filter(
      (fileName) =>
        fileName.endsWith(".md") &&
        (!tag ||
          hasTag(
            matter(
              fs.readFileSync(path.join(contentDirectory, fileName), "utf8"),
            ).data,
            tag,
          )),
    );
}

export function getContent(fileName: string): RawContent {
  const meta = matter(
    fs.readFileSync(path.join(contentDirectory, fileName), "utf8"),
  );

  return {
    fileName,
    id: fileName.replace(/\.md$/, ""),
    data: meta.data,
    markdownString: meta.content,
  };
}
