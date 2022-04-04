import request from '@/utils/request'



export default{

    //获取全部讲师
    getAllTeacher(){
        return request({

            url:`/eduservice/teacher/findAll/`,
            method:'get'
        })

    },

    //1.讲师列表
    getTeacherListPage(current,limit,teacherQuery){

        return request({
            url:`/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
            method:'post',
            //teacherQuery条件对象，把后端使用RequestBody获取数据
            //data表示把对象转换成json进行传递到接口里面
            data:teacherQuery
        })
    },

    //2.删除讲师
    removeTeacherById(id){
        
        return request({

            url:`/eduservice/teacher/${id}`,
            method:'delete'
        })
    },

    //3.添加讲师
    addTeacher(teacher){

        return request({
            url:`/eduservice/teacher/addTeacher`,
            method:'post',
            data:teacher
        })
    },

    //4.通过id获取讲师
    getTeacherById(id){

        return request({
            url:`/eduservice/teacher/getTeacher/${id}`,
            method:'get',
        
        })
    },

    //5.修改讲师
    updateTeacherInfo(teacher){

        return request({
            url:`/eduservice/teacher/updateTeacher`,
            method:'post',
            data:teacher
        })
    },
}

