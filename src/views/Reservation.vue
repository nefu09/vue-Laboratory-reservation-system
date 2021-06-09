<template>
  <div class="form">
    <el-form :inline="true" class="demo-form-inline" id="form1">
      <el-form-item>
        <el-select v-model="checkedcourseid" placeholder="请选择课程">
          <el-option
            v-for="c in courses"
            :value="c.id"
            :key="c.id"
            :label="c.name"
            >{{ c.name }}</el-option
          >
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="choicecourse">查询</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" class="demo-form-inline" id="form2">
      <el-form-item>
        <el-select v-model="checkedlaboratoryid" placeholder="请选择实验室">
          <el-option
            :label="a.name"
            v-for="a in avialablelaboratories1"
            :value="a.id"
            :key="a.id"
            :disabled="change"
            >{{ a.name }}</el-option
          >
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="choicelaboratory">确定</el-button>
      </el-form-item>
    </el-form>
    <div id="span">
      <span :style="{ color: selectedperiod == period ? 'green' : 'red' }">
        {{ selectedperiod }} </span
      ><span>/{{ period }}</span>
    </div>
  </div>
  <table border="1px solid red" id="table">
    <thead>
      <th>第几节</th>
      <th>星期一</th>
      <th>星期二</th>
      <th>星期三</th>
      <th>星期四</th>
      <th>星期五</th>
      <th>星期六</th>
      <th>星期七</th>
    </thead>
    <tbody>
      <tr v-for="location in locations1" :key="location.lesson + 1">
        <td>第{{ location.lesson }}节</td>
        <template v-for="day in location.days" :key="day.daywhich + 1">
          <td><button @click="schedule(location, day)">课程预约</button></td>
        </template>
      </tr>
    </tbody>
  </table>

  <div id="pop" v-if="dialogFormVisible && ableschedule">
    <template v-for="c in choice1.day.weeks" :key="c.weekwhich">
      第{{ c.weekwhich }}周<input
        type="checkbox"
        :disabled="c.disabled"
        :value="{
          teacherId: checkedteacherid,
          courseId: checkedcourseid,
          laboratoryId: checkedlaboratoryid,
          week: c.weekwhich,
          lesson: choice1.lesson,
          day: choice1.day.daywhich,
        }"
        v-model="reservationuseadd"
      />
    </template>
    <div id="buttoncollection">
      <div id="button1">
        <el-button type="info" @click="cancelreserve">取消</el-button>
      </div>
      <div id="button2">
        <el-button type="success" @click="finishreserve">预约</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import axios from "@/axios/index";
import { useRouter } from "vue-router";
import {
  Location,
  Day,
  Week,
  Choice,
  Course,
  Laboratory,
  Reservation,
} from "@/datasource/Types";
import { useStore } from "vuex";
import { State } from "@/store";

export default defineComponent({
  props: {
    tid: String,
  },
  setup(props) {
    const router = useRouter();
    const dialogFormVisible = ref(false);
    const store = useStore<State>();
    const courses = computed(() => store.state.courses);
    const checkedcourseid = ref<string>();
    const checkedteacherid = ref(sessionStorage.getItem("tid"));
    const checkedlaboratoryid = ref<string>();
    const avialablelaboratories: Laboratory[] = [];
    const avialablelaboratories1 = ref(avialablelaboratories);
    const reservations = ref<Reservation[]>([]);
    const exclude = ref<number[]>([]);
    const weekswhich = ref<number[]>([]);
    const period = ref<number>(0);
    const yse = ref(true);
    const reservationuseadd = ref<Reservation[]>([]);
    const selectedperiod01 = ref<number>(0);
    const selectedperiod = ref<number>(0);
    const ableschedule=ref(false);
    const change = ref(true);
    watch(reservationuseadd, () => {
      selectedperiod.value =
        selectedperiod01.value + reservationuseadd.value.length * 2;
      if (period.value <= selectedperiod.value && yse.value == true) {
        alert("课程课时已满");
        yse.value = false;
        choice1.value.day?.weeks?.forEach((c) => {
          c.disabled = true;
        });
      }
    });
    watch(checkedcourseid, () => {
      change.value = true;
      ableschedule.value = false;
    });
    watch(checkedlaboratoryid, () => {
      ableschedule.value = false;
    });
    const choice: Choice = {
      // lesson: 0,
      // day: {
      //   daywhich: 0,
      //   weeks: [
      //     { weekwhich: 1, disabled: false },
      //     { weekwhich: 2, disabled: false },
      //     { weekwhich: 3, disabled: false },
      //     { weekwhich: 4, disabled: false },
      //     { weekwhich: 5, disabled: false },
      //     { weekwhich: 6, disabled: false },
      //     { weekwhich: 7, disabled: false },
      //     { weekwhich: 8, disabled: false },
      //     { weekwhich: 9, disabled: false },
      //     { weekwhich: 10, disabled: false },
      //     { weekwhich: 11, disabled: false },
      //     { weekwhich: 12, disabled: false },
      //     { weekwhich: 13, disabled: false },
      //     { weekwhich: 14, disabled: false },
      //     { weekwhich: 15, disabled: false },
      //     { weekwhich: 16, disabled: false },
      //     { weekwhich: 17, disabled: false },
      //     { weekwhich: 18, disabled: false },
      //   ],
      // },
    };
    const choice1 = ref(choice);
    axios.get(`/selectcourse/${checkedteacherid.value}`).then((resp) => {
      if (resp) {
        store.state.courses = resp.data.data.courses;
      }
    });
    const locations: Location[] = [
      {
        lesson: 1,
        days: [
          {
            daywhich: 1,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 2,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 3,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 4,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 5,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 6,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 7,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
        ],
      },
      {
        lesson: 2,
        days: [
          {
            daywhich: 1,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 2,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 3,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 4,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 5,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 6,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 7,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
        ],
      },
      {
        lesson: 3,
        days: [
          {
            daywhich: 1,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 2,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 3,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 4,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 5,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 6,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 7,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
        ],
      },
      {
        lesson: 4,
        days: [
          {
            daywhich: 1,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 2,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 3,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 4,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 5,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 6,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 7,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
        ],
      },
      {
        lesson: 5,
        days: [
          {
            daywhich: 1,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 2,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 3,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 4,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 5,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 6,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
          {
            daywhich: 7,
            weeks: [
              { weekwhich: 1, disabled: false },
              { weekwhich: 2, disabled: false },
              { weekwhich: 3, disabled: false },
              { weekwhich: 4, disabled: false },
              { weekwhich: 5, disabled: false },
              { weekwhich: 6, disabled: false },
              { weekwhich: 7, disabled: false },
              { weekwhich: 8, disabled: false },
              { weekwhich: 9, disabled: false },
              { weekwhich: 10, disabled: false },
              { weekwhich: 11, disabled: false },
              { weekwhich: 12, disabled: false },
              { weekwhich: 13, disabled: false },
              { weekwhich: 14, disabled: false },
              { weekwhich: 15, disabled: false },
              { weekwhich: 16, disabled: false },
              { weekwhich: 17, disabled: false },
              { weekwhich: 18, disabled: false },
            ],
          },
        ],
      },
    ];
    const locations1 = ref(locations);
    function schedule(location: Location, day: Day) {
      axios
        .get(
          `/reserve/${checkedlaboratoryid.value}/${day.daywhich}/${location.lesson}`
        )
        .then((resp) => {
          reservations.value = resp.data.data.reservations;
          choice1.value.lesson = location.lesson;
          choice1.value.day = day;
          console.log(reservations.value.length);
          if (selectedperiod01.value >= period.value) {
            choice1.value.day.weeks?.forEach((w) => {
              w.disabled = true;
            });
          } else {
            choice1.value.day.weeks?.forEach((w) => {
              reservations.value?.forEach((r) => {
                if (r.week == w.weekwhich) {
                  w.disabled = true;
                }
              });
            });
          }
          dialogFormVisible.value = true;
        });
    }
    function choicecourse() {
      axios.get(`/reserve/course/${checkedcourseid.value}`).then((resp) => {
        if (resp) {
          avialablelaboratories1.value = resp.data.data.AvialableLaboratories;
          period.value = resp.data.data.period;
          selectedperiod.value = resp.data.data.selectedPeriod;
          selectedperiod01.value = resp.data.data.selectedPeriod;
          change.value = false;
        }
      });
    }
    function finishreserve() {
      axios
        .post(`/reserve/reservetime`, reservationuseadd.value)
        .then((resp1) => {
          if (resp1) {
            axios
              .get(`/reserve/course/${checkedcourseid.value}`)
              .then((resp) => {
                if (resp) {
                  if (selectedperiod01.value >= period.value) {
                    yse.value = false;
                  }
                  reservationuseadd.value = [];
                  selectedperiod.value = resp.data.data.selectedPeriod;
                  selectedperiod01.value = resp.data.data.selectedPeriod;
                }
                dialogFormVisible.value = false;
                choice1.value = choice;
                reservations.value = [];
              });
          }
        });
    }

    function cancelreserve() {
      reservationuseadd.value = [];
      selectedperiod.value = selectedperiod01.value;
      if (selectedperiod01.value < period.value) {
        yse.value = true;
      }
      dialogFormVisible.value = false;
    }
    function choicelaboratory() {
      dialogFormVisible.value = false;
      ableschedule.value = true;
    }
    return {
      schedule,
      locations1,
      choice1,
      courses,
      choicecourse,
      avialablelaboratories1,
      checkedcourseid,
      checkedlaboratoryid,
      checkedteacherid,
      finishreserve,
      dialogFormVisible,
      cancelreserve,
      exclude,
      weekswhich,
      reservationuseadd,
      period,
      selectedperiod,
      change,
      choicelaboratory,
      ableschedule,
    };
  },
});
</script>
<style scoped>
td {
  width: 80px;
  height: 80px;
}
#schedule {
  border: 2px black solid;
  width: 400px;
  height: 300px;
  display: none;
  position: fixed;
  right: 600px;
  top: 100px;
}
#label {
  font-size: 25px;
  width: 100px;
}
#form1 {
  width: 400px;
  display: inline-block;
  margin-right: 120px;
}
#form2 {
  width: 400px;
  display: inline-block;
  margin-right: 80px;
}
.form {
  display: inline-block;
}
span {
  font-size: 30px;
}
#span {
  margin-right: 100px;
}

#buttoncollection {
  display: inline-block;
}
#button1 {
  float: left;
  margin-top: 20px;
  margin-right: 100px;
}
#button2 {
  float: left;
  margin-top: 20px;
}
</style>
