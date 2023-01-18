import DefaultHeadTag from "shared/DefaultHeadTags";

import { OWNER_NAME } from "../../app.config";

export default async function Head() {
  return (
    <DefaultHeadTag title={`Blog - ${OWNER_NAME}`} robots="index, follow" />
  );
}
