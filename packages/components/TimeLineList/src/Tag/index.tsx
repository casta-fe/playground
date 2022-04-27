import { defineComponent } from "vue";
import {Tag,Tooltip} from 'ant-design-vue'
import { TagProps } from "./indexProps";
export default defineComponent({
    name:'TgTagLabel',
    components:{
        Tag,
        Tooltip
    },
    props:TagProps,
    setup(props){
        console.log(props,'dldldldldl')
        const {label,tooltip,color}=props
        return()=>(
            (label&&label.length>20 || tooltip)?
                <Tooltip title={label}>
                    <Tag color={color}>
                        {`${label?.slice(0, 20)}...` }
                    </Tag>
                </Tooltip>:
                <Tag color={color}>
                    {label}
                </Tag>
       )
    }
})