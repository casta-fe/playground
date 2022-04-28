import { FileView } from "@casta-fe-playground/components";
import { defineComponent, reactive } from "vue";
import '../test.less'
export default defineComponent({
    setup(){
        const state=reactive({
            list:[{"id":7116,"appId":10001,"actualId":"93645034fb304ba3a5015412c1b2fc4a","moduleId":25,"businessKey":null,"businessId":null,"type":104,"deleted":0,"version":1,"name":"logo192","suffix":"png","fullName":"logo192.png","size":5347,"address":"/20220428/16511405641079317.png","runtime":null,"hyperlink":0,"createTime":"2022-04-28 18:09:24","createBy":"1","createByName":"系统管理员","fileSize":"5KB","moduleCode":"tg_fund_manager","typeCode":"FUND_GLR_QTZL"}]
            ,show:false
        })
        
        const open=()=>{
            state.show=true
        }
        return ()=>(
            <section class="test">
                <h2>FileView测试</h2>
                <FileView list={state.list} v-model:show={state.show}></FileView>
                <div onClick={open}>openFileView 查看</div>
            </section>
        )
    }
})