import path from "path";
import { outDir } from "./paths";

export const buildConfig = {
  esm: {
    module: "esnext", // tsconfig输出的结果是es6模块
    format: "esm", // 需要配置格式化后的模块规范
    output: {
      name: "es", // 打包到dist目录下的es目录
      path: path.resolve(outDir, "es")
    },
    bundle: {
      path: "casta-fe-playground/es"
    },
    globals: {
      // 表示使用的vue是全局的
      vue: "Vue",
      "ant-design-vue": "ant-design-vue"
    }
  },
  cjs: {
    module: "commonjs",
    format: "cjs",
    output: {
      name: "lib",
      path: path.resolve(outDir, "lib")
    },
    bundle: {
      path: "casta-fe-playground/lib"
    },
    globals: {
      // 表示使用的vue是全局的
      vue: "Vue",
      "ant-design-vue": "ant-design-vue"
    }
  }
};

export type BuildConfig = typeof buildConfig;
