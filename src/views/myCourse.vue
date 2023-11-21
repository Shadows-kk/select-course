<template>
  <div class="table_wrapper">
    <div class="row-flex-start">
      <div class="addcourse" @click="addcourseHandle">
        <span>选择新课程</span>
        <el-icon><CirclePlusFilled /></el-icon>
      </div>
      <el-button :style="{ marginLeft: '100px' }" @click="exportPDF(formRef)"
        >导出为PDF</el-button
      >
    </div>
    <div id="print-table">
      <Table ref="tableRef" :data="tableData" :options="myCourseTableOptions">
        <template #action="{ scope }">
          <div class="btn_wrapper">
            <span class="commonStyle delete" @click="cancelHandler(scope.row)"
              >退选课程</span
            >
          </div></template
        >
      </Table>
    </div>

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
    <el-dialog
      class="addDialog"
      v-model="addDialogVisible"
      title="添加选课"
      width="80%"
    >
      <el-form
        ref="formRef"
        :model="formModel"
        label-width="100px"
        class="row-flex-start"
      >
        <el-form-item label="课程名称" prop="courseName">
          <el-input
            v-model.number="formModel.courseName"
            type="text"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="上课老师" prop="courseTeacher">
          <el-input
            v-model.number="formModel.courseTeacher"
            type="text"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="上课学院" prop="courseCollege">
          <el-input
            v-model.number="formModel.courseCollege"
            type="text"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item :style="{ width: '400px' }">
          <el-button type="primary" @click="submitForm(formRef)"
            >搜索</el-button
          >
          <el-button @click="resetForm(formRef)">重置</el-button>
        </el-form-item>
      </el-form>
      <Table
        ref="tableRef2"
        :data="tableData2"
        :options="courseManageTableOptions"
      >
        <template #action="{ scope }">
          <div class="btn_wrapper">
            <span class="commonStyle active" @click="selectHandler(scope.row)"
              >选择课程</span
            >
          </div></template
        >
      </Table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addDialogVisible = false">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { CirclePlusFilled, Download } from "@element-plus/icons-vue";
import { myCourseTableOptions, courseManageTableOptions } from "./config";
import { getCourse, backCourse, findCourse, selctCourse } from "@api/admin";
const { proxy } = getCurrentInstance();
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
    rowData.value.courseID += "";
    rowData.value.userID += "";
    backCourse({ ...requestData, ...rowData.value }).then((res) => {
      if (!res) return;
      if (res.statusCode === 0) {
        ElMessage.success("退选成功！");
        getList();
      } else {
        ElMessage.error("退选失败！");
      }
    });
  }
  centerDialogVisible.value = false;
};
const addDialogVisible = ref(false);
const formRef = ref(null);
const formModel = reactive({
  courseName: "",
  courseTeacher: "",
  courseCollege: "",
});
const tableData2 = ref([]);
const tableRef2 = ref(null);
const submitForm = (formEl) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      const requestData = {
        courseName: "",
        courseTeacher: "",
        couserTime: "",
        courseCollege: "",
      };
      findCourse({ ...requestData, ...formModel }).then((res) => {
        if (res.statusCode === 1) {
          ElMessage.error(res.ErrorMsg);
        } else {
          const { result } = res;
          tableData2.value = result;
        }
      });
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  getCourseList();
};
const addcourseHandle = () => {
  addDialogVisible.value = true;
  getCourseList();
};
const getCourseList = () => {
  const requestData = {
    courseName: "",
    courseTeacher: "",
    couserTime: "",
    courseCollege: "",
  };
  findCourse(requestData).then((res) => {
    const { result } = res;
    tableData2.value = result;
  });
};
const selectHandler = (rowData) => {
  rowData.courseID += "";
  selctCourse({ ...requestData, ...rowData }).then((res) => {
    if (res.statusCode === 0) {
      ElMessage.success(res.errorMsg);
      getList();
    }
  });
};
const exportPDF = () => {
  // 拼接
  let _docHtml = document.querySelector(
    "#print-table .el-table__header-wrapper .el-table__header"
  );
  let _table_body = document.querySelector(
    "#print-table .el-table__body-wrapper .el-table__body tbody"
  );
  _table_body.insertBefore(_docHtml, _table_body.children[0]);
  // 导出
  proxy.$exportPDF(_table_body, "我的课程列表");
  // 还原
  let _header_wrapper = document.querySelector(
    "#print-table .el-table__header-wrapper"
  );
  _header_wrapper.appendChild(_table_body.querySelector(".el-table__header"));
};
onMounted(() => {
  getList();
});
</script>

<style lang="scss" scoped>
:deep(.el-dialog.addDialog) .el-dialog__body {
  height: 500px;
  overflow: scroll;
}

:deep(.el-dialog--center) .el-dialog__body {
  text-align: center;
}
</style>
