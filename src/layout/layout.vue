<template>
  <el-container class="admin_container admin-module">
    <el-aside width="260px" class="aside_style column-space-center">
      <div class="logo column-center">
        <div class="title">选课系统后台</div>
        <div class="subTitle">The Admin of Course Selection</div>
      </div>
      <!-- <div class="nav"></div> -->
      <SideNav></SideNav>
      <div class="user column-center" @click="logout">
        <el-avatar :icon="UserFilled" />
        <div class="subTitle">{{ username }}</div>
      </div>
    </el-aside>
    <el-main class="main_style"> 
    <div class="container">
      <router-view />
      </div>
    </el-main>
  </el-container>
</template>
<script setup>
import { UserFilled } from '@element-plus/icons-vue'
import SideNav from "./SideNav.vue";
import localCache from "@/plugins/cache";
import showMsg from "@/plugins/showMsg.jsx";
const router = useRouter();
const logout = () => {
  showMsg("此操作将退出登录，是否继续", (close) => {
    router.push("/login");
    close();
  });
};
const username = ref("默认用户");
const getUsername = () => {
  const {account}= localCache.getCache("userInfo")
  username.value = account?? "默认用户";
};
onMounted(() => {
  getUsername();
  window.document.documentElement.setAttribute("root-module", "admin");
});
onUnmounted(() => {
  window.document.documentElement.removeAttribute("root-module");
});
</script>

<style lang="scss" scoped></style>
