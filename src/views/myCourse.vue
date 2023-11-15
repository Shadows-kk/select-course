<template>
  <div class="table_wrapper">
    <Table ref="tableRef" :data="tableData" :options="myCourseTableOptions">
      <template #action="{ scope }">
        <div class="btn_wrapper">
          <span class="commonStyle delete" @click="cancelHandler(scope.row)"
            >退选课程</span
          >
        </div></template
      >
    </Table>
    <el-dialog
      v-model="centerDialogVisible"
      title="警告"
      width="30%"
      align-center
      center
    >
      <span> 此操作将取消选课，是否继续？ </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmClick"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { myCourseTableOptions } from "./config";
import { getCourse, backCourse } from "@api/admin";

const tableData = ref([]);

const centerDialogVisible = ref(false);
const { userID } = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : {};
const requestData = reactive({
  userID: userID + "",
  courseID: "",
  courseName: "",
  courseTeacher: "",
  courseTime: "",
  courseCollege: "",
});
const getList = () => {
  getCourse(requestData).then((res) => {
    if (!res) return;
    const { result } = res;
    tableData.value = result;
  });
};
const rowData = ref({});
const cancelHandler = (data) => {
  centerDialogVisible.value = true;
  rowData.value = data;
};
const confirmClick = () => {
  if (rowData.value) {
    backCourse({ ...requestData, ...rowData.value }).then((res) => {
      if (!res) return;
      if (res.statusCode === 0) {
        ElMessage.success("退选成功！");
        getList()
      }
    });
  }
  centerDialogVisible.value = false;
};
onMounted(() => {
  getList();
});
</script>

<style lang="scss" scoped>
:deep(.el-dialog--center) .el-dialog__body {
  text-align: center;
}
</style>
