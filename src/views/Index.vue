<template>
  <div class="home">
    <a-layout>
      <a-layout-sider theme="light">
        <div class="logo" />
        <a-menu theme="light" mode="inline" v-model="menuSelect">
          <a-menu-item
            v-for="(name, index) in menus"
            :key="name.key"
            @click="viewSwitch(name.key)"
          >
            <a-icon :type="icons[index]" />{{ name.value }}
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="background: #e0eee8; padding: 0">
          <a style="float: right" @click="logout">Logout</a>
        </a-layout-header>
        <a-layout-content style="margin: 0 16px">
          <a-breadcrumb style="margin: 16px 0"> </a-breadcrumb>
          <div
            :style="{ padding: '24px', background: '#fff', minHeight: '475px' }"
          >
            <router-view />
          </div>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
          2018-2020 &copy; 蜂窝煤
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
export default {
  name: "index",
  components: {},
  data() {
    return {
      menus: [
        {
          key: "filelist",
          value: "Kettle File List",
        },
        {
          key: "init",
          value: "DataSource Setting",
        },
        {
          key: "datasourcelist",
          value: "DataSource Control",
        },
        {
          key: "manage",
          value: "DataSource Manage",
        },
      ],
      icons: ["profile", "api", "tool", "database"],
      menuSelect: [],
    };
  },
  mounted: function () {
    this.init();
  },
  methods: {
    viewSwitch(item) {
      if (this.$route.name != item) {
        this.$router.push({ name: item });
      }
    },
    init() {
      this.menuSelect = [this.$route.name];
    },
    logout() {
      let _this = this;
      this.$http
        .post("auth/logout")
        .then(function (res) {
          if (!res) {
            _this.$message.error(res, 3);
            return;
          }
          _this.$message.success("成功退出登录!", 3);
          sessionStorage.clear();
          _this.$router.push({ name: "login" });
        });
    },
  },
};
</script>

<style>
#components-layout-demo-side .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>