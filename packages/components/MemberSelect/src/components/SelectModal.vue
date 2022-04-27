<template>
  <div class="member-select">
    <div class="member-box">
      <Tabs v-model:activeKey="tabActive">
        <TabPane key="0" tab="部门" v-if="!hideOrgTabs">
          <template v-if="propsData.multiple">
            <CheckboxGroup v-model:value="checkboxData">
              <Tree
                :treeData="orgList"
                blockNode
                :expandedKeys="orgExpandedKeys"
                :autoExpandParent="autoExpandParent"
                :selectable="false"
                :loadData="getOrgUser"
                :replaceFields="replaceFields"
                @expand="onExpand"
              >
                <template #title="item">
                  <template v-if="item.isLeaf">
                    <Checkbox :value="item.id">
                      <firstLetter :value="item" />{{ item.name }}
                    </Checkbox>
                  </template>
                  <template v-else>
                    <i class="icon-select-company" v-if="item.type == 1"></i>
                    <i class="icon-select-org" v-if="item.type == 2"></i>
                    <i class="icon-select-group" v-if="item.type == 3"></i>
                    {{ item.name }}
                  </template>
                </template>
              </Tree>
            </CheckboxGroup>
          </template>
          <template v-else>
            <RadioGroup v-model:value="radioData">
              <Tree
                :treeData="orgList"
                blockNode
                :expandedKeys="orgExpandedKeys"
                :autoExpandParent="autoExpandParent"
                :selectable="false"
                :loadData="getOrgUser"
                :replaceFields="replaceFields"
                @expand="onExpand"
              >
                <template #title="item">
                  <template v-if="item.isLeaf">
                    <Radio :value="item.id"> <firstLetter :value="item" /> {{ item.name }} </Radio>
                  </template>
                  <template v-else>
                    <i class="icon-select-org"></i>
                    {{ item.name }}
                  </template>
                </template>
              </Tree>
            </RadioGroup>
          </template>
        </TabPane>
        <TabPane key="1" tab="成员">
          <div class="user-wrap">
            <div class="letter-list">
              <span
                v-for="item in letterList"
                :key="item.key"
                @click="letterClick(item.key)"
                :class="{ on: activeLetter == item.key }"
                >{{ item.key }}</span
              >
            </div>
            <div class="user-list" id="userListRef">
              <template v-if="propsData.multiple">
                <CheckboxGroup v-model:value="checkboxData">
                  <ul v-for="item in letterList" :key="item.key" :data-id="item.key">
                    <li :id="'letter-' + item.key">
                      <b>{{ item.key }}</b>
                    </li>
                    <li v-for="v in item.list" :key="v.id">
                      <Checkbox :value="v.id"> <firstLetter :value="v" />{{ v.name }} </Checkbox>
                    </li>
                  </ul>
                </CheckboxGroup>
              </template>
              <template v-else>
                <RadioGroup v-model:value="radioData">
                  <ul v-for="item in letterList" :key="item.key" :data-id="item.key">
                    <li :id="'letter-' + item.key">
                      <b>{{ item.key }}</b>
                    </li>
                    <li v-for="v in item.list" :key="v.id">
                      <Radio :value="v.id"> <firstLetter :value="v" />{{ v.name }} </Radio>
                    </li>
                  </ul>
                </RadioGroup>
              </template>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
    <div class="selected-box" v-if="propsData.multiple">
      <div class="select-hd">
        <div class="num">已选中 {{ tagList.length }} 个</div>
        <div class="ctrl"><Button type="primary" @click="clearTag">清空选择</Button></div>
      </div>
      <div class="select-bd">
        <span class="tag" v-for="item in tagList" :key="item.id">
          {{ item.name }}
          <i class="icon-remove" @click="removeTag(item.id)"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Checkbox, CheckboxGroup, Radio, RadioGroup, TabPane, Tabs, Tree } from "ant-design-vue";
  import pinyin from "js-pinyin";
  import { computed, defineComponent, inject, onMounted, reactive, toRefs, watch } from "vue";
  import { letterItem, LetterItemList } from "../types";
  import FirstLetter from "./FirstLetter.vue";
  import { Button } from "@casta-fe-playground/components/Button";
  import { useMessage } from "@casta-fe-playground/hooks";
  const { createConfirm } = useMessage();
  export default defineComponent({
    components: {
      Tree,
      Button,
      Tabs,
      TabPane,
      CheckboxGroup,
      Checkbox,
      RadioGroup,
      Radio,
      FirstLetter
    },
    props: {
      selectedData: {
        type: Array,
        default: () => []
      }
    },
    emits: ["change"],
    setup(props, { emit }) {
      const propsData = inject("propsData") as any;
      const userList = inject("userList") as any;
      const orgList = inject("orgList") as any;
      console.log(orgList);
      const state = reactive({
        replaceFields: {
          title: "name",
          value: "id",
          key: "id"
        },
        orgExpandedKeys: [] as any[],
        autoExpandParent: true,
        tabActive: "1", //tab切换默认栏
        checkboxData: [] as any[],
        radioData: "" as any,
        letterList: [] as letterItem[], //用户列表的字母顺序表
        listenScroll: true, //是否监听滚动，点击时候要设置为false
        activeLetter: "" //当前选中的字母
      });
      // 多选时候右侧展示的列表
      const tagList = computed((): any[] => {
        return userList.value.filter((item: any) => state.checkboxData.some((v) => v === item.id));
      });
      // 是否显示组织的tab
      const hideOrgTabs = computed(() => {
        return propsData.value.noOrg || !!propsData.value.options;
      });
      // 移除已选中的用户
      const removeTag = (id): void => {
        let data = state.checkboxData;
        let index = data.findIndex((v) => v == id);
        data.splice(index, 1);
      };
      // 清空已选中的列表
      const clearTag = (): void => {
        createConfirm({
          iconType: "warning",
          content: "确定清空选中的用户？",
          onOk() {
            state.checkboxData = [];
          }
        });
      };
      // 获取全部用户首字母，并将其分类
      const userDataRest = () => {
        let letterObj = {};
        userList.value.forEach((v: any) => {
          let chart = pinyin.getCamelChars(v.name)[0];
          let upperChart = chart.toUpperCase();
          if (!letterObj[upperChart]) {
            letterObj[upperChart] = [v];
          } else {
            letterObj[upperChart].push(v);
          }
        });
        state.letterList = Object.keys(letterObj)
          .sort()
          .map((v) => {
            return {
              key: v,
              list: letterObj[v] as LetterItemList[]
            };
          });
        if (state.letterList.length > 0) {
          state.activeLetter = state.letterList[0].key;
        }
      };
      // 点击字母滚动到对应的位置
      const letterClick = (key: string) => {
        state.listenScroll = false;
        let dom = document.getElementById("letter-" + key);
        let userListRef = document.getElementById("userListRef");
        if (dom && userListRef) {
          userListRef.scrollTop = dom?.offsetTop - 60 || 0;
          state.activeLetter = key;
          // 延迟运行监听滚动
          setTimeout(() => {
            state.listenScroll = true;
          }, 500);
          // let { start } = useScrollTo({
          //   el: userListRef,
          //   to: dom?.offsetTop - 60 || 0,
          //   duration: 50,
          //   direction: "scrollTop"
          // });
          // start();
        }
      };

      // 部门树加载用户
      const getOrgUser = (treeNode: any) => {
        return new Promise((resolve) => {
          let oldData = [...treeNode.dataRef.children];
          if (oldData.length == 0) {
            console.log("没数据");
          }
          let children = userList.value
            .filter((v: any) => v.organizationId == treeNode.eventKey)
            .map((v: any) => {
              v.isLeaf = true;
              // 忽略列表中的用户需要禁止选中
              // v.disabled = propsData.value.ignoreUser.includes(v.id);
              return v;
            });
          treeNode.dataRef.children = deWeightThree([...oldData, ...children]);
          resolve(null);
        });
      };
      // 数据去重
      const deWeightThree = (arr) => {
        let map = new Map();
        for (let item of arr) {
          if (!map.has(item.id)) {
            map.set(item.name, item);
          }
        }
        return [...map.values()];
      };
      const openFirstOrg = () => {
        // 默认打开第一个节点，并获取他下面的用户
        let firstOrg = orgList.value[0];
        if (firstOrg) {
          state.orgExpandedKeys = [firstOrg.id];
          let children = userList.value
            .filter((v: any) => v.organizationId == firstOrg.id)
            .map((v: any) => {
              v.isLeaf = true;
              return v;
            });
          firstOrg.children = [...firstOrg.children, ...children];
        }
      };
      // 监听滚动 设置当前选中的字母
      const listenerUserScroll = (): void => {
        let userListRef: HTMLElement | null = document.getElementById("userListRef");
        if (userListRef) {
          userListRef.addEventListener("scroll", () => {
            console.log(state.listenScroll);
            if (state.listenScroll) {
              let ulList = userListRef?.childNodes[0].childNodes as NodeListOf<ChildNode>;
              if (ulList) {
                ulList.forEach((v: HTMLElement) => {
                  // if(v.offsetTop>0&&)
                  if (v.nodeName == "UL") {
                    if (userListRef) {
                      let dis = v.offsetTop - userListRef.scrollTop;
                      if (dis > 0 && dis < 100) {
                        state.activeLetter = v.getAttribute("data-id") || "";
                      }
                    }
                  }
                });
              }
            }
          });
        }
      };
      const onExpand = (keys: string[]) => {
        state.orgExpandedKeys = keys;
        state.autoExpandParent = false;
      };
      watch(
        () => orgList.value,
        (newData) => {
          if (newData.length > 0) {
            openFirstOrg();
          }
        }
      );
      watch(
        () => state.checkboxData,
        (val) => {
          emit("change", val);
        }
      );
      watch(
        () => state.radioData,
        (val) => {
          emit("change", val);
        }
      );
      onMounted(() => {
        listenerUserScroll();
      });
      const pageInit = (): void => {
        let data: any[] = props.selectedData;
        openFirstOrg();
        if (propsData.value.multiple) {
          state.checkboxData = [...data[0]];
        } else {
          if (data.length > 0) {
            state.radioData = data[0];
          }
        }
        if (propsData.value.type == "user") {
          userDataRest();
        }
      };
      pageInit();
      return {
        ...toRefs(state),
        hideOrgTabs,
        propsData,
        userList,
        orgList,
        tagList,
        getOrgUser,
        removeTag,
        clearTag,
        onExpand,
        letterClick
      };
    }
  });
</script>

<style lang="less">
  @import "../../index.less";
  .member-select {
    border-radius: @border-radius-base;
    border: 1px solid @border-color-light;
    display: flex;
    margin: 8px 0;
  }

  .member-box {
    flex: 1;

    .ant-tabs-bar {
      border-color: @border-color-light;

      .ant-tabs-tab {
        padding-bottom: 2px;
        padding-top: 18px;
        margin-left: 20px;
        margin-right: 0;
      }
    }

    .ant-tabs-tabpane {
      overflow-y: auto;
      overflow-x: hidden;
      height: 430px;
      max-height: calc(100vh - 250px);
      position: relative;
    }

    .user-wrap {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding-left: 20px;

      .letter-list {
        margin: 0 -10px 16px;

        span {
          display: inline-block;
          line-height: 22px;
          cursor: pointer;
          padding: 0 10px;
          font-weight: bold;
          color: #999;

          &.on {
            color: @primary-color;
          }
        }
      }

      .user-list {
        flex: 1;
        overflow-y: auto;

        li {
          cursor: pointer;
          line-height: 24px;
        }
      }
    }

    .ant-checkbox-wrapper-checked,
    .ant-radio-wrapper-checked {
      color: @primary-color;
    }
  }

  .selected-box {
    width: 50%;
    box-sizing: border-box;
    border-left: 1px solid @border-color-light;

    .select-hd {
      display: flex;
      padding: 0 16px;
      line-height: 40px;
      justify-content: space-between;
      border-bottom: 1px solid @border-color-light;
    }

    .select-bd {
      padding: 3px 8px;

      span {
        display: inline-block;
        line-height: 26px;
        min-width: 100px;
        padding: 0 10px;
        background: #f8f8fb;
        border-radius: 13px;
        color: #999;
        margin: 7px;
      }

      .icon-remove {
        cursor: pointer;
        float: right;
        margin-top: 6px;
        margin-left: 15px;
      }
    }
  }
</style>
