<template>
  <div class="loginPage">
    <div class="loginPanel">
      <div class="title">杭电选课系统</div>
      <el-form class="formWrapper">
        <el-form-item label="账号">
          <el-input
            v-model="loginInfo.account"
            placeholder="请输入账号"
            clearable
          />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="loginInfo.passWord"
            placeholder="请输入密码"
            type="password"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { loginApi } from "@api/login";
import localCache from "@/plugins/cache";
import { useRoute } from "vue-router";
const loginInfo = reactive({
  account: "",
  passWord: "",
});
const router = useRouter()
const login = async() => {
  const { result } =await loginApi(loginInfo);
  const { token='', userInfo } = result ||{};
  localCache.setCache("HDToken", token);
  localCache.setCache("userInfo", userInfo);
  router.push('/')
};
</script>

<style lang="scss" scoped></style>
