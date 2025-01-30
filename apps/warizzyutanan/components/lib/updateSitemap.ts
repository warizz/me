import { readdirSync, writeFileSync } from "fs";
import path from "path";

import getPostData, { postsDirectory } from "./getPostData";
import parseToSitemap from "./parseToSitemap";

function _info(...args: unknown[]) {
  console.info("[gen-sitemap]", ...args);
}

export default function updateSitemap(domain: string) {
  const publicDir = path.join(process.cwd(), "public");
  const sitemapFilePath = path.join(publicDir, "sitemap.xml");

  _info("started ...");
  _info(`publicDir "${publicDir}"`);

  const posts = readdirSync(postsDirectory)
    .map(getPostData)
    .filter((post) => post !== null)
    .filter((post) => post.isPublished);

  const sitemap = parseToSitemap(domain, posts);

  _info(`write file "${sitemapFilePath}"`);
  writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);

  _info("finished ...");
}
