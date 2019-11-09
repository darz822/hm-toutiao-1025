<template>
  <div class="container">
    <el-card>
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <!-- 按钮区域 -->
      <div class="btn_box">
        <!-- 全部与收藏 -->
        <!-- label指定选中当前单选数据的值 -->
        <el-radio-group @change="toggleList" v-model="reqParams.collect" size="small">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <!-- 添加按钮 -->
        <el-button @click="dialogVisible=true" type="success" size="small" style="float:right">添加素材</el-button>
      </div>
      <!-- 素材管理 -->
      <div class="img_list">
        <div class="img_item" v-for="item in images" :key="item.id">
          <img :src="item.url" alt />
          <div class="footer" v-show="!reqParams.collect">
            <span
              @click="togglStar(item)"
              class="el-icon-star-off"
              :class="{red:item.is_collected}"
            ></span>
            <span @click="deleteImage(item.id)" class="el-icon-delete"></span>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="pager"
      ></el-pagination>
    </el-card>
    <!-- 对话框 -->
    <!-- 上传组件请求头 -->
    <!-- name提交文件字段名称需要和后台保持一致 -->
    <el-dialog title="添加素材" :visible.sync="dialogVisible" width="300px">
      <el-upload
        class="avatar-uploader"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="headers"
        name="image"
        :on-success="handleSuccess"
        :show-file-list="false"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import local from '@/utils/local'
export default {
  data () {
    return {
      // 提交筛选参数
      reqParams: {
        collect: false,
        page: 1,
        per_page: 10
      },
      // 图片列表
      images: [],
      // 总条数
      total: 0,
      // 对话框显示隐藏
      dialogVisible: false,
      // 上传成功后的图片地址
      imageUrl: null,
      // 请求头
      headers: {
        Authorization: `Bearer ${local.getUser().token}`
      }
    }
  },
  created () {
    this.getImages()
  },
  methods: {
    // 上传图片成功
    handleSuccess (res) {
      // res就是响应主体 res.data.url就是图片地址
      this.imageUrl = res.data.url
      this.$message.success('上传成功')
      window.setTimeout(() => {
        // 关闭
        this.diaologVisible = false
        // 更新列表
        this.getImages()
      }, 2000)
    },
    //  上传图片
    // 获取素材列表
    async getImages () {
      // 获取数据
      const { data: { data } } = await this.$http.get('/user/images', { params: this.reqParams })
      // 赋值给images
      this.images = data.results
      // 总条数赋值
      this.total = data.total_count
    },
    pager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    // 切换列表
    toggleList () {
      this.reqParams.page = 1
      this.getImages()
    },
    // 切换添加收藏取消收藏
    async togglStar (item) {
      const { data: { data } } = await this.$http.put(`user/images/${item.id}`, {
        collect: !item.is_collected
      })
      // 成功（改当前图片状态，提示）
      item.is_collected = data.collect
      this.$message.success(data.collect ? '添加收藏成功' : '取消收藏成功')
    },
    deleteImage (id) {
      // 显示确认框
      this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 点击了确认
        // 1.发请求
        await this.$http.delete(`user/images/${id}`)
        // 2.提示
        this.$message.success('删除成功')
        // 3.更新列表
        this.getImages()
      }).catch(() => {
        // 点击取消
      })
    }
  }
}
</script>

<style scoped lang='less'>
.img_list {
  margin-top: 20px;
  .img_item {
    width: 180px;
    height: 180px;
    border: 1px dashed #dddddd;
    position: relative;
    display: inline-block;
    margin-right: 50px;
    margin-bottom: 20px;
    img {
      width: 100%;
      height: 100%;
    }
    .footer {
      width: 100%;
      height: 30px;
      line-height: 30px;
      background: rgba(0, 0, 0, 0.3);
      color: #ffffff;
      position: absolute;
      left: 0;
      bottom: 0;
      text-align: center;
      // span .red{}选择器无效
      // span.red{}选择器有效 &连接符
      span {
        margin: 0 20px;
        &.red {
          color: red;
        }
      }
    }
  }
}
</style>
