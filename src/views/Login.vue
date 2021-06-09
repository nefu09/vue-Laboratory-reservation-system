<template>
  <div id="max">
    <div>
      <el-form-item>
        <el-button type="primary" @click="teacherlogin" id="teacherbutton"
          >教师端</el-button
        >
        <el-button type="primary" @click="adminlogin" id="adminbutton"
          >管理员端</el-button
        >
      </el-form-item>
    </div>
    <div id="form01">
      <el-form
        :model="role01"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input
            type="userName"
            v-model="role01.userName"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="role01.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button plain type="primary" @click="submitteacherlogin" id="login"
            >登陆</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <div id="form02">
      <el-form
        :model="role02"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input
            type="userName"
            v-model="role02.userName"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="role02.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button plain type="primary" @click="submitadminlogin" id="login"
            >登陆</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import axios from "@/axios/index";
import { useRouter } from "vue-router";
import { Role } from "@/datasource/Types";
import { useStore } from "vuex";
import { State } from "@/store";

export default defineComponent({
  setup() {
    const bollen01 = ref(true);
    const bollen02 = ref(false);
    const router = useRouter();
    const store = useStore<State>();
    const role1: Role = {
      userName: "teacher_wang",
      password: "123456",
    };
    const role01 = ref(role1);
    const role2: Role = {
      userName: "admin",
      password: "123456",
    };
    const role02 = ref(role2);
    function submitteacherlogin() {
      axios.post("/login", role01.value).then((resp) => {
        if (resp) {
          if (resp.data.code == 200) {
            const token = resp.data.data.token;
            sessionStorage.setItem("token", token);
            if (resp.data.data.role == 1) {
              sessionStorage.setItem("tid", resp.data.data.teacher);
              store.state.tid = resp.data.data.teacher;
              router.replace(`/teacher`);
            }
            if (resp.data.data.role == 2) {
              alert("用户名或密码错误");
            }
          } else {
            alert(resp.data.message);
          }
        }
      });
    }
    function submitadminlogin() {
      axios.post(`/login`, role02.value).then((resp) => {
        if (resp) {
          if (resp.data.code == 200) {
            const token = resp.data.data.token;
            sessionStorage.setItem("token", token);
            if (resp.data.data.role == 1) {
              alert("用户名或密码错误");
            }
            if (resp.data.data.role == 2) {
              router.replace("/admin");
            }
          } else {
            alert(resp.data.message);
          }
        }
      });
    }
    function teacherlogin() {
      const obj1 = document.getElementById("form01");
      if (obj1 != null) {
        obj1.style.display = "block";
      }
      const obj2 = document.getElementById("form02");
      if (obj2 != null) {
        obj2.style.display = "none";
      }
    }
    function adminlogin() {
      const obj1 = document.getElementById("form01");
      if (obj1 != null) {
        obj1.style.display = "none";
      }
      const obj2 = document.getElementById("form02");
      if (obj2 != null) {
        obj2.style.display = "block";
      }
    }
    return {
      adminlogin,
      teacherlogin,
      submitteacherlogin,
      submitadminlogin,
      role01,
      role02,
      bollen01,
      bollen02,
    };
  },
});
</script>
<style scoped>
#max {
  margin-left: 500px;
  margin-top: 130px;
  border: 2px solid silver;
  width: 500px;
  height: 300px;
}
#form01 {
  position: fixed;
  left: 500px;
  top: 220px;
  width: 500px;
  height: 200px;
  display: block;
}
#form02 {
  position: fixed;
  left: 500px;
  top: 220px;
  width: 500px;
  height: 200px;
  display: none;
}
#login {
  margin-right: 50px;
}
#teacherbutton {
  margin-top: 2px;
}
#adminbutton {
  margin-top: 2px;
}
</style>
