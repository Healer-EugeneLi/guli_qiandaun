import request from '@/utils/request'

export default{

    //获取课程分类列表 树形
    getSubjectList(){
        return request({

            url:'/eduservice/subject/getAllSubject',
            method:'get'
        })
    }
}