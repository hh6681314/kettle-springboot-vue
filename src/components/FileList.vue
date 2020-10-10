<template>
  <a-spin :spinning="spinConfig.spinning" :delay="spinConfig.delayTime">
    <a-table
      :columns="columns"
      :data-source="fileList"
      tableLayout="fixed"
      :bordered="tableConfig.bordered"
    >
      <template slot="action" slot-scope="record">
        <a-space size="large" direction="horizontal">
          <a @click="exec(record.name, record.key, record.server)">执行</a>
          <a-popconfirm
            title="Sure to delete?"
            @confirm="() => delFile(record.name, record.key, record.server)"
          >
            <a>删除</a>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>
  </a-spin>
</template>
<script>
const columns = [
  {
    title: "文件名",
    dataIndex: "name",
    align: "center",
  },
  {
    title: "所属服务器",
    dataIndex: "server",
    align: "center",
  },
  {
    title: "文件操作",
    scopedSlots: { customRender: "action", title: "执行" },
    align: "center",
  },
];

export default {
  data() {
    return {
      fileList: [],
      columns,
      spinConfig: {
        spinning: false,
        delayTime: 500,
      },
      tableConfig: {
        bordered: true,
      },
    };
  },
  mounted: function () {
    this.init();
  },
  methods: {
    init() {
      let _this = this;
      this.spinConfig.spinning = true;
      this.$http.get("/file/list").then(function (res) {
        _this.spinConfig.spinning = false;
        if (res) {
          let result = JSON.parse(res);
          for (let i = 0; i < result.length; i++) {
            for (let j = 0; j < result[i].length; j++) {
              if (i == 0) {
                _this.fileList.push({
                  key: j,
                  server: "WEB",
                  name: result[i][j],
                });
              } else {
                _this.fileList.push({
                  key: j + result[i].length,
                  server: "DATABASE",
                  name: result[i][j],
                });
              }
            }
          }
        }
      });
    },
    exec(name, key, server) {
      let _this = this;
      this.spinConfig.spinning = true;
      this.$http.post("file/execBat", {
        name: name,
        server: server
      }).then(function () {
        _this.spinConfig.spinning = false;
        return;
      });
    },
    delFile(name, key, server) {
      console.log(name);
      console.log(key);
      console.log(server);
      this.$message.warn("功能尚未实现");
    },
  },
};
</script>
<style>
#components-table-demo-size h4 {
  margin-bottom: 16px;
}
</style>
