import DefaultHeadTag from "shared/DefaultHeadTags";

import { GA_ID, NEXT_PUBLIC_IS_DISABLED_GA, OWNER_NAME } from "../app.config";

export default async function Head() {
  return (
    <DefaultHeadTag
      ga={{
        isDisabled: NEXT_PUBLIC_IS_DISABLED_GA,
        id: GA_ID,
      }}
      title={`Home - ${OWNER_NAME}`}
      robots="index, follow"
    />
  );
}
