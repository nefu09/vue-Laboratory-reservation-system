
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Login from "../views/Login.vue";

const routes: Array<RouteRecordRaw> = [
  { 
    path: "/",
    name: "Login",
    component: Login
  },
  {
    path: "/admin",
    name: "Admin",
    component: ()=>import("@/views/Admin.vue"),
    children: [
      { 
        path: "",
        component: () => import("@/views/TeacherManage.vue")
      },
      { 
        path: "laboratory",
        component: () => import("@/views/Laboratory.vue")
      }
    ]
  },
  { 
    path: "/teacher",
    name: "Teacher",
    component: ()=>import("@/views/Teacher.vue"),
    children: [
      { 
        path: "course",
        component: () => import("@/views/Course.vue")
      },
      {  
        path: "reservation",
        component: () => import("@/views/Reservation.vue"),
      }
    ]
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
