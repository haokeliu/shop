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
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" @clear="getUserList" clearable>
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表区域 -->
            <el-table :data="userList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态" prop="mg_state" >
                    <template slot-scope="scope">
                        <el-switch
                         v-model="scope.row.mg_state" @change="userStatusChanged(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                    <!-- <template> -->
                        <!-- 修改按钮 -->
                        <el-button type="primary" @click="showEditDialog(scope.row.id)" icon="el-icon-edit" circle></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" @click="removeUserById(scope.row.id)" circle></el-button>
                        <!-- 分配角色按钮 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable=false>
                            <el-button type="primary" icon="el-icon-setting" circle></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加用户对话框 -->
        <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        @close="addDialogClosed"
        width="50%">
            <!-- 内容主体区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改用户对话框 -->
        <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名" >
                <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="email">
                <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="mobile">
                <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data () {
        // 验证邮箱的规则
        var checkEmail = (rule, value, cb) => {
            // 验证邮箱的正则表达式
            const regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
            if (regEmail.test(value)) {
                return cb()
            }
            cb(new Error('请输入合法的邮箱'))
        }
        // 验证手机的规则
        var checkMobile = (rule, value, cb) => {
            // 验证手机号的正则表达式
            const regMobile = /^1[0-9]{10}$/
            if (regMobile.test(value)) {
                return cb()
            }
            cb(new Error('请输入正确的手机号'))
        }
        return {
            // 获取用户列表的查询参数
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            userList: [],
            total: 0,
            // 控制添加用户对话框的显示与隐藏
            addDialogVisible: false,
            // 添加用户的表单数据
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            // 添加用户的验证规则的对象
            addFormRules: {
                username: [
                    { required: true, message: '请输入用户邮箱', trigger: 'blur' }, { min: 3, max: 10, message: '用户名的长度在3~10字符之间', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入用户密码', trigger: 'blur' }, { min: 6, max: 15, message: '用户密码的长度在6~15字符之间', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' }, { validator: checkMobile, trigger: 'blur' }
                ]
            },
            // 控制修改用户对话框的显示与隐藏
            editDialogVisible: false,
            // 查询到的用户信息对象
            editForm: {},
            // 修改表单的验证规则对象
            editFormRules: {
                email: [
                    { required: true, message: '请输入用户邮箱', trogger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入用户手机', trogger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ]
            }
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
        },
        // 监听pageSize改变的事件
        handleSizeChange (newSize) {
            this.queryInfo.pagesize = newSize
            this.getUserList()
        },
        // 监听当前页码改变的事件
        handleCurrentChange (newPage) {
            this.queryInfo.pagenum = newPage
            this.getUserList()
        },
        // 监听switch状态的开关
        async userStatusChanged (userInfo) {
            const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
            if (res.meta.status !== 200) {
                userInfo.mg_state = !userInfo.mg_state
                return this.$message.error('更新用户失败')
            }
            this.$message.success('更新用户状态成功')
        },
        // 监听用户关闭对话框事件
        addDialogClosed () {
            this.$refs.addFormRef.resetFields()
        },
        // 点击按钮添加新用户
        addUser () {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return
                // 可以发起添加用户请求
                const { data: res } = await this.$http.post('users', this.addForm)
                if (res.meta.status !== 201) {
                    this.$message.error('添加用户失败')
                }
                this.$message.success('添加用户成功')
                // 隐藏添加用户的对话框
                this.addDialogVisible = false
                // 重新获取用户列表数据
                this.getUserList()
            })
        },
        // 展示用户编辑的对话框
        async showEditDialog (id) {
            // console.log(id)
            const { data: res } = await this.$http.get('users/' + id)
            if (res.meta.status !== 200) {
                return this.$message.error('查询用户信息失败！')
            }
            this.editForm = res.data
            this.editDialogVisible = true
        },
        // 监听修改用户对话框的关闭事件
        editDialogClosed () {
            this.$refs.editFormRef.resetFields()
        },
        // 修改用户信息并提交
        editUserInfo () {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return
                // 发起修改用户信息的数据请求
                const { data: res } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
                if (res.meta.status !== 200) {
                    return this.$message.error('更新用户信息失败！')
                }
                // 关闭对话框
                this.editDialogVisible = false
                // 刷新数据列表
                this.getUserList()
                // 提示修改成功
                this.$message.success('更新用户信息成功')
            })
        },
        // 根据id删除对应用户信息
        async removeUserById (id) {
            console.log(id)
            // 弹框询问用户是否删除用户
            const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            // 如果用户确认删除则 返回值为字符串:confirm
            // 如果用户取消删除则 返回值为字符串:cancel
            // console.log(confirmResult)
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            const { data: res } = await this.$http.delete('users/' + id)
            if (res.meta.status !== 200) {
                return this.$message.error('删除用户失败！')
            }
            this.$message.success('删除用户成功！')
            this.getUserList()
        }
    }
}
</script>
<style lang="less" scoped>

</style>
