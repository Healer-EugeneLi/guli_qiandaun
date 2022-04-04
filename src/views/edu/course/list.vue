
<template>
    <div class="app-container">
        课程列表
        <!--查询表单-->
        <el-form :inline="true" class="demo-form-inline">

        <!-- 所属分类：级联下拉列表 -->
        <!-- 一级分类 -->
        <el-form-item label="课程类别">
            <el-select
            v-model="searchObj.subjectParentId"
            placeholder="请选择"
            @change="subjectLevelOneChanged">
            <el-option
                v-for="subject in subjectOneList"
                :key="subject.id"
                :label="subject.title"
                :value="subject.id"/>
            </el-select>

            <!-- 二级分类 -->
            <el-select v-model="searchObj.subjectId" placeholder="请选择">
            <el-option
                v-for="subject in subjectTwoList"
                :key="subject.id"
                :label="subject.title"
                :value="subject.id"/>
            </el-select>
        </el-form-item>

        <!-- 标题 -->
        <el-form-item>
            <el-input v-model="searchObj.title" placeholder="课程标题"/>
        </el-form-item>
        <!-- 讲师 -->
        <el-form-item>
            <el-select
            v-model="searchObj.teacherId"
            placeholder="请选择讲师">
            <el-option
                v-for="teacher in teacherList"
                :key="teacher.id"
                :label="teacher.name"
                :value="teacher.id"/>
            </el-select>
        </el-form-item>

        <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="数据加载中"
        border
        fit
        highlight-current-row
        row-class-name="myClassList">

        <el-table-column
            label="序号"
            width="70"
            align="center">
            <template slot-scope="scope">
            {{ (page - 1) * limit + scope.$index + 1 }}
            </template>
        </el-table-column>

        <el-table-column label="课程信息" width="470" align="center">
            <template slot-scope="scope">
            <div class="info">
                <div class="pic">
                <img :src="scope.row.cover" alt="scope.row.title" width="150px">
                </div>
                <div class="title">
                <a href="">{{ scope.row.title }}</a>
                <p>{{ scope.row.lessonNum }}课时</p>
                </div>
            </div>

            </template>
        </el-table-column>

        <el-table-column label="创建时间" align="center">
            <template slot-scope="scope">
            {{ scope.row.gmtCreate.substr(0, 10) }}
            </template>
        </el-table-column>
        <el-table-column label="发布时间" align="center">
            <template slot-scope="scope">
            {{ scope.row.gmtModified.substr(0, 10) }}
            </template>
        </el-table-column>
        <el-table-column label="价格" width="100" align="center" >
            <template slot-scope="scope">
            {{ Number(scope.row.price) === 0 ? '免费' :
            '¥' + scope.row.price.toFixed(2) }}
            </template>
        </el-table-column>
        <el-table-column prop="buyCount" label="付费学员" width="100" align="center" >
            <template slot-scope="scope">
            {{ scope.row.buyCount }}人
            </template>
        </el-table-column>

        <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
            <router-link :to="'/course/info/'+scope.row.id">
                <el-button type="text" size="mini" icon="el-icon-edit">编辑课程信息</el-button>
            </router-link>
            <router-link :to="'/course/chapter/'+scope.row.id">
                <el-button type="text" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
            </router-link>
            <el-button type="text" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
    :current-page="page"
    :page-size="limit"
    :total="total"
    style="padding: 30px 0; text-align: center;"
    layout="total, prev, pager, next, jumper"
    @current-change="fetchData"
    />

    </div>
</template>


<script>

import course from '@/api/edu/course'
import teacher from '@/api/edu/teacher'
import subject from '@/api/edu/subject'
export default{

    data(){
        return {
            listLoading: true, // 是否显示loading信息
            list: null, // 数据列表
            total: 0, // 总记录数
            page: 1, // 页码
            limit: 10, // 每页记录数
            searchObj: {
                subjectParentId: '',
                subjectId: '',
                title: '',
                teacherId: ''
            }, // 查询条件
            teacherList: [], // 讲师列表
            subjectOneList:[],//一级分类
            subjectTwoList:[],//二级分类
        }
    },


    created(){
        
        this.fetchData()

        //初始化分类列表
        this.initSubjectList()
        //初始化讲师列表
        this.initTeacherList()

    },

    methods:{

        //获取分页课程数据
        fetchData(page=1){
            this.page=page
            this.listLoading = true
            course.getCourseListPage(this.page,this.limit,this.searchObj)
            .then(response=>{
                //请求成功 response接口返回数据
                console.log(response)
                this.list=response.data.rows
                this.total=response.data.total
                this.listLoading = false
                

            })
            .catch(error=>{
                //请求失败
                console.log(error)

            })
        },

        //初始化教师列表
        initTeacherList(){
            teacher.getAllTeacher().then(response=>{

                this.teacherList=response.data.items
            })
        },
        //初始化课程分类
        initSubjectList(){
            subject.getSubjectList().then(response=>{

                this.subjectOneList=response.data.item
            })
        },

        //一二级分类联动
        //一级分类与二级分类的联动
        subjectLevelOneChanged(value){
        
        // console.log("value",value)
        // console.log(this.subjectOneList)

        //values是一级分类的id
            for(let i=0;i<this.subjectOneList.length;i++){
                
                //得到当前选中的一级分类的id 遍历所有一级分类的数据
                if(value===this.subjectOneList[i].id){
                //找到对应的二级分类数据
                this.subjectTwoList=this.subjectOneList[i].children
                //此时更新完之后把二级分类清空一下
                this.searchObj.subjectId=''
                
                }
            }
        },
        //重置数据
        resetData(){
            this.searchObj={}
            this.subjectTwoList=[]
            this.fetchData()
        },
        //删除课程
        removeDataById(courseId){

            this.$confirm('此操作将永久该课程, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                //点击确定 调用删除的方法
                course.deleteCourse(courseId).
                    then(response=>{
                        //删除成功
                        this.$message({
                        type: 'success',
                        message: '删除成功!'
                        });
                //回到列表页面
                this.fetchData()
                })
            })
        }
    }



}
</script>

<style scoped>
.myClassList .info {
    width: 450px;
    overflow: hidden;
}
.myClassList .info .pic {
    width: 150px;
    height: 90px;
    overflow: hidden;
    float: left;
}
.myClassList .info .pic a {
    display: block;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}
.myClassList .info .pic img {
    display: block;
    width: 100%;
}
.myClassList td .info .title {
    width: 280px;
    float: right;
    height: 90px;
}
.myClassList td .info .title a {
    display: block;
    height: 48px;
    line-height: 24px;
    overflow: hidden;
    color: #00baf2;
    margin-bottom: 12px;
}
.myClassList td .info .title p {
    line-height: 20px;
    margin-top: 5px;
    color: #818181;
}
</style>