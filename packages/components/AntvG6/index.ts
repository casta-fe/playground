import antvG6DomNode from "./src/DomNode.vue";
import antvG6CanvasNode from "./src/CanvasNode.vue";
import { withInstall } from "@casta-fe-playground/utils";
export * from "./src/types";

export const AntvG6DomNode = withInstall(antvG6DomNode);
export const AntvG6CanvasNode = withInstall(antvG6CanvasNode);
