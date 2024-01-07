import eRequest from "@/service/index";
// 获取学生列表
export function changePwd(params) {
  return eRequest.post({
    url: "/Authority/ChangePwd",
    data: params,
  });
}
export function getStudentList(params) {
  return eRequest.post({
    url: "/Authority/GetStudentList",
    data: params,
  });
}
export function deleteStudent(params) {
  return eRequest.post({
    url: "/Authority/DeleteStudent",
    data: params,
  });
}
export function sendSms(params) {
  return eRequest.post({
    url: "/Authority/sendSms",
    data: params,
  });
}
export function initPassword(params) {
  return eRequest.post({
    url: "/Authority/InitPassword",
    data: params,
  });
}
export function findStudent(params) {
  return eRequest.post({
    url: "/Authority/FindStudent",
    data: params,
  });
}
export function findCourse(params) {
  return eRequest.post({
    url: "/Authority/FindCourse",
    data: params,
  });
}
export function perCourseStudents(params) {
  return eRequest.post({
    url: "/Authority/PerCourseStudents",
    data: params,
  });
}
export function deleteCourse(params) {
  return eRequest.post({
    url: "/Authority/DeleteCourse",
    data: params,
  });
}
export function getCourse(params) {
  return eRequest.post({
    url: "/Authority/GetCourse",
    data: params,
  });
}
export function backCourse(params) {
  return eRequest.post({
    url: "/Authority/BackCourse",
    data: params,
  });
}
export function selctCourse(params) {
  return eRequest.post({
    url: "/Authority/SelctCourse",
    data: params,
  });
}
export function uploadFile(params) {
  return eRequest.post({
    url: "/Authority/UploadFile",
    data: params,
  });
}
