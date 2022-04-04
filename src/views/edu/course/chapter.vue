<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="发布课程"/>
    </el-steps>
    <el-button type="text" @click="openCharpterDialog">添加章节</el-button>

    <!-- 章节 -->
    <ul class="chanpterList">
        <li
            v-for="chapter in chapterVideoList"
            :key="chapter.id">
            <p>
                {{ chapter.title }}

                <span class="acts">
                    <el-button type="text"  @click="openVideoDialog(chapter.id)">添加小节</el-button>
                    <el-button style="" type="text"  @click="editChapter(chapter.id)">编辑</el-button>
                    <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
                </span>
            </p>

            <!-- 视频 -->
            <ul class="chanpterList videoList">
                <li
                    v-for="video in chapter.children"
                    :key="video.id">
                    <p>{{ video.title }}
                        <span class="acts">
                            <el-button type="text" @click="editVideo(video.id)">编辑</el-button>
                            <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
                        </span>
                    </p>
                </li>
            </ul>
        </li>
    </ul>

 
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
        <el-form :model="chapter" label-width="120px">
            <el-form-item label="章节标题">
                <el-input v-model="chapter.title"/>
            </el-form-item>
            <el-form-item label="章节排序">
                <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
  <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <!-- TODO -->
        </el-form-item>
    </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
    <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
  </div>
</el-dialog>


  </div>

  
</template>

<script>
import course from '@/api/edu/course'
import chapter from '@/api/edu/chapter'
import video from '@/api/edu/video'

export default {
  data() {
    return {
      saveBtnDisabled: false ,// 保存按钮是否禁用
      courseId:'',//上一步添加完课程信息之后 放在路径上的课程id
      chapterVideoList:[],
      dialogChapterFormVisible: false, //是否显示章节表单
      chapter: {// 章节对象 不显示写出来也行 实际应该是多一个id
        title: '',
        sort: 0
      },
      //==========小节相关
      dialogVideoFormVisible:false,
      saveVideoBtnDisabled: false, // 课时按钮是否禁用
      dialogVideoFormVisible: false, // 是否显示课时表单
      chapterId: '', // 课时所在的章节id
      video: {// 课时对象
        title: '',
        sort: 0,
        free: 0,
        videoSourceId: ''
      },

    }
  },

  created() {

   
    //获取路由的id值
    if(this.$route.params&&this.$route.params.id){

      this.courseId=this.$route.params.id
      this.getAllChapterVideo()
    }

    console.log('chapter created')
  },

  methods: {

//=========================================小节操作========================================

    //删除小节
    removeVideo(videoId){
      //先进行弹框提示
      this.$confirm("此操作将永久删除该小节，是否继续？","提示",{

        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{

        video.deleteVideo(videoId)
        .then(response=>{
          this.chapter={}
          //提示信息
          this.$message({
            type: 'success',
            message: '删除小节成功!'
          });
          //刷新页面
          this.getAllChapterVideo()
        })

      })

       
    },
    

    //修改小节信息
    editVideo(videoId){
      this.dialogVideoFormVisible=true
      video.getVideoById(videoId).
      then(response=>{
      
        this.video=response.data.video
      })

    },

    //点击编辑小节按钮
    openVideoDialog(chapterId){
      this.dialogVideoFormVisible=true
      //清空表单数据
      this.video={}
      this.chapterId=chapterId

    },

    //保存或者添加
    saveOrUpdateVideo(){
      if(this.video.id){
        this.updateVideo()
      }else{
        this.saveVideo()
      }
    },
    //添加小节信息
    saveVideo(){
      
      //插入课程id 
      this.video.courseId=this.courseId
      //插入章节id
      this.video.chapterId=this.chapterId
      video.addVideo(this.video).
      then(response=>{

          this.$message({
          type: 'success',
          message: '保存成功!'
          })

          this.refreshVideo()
          
      })
    },

    //更新小节信息
    updateVideo(){
      video.updateVideo(this.video).then(response=>{
          this.$message({
          type: 'success',
          message: '更新小节信息成功!'
          })

          this.refreshVideo()
      })
    },

    //小节保存或者修改之后更新
    refreshVideo(){
      this.dialogVideoFormVisible=false//关闭对话框
      this.getAllChapterVideo()//刷新页面
      this.video={}//充值添加小节的对话框
      this.saveVideoBtnDisabled=false
    },

//==========================================章节操作==========================================
    //删除章节信息
    removeChapter(chapterId){
      //先进行弹框提示
      this.$confirm("此操作将永久删除该章节，是否继续？","提示",{

        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{

        chapter.deleteChapter(chapterId)
        .then(response=>{
          this.chapter={}
          //提示信息
          this.$message({
            type: 'success',
            message: '删除章节成功!'
          });
          //刷新页面
          this.getAllChapterVideo()
        })

      })

    },

    //修改章节弹框数据回显
    editChapter(chapterId){
      this.dialogChapterFormVisible=true
      chapter.getChapterById(chapterId).
      then(response=>{
      
        this.chapter=response.data.chapter
      })
    },

     //添加章节方法
    openCharpterDialog(){

      this.dialogChapterFormVisible=true
      //清空表单数据
      this.chapter.title=''
      this.chapter.sort=''
    },
    //修改或更新章节信息
    saveOrUpdate(){
      
 
      if(this.chapter.id){
        //更新
        this.updateChapter()
      }else{
        //添加
         this.addChapter()
      }
     
    },
    //添加章节
    addChapter(){

      //设置课程id进入chapter对象
      this.chapter.courseId=this.courseId
      chapter.addChapter(this.chapter)
      .then(response=>{
  
        //关闭弹窗
        this.dialogChapterFormVisible=false;
        //提示信息
        this.$message({
          type: 'success',
          message: '添加成功!'
        });
        //刷新页面
        this.getAllChapterVideo()
        
      })
    },
    //修改章节
    updateChapter(){

       //设置课程id进入chapter对象
      this.chapter.courseId=this.courseId
      chapter.updateChapter(this.chapter)
      .then(response=>{
  
        //关闭弹窗
        this.dialogChapterFormVisible=false;
        //提示信息
        this.$message({
          type: 'success',
          message: '修改章节信息成功!'
        });
        //刷新页面
        this.getAllChapterVideo()
        
      })

    },
    //根据courseId查询章节和小节信息
    getAllChapterVideo(){

      chapter.getAllChapterVideo(this.courseId).then(response=>{
        
        this.chapterVideoList=response.data.allChapterVideo

      })
    },

    previous() {
      console.log('previous')
      this.$router.push({ path: '/course/info/'+this.courseId })
    },

    next() {
      console.log('next')
      this.$router.push({ path: '/course/publish/'+this.courseId })
    }
  }
}
</script>

<style scoped>
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
    float: right;
    font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>