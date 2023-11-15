export const userManageTableOptions = [
  {
    label: "学生姓名",
    prop: "userName",
    showTooltip: true,
  },
  {
    label: "账户名",
    prop: "account",
    showTooltip: true,
  },
  {
    label: "密码",
    prop: "passWord",
    showTooltip: true,
  },
  {
    label: "年级",
    prop: "classNum",
    showTooltip: true,
  },
  {
    label: "电话",
    prop: "userPhone",
    showTooltip: true,
  },
  {
    label: "操作",
    prop: "action",
    align: "center",
    action: true,
  },
];
export const userManageFormOptions = ref([
  {
    type: "input",
    value: "",
    label: "学生姓名",
    prop: "userName",
    attrs: {
      style: {
        width: "100%",
      },
      clearable: true,
    },
  },
  {
    type: "input",
    value: "",
    label: "学生年级",
    prop: "classNum",
    attrs: {
      style: {
        width: "100%",
      },
      clearable: true,
    },
  },
]);
export const courseManageTableOptions = [
  {
    label: "课程名称",
    prop: "courseName",
    showTooltip: true,
  },
  {
    label: "上课老师",
    prop: "courseTeacher",
    showTooltip: true,
  },
  {
    label: "上课学院",
    prop: "courseCollege",
    showTooltip: true,
  },
  {
    label: "上课时间",
    prop: "courseTime",
    showTooltip: true,
  },
  {
    label: "课程余量",
    prop: "courseNum",
    showTooltip: true,
  },
  {
    label: "操作",
    prop: "action",
    align: "center",
    action: true,
  },
];
