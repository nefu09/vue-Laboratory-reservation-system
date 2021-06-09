<template>
  <div>
    <el-button type="primary"
      ><router-link to="/admin" id="button"
        >教师信息管理</router-link
      ></el-button
    >
    <el-button type="primary"
      ><router-link to="/admin/laboratory" id="button"
        >实验室信息管理</router-link
      ></el-button
    >

    <router-view> </router-view>
  </div>
</template>
<style scoped>
#button {
  text-decoration: none;
  color: aquamarine;
}
</style>
