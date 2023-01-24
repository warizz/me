import DefaultHeadTag from "shared/DefaultHeadTags";
import getPostData from "shared/lib/getPostData";

import {
  GA_ID,
  NEXT_PUBLIC_IS_DISABLED_GA,
  OWNER_NAME,
} from "../../../app.config";

export default async function Head({ params }: { params: { slug: string } }) {
  const { title, description } = await getPostData(`${params.slug}.md`);
  return (
    <DefaultHeadTag
      ga={{
        isDisabled: NEXT_PUBLIC_IS_DISABLED_GA,
        id: GA_ID,
      }}
      title={`${title} - ${OWNER_NAME}`}
      description={description}
      robots="index, follow"
    />
  );
}
