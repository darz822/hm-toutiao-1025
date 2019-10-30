<template>
  <div class="container">
    <!-- 卡片容器 -->
    <el-card>
      <img src="../../assets/logo_index.png" alt />
      <!-- 表单 -->
      <el-form ref="loginFrom" :model="LoginFrom" status-icon :rules="loginRules">
        <el-form-item prop="mobile">
          <el-input v-model="LoginFrom.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="LoginFrom.code"
            placeholder="请输入验证码"
            style="width:240px;margin-right:5px"
          ></el-input>
          <el-button>发送验证码</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox :value="true">我已阅读用户协议及隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login" style="width:100%;">登陆</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>

export default {
  data () {
    // 校验手机号函数
    const checkMobile = (rule, value, callback) => {
      // 去判断value是否符合手机号格式
      // 格式：1开头2位3-9之间9位数字结尾
      if (/^1[3-9]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error('手机号格式不对'))
      }
    }

    return {
      LoginFrom: {
        modbile: '',
        code: ''
      },
      loginRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '请输入6位验证码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      // 对整个表单进行校验
      this.$refs['loginFrom'].validate(valid => {
        if (valid) {
          // 校验成功进行登陆(发请求)
          // post(url,参数对象)
          // get(url{params:参数对象})
          this.$http.post('authorizations', this.LoginFrom).then(res => {
            // 成功
            this.$router.push('/')
          }).catch(() => {
            // 失败提示
            this.$message.error('手机号或验证码错误')
          })
        }
      })
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  width: 100%;
  height: 100%;
  background: url("../../assets/login_bg.jpg") no-repeat center / cover;
  position: absolute;
  left: 0;
  top: 0;

  .el-card {
    width: 400px;
    height: 300px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 150px;
      display: block;
      margin: 0 auto;
      margin-bottom: 10px;
    }
  }
}
</style>
