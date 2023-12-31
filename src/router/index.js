import localCache from "@/plugins/cache";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("../views/login.vue"),
    },
    {
      path: "/",
      name: "layout",
      component: () => import("../layout/layout.vue"),
      // redirect: "/login",
      children: [
        {
          path: "userManage",
          name: "userManage",
          component: () => import("../views/userManage.vue"),
          meta: {
            module: "userManage",
          },
        },
        {
          path: "courseManage",
          name: "courseManage",
          component: () => import("../views/courseManage.vue"),
          meta: {
            module: "courseManage",
          },
        },
        {
          path: "myCourse",
          name: "myCourse",
          component: () => import("../views/myCourse.vue"),
          meta: {
            module: "myCourse",
          },
        },
      ],
    },
  ],
});
router.beforeEach((to) => {
  if (to.path !== '/login') {
    const token = localCache.getCache('HDToken')
    if (!token) {
      return '/login'
    }
  }
});

export default router;
