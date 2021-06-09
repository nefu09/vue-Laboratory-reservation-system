<template>
  <div>
    <el-button @click="addlaboratory" type="text" size="medium"
      >添加实验室
    </el-button>
    <el-table :data="laboratory1" border style="width: 100%">
      <el-table-column fixed type="index" label="序号" width="200">
      </el-table-column>
      <el-table-column fixed prop="name" label="实验室名称" width="200">
      </el-table-column>
      <el-table-column prop="capacity" label="容量" width="200">
      </el-table-column>
      <el-table-column prop="description" label="描述" width="200">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button
            @click="updatelaboratory(scope.row)"
            type="text"
            size="small"
            >编辑</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="deletelaboratory(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog title="编辑" v-model="dialogFormVisible01">
    <el-form :model="updateLaboratoryForm">
      <el-tag class="dialog-tag">实验室名称</el-tag>
      <el-form-item :label-width="formLabelWidth">
        <el-input
          v-model="updateLaboratoryForm.name"
          autocomplete="off"
          class="dialog-input"
          size="small"
        ></el-input>
      </el-form-item>

      <el-tag class="dialog-tag">容量</el-tag>
      <el-form-item :label-width="formLabelWidth">
        <el-input
          v-model="updateLaboratoryForm.capacity"
          autocomplete="off"
          class="dialog-input"
          size="small"
        ></el-input>
      </el-form-item>

      <el-tag class="dialog-tag">描述</el-tag>
      <el-form-item :label-width="formLabelWidth">
        <el-input
          v-model="updateLaboratoryForm.description"
          autocomplete="off"
          class="dialog-input"
          size="small"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelupdatelaboratory">取消</el-button>
        <el-button
          type="primary"
          @click="confirmupdatelaboratory(updateLaboratoryForm)"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>

  <el-dialog title="编辑" v-model="dialogFormVisible02">
    <el-form :model="addLaboratoryForm">
      <el-tag class="dialog-tag">实验室名称</el-tag>
      <el-form-item :label-width="formLabelWidth">
        <el-input
          v-model="addLaboratoryForm.name"
          autocomplete="off"
          class="dialog-input"
          size="small"
        ></el-input>
      </el-form-item>

      <el-tag class="dialog-tag">容量</el-tag>
      <el-form-item :label-width="formLabelWidth">
        <el-input
          v-model="addLaboratoryForm.capacity"
          autocomplete="off"
          class="dialog-input"
          size="small"
        ></el-input>
      </el-form-item>

      <el-tag class="dialog-tag">描述</el-tag>
      <el-form-item :label-width="formLabelWidth">
        <el-input
          v-model="addLaboratoryForm.description"
          autocomplete="off"
          class="dialog-input"
          size="small"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="canceladdlaboratory">取消</el-button>
        <el-button
          type="primary"
          @click="confirmaddlaboratory(addLaboratoryForm)"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import axios from "@/axios/index";
import { Laboratory } from "@/datasource/Types";
import { useStore } from "vuex";
import { State } from "@/store";
import { LIST_LABS } from "@/store/VuexTypes";
export default defineComponent({
  setup() {
    const dialogTableVisible = ref(false);
    let dialogFormVisible01 = ref(false);
    let dialogFormVisible02 = ref(false);
    const store = useStore<State>();
    axios.get("/admin/selectlaboratory").then((resp) => {
      store.state.labs = resp.data.data.laboratories;
    });
    const laboratory1 = computed(() => store.state.labs);
    const laboratory2: Laboratory = {};
    const laboratory3: Laboratory = {};
    const updateLaboratoryForm = ref(laboratory2);
    const addLaboratoryForm = ref(laboratory3);

    function deletelaboratory(data: Laboratory) {
      axios.get(`/admin/deletelaboratory/${data.id}`).then((resp) => {
        store.state.labs = resp.data.data.laboratories;
      });
    }
    function updatelaboratory(data: Laboratory) {
      Object.assign(updateLaboratoryForm.value, data);
      dialogFormVisible01.value = true;
      console.log(data.name);
    }
    function cancelupdatelaboratory() {
      dialogFormVisible01.value = false;
    }
    function confirmupdatelaboratory(data: Laboratory) {
      console.log(data);
      axios.post(`/admin/updatelaboratory`, data).then((resp) => {
        if (resp) {
          store.state.labs = resp.data.data.laboratories;
        }
      });

      dialogFormVisible01.value = false;
    }
    function addlaboratory(data: Laboratory) {
      dialogFormVisible02.value = true;
    }
    function canceladdlaboratory() {
      dialogFormVisible02.value = false;
    }
    function confirmaddlaboratory(data: Laboratory) {
      axios.post(`/admin/addlaboratory`, data).then((resp) => {
        if (resp) {
          store.state.labs = resp.data.data.laboratories;
        }
      });
      dialogFormVisible02.value = false;
    }
    return {
      laboratory1,
      dialogTableVisible,
      deletelaboratory,
      dialogFormVisible01,
      updatelaboratory,
      updateLaboratoryForm,
      confirmupdatelaboratory,
      cancelupdatelaboratory,
      addLaboratoryForm,
      dialogFormVisible02,
      addlaboratory,
      confirmaddlaboratory,
      canceladdlaboratory,
    };
  },
});
</script>
