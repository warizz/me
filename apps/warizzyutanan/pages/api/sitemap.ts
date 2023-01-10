import type { NextApiRequest, NextApiResponse } from "next";
import parseToSitemap from "shared/lib/generateSiteMap";
import { getPosts } from "shared/Posts.server";

import { DOMAIN } from "../../app.config";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const posts = getPosts();
  const sitemap = parseToSitemap(DOMAIN, posts);

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();
}
