<template>
  <a-layout>
    <a-space size="large" direction="vertical">
      <a-layout-header theme="light"></a-layout-header>
      <a-layout-content>
        <a-row>
          <a-col :span="8"></a-col>
          <a-col :span="8">
            <a-spin
              :spinning="spinConfig.spinning"
              :delay="spinConfig.delayTime"
            >
              <a-form
                id="components-form-demo-normal-login"
                :form="form"
                class="login-form"
                @submit="login"
              >
                <a-form-item>
                  <a-input
                    v-decorator="[
                      'userName',
                      {
                        rules: [
                          {
                            required: true,
                            message: 'Please input your username!',
                          },
                        ],
                      },
                    ]"
                    placeholder="Username"
                  >
                    <a-icon
                      slot="prefix"
                      type="user"
                      style="color: rgba(0, 0, 0, 0.25)"
                    />
                  </a-input>
                </a-form-item>
                <a-form-item>
                  <a-input
                    v-decorator="[
                      'password',
                      {
                        rules: [
                          {
                            required: true,
                            message: 'Please input your Password!',
                          },
                        ],
                      },
                    ]"
                    type="password"
                    placeholder="Password"
                  >
                    <a-icon
                      slot="prefix"
                      type="lock"
                      style="color: rgba(0, 0, 0, 0.25)"
                    />
                  </a-input>
                </a-form-item>
                <a-form-item>
                  <a-checkbox
                    v-decorator="[
                      'remember',
                      {
                        valuePropName: 'checked',
                        initialValue: true,
                      },
                    ]"
                    >Remember me</a-checkbox
                  >
                  <a class="login-form-forgot" @click="forget"
                    >Forgot password</a
                  >
                  <a-button
                    type="primary"
                    html-type="submit"
                    class="login-form-button"
                    >Log in</a-button
                  >Or
                  <a @click="register">register now!</a>
                </a-form-item>
              </a-form>
            </a-spin>
          </a-col>
          <a-col :span="8"></a-col>
        </a-row>
      </a-layout-content>
      <a-layout-footer></a-layout-footer>
    </a-space>
  </a-layout>
</template>

<script>
export default {
  name: "Login",
  components: {},
  data() {
    return {
      formData: {
        user: "",
        password: "",
      },
      spinConfig: {
        spinning: false,
        delayTime: 500,
      },
    };
  },
  beforeCreate: function () {
    this.form = this.$form.createForm(this, { name: "normal_login" });
  },
  methods: {
    login(e) {
      let _this = this;
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (err) {
          _this.$message.error("校验失败");
        } else {
          let user = values.userName;
          let password = values.password;
          let remeber = values.remeber;
          this.spinConfig.spinning = true;
          this.$http
            .post("auth/login", {
              username: user,
              password: password,
              remeber: remeber,
            })
            .then(function (res) {
              _this.spinConfig.spinning = false;
              if (res) {
                sessionStorage.setItem("Authorization", res);
                _this.$router.push("/Index");
              }
            });
        }
      });
    },
    forget() {
      this.$message.error("功能未实现");
      return;
    },
    register() {
      this.$message.error("功能未实现");
      return;
    },
  },
};
</script>
<style>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>