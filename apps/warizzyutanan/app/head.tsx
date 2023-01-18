import { OWNER_NAME } from "../app.config";

import DefaultHeadTag from "./DefaultHeadTags";

export default async function Head() {
  return (
    <DefaultHeadTag title={`Home - ${OWNER_NAME}`} robots="index, follow" />
  );
}
