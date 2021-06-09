<template>
  <div>
    <el-button @click="addteacher" type="text" size="medium"
      >添加教师
    </el-button>
    <el-table :data="role1" border style="width: 100%">
      <el-table-column fixed type="index" label="序号" width="200">
      </el-table-column>
      <el-table-column fixed prop="name" label="姓名" width="200">
      </el-table-column>
      <el-table-column prop="userName" label="用户名" width="200">
      </el-table-column>
      <el-table-column prop="password" label="密码" width="200">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button @click="updateteacher(scope.row)" type="text" size="small"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="deleteteacher(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog title="编辑" v-model="dialogFormVisible01">
    <el-form :model="updateTeacherForm">
      <el-tag class="dialog-tag">姓名</el-tag>
      <el-form-item :label-width="formLabelWidth">
        <el-input
          v-model="updateTeacherForm.name"
          autocomplete="off"
          class="dialog-input"
          size="small"
        ></el-input>
      </el-form-item>

      <el-tag class="dialog-tag">用户名</el-tag>
      <el-form-item :label-width="formLabelWidth">
        <el-input
          v-model="updateTeacherForm.userName"
          autocomplete="off"
          class="dialog-input"
          size="small"
        ></el-input>
      </el-form-item>

      <el-tag class="dialog-tag">密码</el-tag>
      <el-form-item :label-width="formLabelWidth">
        <el-input
          v-model="updateTeacherForm.password"
          autocomplete="off"
          class="dialog-input"
          size="small"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelupdateteacher">取消</el-button>
        <el-button
          type="primary"
          @click="confirmupdateteacher(updateTeacherForm)"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>

  <el-dialog title="编辑" v-model="dialogFormVisible02">
    <el-form :model="addTeacherForm">
      <el-tag class="dialog-tag">姓名</el-tag>
      <el-form-item :label-width="formLabelWidth">
        <el-input
          v-model="addTeacherForm.name"
          autocomplete="off"
          class="dialog-input"
          size="small"
        ></el-input>
      </el-form-item>

      <el-tag class="dialog-tag">用户名</el-tag>
      <el-form-item :label-width="formLabelWidth">
        <el-input
          v-model="addTeacherForm.userName"
          autocomplete="off"
          class="dialog-input"
          size="small"
        ></el-input>
      </el-form-item>

      <el-tag class="dialog-tag">密码</el-tag>
      <el-form-item :label-width="formLabelWidth">
        <el-input
          v-model="addTeacherForm.password"
          autocomplete="off"
          class="dialog-input"
          size="small"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="canceladdteacher">取消</el-button>
        <el-button type="primary" @click="confirmaddteacher(addTeacherForm)"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import axios from "@/axios/index";
import { Role } from "@/datasource/Types";
import { useStore } from "vuex";
import { State } from "@/store";
export default defineComponent({
  setup() {
    const store = useStore<State>();
    axios.get("/admin/selectteacher").then((resp) => {
      if (resp) {
        store.state.roles = resp.data.data.roles;
      }
    });
    const dialogTableVisible = ref(false);
    let dialogFormVisible01 = ref(false);
    let dialogFormVisible02 = ref(false);
    const role1 = computed(() => store.state.roles);
    const role2: Role = {};
    const role3: Role = {
      authority: 1,
    };
    const updateTeacherForm = ref(role2);
    const addTeacherForm = ref(role3);
    function deleteteacher(data: Role) {
      axios
        .get(`/admin/deleteteacher/${data.id}`)
        .then((resp) => (store.state.roles = resp.data.data.roles));
    }
    function updateteacher(data: Role) {
      Object.assign(updateTeacherForm.value, data);
      dialogFormVisible01.value = true;
      console.log(data.name);
    }
    function cancelupdateteacher() {
      dialogFormVisible01.value = false;
    }
    function confirmupdateteacher(data: Role) {
      console.log(data);
      axios
        .post(`/admin/updateteacher`, data)
        .then((resp) => (store.state.roles = resp.data.data.roles));
      dialogFormVisible01.value = false;
    }
    function addteacher(data: Role) {
      dialogFormVisible02.value = true;
    }
    function canceladdteacher() {
      dialogFormVisible02.value = false;
    }
    function confirmaddteacher(data: Role) {
      axios
        .post(`/admin/addteacher`, data)
        .then((resp) => (store.state.roles = resp.data.data.roles));
      dialogFormVisible02.value = false;
    }
    return {
      role1,
      dialogTableVisible,
      deleteteacher,
      dialogFormVisible01,
      updateteacher,
      updateTeacherForm,
      confirmupdateteacher,
      cancelupdateteacher,
      addTeacherForm,
      dialogFormVisible02,
      addteacher,
      canceladdteacher,
      confirmaddteacher,
    };
  },
});
</script>
