<template>
  <el-container style="height: 100%; border: 2px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '3']">
        <el-submenu index="1">
          <template #title>教师管理</template>
          <el-menu-item index="1-1"
            ><router-link to="/teacher/course"
              >课程信息管理</router-link
            ></el-menu-item
          >
          <el-menu-item index="1-2"
            ><router-link to="/teacher/reservation"
              >实验室预约</router-link
            ></el-menu-item
          >
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
        </el-dropdown>
      </el-header>

      <router-view></router-view>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import axios from "@/axios/index";
import { useRouter } from "vue-router";
import { Role } from "@/datasource/Types";
import { useStore } from "vuex";
import { State } from "@/store";
import { LIST_USERS } from "@/store/VuexTypes";
export default defineComponent({
  setup() {
    return {};
  },
});
</script>
