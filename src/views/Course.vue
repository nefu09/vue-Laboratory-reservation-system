<template>
  <div>
    <el-button @click="addcourse" type="text" size="medium"
      >添加课程
    </el-button>
    <el-table :data="course1" border style="width: 100%">
      <el-table-column fixed type="index" label="序号" width="160">
      </el-table-column>
      <el-table-column fixed prop="name" label="课程姓名" width="160">
      </el-table-column>
      <el-table-column prop="teacherName" label="授课教师" width="160">
      </el-table-column>
      <el-table-column prop="studentNumber" label="学生数量" width="160">
      </el-table-column>
      <el-table-column prop="period" label="课时" width="160">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="170">
        <template #default="scope">
          <el-button @click="updatecourse(scope.row)" type="text" size="small"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="deletecourse(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog title="编辑" v-model="dialogFormVisible01">
    <el-form :model="updateCourseForm">
      <el-tag class="dialog-tag">课程名称</el-tag>
      <el-form-item :label-width="formLabelWidth">
        <el-input
          v-model="updateCourseForm.name"
          autocomplete="off"
          class="dialog-input"
          size="small"
        ></el-input>
      </el-form-item>
      <el-tag class="dialog-tag">授课教师</el-tag>
      <el-form-item :label-width="formLabelWidth">
        <el-input
          v-model="updateCourseForm.teacherName"
          autocomplete="off"
          class="dialog-input"
          size="small"
        ></el-input>
      </el-form-item>

      <el-tag class="dialog-tag">学生数量</el-tag>
      <el-form-item :label-width="formLabelWidth">
        <el-input
          v-model="updateCourseForm.studentNumber"
          autocomplete="off"
          class="dialog-input"
          size="small"
        ></el-input>
      </el-form-item>

      <el-tag class="dialog-tag">课时</el-tag>
      <el-form-item :label-width="formLabelWidth">
        <el-input
          v-model="updateCourseForm.period"
          autocomplete="off"
          class="dialog-input"
          size="small"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelupdatecourse">取消</el-button>
        <el-button type="primary" @click="confirmupdatecourse(updateCourseForm)"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>

  <el-dialog title="添加" v-model="dialogFormVisible02">
    <el-form :model="addCourseForm">
      <el-tag class="dialog-tag">课程名称</el-tag>
      <el-form-item :label-width="formLabelWidth">
        <el-input
          v-model="addCourseForm.name"
          autocomplete="off"
          class="dialog-input"
          size="small"
        ></el-input>
      </el-form-item>

      <el-tag class="dialog-tag">授课教师</el-tag>
      <el-form-item :label-width="formLabelWidth">
        <el-input
          v-model="addCourseForm.teacherName"
          autocomplete="off"
          class="dialog-input"
          size="small"
        ></el-input>
      </el-form-item>

      <el-tag class="dialog-tag">学生数量</el-tag>
      <el-form-item :label-width="formLabelWidth">
        <el-input
          v-model="addCourseForm.studentNumber"
          autocomplete="off"
          class="dialog-input"
          size="small"
        ></el-input>
      </el-form-item>

      <el-tag class="dialog-tag">课时</el-tag>
      <el-form-item :label-width="formLabelWidth">
        <el-input
          v-model="addCourseForm.period"
          autocomplete="off"
          class="dialog-input"
          size="small"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="canceladdcourse">取消</el-button>
        <el-button type="primary" @click="confirmaddcourse(addCourseForm)"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import axios from "@/axios/index";
import { Course, Role } from "@/datasource/Types";
import { useStore } from "vuex";
import { State } from "@/store";
export default defineComponent({
  setup() {
    const store = useStore<State>();
    const checkedteacherid = ref(sessionStorage.getItem("tid"));
    axios.get(`/selectcourse/${checkedteacherid.value}`).then((resp) => {
      if (resp) {
        store.state.courses = resp.data.data.courses;
      }
    });
    const dialogTableVisible = ref(false);
    let dialogFormVisible01 = ref(false);
    let dialogFormVisible02 = ref(false);
    const course1 = computed(() => store.state.courses);
    const course2: Course = {
      teacherId: store.state.tid,
    };
    const course3: Course = {
      teacherId: store.state.tid,
    };
    const updateCourseForm = ref(course2);
    const addCourseForm = ref(course3);
    function deletecourse(data: Course) {
      axios
        .get(`/deletecourse/${data.id}/${checkedteacherid.value}`)
        .then((resp) => (store.state.courses = resp.data.data.courses));
    }
    function updatecourse(data: Role) {
      Object.assign(updateCourseForm.value, data);
      dialogFormVisible01.value = true;
      console.log(data.name);
    }
    function cancelupdatecourse() {
      dialogFormVisible01.value = false;
    }
    function confirmupdatecourse(data: Course) {
      console.log(data);
      axios
        .post(`/updatecourse/${checkedteacherid.value}`, data)
        .then((resp) => (store.state.courses = resp.data.data.courses));
      dialogFormVisible01.value = false;
    }
    function addcourse(data: Course) {
      dialogFormVisible02.value = true;
    }
    function canceladdcourse() {
      dialogFormVisible02.value = false;
    }
    function confirmaddcourse(data: Course) {
      axios
        .post(`/addcourse/${checkedteacherid.value}`, data)
        .then((resp) => (store.state.courses = resp.data.data.courses));
      dialogFormVisible02.value = false;
    }
    return {
      course1,

      dialogTableVisible,
      deletecourse,
      dialogFormVisible01,
      updatecourse,
      updateCourseForm,
      confirmupdatecourse,
      cancelupdatecourse,
      addCourseForm,
      dialogFormVisible02,
      addcourse,
      canceladdcourse,
      confirmaddcourse,
    };
  },
});
</script>
