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

        <el-upload
          action
          class="importExcel"
          accept=".xlsx, .xls"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="selectFileChange"
        >
          <el-button>Excel导入课程</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <Table ref="tableRef" :data="tableData" :options="courseManageTableOptions">
      <template #courseID="{ scope }">
        <el-button @click="viewStudents(scope.row)">查看选课学生</el-button>
      </template>
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
    <el-dialog
      id="print-table"
      v-model="studentListVisible"
      title="选课学生列表"
      width="30%"
      align-center
      center
    >
      <el-table :data="studentList" style="width: 100%">
        <el-table-column prop="userName" label="姓名" />
        <el-table-column prop="classNum" label="年级" />
        <el-table-column prop="userPhone" label="电话" />
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="exportStuPDF"> 导出PDF </el-button>
          <el-button type="primary" @click="studentListVisible = false">
            关闭
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { getCurrentInstance } from "vue";
import * as XLSX from "xlsx/xlsx.mjs";
import { courseManageTableOptions } from "./config";
import {
  deleteCourse,
  findCourse,
  perCourseStudents,
  uploadFile,
} from "@api/admin";
const { proxy } = getCurrentInstance();
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
const readFile = (file) => {
  //文件读取
  return new Promise((resolve) => {
    let reader = new FileReader();
    reader.readAsBinaryString(file); //以二进制的方式读取
    reader.onload = (ev) => {
      resolve(ev.target.result);
    };
  });
};
async function selectFileChange(ev) {
  let file = ev.raw;
  if (file.name.indexOf("xlsx") == -1 || file.name.indexOf("xls") == -1) {
    ElMessage({
      message: "请选择xlsx、xls格式文件",
      type: "warning",
    });
    return;
  }
  if (!file) {
    ElMessage({
      message: "文件导入失败",
      type: "warning",
    });
    return;
  } else {
    let data = await readFile(file);
    let workbook = XLSX.read(data, { type: "binary" }); //解析二进制格式数据
    // console.log('二进制数据的解析:')
    // console.log(workbook)
    let worksheet = workbook.Sheets[workbook.SheetNames[0]]; //获取第一个Sheet
    let result = XLSX.utils.sheet_to_json(worksheet); //json数据格式
    console.log(result);
    uploadFile({ file: result }).then((res) => {
      console.log(res);
      if (res.statusCode === 1) {
        ElMessage.error(res.errorMsg);
      } else {
        ElMessage.success("上传成功");
      }
    });
  }
}
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
const studentList = ref([]);
const studentListVisible = ref(false);
const viewStudents = (row) => {
  perCourseStudents(row).then((res) => {
    if (res.statusCode !== 0) return;
    studentList.value = res.result;
    studentListVisible.value = true;
  });
};

const exportStuPDF = () => {
  // 拼接
  let _docHtml = document.querySelector(
    "#print-table .el-table__header-wrapper .el-table__header"
  );
  let _table_body = document.querySelector(
    "#print-table .el-table__body-wrapper .el-table__body tbody"
  );
  _table_body.insertBefore(_docHtml, _table_body.children[0]);
  // 导出
  proxy.$exportPDF(_table_body, "选课学生列表");
  // 还原
  let _header_wrapper = document.querySelector(
    "#print-table .el-table__header-wrapper"
  );
  _header_wrapper.appendChild(_table_body.querySelector(".el-table__header"));
};
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
.importExcel {
  margin-left: 15px;
}
</style>
