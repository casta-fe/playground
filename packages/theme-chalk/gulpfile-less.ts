/**
 * 打包样式
 * 安装相关依赖
 * pnpm install gulp-sass @types/gulp-sass @types/sass gulp-autoprefixer @types/gulp-autoprefixer @types/gulp-clean-css gulp-clean-css -w -D
 * gulp-autoprefixer:添加样式前缀  gulp-clean-css：压缩css
 */
/**
 * gulp是类似一个管道的方式执行，从入口开始到出口，中间一步步执行
 */
import { dest, series, src } from "gulp";
import autoprefixer from "gulp-autoprefixer";
import cleanCss from "gulp-clean-css";
import less from "gulp-less";
import path from "path";
/**
 * 对sass文件做处理
 */

function compileLess() {
  console.log('compileLess')
  return src(path.resolve(__dirname, "./src/*.less"))
    .pipe(less())
    .pipe(autoprefixer())
    .on("data", (data) => {
      console.log(data,'dkkdkd')
      let content = data.contents.toString();
      content = content.replaceAll("./fonts", "casta-fe-playground/theme-chalk/fonts");
      data.contents = new Buffer(content);
    })
    .pipe(cleanCss())
    .pipe(dest("./dist/css"));
}

/**
 * 处理font文件
 */
// function copyFonts() {
//   // 从src下单fonts文件夹下的所有文件开始=>压缩=>最终输出到当前目录下dist下的font目录
//   return src(path.resolve(__dirname, "./src/fonts/**")).pipe(cleanCss()).pipe(dest("./dist/fonts"));
// }
// function copyLess() {
//   // 从src下单src文件夹下的所有文件开始=>压缩=>最终输出到当前目录下dist下的less目录
//   return src(path.resolve(__dirname, "./src/**")).pipe(dest("./dist/less"));
// }
/**
 * 把打包好的css输出到根目录的dist
 */
function copyFullStyle() {
  const rootDistPath = path.resolve(__dirname, "../../dist/theme-chalk");
  return src(path.resolve(__dirname, "./dist/**")).pipe(dest(rootDistPath));
}

// export default series(compileLess, copyFonts, copyFullStyle);
// copyLess,
export default series(compileLess,copyFullStyle);

