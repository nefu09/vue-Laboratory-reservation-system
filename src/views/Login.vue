<template>
  <div>
    <form>
      <label>用户名</label>
      <input type="text" v-model="role1.userName" />
      <br />
      <label>密码</label>
      <input type="password" v-model="role1.password" />
      <br />
      <button @click="submitLogin" type="submit">登录</button>
    </form>
  </div>
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
    const router = useRouter();
    const store = useStore<State>();
    const role: Role = {
      name: "",
      password: "123456",
      userName: "guan",
      id: undefined,
      authority: undefined,
    };
    const role1 = ref(role);
    function submitLogin() {
      axios.post("/login", role1.value).then((resp) => {
        if (resp) {
          if (resp.data.code == 200) {
            const token = resp.data.data.token;
            sessionStorage.setItem("token", token);
            if (resp.data.data.role == 1) {
              router.replace("/teacher");
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
    return {
      submitLogin,
      role1,
    };
  },
});
</script>
