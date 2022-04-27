<template>
  <div class="date_box">
    <RangePicker @change="handleDateChange" :value="state.defaultDate" />
    <!-- <Select placeholder="" class="date_section" :options="state.timeOption" /> -->
    <Dropdown trigger="click">
      <Button preIcon="ant-design:calendar-filled" />
      <template #overlay>
        <Menu @click="handleRangeChange">
          <MenuItem :key="1">
            <span>本周</span>
          </MenuItem>
          <MenuItem :key="2">
            <span>本月</span>
          </MenuItem>
          <MenuItem :key="3">
            <span>本季度</span>
          </MenuItem>
          <MenuItem :key="4">
            <span>本年</span>
          </MenuItem>
        </Menu>
      </template>
    </Dropdown>
  </div>
</template>

<script lang="ts">
  import { Dropdown, Menu, MenuItem, RangePicker } from "ant-design-vue";
  import moment from "moment";
  import { defineComponent, reactive } from "vue";
  import { Button } from "ant-design-vue";
  export default defineComponent({
    components: {
      RangePicker,
      Dropdown,
      Button,
      MenuItem,
      Menu
    },
    emits: ["getDateRange"],
    setup(_, { emit }) {
      const state = reactive<Recordable>({
        defaultDate: [moment().startOf("year"), moment().endOf("year")]
      });
      const handleDateChange = (momentList) => {
        state.defaultDate = momentList;
        // console.log(momentList);
        emit("getDateRange", momentList);
      };
      const handleRangeChange = ({ key }) => {
        const dateRange: Recordable[] = [];
        switch (key) {
          case 1:
            dateRange[0] = moment().startOf("week");
            dateRange[1] = moment().endOf("week");
            break;
          case 2:
            dateRange[0] = moment().startOf("month");
            dateRange[1] = moment().endOf("month");
            break;
          case 3:
            dateRange[0] = moment().startOf("quarter");
            dateRange[1] = moment().endOf("quarter");
            break;
          case 4:
            dateRange[0] = moment().startOf("year");
            dateRange[1] = moment().endOf("year");
            break;
        }
        state.defaultDate = dateRange;
        emit("getDateRange", dateRange);
      };
      return {
        state,
        handleDateChange,
        handleRangeChange
      };
    }
  });
</script>

<style lang="less" scoped>
  .date_box {
    // background-color: #ccc;
    width: 232px;
    // margin: 0 8px;
    .ant-calendar-picker {
      max-width: 200px;
      :deep(.ant-input) {
        border-radius: 4px 0px 0px 4px;
      }
    }
    .ant-btn {
      min-width: auto !important;
      width: 32px;
      height: 32px !important;
      padding: 0 !important;
      border-radius: 0px 4px 4px 0px;
    }
  }
</style>
