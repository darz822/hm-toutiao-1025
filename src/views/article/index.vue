<template>
  <div class="container-article">
    <!-- 筛选条件布局 -->
    <el-card>
      <div slot="header">
        <!-- 使用面包屑组件 -->
        <my-bread>内容管理</my-bread>
      </div>
      <el-form lable-width="80px" size="small">
        <el-form-item label="状态：">
          <el-radio-group v-model="reqParams.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 频道组件 -->
        <!-- v-model 第一  value 第二  @input -->
        <el-form-item label="频道：">
          <my-channel v-model="reqParams.channel_id"></my-channel>
        </el-form-item>
        <el-form-item label="日期：">
          <!-- v-model绑定的值是【起始日期，结束日期】 -->
          <el-date-picker
            v-model="dateArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top:80px">
      <div slot="header">
        <span>根据筛选条件共查询到 {{total}} 条结果：</span>
      </div>
      <!-- 表格 -->
      <el-table :data="articles">
        <el-table-column label="封面">
          <template slot-scope="scope">
            <el-image :src="scope.row.cover.images[0]" style="width:150px;height:100px">
              <div slot="error">
                <img src="../../assets/error.gif" alt width="150" height="100" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.status===0">草稿</el-tag>
            <el-tag v-if="scope.row.status===1">待审核</el-tag>
            <el-tag type="success" v-if="scope.row.status===2">审核</el-tag>
            <el-tag type="warning" v-if="scope.row.status===3">审核失败</el-tag>
            <el-tag type="danger" v-if="scope.row.status===4">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="pubdate"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button
              @click="toEdit(scope.row.id)"
              type="primary"
              icon="el-icon-edit"
              circle
              plain
            ></el-button>
            <el-button
              @click="delArticle(scope.row.id)"
              type="danger"
              icon="el-icon-delete"
              circle
              plain
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <!-- layout="prev, pager, next"当前分页组包含得布局 -->
      <!-- total 总条数 -->
      <!-- page-size 默认每一页10条 -->
      <!-- current-page指定当前激活得按钮 -->
      <!-- @current-change 作用当页码发生改变触发 默认传入当前新的页码-->
      <el-pagination
        style="margin-top:50px"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="pager"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 提交给后台的参数对象
      // 有axios进行数据提交字段的值为null，axios不会提交该字段
      reqParams: {
        status: null,
        channel_id: 2,
        begin_pubdate: null,
        end_pubdate: null,
        // 当前页
        page: 1,
        // 每页有多少条
        per_page: 20

      },
      // 频道选项
      channelOptions: [],
      // 日期范围
      dateArr: [],
      // 文章列表数据
      articles: [],
      // 总条数
      total: 0
    }
  },
  created () {
    // this.getChannelOptions()
    this.getArticles()
  },
  methods: {
    // async getChannelOptions () {
    //   // 获取数据
    //   const { data: { data } } = await this.$http.get('channels')
    //   // 赋值 channelOptions
    //   this.channelOptions = data.channels
    // },
    // 获取文章列表数据
    async getArticles () {
      // 获取数据
      const { data: { data } } = await this.$http.get('articles', { params: this.reqParams })
      // 赋值 articles
      this.articles = data.results
      // 总条数赋值
      this.total = data.total_count
    },
    pager (newPage) {
      // 修改当前页码为新的页码
      this.reqParams.page = newPage
      // 重新获取数据
      this.getArticles()
    },
    // 筛选
    search () {
      // 获取筛选数据
      // 把页码转换成1
      // 处理频道空字符串得问题
      if (this.reqParams.channel_id === '') this.reqParams.channel_id = null
      this.reqParams.page = 1
      this.getArticles()
    },
    changeDate (dateArr) {
      // dateArr是数组[date，date]起始时间 结束时间
      // 我们需要： dateArr 是数组 [string,string] string ==='2019-10-01'
      // 注意：清空日期之后，dateArr是null 对应得begin end值也该为null
      if (dateArr) {
        this.reqParams.begin_pubdate = dateArr[0]
        this.reqParams.end_pubdate = dateArr[0]
      } else {
        this.reqParams.begin_pubdate = null
        this.reqParams.end_pubdate = null
      }
    },
    // 去编辑
    toEdit (id) {
      // 第一种传参方式 query传参方式
      // this.$router.push(`/publish?id=${id}`)
      // 第二种 query传参方式
      this.$router.push({ path: `/publish`, query: { id } })
    },
    async delArticle (id) {
      // 发请求 restful接口规则（get post put patch delete）
      await this.$http.delete(`articles/${id}`)
      // 提示
      this.$message.success('删除成功')
      // 更新列表
      this.getArticles()
    }
  }
}
</script>

<style scoped lang='less'>
</style>
