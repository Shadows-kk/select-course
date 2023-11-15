<template>
  <div class="table_wrapper">
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
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">搜索</el-button>
        <el-button @click="resetForm(formRef)">重置</el-button>
        <el-button @click="resetForm(formRef)">Excel导入课程</el-button>
      </el-form-item>
    </el-form>
    <Table ref="tableRef" :data="tableData" :options="courseManageTableOptions">
      <template #action="{ scope }">
        <div class="btn_wrapper">
          <span class="commonStyle delete" @click="deleteHandler(scope.row)"
            >删除</span
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
      <span> 此操作将永久删除数据，是否继续？ </span>
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
import { courseManageTableOptions } from "./config";
import { deleteCourse, findCourse } from "@api/admin";
const formRef = ref(null);
const formModel = reactive({
  courseName: "",
  courseTeacher: "",
  courseCollege: "",
});

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
          tableData.value = result;
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
  getList();
};
const tableData = ref([]);
const getList = () => {
  const requestData = {
    courseName: "",
    courseTeacher: "",
    couserTime: "",
    courseCollege: "",
  };
  findCourse(requestData).then((res) => {
    const { result } = res;
    tableData.value = result;
  });
};
const centerDialogVisible = ref(false);
const rowData = ref({});
const deleteHandler = (data) => {
  centerDialogVisible.value = true;
  rowData.value = data;
};
const confirmClick = () => {
  if (rowData.value) {
    deleteCourse(rowData.value).then((res) => {
      if (!res) return;
      if (res.statusCode === 0) {
        ElMessage.success("删除成功！");
        getList();
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
