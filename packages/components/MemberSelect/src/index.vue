<!--
 * @Author: huyb
 * @Descripttion: 用户/组织选择器
 * @Date: 2021-11-08 11:22:23
-->
<template>
  <div class="ta-member-select" v-if="!noSelect">
    <template v-if="type == 'user'">
      <Select
        ref="userSelectRef"
        @dropdown-visible-change="userVisibleChange"
        v-model:value="selectedData[0]"
        showSearch
        dropdownClassName="ta-member-option"
        optionFilterProp="label"
        :allowClear="allowClear"
        :options="userOptions"
        :maxTagCount="maxTagCount"
        :maxTagPlaceholder="maxTagPlaceholder"
        :disabled="disabled"
        :placeholder="placeholder"
        :mode="multiple ? 'multiple' : undefined"
        :autofocus="autofocus"
        :default-open="defaultOpen"
        :getPopupContainer="getPopupContainer"
        @change="emitHandle"
      >
        <template #option="item">
          <div class="ta-member-option-item">
            <span>{{ item.label }}</span>
            <span>{{ item.sex == 1 ? "男" : "女" }}</span>
            <span>{{ item.phone }}</span>
          </div>
        </template>
        <template #dropdownRender="{ menuNode: menu }">
          <v-nodes :vnodes="menu" />
          <div
            class="ta-member-option-more"
            @mousedown="(e) => e.preventDefault()"
            @click="showModal"
            v-if="userList.length > 0"
          >
            <a href="javascript:;">查看更多</a>
          </div>
        </template>
      </Select>
    </template>
    <template v-else>
      <TreeSelect
        dropdownClassName="ta-member-tree"
        treeNodeFilterProp="title"
        showSearch
        treeIcon
        v-model:value="selectedData[0]"
        :treeDefaultExpandedKeys="orgExpandedKey"
        :allowClear="allowClear"
        :maxTagCount="maxTagCount"
        :maxTagPlaceholder="maxTagPlaceholder"
        :disabled="disabled"
        :placeholder="placeholder"
        :multiple="multiple"
        :tree-data="orgList"
        :replaceFields="orgFileds"
        :autofocus="autofocus"
        :default-open="defaultOpen"
        :getPopupContainer="getPopupContainer"
        @change="emitHandle"
      >
        <!-- :treeDefaultExpandedKeys="orgExpandedKey" -->
        <!-- 自己循环得递归，暂时不这样写 -->
        <!-- <TreeSelectNode v-for="item in orgList" :key="item.id">
          {{item.name}}
        </TreeSelectNode> -->
      </TreeSelect>
    </template>
  </div>
  <BasicModal
    :title="title"
    :width="850"
    wrapClassName="ta-member-modal"
    :destroyOnClose="true"
    :getContainer="getPopupContainer"
    @register="registerMemberModal"
  >
    <MemberModal @change="modalChange" :selectedData="selectedData" />
    <template #footer>
      <Button type="primary" @click="modalSubmit">确定</Button>
      <Button @click="hideModal">取消</Button>
    </template>
  </BasicModal>
</template>

<script lang="ts">
  import { Select, TreeSelect } from "ant-design-vue";
  import { computed, defineComponent, provide, reactive, ref, toRefs, watch } from "vue";
  import MemberModal from "./components/SelectModal.vue";
  import basicProps from "./props";
  // import { API__SYSTEM_ORGANIZATION_LIST } from "/@/api/system/organization";
  import { Button } from "@casta-fe-playground/components/Button";
  import { BasicModal, useModal } from "@casta-fe-playground/components/Modal";
  import { isArray } from "@casta-fe-playground/utils";
  export default defineComponent({
    name: "MemberSelect",
    components: {
      VNodes: (_, { attrs }) => {
        return attrs.vnodes;
      },
      BasicModal,
      MemberModal,
      Button,
      Select,
      TreeSelect
    },
    props: basicProps,
    emits: ["change", "update:value", "blur"],
    setup(props, { emit }) {
      const userSelectRef = ref<any>(null);
      const state = reactive({
        selectedData: [] as any[], //组件里面选中的数据
        catchData: [] as any[],
        userList: [] as LabelValueOptions,
        orgList: [] as any[], //组织树下用的数据
        orgExpandedKey: [] as any[], //默认展开的数据
        orgFileds: {
          children: "children",
          title: "name",
          key: "id",
          value: "id"
        }
      });
      provide(
        "propsData",
        computed(() => props)
      );
      provide(
        "userList",
        computed(() => state.userList)
      );
      provide(
        "orgList",
        computed(() => state.orgList)
      );
      const userOptions = computed(() => {
        let list: LabelValueOptions = [];
        state.userList.forEach((v) => {
          let value = v.id || v.value;
          // 非ignoreUser的用户才能选择
          if (!props.ignoreUser.includes(value)) {
            list.push({
              label: (v.name as string) || v.label,
              value: value,
              phone: v.phone,
              sex: v.sex
            });
          }
        });
        return list;
      });
      const [registerMemberModal, { openModal: openMemberModal, closeModal: closeMemberModal }] =
        useModal();

      const showModal = () => {
        // 如果是用户选择器，打开弹窗时候 也请求下组织列表，可以根据组织选择用户
        if (props.type == "user") {
          getUserList();
          if (!props.noOrg) {
            getOrgList();
          }
        }
        if (props.type == "org") {
          getOrgList();
        }
        if (userSelectRef.value) {
          userSelectRef.value.blur();
        }
        // 某些情况下直接拉起弹窗，那么就需要重置下数据和请求用户列表
        setBaseData();
        //  延迟出现，防止互相覆盖
        setTimeout(() => {
          openMemberModal();
        }, 500);
      };
      const hideModal = () => {
        closeMemberModal();
      };
      // 获取用户数据

      const getUserList = () => {
        if (isArray(props.options)) {
          // 将其处理成 人员的数据格式
          state.userList = getTrueUserList(props.options);
        } else {
          props
            .userListApi({
              ...props.userListParams
            })
            .then((res) => {
              state.userList = getTrueUserList(res.data);
            });
        }
      };
      // 获取组织数据
      const getOrgList = (): void => {
        // API__SYSTEM_ORGANIZATION_LIST().then((res) => {
        //   state.orgList = res.data;
        // });
      };
      // 弹窗里面的数据变化
      const modalChange = (value) => {
        state.catchData = value;
      };
      // 弹窗下面的确定事件
      const modalSubmit = (): void => {
        let data = state.catchData;
        // 多选第一位为数组，单选第一位为字符串
        state.selectedData[0] = data;
        emitHandle();
        closeMemberModal();
      };
      const emitHandle = (): void => {
        emit("update:value", state.selectedData[0]);
        emit("change", state.selectedData[0]);
      };
      // 将传入的value保存为组件使用的数据
      const setBaseData = (): void => {
        if (props.multiple) {
          if (!Array.isArray(props.value)) {
            console.warn("多选默认值请传入数组");
            state.selectedData = [[]];
          } else {
            state.selectedData = [[...props.value]];
          }
        } else {
          state.selectedData = props.value ? [props.value] : [null];
        }
      };
      const getTrueUserList = (userList = state.userList) => {
        let list: LabelValueOptions = [];
        userList.forEach((v) => {
          let value = v.id || v.value;
          // 非ignoreUser的用户才能选择
          if (!props.ignoreUser.includes(value)) {
            list.push(v);
          }
        });
        return list;
      };
      const userVisibleChange = () => {
        // if (v) {
        // }
      };
      const orgVisibleChange = () => {
        // console.log(v);
      };
      watch(
        () => state.orgList,
        (newData) => {
          if (props.multiple) {
            state.orgExpandedKey =
              state.selectedData[0].length > 0 ? state.selectedData[0] : [newData[0].id];
          } else {
            state.orgExpandedKey = state.selectedData[0] ? state.selectedData : [newData[0].id];
          }
        }
      );
      watch(
        () => props.ignoreUser,
        () => {
          state.userList = getTrueUserList();
        }
      );
      watch(
        () => props.options,
        (data) => {
          if (data) {
            getUserList();
          }
        }
      );
      watch(
        () => props.value,
        () => {
          // 组件绑定的是 selectedData第一位
          setBaseData();
        }
      );
      // 页面初始化
      const pageInit = (): void => {
        setBaseData();
        if (props.type == "user") {
          // 如果默认不显示select就不请求用户
          if (props.noSelect) {
            return;
          }
          getUserList();
        } else {
          getOrgList();
        }
      };
      pageInit();
      return {
        userSelectRef,
        ...toRefs(state),
        userOptions,
        userVisibleChange,
        orgVisibleChange,
        showModal,
        hideModal,
        modalChange,
        modalSubmit,
        emitHandle,
        registerMemberModal
      };
    }
  });
</script>

<style lang="less">
  .ta-member-select {
    .ant-select {
      width: 100%;
    }
  }

  .ta-member-option {
    min-width: 260px !important;

    &-item {
      display: flex;
      margin-right: 20px;

      span:nth-child(1) {
        flex: 1;
        width: calc(100% - 140px);
        overflow: hidden;
        text-overflow: ellipsis;
        // word-break: break-all;
        // white-space: normal;
      }

      span:nth-child(2) {
        width: 50px;
      }

      span:nth-child(3) {
        width: 100px;
      }
    }

    &-more {
      padding: 4px 8px;
      cursor: pointer;
      text-align: right;
    }

    .ant-select-item:hover,
    .ant-select-item-option-selected {
      background: #e6edff;
      color: @primary-color;
      position: relative;

      .ant-select-item-option-state {
        position: absolute;
        right: 10px;
      }
    }
  }

  .ta-member-tree {
    .ant-select-tree-iconEle {
      display: inline-block;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAArJJREFUSEutlrFPU1EUh7/Da0JMABtZwAVIWl1MBExkhMZNHXBx0EEcSNzEv0CJm4tsDsQIYXCERHC1DTuUwcU2oTjApCm2xkAox9z3bOnre6/3NbZL077zznd/555z70+I8dHq/ji1syeojIMmEfMNqOZByojmcRKr0jeWt6WTdgH6qzjHOS8RRm2JvAVQoodXMpBajYoPBbqKzmpvEWZigVqDlCwJ50WY4gBQK4UZarKOkAyFVQ7hew5+FCB9D4Zvha9JKZNwMq1QH9CFncuX0AylLBS34CDnf/xwA/qvRheiRzPSn87WAxpA/bM/yklt16fMqDGQwiZUjsKT3n0XrdLb1zK9zoRcGiuZnxfAciGLyHQj67dPsP3avoU2oAfNSjKVaQDdblQ++LKvZeD0d3eAHumpDKRWXIVaLpYQRnzZ39+2w0xEHIX/RkaSqTHxhrq2G8heB15Jw0jLdFQPobDlvRIXaGIdZ0L0uLgEPI8Ezq7B4PWg2s/P4GjnArizDMVNmJiH9P2I6uiiaGuz1EPrCkemYfCaP8FJFb5+9Cs0wN1l77/+YbjzJrhQ1ZwB5hG5GanQtpP1kjYDzTtG6eS8/23VvCmphubstGniAE2zWoF9Q8GT5KQCPwvRJY1S6AJtJY06utYfe9DOSrpnbxqzD0OT/qqfVmF7EUzzdAbM2ceim02DGQvb4HcTaAa/a0ebrUuVA0mmRj1g6+EddyRs6ptnUXggA6mN8Osp7k1hA04twI1HxmzlJJl2D+TWCziPcNmWp6PnyjG9znjgAnZL285idERpCjaN0mQfgybKc2zZ/1ZqlCWcmbYmqr4uz9+crfgsRycKVXP0JubqZWx+1WaEZzlnKeAGouDKAT0smG6MCmkLbCj2rP4s6hpjY/W960x1DygjZHESG3Gs/l/yOkij4gFNCwAAAABJRU5ErkJggg==) left center no-repeat;
      background-size: 14px 14px;
    }

    .ant-select-tree li {
      .ant-select-tree-node-content-wrapper {
        &:hover,
        &.ant-select-tree-node-selected {
          background: #e6edff;
          color: @primary-color;
        }
      }
    }
  }
</style>
