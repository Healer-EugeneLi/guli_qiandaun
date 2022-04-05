import request from '@/utils/request'

export default{

    //添加小节
    deleteVideoByVideoId(videoId){
        return request({

            url:'/eduvod/video/deleteVideo/'+videoId,
            method:'delete',
           
        })
    },
    
}