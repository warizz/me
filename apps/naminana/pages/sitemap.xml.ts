import { GetServerSideProps } from "next";
import { getPosts } from "shared/Posts.server";

import { DOMAIN } from "../app.config";

function generateSiteMap(postIds: string[]) {
  const _ids = ["posts", ...postIds];
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>https://www.${DOMAIN}/</loc>
     </url>
     ${_ids
       .map((id) => {
         return `
            <url>
                <loc>https://www.${DOMAIN}/${id}</loc>
            </url>`;
       })
       .join("")}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const posts = getPosts();
  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(posts.map((post) => post.id));

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
