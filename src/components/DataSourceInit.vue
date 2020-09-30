<template>
  <a-form
    :form="form"
    :label-col="{ span: 5 }"
    :wrapper-col="{ span: 12 }"
    @submit="handleSubmit"
  >
    <a-form-item label="Database">
      <a-select
        v-decorator="[
          'Database',
          {
            rules: [
              {
                required: !this.checkout,
              },
            ],
          },
        ]"
        placeholder="Select an option to identify the database"
        @change="databaseSelectChange"
        @focus="databaseSelectClick"
      >
        <a-select-option v-for="database in databases" :key="database">
          {{ database }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="Database Driver">
      <a-select
        v-decorator="[
          'databaseDriver',
          {
            rules: [
              {
                required: this.checkout,
                message: 'Please select your database driver!',
              },
            ],
          },
        ]"
        placeholder="Select an option to identify the database driver"
      >
        <a-select-option
          v-for="driver in databaseDrivers"
          :key="driver"
          :value="driver"
        >
          {{ driver }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="name">
      <a-input
        v-decorator="[
          'name',
          {
            rules: [
              { required: this.checkout, message: 'Please input your name!' },
            ],
          },
        ]"
      />
    </a-form-item>
    <a-form-item label="Host">
      <a-input
        v-decorator="[
          'host',
          {
            rules: [
              {
                required: this.checkout,
                pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
                message: 'Please enter the database server IP!',
              },
            ],
          },
        ]"
      />
    </a-form-item>
    <a-form-item label="Port">
      <a-input
        v-decorator="[
          'port',
          {
            rules: [
              { required: this.checkout, message: 'Please input your port!' },
            ],
          },
        ]"
      />
    </a-form-item>
    <a-form-item label="User">
      <a-input
        v-decorator="[
          'user',
          {
            rules: [
              { required: this.checkout, message: 'Please input your user!' },
            ],
          },
        ]"
      >
      </a-input>
    </a-form-item>
    <a-form-item label="Password">
      <a-input-password
        v-decorator="[
          'password',
          {
            rules: [
              {
                required: this.checkout,
                message: 'Please input your password!',
              },
            ],
          },
        ]"
      />
    </a-form-item>
    <a-form-item label="Schemas Database">
      <a-input
        v-decorator="[
          'schemasDatabase',
          {
            rules: [
              { required: false, message: 'Please input your Database!' },
            ],
          },
        ]"
      />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 24, offset: 10 }">
      <a-button type="primary" html-type="submit" :loading="loading">
        Connect
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  data() {
    return {
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" }),
      databases: [],
      databaseDrivers: ["MSSQL", "MYSQL", "ORACLE"],
      loading: false,
      checkout: true,
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      let _this = this;
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$confirm({
            title: "Do you want to connect this database?",
            content:
              "When you click OK, the program will start trying to connect to the database",
            onOk() {
              return new Promise((resolve, reject) => {
                setTimeout(resolve, 5000);
                _this.$http
                  .post("data/init", JSON.stringify(values))
                  .then(function (res) {
                    if (!res) {
                      setTimeout(reject, 0);
                      return;
                    }
                    setTimeout(resolve, 0);
                  });
                //setTimeout(resolve, 0);
              }).catch(() => console.log("Oops errors!"));
            },
            onCancel() {
              return;
            },
          });
        }
      });
    },
    databaseSelectChange(value) {
      let _this = this;
      this.$http.get("data/getPoolByName/" + value).then(function (res) {
        _this.form.setFieldsValue({
          databaseDriver: "MSSQL",
          name: value,
          host: res,
          port: "DO NOT WRITE",
          user: "DO NOT WRITE",
          password: "DO NOT WRITE",
          schemasDatabase: "DO NOT WRITE",

        });
        _this.checkout = false;
      });
    },
    databaseSelectClick() {
      let _this = this;
      this.databases = [];
      this.$http.get("data/allConnect").then(function (res) {
        let data = JSON.parse(res);
        data.forEach((s) => _this.databases.push(s));
      });
    },
  },
};
</script>