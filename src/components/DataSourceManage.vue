<template>
  <a-table :data-source="data" :columns="columns">
    <div
      slot="filterDropdown"
      slot-scope="{
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        column,
      }"
      style="padding: 8px"
    >
      <a-input
        v-ant-ref="(c) => (searchInput = c)"
        :placeholder="`Search ${column.dataIndex}`"
        :value="selectedKeys[0]"
        style="width: 188px; margin-bottom: 8px; display: block"
        @change="(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])"
        @pressEnter="
          () => handleSearch(selectedKeys, confirm, column.dataIndex)
        "
      />
      <a-button
        type="primary"
        icon="search"
        size="small"
        style="width: 90px; margin-right: 8px"
        @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
      >
        Search
      </a-button>
      <a-button
        size="small"
        style="width: 90px"
        @click="() => handleReset(clearFilters)"
      >
        Reset
      </a-button>
    </div>
    <a-icon
      slot="filterIcon"
      slot-scope="filtered"
      type="search"
      :style="{ color: filtered ? '#108ee9' : undefined }"
    />
    <template slot="customRender" slot-scope="text, record, index, column">
      <span v-if="searchText && searchedColumn === column.dataIndex">
        <template
          v-for="(fragment, i) in text
            .toString()
            .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
        >
          <mark
            v-if="fragment.toLowerCase() === searchText.toLowerCase()"
            :key="i"
            class="highlight"
            >{{ fragment }}</mark
          >
          <template v-else>{{ fragment }}</template>
        </template>
      </span>
      <template v-else>
        {{ text }}
      </template>
    </template>
    <template slot="action" slot-scope="record">
      <a-space size="large" direction="horizontal">
        <a @click="exec(record.key)">编辑</a>
        <a-popconfirm
          title="Sure to delete?"
          @confirm="() => delConnect(record.key)"
        >
          <a>删除</a>
        </a-popconfirm>
      </a-space>
    </template>
  </a-table>
</template>

<script>
const data = [];

export default {
  data() {
    return {
      data,
      searchText: "",
      searchInput: null,
      searchedColumn: "",
      columns: [
        {
          title: "LinkName",
          dataIndex: "linkName",
          key: "linkName",
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) =>
            record.linkName
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              }, 0);
            }
          },
        },
        {
          title: "IP",
          dataIndex: "ip",
          key: "ip",
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) =>
            record.ip.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              });
            }
          },
        },
        {
          title: "Port",
          dataIndex: "port",
          key: "port",
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) =>
            record.port.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              });
            }
          },
        },
        {
          title: "Action",
          scopedSlots: {
            customRender: "action",
          },
        },
      ],
    };
  },
  mounted: function () {
    this.init();
  },
  methods: {
    init() {
      this.data = [];
      let _this = this;
      this.$http.get("data/dataSourceList").then(function (res) {
          if (!res) {
            return;
          }
        res = JSON.parse(res);
        res.forEach((e) => {
          _this.data.push({
            key: e.name,
            linkName: e.name,
            ip: e.host,
            port: e.port,
          });
        });
      });
    },

    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },

    handleReset(clearFilters) {
      clearFilters();
      this.searchText = "";
    },

    delConnect(key) {
      let _this = this;
      this.$http.delete("data/delConnect/" + key).then(function (res) {
        if(!res){
          return;
        }
        
        _this.init();
      });
    },
  },
};
</script>
<style scoped>
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
</style>
