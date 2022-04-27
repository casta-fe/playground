import { withInstall } from "@casta-fe-playground/utils";
import skeletonDetailPage from "./src/DetailPage.vue";
import skeletonForm from "./src/Form.vue";
import skeletonModalForm from "./src/ModalForm.vue";
import skeletonSection from "./src/Section.vue";

export const SkeletonDetailPage = withInstall(skeletonDetailPage);
export const SkeletonForm = withInstall(skeletonForm);
export const SkeletonModalForm = withInstall(skeletonModalForm);
export const SkeletonSection = withInstall(skeletonSection);
