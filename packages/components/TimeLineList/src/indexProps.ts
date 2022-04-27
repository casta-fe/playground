import { TimeLineListPropsType } from "./types";
import type { PropType } from "vue";

export const TimeLineListProps = {
    list: {
        type: Array as PropType<TimeLineListPropsType['list']>,
        default:()=>[]
    },
    useLoadingMore: {
        type: Boolean as PropType<TimeLineListPropsType['useLoadingMore']>,
        default: true
    },
    renderListItem:{
        type:Function || null,
        default:null
    },

};