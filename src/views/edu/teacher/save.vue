<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import teacherApi from '@/api/teacher/teacher.js'
export default {
    

    data(){
        return{
            teacher:{
                //不加这些属性 也会自动帮我们加进来
                name:'',
                sort:0,
                level:1,
                career:'',
                intro:'',
                avatar:''
            },
            saveBtnDisabled:false
        }
    },
    created(){

        this.init()
      
    },

    watch:{
        $route(to, from) {
            console.log('watch $route')
            this.init()
        }   
    },
    methods:{

        //初始化
        init(){

            //当路径中有id的时候说明是修改  需要回显信息
            if(this.$route.params&&this.$route.params.id){
                const id=this.$route.params.id
                this.getInfo(id)
            }else{
                this.teacher={}
            }
        },

        //根据id获取讲师信息
        getInfo(id){
            teacherApi.getTeacherById(id)
            .then(response=>{

                this.teacher=response.data.teacher
                console.log("teacher"+this.teacher)
            })
        },


        saveOrUpdate(){

            //根据teacher对象中是否有id来判断是否是修改还是添加
            if(!this.teacher.id){
                //添加
                this.saveTeacher()
            }else{
                this.updateTeacher()
            }
           
        },

        //添加讲师
        saveTeacher(){
            teacherApi.addTeacher(this.teacher)
                .then(response=>{
                    //添加成功
                    this.$message({
                        type:"success",
                        message:'添加成功!'
                    });
                    //回到列表页面 路由跳转
                    this.$router.push({path:'/teacher/table'})
                    // this.$router.push({ path: '/edu/teacher' })

                })
        },
        //修改讲师
        updateTeacher(){
            teacherApi.updateTeacherInfo(this.teacher)
                .then(response=>{
                    //修改成功
                    this.$message({
                        type:"success",
                        message:'修改成功!'
                    });
                    //回到列表页面 路由跳转
                    this.$router.push({path:'/teacher/table'})
                    // this.$router.push({ path: '/edu/teacher' })

                })
        }
    }
}
</script>