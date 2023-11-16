<template>
  <div class="nav">
    <template v-for="(item, index) in navListByPermission" :key="index">
      <div
        class="navItem"
        :class="{ actived: defaultFocus === item.title }"
        @click="handleClick(item)"
      >
        <span> {{ item.title }}</span>
      </div>
    </template>
  </div>
</template>

<script setup>
const defaultFocus = ref("用户管理");
const navList = [
  { icon: "userManage", title: "学生管理", path: "userManage" },
  { icon: "courseManage", title: "课程管理", path: "courseManage" },
  { icon: "myCourse", title: "我的课程", path: "myCourse" },
];
const navListByPermission = ref([]);

const router = useRouter();
const handleClick = (item) => {
  defaultFocus.value = item.title;
  router.push(`/${item.path}`);
};
// 高亮nav
const route = useRoute();
onMounted(() => {
  const { permissionList = [] } =
    JSON.parse(localStorage.getItem("userInfo")) || {};
  permissionList.forEach((i) => {
    const temp = navList.find((item) => {
      return item.path === i.permissionName;
    });
    if (temp) {
      navListByPermission.value.push(temp);
    }
    defaultFocus.value = navListByPermission.value[0].title;
    router.push(navListByPermission.value[0].path);
  });
});
</script>

<style lang="scss" scoped></style>
