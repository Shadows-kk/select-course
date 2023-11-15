<template>
  <div
    class="paginationWrapper"
    :style="{
      justifyContent: paginationJustify
    }"
  >
    <el-pagination
      v-bind="$attrs"
      :current-page="currentPage"
      :page-size="pageSize"
      :layout="layout"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  // 分页器当前页
  currentPage: {
    type: Number,
    default: 1
  },
  // 每一页的数据
  pageSize: {
    type: Number,
    default: 20
  },
  // 每一页数据可选值
  pageSizes: {
    type: Array,
    default: [10, 20, 50, 100]
  },
  layout: {
    type: String,
    default: 'jumper,prev, pager, next'
  },
  // 数据总数
  total: {
    type: Number,
    default: 0
  },
  // 分页器的排列方式
  paginationAlign: {
    type: String,
    default: 'right'
  }
})
// 处理分页器的排列方式
let paginationJustify = computed(() => {
  switch (props.paginationAlign) {
    case 'left':
      return 'flex-start'
    case 'center':
      return 'center'
    case 'right':
      return 'flex-end'
  }
})
// 分页数据改变
const emits = defineEmits(['sizeChange', 'currentChange'])
const handleSizeChange = (val) => {
  emits('sizeChange', val)
}
const handleCurrentChange = (val) => {
  emits('currentChange', val)
}
</script>

<style lang="scss" scoped>
.paginationWrapper {
  display: flex;
  align-items: center;
  :deep(.el-pagination) {
    button {
      border: 1px solid var(--admin-color-border);
      border-radius: 6px;
      width: 32px;
      height: 32px;
    }
    .el-pagination__jump {
      .el-input__wrapper {
        box-shadow: none;
        border: 1px solid var(--admin-color-border);
      }
    }
    .el-pager {
      li:hover:not(.is-active) {
        color: var(--admin-color-text);
        font-weight: bold;
      }
      .number,
      .more {
        border-radius: 6px;
        width: 32px;
        height: 32px;
        margin-left: 8px;
        border: 1px solid var(--admin-color-border);
      }

      .number:last-of-type {
        margin-right: 8px;
      }
      .is-active {
        background: var(--admin--color-background);
        color: #fff;
      }
    }
  }
}
</style>
