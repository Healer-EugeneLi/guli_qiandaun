import request from '@/utils/request'

export default{

    //根据courseId获取 所有章节和小节的信息
    getAllChapterVideo(courseId){
        return request({

            url:'/eduservice/chapter/getChapter/'+courseId,
            method:'get'
        })
    },
    //添加章节
    addChapter(chapter){
        return request({

            url:'/eduservice/chapter/addChapter',
            method:'post',
            data:chapter
        })
    },

    //根据id查询章节
    getChapterById(chapterId){
        return request({

            url:'/eduservice/chapter/getChapterInfo/'+chapterId,
            method:'get'
        })

    },

    //更新章节信息
    updateChapter(chapter){
        return request({

            url:'/eduservice/chapter/updateChapter',
            method:'post',
            data:chapter
        })
    },

    //删除章节信息
    deleteChapter(chapterId){
        return request({

            url:"/eduservice/chapter/"+chapterId,
            method:'delete'
        })
    }

}