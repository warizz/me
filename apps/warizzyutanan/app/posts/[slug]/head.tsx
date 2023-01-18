import DefaultHeadTag from "shared/DefaultHeadTags";
import getPostData from "shared/lib/getPostData";

import { OWNER_NAME } from "../../../app.config";

export default async function Head({ params }: { params: { slug: string } }) {
  const { title, description } = await getPostData(`${params.slug}.md`);
  return (
    <DefaultHeadTag
      title={`${title} - ${OWNER_NAME}`}
      description={description}
      robots="index, follow"
    />
  );
}
