import eRequest from "@/service/index";
// 获取外部数据源（分页）
export function loginApi(params) {
  return eRequest.post({
    url: "/Authority/Login",
    data: params,
  });
}
