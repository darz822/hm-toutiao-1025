<template>
  <el-container class="home-container">
    <el-aside :width="isOpen? '200px':'64px'">
      <!-- logo -->
      <div class="logo" :class="{smalllogo:!isOpen}"></div>
      <!-- 导航 -->
      <el-menu
        :default-active="$router.path"
        background-color="#002033"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="border-right:none"
        :collapse="!isOpen"
        :collapse-transition="false"
        router
      >
        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="/article">
          <i class="el-icon-s-management"></i>
          <span slot="title">内容管理</span>
        </el-menu-item>
        <el-menu-item index="/image">
          <i class="el-icon-folder-opened"></i>
          <span slot="title">素材管理</span>
        </el-menu-item>
        <el-menu-item index="/publish">
          <i class="el-icon-edit"></i>
          <span slot="title">发布文章</span>
        </el-menu-item>
        <el-menu-item index="/comment">
          <i class="el-icon-edit-outline"></i>
          <span slot="title">评论管理</span>
        </el-menu-item>
        <el-menu-item index="/fans">
          <i class="el-icon-magic-stick"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="/setting">
          <i class="el-icon-s-tools"></i>
          <span slot="title">设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <!-- 图标 -->
        <span class="el-icon-s-fold" @click="toggleMenu"></span>
        <!-- 文字 -->
        <span class="text-title">澳门维多利亚赌场上线了</span>
        <!-- 下拉菜单 -->
        <el-dropdown class="dropdown-right" @command="handleClick">
          <span class="el-dropdown-link">
            <img class="heard-picture" :src="photo" alt />
            <span class="head-portait">{{name}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-cherry" command="setting">个人设置</el-dropdown-item>
            <el-dropdown-item icon="el-icon-unlock" command="logoout">退出登陆</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import local from '@/utils/local'
export default {
  data () {
    return {
      // 展开
      isOpen: true,
      // 头像
      photo: '',
      // 名称
      name: ''
    }
  },
  created () {
    const user = local.getUser() || {}
    this.photo = user.photo
    this.name = user.name
  },
  methods: {
    toggleMenu () {
      // 切换侧边栏 展开收起
      this.isOpen = !this.isOpen
    },
    // 绑定的click事件无效
    // 给的element-ui提供的组件绑定的click事件，如果组件不支持click事件，无法触发。
    // 组件不支持，给组件解析后的DOM绑定事件
    // vue提供了事件修饰符功能，prevent once stop ---native 把事件绑定在原生DOM上
    setting () {
      this.$router.push('/setting')
    },
    logoout () {
      local.delUser()
      this.$router.push('/logoout')
    },
    handleClick (command) {
      this[command]()
    }
  }
}
</script>

<style scoped lang='less'>
.home-container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  .el-aside {
    background: #002033;
    .logo {
      background: #002244 url("../../assets/logo_admin.png") no-repeat center/
        140px auto;
      width: 100%;
      height: 70px;
    }
    //覆盖
    .smalllogo {
      background-image: url("../../assets/logo_admin_01.png");
      background-size: 40px auto;
    }
  }
  .el-header {
    border-bottom: 1px solid #cccccc;
    line-height: 60px;
    .el-icon-s-fold {
      font-size: 30px;
      vertical-align: middle;
      margin-left: 10px;
    }
    .text-title {
      //   margin-right: 80px;
      vertical-align: middle;
    }
    .dropdown-right {
      float: right;
      .heard-picture {
        width: 30px;
        height: 30px;
        vertical-align: middle;
        border-radius: 50%;
      }
      .head-portait {
        margin-left: 10px;
        font-weight: bold;
        vertical-align: middle;
      }
    }
  }
}
</style>
