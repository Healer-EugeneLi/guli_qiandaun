import request from '@/utils/request'

export default{

    //添加小节
    addVideo(video){
        return request({

            url:'/eduservice/video/addVideo',
            method:'post',
            data:video
        })
    },
    //通过id获取小节信息
    getVideoById(videoId){
        return request({

            url:'/eduservice/video/'+videoId,
            method:'get',
        })
    },

    //删除小节
    deleteVideo(videoId){

        return request({
            url:'/eduservice/video/'+videoId,
            method:'delete'
        })
    },

    //更新小节信息
    updateVideo(video){
        return request({

            url:'/eduservice/video/updateVideo',
            method:'post',
            data:video
        })
    }
}