
import { List, ListItem, Tag, Tooltip, Button } from "ant-design-vue";
import { defineComponent } from "vue";
import { TimeLineListProps } from './indexProps'
import { TimeLineListEmits } from './indexEmits'
import ListItemDefault from './ListItem/index'

import './index.less'
export default defineComponent({
  components: { List, ListItem, Button, Tag, Tooltip },
  inheritAttrs: false,
  props: TimeLineListProps,
  emits: TimeLineListEmits,
  setup(props, { emit, slots }) {
    const handleLoadingMore = () => {
      emit("loadingMore");
    };
    const { list, useLoadingMore } = props
    const renderItem = ({ item, index }) => {
      if (props.renderListItem) {
        return props.renderListItem({ item, index })
      } else {
        return <ListItemDefault itemData={item}></ListItemDefault>
      }
    }
    return () => (
      <List
        class="ta-timeline-list"
        item-layout="horizontal"
        data-source={list}
        renderItem={renderItem}
      > 
        {
          useLoadingMore
          ?
            slots.loadMore
              ?slots.loadMore()
              :<div  class="ta-timeline-list-loading-more">
                <Button postIcon="ant-design:cloud-download-outlined" onClick={handleLoadingMore}>
                  加载更多
                </Button>
              </div>
          :''
        }
      </List>

    )
  }
});


