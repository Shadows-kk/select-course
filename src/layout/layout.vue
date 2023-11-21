<template>
  <el-container class="admin_container admin-module">
    <el-aside width="260px" class="aside_style column-space-center">
      <div class="logo column-center">
        <div class="title">杭电选课系统</div>
        <div class="subTitle">The Admin of Course Selection</div>
      </div>
      <!-- <div class="nav"></div> -->
      <SideNav></SideNav>
      <!-- <div class="user column-center" @click="logout">
        <el-avatar :icon="UserFilled" />
        <div class="subTitle">{{ username }}</div>
      </div> -->
      <el-popover placement="right-start" trigger="click">
        <template #reference>
          <div class="user column-center">
            <el-avatar :icon="UserFilled" />
            <div class="subTitle">{{ username }}</div>
          </div>
        </template>
        <div class="btnWrapper column-center">
          <div class="item" @click="changePassword">修改密码</div>
          <div class="item" @click="logout">退出登录</div>
        </div>
      </el-popover>
    </el-aside>
    <el-main class="main_style">
      <div class="container">
        <router-view />
      </div>
    </el-main>
  </el-container>
  <el-dialog v-model="dialogVisible" title="修改密码" width="30%">
    <el-form
      ref="ruleFormRef"
      label-position="right"
      label-width="100px"
      :model="formData"
      :rules="rules"
      style="max-width: 460px"
    >
      <el-form-item label="旧密码" prop="oldPwd">
        <el-input v-model="formData.oldPwd" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd">
        <el-input v-model="formData.newPwd" type="password" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmClick"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { UserFilled } from "@element-plus/icons-vue";
import SideNav from "./SideNav.vue";
import localCache from "@/plugins/cache";
import showMsg from "@/plugins/showMsg.jsx";
import { changePwd } from "@api/admin";
const router = useRouter();
const dialogVisible = ref(false);
const ruleFormRef = ref(null);
const formData = reactive({
  oldPwd: "",
  newPwd: "",
  userID: "",
});
const rules = {
  oldPwd: [
    {
      required: true,
      message: "旧密码不能为空",
      trigger: "change",
    },
  ],
  newPwd: [
    {
      required: true,
      message: "新密码不能为空",
      trigger: "change",
    },
  ],
};
const changePassword = () => {
  dialogVisible.value = true;
};
const confirmClick = () => {
  dialogVisible.value = false;
  ruleFormRef.value.validate((valid) => {
    if (!valid) return;
    changePwd(formData).then((res) => {
      if (res.code === 0) {
        ElMessage.success("修改成功!");
      } else {
        ElMessage.error(res.ErrorMsg);
      }
    });
  });
};
const logout = () => {
  showMsg("此操作将退出登录，是否继续", (close) => {
    router.push("/login");
    close();
  });
};
const username = ref("默认用户");
const getUsername = () => {
  const { account, passWord, userID } = localCache.getCache("userInfo");
  formData.oldPwd = passWord;
  formData.userID = userID;
  username.value = account ?? "默认用户";
};
onMounted(() => {
  getUsername();
  window.document.documentElement.setAttribute("root-module", "admin");
});
onUnmounted(() => {
  window.document.documentElement.removeAttribute("root-module");
});
</script>

<style lang="scss" scoped>
.btnWrapper {
  .item {
    cursor: pointer;

    width: 100%;
    text-align: center;
    padding: 5px 0;
    &:hover {
      background-color: #eee;
    }
  }
}
</style>
