import { IPost } from "./getPostData";

export default function parseToSitemap(DOMAIN: string, posts: IPost[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://www.${DOMAIN}/</loc>
     </url>
     <url>
       <loc>https://www.${DOMAIN}/posts/</loc>
     </url>
     <url>
       <loc>https://www.${DOMAIN}/watermark/</loc>
     </url>
     <url>
       <loc>https://www.${DOMAIN}/compress/</loc>
     </url>
     <url>
       <loc>https://www.${DOMAIN}/life-in-weeks/</loc>
     </url>
     ${posts
       .map((post) => {
         return `
            <url>
                <loc>https://www.${DOMAIN}/posts/${post.id}</loc>
            </url>`;
       })
       .join("")}
   </urlset>
 `;
}
