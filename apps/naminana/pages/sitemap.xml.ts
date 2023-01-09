import type { GetServerSideProps } from "next";
import generateSiteMap from "shared/lib/generateSiteMap";
import { getPosts } from "shared/Posts.server";

import { DOMAIN } from "../app.config";

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const posts = getPosts();
  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(DOMAIN, posts);

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
