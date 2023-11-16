import { createApp } from "vue";
import "./style.css";
import "element-plus/dist/index.css"; // ele-plus样式
import "./assets/adminCss/index.scss"; // 后台管理样式

import App from "./App.vue";
import installComponent from "./components/installComponent.js";
import router from "./router";
import registerFcns from "./global";

const app = createApp(App);
app.use(router);
app.use(installComponent);
app.use(registerFcns);
app.mount("#app");
