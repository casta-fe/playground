import path from "path";

// 项目根目录
export const projectRoot = path.resolve(__dirname, "../../");

// 打包输出目录
export const outDir = path.resolve(__dirname, "../../dist");

// casta-fe-playground入口 index.ts
export const tgRoot = path.resolve(__dirname, "../../packages/casta-fe-playground");

// 组件目录
export const compRoot = path.resolve(projectRoot, "packages/components");
