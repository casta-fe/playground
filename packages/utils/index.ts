import type { App, Plugin } from "vue";
import { unref } from "vue";
import { isObject } from "./src/is";

export const noop = () => {};

/**
 * @description:  Set ui mount node
 */
export function getPopupContainer(node?: HTMLElement): HTMLElement {
  return (node?.parentNode as HTMLElement) ?? document.body;
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = "";
  for (const key in obj) {
    parameters += key + "=" + encodeURIComponent(obj[key]) + "&";
  }
  parameters = parameters.replace(/&$/, "");
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, "?") + parameters;
}

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}

export function openWindow(
  url: string,
  opt?: { target?: TargetContext | string; noopener?: boolean; noreferrer?: boolean }
) {
  const { target = "__blank", noopener = true, noreferrer = true } = opt || {};
  const feature: string[] = [];

  noopener && feature.push("noopener=yes");
  noreferrer && feature.push("noreferrer=yes");

  window.open(url, target, feature.join(","));
}

// dynamic use hook props
export function getDynamicProps<T, U>(props: T): Partial<U> {
  const ret: Recordable = {};

  Object.keys(props).map((key) => {
    ret[key] = unref((props as Recordable)[key]);
  });

  return ret as Partial<U>;
}

// export const withInstall = <T>(component: T, alias?: string) => {
//   const comp = component as any;
//   comp.install = (app: App) => {
//     app.component(comp.name || comp.displayName, component);
//     if (alias) {
//       app.config.globalProperties[alias] = component;
//     }
//   };
//   return component as T & Plugin;
// };

/**
 * 组件外部使用use时执行install，然后将组件注册为全局
 */

// 类型必须导出否则生成不了.d.ts文件
export type SFCWithInstall<T> = T & Plugin;

/**
 * 定义一个withInstall方法处理以下组件类型问题
 * @param comp
 */
export const withInstall = <T>(comp: T) => {
  /**
   * 直接写comp.install = function(){} 的话会报错，因为comp下没有install方法
   * 所以从vue中引入Plugin类型，断言comp的类型为T&Plugin
   */
  (comp as SFCWithInstall<T>).install = function (app: App) {
    app.component((comp as any).name, comp);
  };
  return comp as SFCWithInstall<T>;
};

function clearAndUpper(text) {
  return text.replace(/-/, "").toUpperCase();
}

export function kebabCaseToCamelCase(text) {
  return text.replace(/-\w/g, clearAndUpper);
}

export function kebabCaseToPascalCase(text) {
  return text.replace(/(^\w|-\w)/g, clearAndUpper);
}

export function numberToCNText(number) {
  const data = {
    "0": "零",
    "1": "一",
    "2": "二",
    "3": "三",
    "4": "四",
    "5": "五",
    "6": "六",
    "7": "七",
    "8": "八",
    "9": "九"
  };

  return data[`${number}`];
}

/**
 * 通过字符串 a.b.c 的形式来访问 obj 中的 c
 * @param obj
 * @param path
 * @param returnType value 则只返回当前匹配的值，没传的话返回所有信息
 * @returns
 */
export function getPropByPath(obj, path, returnType = "all") {
  let tempObj = JSON.parse(JSON.stringify(obj));
  path = path.replace(/\[(\w+)\]/g, ".$1");
  path = path.replace(/^\./, "");

  const keyArr = path.split(".");
  let i = 0;
  for (let len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj) break;
    const key = keyArr[i];
    if (key in tempObj) {
      tempObj = tempObj[key];
    } else {
      break;
    }
  }

  const result = {
    o: tempObj,
    k: keyArr[i],
    v: tempObj && tempObj[keyArr[i]] ? tempObj[keyArr[i]] : null
  };

  if (returnType === "value") {
    return result.v;
  } else {
    return result;
  }
}

export * from "./src/cipher";  
export * from "./src/color";
export * from "./src/dateUtil";
export * from "./src/domUtils";
export * from "./src/is";
export * from "./src/log";
export { default as mitt } from "./src/mitt";
export * from "./src/mitt";
export * from "./src/propTypes";
export * from "./src/uuid";

// // src/event
export * from './src/event/index'
export * from './src/event/useScrollToCenter'

// src/factory
export * from './src/factory/createAsyncComponent'

// src/file
export * from './src/file/base64Conver'
export * from './src/file/download'
export * from './src/file/TaDownload'
export * from './src/file/TaFileTypeCode'

// // src/helper
export * from './src/helper/treeHelper'
export * from './src/helper/tsxHelper'

// // src/lib
export { default as echarts } from "./src/lib/echarts"
