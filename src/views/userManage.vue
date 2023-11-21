<template>
  <div class="table_wrapper">
    <el-form
      ref="formRef"
      :model="formModel"
      label-width="100px"
      class="row-flex-start"
    >
      <el-form-item label="学生姓名" prop="userName">
        <el-input
          v-model.number="formModel.userName"
          type="text"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="学生年级" prop="classNum">
        <el-input
          v-model.number="formModel.classNum"
          type="text"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">搜索</el-button>
        <el-button @click="resetForm(formRef)">重置</el-button>
      </el-form-item>
    </el-form>
    <Table ref="tableRef" :data="tableData" :options="userManageTableOptions">
      <template #action="{ scope }">
        <div class="btn_wrapper">
          <span class="commonStyle edit" @click="editHandler(scope.row)"
            >重置密码</span
          >
          <span class="commonStyle delete" @click="deleteHandler(scope.row)"
            >删除</span
          >
          <span class="commonStyle active" @click="impartHandler(scope.row)"
            >短信通知</span
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
import { userManageTableOptions } from "./config";
import {
  getStudentList,
  deleteStudent,
  findStudent,
  sendSms,
  initPassword,
} from "@api/admin";
const formRef = ref(null);
const formModel = reactive({
  userName: "",
  classNum: "",
});

const submitForm = (formEl) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      const requestData = {
        userID: 0,
        userName: "",
        account: "",
        passWord: "",
        classNum: "",
        userPhone: "",
        userType: 0,
        deleteFlag: true,
        sortID: 0,
      };
      findStudent({ ...requestData, ...formModel }).then((res) => {
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
  getStudentList().then((res) => {
    const { result } = res;
    tableData.value = result;
  });
};
const editHandler = (rowData) => {
  initPassword(rowData).then((res) => {
    if (res.statusCode === 0) {
      ElMessage.success("密码重置成功！");
    } else {
      ElMessage.error(res.errorMsg);
    }
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
    deleteStudent(rowData.value).then((res) => {
      if (res.statusCode === 0) {
        ElMessage.success("删除成功！");
        getList();
      }
    });
  }
  centerDialogVisible.value = false;
};
const impartHandler = (rowData) => {
  sendSms(rowData).then((res) => {
    if (res.statusCode === 0) {
      ElMessage.success("已发送短信通知该学生！");
    } else {
      ElMessage.error(res.errorMsg);
    }
  });
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
