import { ActionTree, createStore, MutationTree } from "vuex";
import * as vxt from "@/store/VuexTypes";
import { Role, Course,Laboratory,reservation } from "@/datasource/Types";
import axios from "@/axios";


export interface State{
  labs?: Laboratory[];
  roles?: Role[];
  courses?: Course[];
  reservations?: reservation[];
}

const myState: State = {
  labs: [],
  roles: [],
  courses: [],
  reservations: [],
}

const myMutations: MutationTree<State> = {
  // 实验室
  [vxt.LIST_LABS]: (state,data) => state.labs = data,
  [vxt.UPDATE_LAB]: (state,data) => state.labs = data,
  // 教师
  [vxt.LIST_USERS]: (state,data) => state.roles = data.data.roles,
  [vxt.UPDATE_USER]: (state,data) => state.roles = data.data.roles,
  // 课程
  [vxt.LIST_COURSES]: (state,data) => state.courses = data,
  [vxt.UPDATE_COURSE]: (state,data) => state.courses = data
}

const myActions: ActionTree<State,State> = {
    /**
     * 实验室
     */
   [vxt.LIST_LABS]: async ({commit}) => {
      const resp = await axios.get("/lab/");
      commit(vxt.LIST_LABS,resp.data);
   },
   [vxt.POST_LAB]: async ({commit},data) => {
      const resp = await axios.post("/lab/",data);
      return resp;
   },
   [vxt.UPDATE_LAB]: async ({commit},data) => {
     const resp = await axios.put("/lab/",data);
     commit(vxt.UPDATE_LAB,resp.data);
     return resp;
   },
   [vxt.DELETE_LAB]: async ({commit},data) => {
     const resp = await axios.delete(`/lab/${data}`);
     return resp;
   },
   [vxt.GET_LABS_BY_COURSE_ID]: async ({commit},data) => {
     if(data){
      const resp = await axios.get(`/lab/${data}`);
      return resp;
     }
  },
   /**
     * 教师
     */
   [vxt.LIST_USERS]: async ({commit}) => {
    const resp = await axios.get("/admin/selectteacher");
    commit(vxt.LIST_USERS,resp.data);
   },
   [vxt.POST_USER]: async ({commit},data) => {
      const resp = await axios.post("/admin/addteacher",data);
      commit(vxt.LIST_USERS,resp.data);
      return resp;
   },
   [vxt.UPDATE_USER]: async ({commit},data) => {
      const resp = await axios.put("/admin/updateteacher",data);
      commit(vxt.UPDATE_USER,resp.data);
      return resp;
   },
   [vxt.DELETE_USER]: async ({commit},data) => {
      const resp = await axios.delete(`/delectteacher/${data}`);
      commit(vxt.LIST_USERS,resp.data);
      return resp;
   },
    /**
     * 课程
     */
   [vxt.LIST_COURSES]: async ({commit},data) => {
     const resp = await axios.get(`/course/teacher/${data}`);
     commit(vxt.LIST_COURSES,resp.data.courses);
   },
   [vxt.POST_COURSE]: async ({commit},data) => {
     const resp = await axios.post("/course/",data);
     return resp;
   },
   [vxt.UPDATE_COURSE]: async ({commit},data) => {
    const resp = await axios.put("/course/",data);
    commit(vxt.UPDATE_LAB,resp.data);
    return resp;
   },
   [vxt.DELETE_COURSE]: async ({commit},data) => {
    const resp = await axios.delete(`/course/${data}`);
    return resp;
   },
   [vxt.GET_COURSE_BY_ID]: async ({commit},data) => {
     if(data){
      const resp = await axios.get(`/course/${data}`);
      return resp;
     }
   },
   /**
     * 预约
     */
    [vxt.GET_APPOINTMENTS_BY_LAB_NAME]: async ({commit},data) => {
      const resp = await axios.get(`/appointment/${data}`)
      return resp;
    },
    [vxt.POST_APPOINTMENT]: async ({commit},data) => {
      const resp = await axios.post("/appointment/", data);
      return resp;
    }
}
export default createStore({
  state: myState,
  mutations: myMutations,
  actions: myActions,
  modules: {},
});
