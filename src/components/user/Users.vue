<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card class="box-card">
            <!-- 搜索与添加区域 -->

            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary">添加用户</el-button>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>
<script>
export default {
    data () {
        return {
            // 获取用户列表的查询参数
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 2
            },
            userList: [],
            total: 0
        }
    },
    created () {
        this.getUserList()
    },
    methods: {
        async getUserList () {
           const { data: res } = await this.$http.get('users', { params: this.queryInfo })
           if (res.meta.status !== 200) this.$message.error(res.meta.msg)
           this.userList = res.data.users
           this.total = res.data.total
           console.log(this.userList)
        }
    }
}
</script>
<style lang="less" scoped>

</style>
