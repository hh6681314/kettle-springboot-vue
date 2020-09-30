<template>
  <a-row align="bottom">
    <a-col :span="6"> </a-col>
    <a-col :span="12">
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="Database">
          <a-cascader
            :options="options"
            :load-data="loadData"
            placeholder="Please select"
            change-on-select
            @change="onChange"
            @click="init"
            size="default"
          />
        </a-form-item>
        <a-form-model-item label="Table Name">
          <a-select
            show-search
            :value="form.value"
            placeholder="input search table name"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            :disabled="searchDisable"
            @search="fetchUser"
            @change="handleChange"
          >
            <a-select-option v-for="d in searchData" :key="d">
              {{ d }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-item :wrapper-col="{ span: 24, offset: 8 }">
          <a-button
            @click="handleSubmit"
            type="primary"
            html-type="submit"
            :loading="submitLoading"
            :disabled="buttonStatus"
          >
            Generate
          </a-button>
        </a-form-item>
        <a-form-item v-show="textAreaStatus"  :wrapper-col="{ span: 24, offset: 0 }">
          <a-textarea :value="textAreaValue" :autoSize="textAreaStatus" placeholder="textarea with clear icon" />
        </a-form-item>
      </a-form>
    </a-col>
    <a-col :span="6"> </a-col>
  </a-row>
</template>
<script>
import debounce from "lodash/debounce";
export default {
  data() {
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 500);
    return {
      options: [],
      listLoading: true,
      form: {
        currentDataSource: "",
        currentSchema: "",
        value: undefined,
      },
      submitLoading: false,
      searchDisable: true,
      searchData: [],
      fetching: false,
      textAreaStatus: false,
      textAreaValue: "",
      buttonStatus: true,

    };
  },
  mounted: function () {
    //this.init();
  },
  methods: {
    init() {
      let _this = this;
      this.$http.get("data/nowConnect", {}).then(function (res) {
        if (!res) {
          return;
        }
        let list = JSON.parse(res);
        _this.options = [];
        list.forEach((name) => {
          _this.options.push({ value: name, label: name, isLeaf: false });
          _this.listLoading = false;
        });
      });
    },
    onChange(value) {
      let databaseSelect = [];
      value.forEach((i) => databaseSelect.push(i));
      if (databaseSelect[1] != null) {
        this.form.currentDataSource = databaseSelect[0];
        this.form.currentSchema = databaseSelect[1];
        this.loadSeacrchData();
      }
    },
    loadSeacrchData() {
      let _this = this;
      this.$http
        .get(
          "data/getAllTableName/" +
            _this.form.currentDataSource +
            "/" +
            _this.form.currentSchema
        )
        .then(function (res) {
          if (!res) {
            return;
          }
          let searchData = JSON.parse(res);
          _this.searchData = searchData;
        });
      this.searchDisable = false;
    },
    loadData(selectedOptions) {
      let _this = this;
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;
      this.$http
        .get("data/getAllDatabaseName/" + targetOption.value)
        .then(function (res) {
          if (!res) {
            return;
          }
          targetOption.children = [];
          JSON.parse(res).forEach((i) => {
            targetOption.children.push({ label: i, value: i });
          });
          targetOption.loading = false;
          _this.options = [..._this.options];
        });
    },
    handleSubmit() {
      let _this = this;
      this.buttonStatus = true;
      this.$http
        .get(
          "data/generate/" +
            this.form.currentDataSource +
            "/" +
            this.form.currentSchema +
            "/" +
            this.form.value
        )
        .then(function (res) {
          let sql = "";
          JSON.parse(res).forEach(s => sql += (s + ";\n"))
          _this.textAreaValue = sql;
          _this.textAreaStatus = true;
        });
      return;
    },
    fetchUser(value) {
      let _this = this;
      if (null == value) {
        return;
      } else if (value == "") {
        this.loadSeacrchData();
        return;
      }
      this.fetching = true;
      this.$http
        .get(
          "data/getTableName/" +
            this.form.currentDataSource +
            "/" +
            this.form.currentSchema +
            "/" +
            value
        )
        .then(function (res) {
          let all = JSON.parse(res);
          _this.searchData = all;
          _this.fetching = false;
        });
    },
    handleChange(value) {
      this.buttonStatus = false;
      this.form.value = value;
    },
  },
};
</script>
<style></style>
