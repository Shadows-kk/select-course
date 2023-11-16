<template>
  <div class="tableWrapper">
    <el-table
      ref="tableCpnRef"
      :data="data"
      style="width: 100%"
      v-bind="$attrs"
    >
      <el-table-column v-if="selection" type="selection" width="55" />
      <el-table-column
        v-if="Index"
        type="index"
        fixed
        label="序列号"
        align="center"
        :width="100"
      />
      <template v-for="(item, index) in tableOptions" :key="index">
        <!-- 普通列，无需插槽处理 -->
        <el-table-column
          v-if="!item.slot"
          :label="item.label"
          :prop="item.prop"
          :align="item.align"
          :width="item.width"
          :sortable="item.sortable"
          :show-overflow-tooltip="item.showTooltip"
        ></el-table-column>
        <!-- 特殊列，需要插槽处理 -->
        <el-table-column
          v-else
          :label="item.label"
          :prop="item.prop"
          :align="item.align"
          :width="item.width"
        >
          <template #default="scope">
            <slot :name="item.slot" :scope="scope"></slot>
          </template>
        </el-table-column>
      </template>
      <!-- 操作列 -->
      <el-table-column
        v-if="actionOptions"
        :label="actionOptions.label"
        :align="actionOptions.align"
        :width="actionOptions.width"
      >
        <template #default="scope">
          <slot name="action" :scope="scope"></slot>
        </template>
      </el-table-column>
      <!-- 右侧固定列 -->
      <el-table-column v-if="fixedFlag" fixed="right" align="center">
        <template #default="scope">
          <slot name="fixedRight" :scope="scope"></slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
const tableCpnRef = ref(null);
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  // 是否固定列
  fixedFlag: {
    type: Boolean,
    default: false,
  },
  Index: {
    type: Boolean,
    default: false,
  },
  selection: {
    type: Boolean,
    default: false,
  },
  hasMoveBar: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["moveHandler"]);
//表格最后一项
const lastIndex = computed(() => props.data.length);
// 拿到表格中的普通项
const tableOptions = computed(() =>
  props.options.filter((item) => !item.action)
);
// 拿到表格中的操作项
const actionOptions = computed(() => props.options.find((item) => item.action));

defineExpose({
  tableCpnRef,
});
</script>

<style lang="scss" scoped>
.tableWrapper {
  padding: 0 20px;
}
:deep(.el-table) {
  border-radius: 20px;
  .move-btn {
    margin: 0 5px;
    cursor: pointer;

    &:hover {
      opacity: 0.6;
    }
  }
  .is-disable {
    cursor: not-allowed;
    opacity: 0.4;
  }
  .normalStatus {
    background-size: cover;
  }

  .closedStatus {
    background-size: cover;
  }
  tr.current-row > td.el-table__cell {
    background-color: var(--admin--color-background);
    color: #fff;
  }
  tr.current-row > td:first-of-type {
    border-radius: 10px 0 0 10px;
  }
  tr.current-row > td:last-of-type {
    border-radius: 0 10px 10px 0;
  }
}
</style>
