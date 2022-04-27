# playground
`casta-fe-playground` 是基于 Vue 3 + Typescript + Vite 技术开发的前端 Vue 组件库。该项目采用`pnpm+monorepo`进行包管理,使用`gulp`控制打包流程,`rollup`进行打包。

# 进度：
https://github.com/casta-fe/playground/projects/1

# 组件处理原则
1. 删掉usedesign 写死ta-
2. @prefix-cls: ~"@{namespace}-icon-picker"; 删掉 namspace 写死 ta
3. 删掉usei18n 写死中文
4. 统计一下使用 api、store、permission的组件，如下：
# 注意⚠️
需要特殊处理的组件：含permission、store、api：
1. 含api fileview TaDownload.ts MemberSelect.vue taupload => prop改成函数: () => xxxapi
2. 含store
permission（Button.vue、ButtonGroup.vue、table）
含store（permission、FlowChart.vue、CodeMirror.vue）

3. 跟业务相关：
useMenuSetting、page、application、menu、simplemenu、layouts文件夹（暂时不处理）
不提 codeeditor、cardlist、excel、flowchart、markdown、preview、tinymce （暂时没用到可以先不处理，后期统一和含store组件讨论，建议删掉）

# 在线调试
在examples文件下引入即可

# 待处理：
form 时间组件引申到其他组件
类型的引入

