<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="发布课程"/>
    </el-steps>

    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 所属分类 TODO -->
     
      <el-form-item label="课程分类">
         <!-- 一级分类-->
        <el-select
          @change="subjectLevelOneChanged"
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类">
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>
      
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

    <!-- 课程简介 TODO -->
    <!-- 课程简介-->
    <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
    </el-form-item>

    <!-- 课程封面 TODO -->

    <!-- 课程封面-->
    <el-form-item label="课程封面">

      <el-upload
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :action="BASE_API+'/eduoss/fileoss/avatar'"
        class="avatar-uploader">
        <img :src="courseInfo.cover">
      </el-upload>

    </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce'
const defaultForm = {
  title: '',
  subjectId: '',
  teacherId: '',
  lessonNum: 0,
  description: '',
  cover: '/static/boy.jpg',
  price: 0
}
export default {
  components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false ,// 保存按钮是否禁用
      courseInfo:{
        title: '',
        subjectId: '',//二级分类id
        subjectParentId:'',//一级分类id
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: '/static/boy.jpg',
        price: 0
      },
      courseId:'',
      teacherList:[],
      subjectOneList:[],//一级分类
      subjectTwoList:[],//二级分类
      BASE_API: process.env.BASE_API, // 接口API地址
    }
  },

  watch:{
      $route(to, from) {
          console.log('watch $route')
          this.init()
          this.courseInfo=defaultForm
      }   
  },

  created() {

    this.init()

  },

  methods: {

    init(){
        //获取路由id值 课程信息回显
      if(this.$route.params&&this.$route.params.id){
          this.courseId=this.$route.params.id
          course.getCourseInfo(this.courseId).then(response=>{
          this.courseInfo=response.data.courseInfo
          console.log(this.courseInfo)
          subject.getSubjectList().then(response=>{
            
            this.subjectOneList=response.data.item

            for(var i=0;i<this.subjectOneList.length;i++){

              if(this.courseInfo.subjectParentId==this.subjectOneList[i].id){
                //设置二级信息
                this.subjectTwoList=this.subjectOneList[i].children
              }
            }
          })

        })
        //同时需要获取讲师列表 这样才能显示出来
        this.getAllTeacher()
    
      }else{
        // this.courseInfo=defaultForm
        //初始化所有的讲师
        this.getAllTeacher()
        //初始化所有的一级分类
        this.getOneSubject()
        
      }
    },

    //上传封面成功调用的方法
    handleAvatarSuccess(res,file){

      console.log(res)//上传响应
      console.log(URL.createObjectURL(file.raw))// base64编码
      this.courseInfo.cover=res.data.url
    },

    //上传封面之前的方法
    beforeAvatarUpload(file){
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

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
          this.courseInfo.subjectId=''
         
        }
      }
    },

    //获取课程分类
    getOneSubject(){

      subject.getSubjectList()
      .then(response=>{

        this.subjectOneList=response.data.item
      })
    },

    //获取讲师列表
    getAllTeacher(){

      course.getAllTeacher()
      .then(response=>{
        this.teacherList=response.data.items
      })

    },

    //添加课程
    addCourse(){
      course.addCourseInfo(this.courseInfo)
      .then(response=>{
          console.log('saveOrUpdate')
          this.$message({
          type: 'success',
          message: '保存成功!'
          })
          
          this.$router.push({ path: '/course/chapter/'+response.data.courseId })
      })

    },
    //修改课程
    updateCourse(){
      course.updateCourseInfo(this.courseInfo)
      .then(response=>{
          this.$message({
          type: 'success',
          message: '修改成功!'
          })
        this.$router.push({ path: '/course/chapter/'+this.courseId })
      })
    },
    saveOrUpdate() {
      
      console.log("此时的courseInfo",this.courseInfo)
      console.log("courseId",this.courseId)
      if(this.courseId){
        //修改课程信息
        console.log("进入修改课程信息")
        this.updateCourse()
      }else{
        console.log("进入添加课程信息")
         this.addCourse()

      }
    
     
    }
  }
}
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>