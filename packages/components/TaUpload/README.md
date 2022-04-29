```javascript
import { TaUpload } from "@casta-fe-playground/components";
```

---

> 外部需要注入依赖项 :
>
> ```javascript
> provide("typeCodeRecord", {
>  tg_invest: [
>    {
>      label: "typeCode1",
>      value: "TYPE_CODE_1"
>    }
>  ]
> });
>
> provide("apis", {
>  /**
>   * 文件查询接口
>   */
>  queryFile: PromiseFn;
>  /**
>   * 文件删除接口(真删)
>   */
>  removeFile: PromiseFn;
>  /**
>   * 文件上传接口
>   */
>  uploadFile: PromiseFn;
>  /**
>   * 根据角色权限筛选用户可上传的文件类型接口
>   * 不传则展示所有文件类型
>   */
>  queryFileType?: PromiseFn;
>  /**
>   * 超链接上传接口
>   */
>  uploadHyperlink: PromiseFn;
> });
> ```
>
> ---
