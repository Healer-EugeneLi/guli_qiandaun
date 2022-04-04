import request from '@/utils/request'

export default{

    //添加课程
    addCourseInfo(courseInfo){
        return request({

            url:'/eduservice/course/addCourse',
            method:'post',
            data:courseInfo
        })
    },

    //获取讲师列表
    getAllTeacher(){
        return request({
            url:'/eduservice/teacher/findAll',
            method:'get'
        })
    },

     //根据课程id获取课程信息
     getCourseInfo(courseId){
        return request({
            url:'/eduservice/course/getCourseInfo/'+courseId,
            method:'get'
        })
    },

    //更新课程信息
    updateCourseInfo(courseInfo){
        return request({

            url:'/eduservice/course/updateCourse',
            method:'post',
            data:courseInfo
        })
    },

    //根据courseId 获取信息
    getPublishInfo(courseId){
        return request({

            url:'/eduservice/course/getPublishCourseInfo/'+courseId,
            method:'get',
        })

    },

    //发布课程 
    publishCourse(courseId){
        return request({

            url:'/eduservice/course/publishCourse/'+courseId,
            method:'post',
        })
    },

    //获取所有课程
    getCourseList(){
        return request({

            url:'/eduservice/course/findAll/',
            method:'get',
        })

    },

     //分页查询课程列表
     getCourseListPage(current,limit,courseQuery){

        return request({
            url:`/eduservice/course/pageCourseCondition/${current}/${limit}`,
            method:'post',
            //courseQuery条件对象，把后端使用RequestBody获取数据
            //data表示把对象转换成json进行传递到接口里面
            data:courseQuery
        })
    },

    //删除课程
    deleteCourse(courseId){
        return request({

            url:'/eduservice/course/'+courseId,
            method:'delete',
        })
    }

}