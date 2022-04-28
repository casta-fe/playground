import { defineComponent } from "vue";
import { ListItem } from "ant-design-vue";
import TagLabel from '../Tag/index'
import './index.less'
import { ListItemProps } from "./indexProps";
export default defineComponent({
    name:'TimeLineItemDefault',
    props:ListItemProps,
    components:{
        ListItem,
        TagLabel
    },
    setup(props){
        const {itemData}=props
        return ()=>(
            <ListItem>
                <div class={`ta-timeline-list-item ta-timeline-list-item--${itemData.status}`}>
                    <div class="time">
                        {itemData.times&&itemData.times.map((time)=>{
                            return <div class="time-line"  key={`${time}`}>{ time }</div>
                        })}
                    </div>
                    <div class="step">
                        <span class="step__icon"></span>
                    </div>
                    <div class="content">
                        <div class='title'>
                            <span>{itemData.title}</span>
                            <div class='tags'>
                                {
                                   itemData.tags&&itemData.tags.map((tag,index)=>{
                                        return <TagLabel {...tag}></TagLabel>
                                   }) 
                                }
                            </div>
                        </div>
                         <div  class="description">
                             {
                                 itemData.description && itemData.description.map(desc=>{
                                     return  <p  key={desc}>{{ desc }}</p>
                                 })
                             }
                        </div>
                    </div>
                </div>
            </ListItem>
        )
    }
})