export const draw = (canvas) => {
    if (canvas) {
        //获取canvas上下文
        let ctx = canvas.getContext('2d');
 
        //创建video标签，并且设置相关属性
        let video = document.createElement('video');
 
       // video.preload = true;
        video.autoplay = false;
        video.controls="controls"
        video.src="http://jsmov2.a.yximgs.com/upic/2019/03/24/23/BMjAxOTAzMjQyMzIwMTJfMTI4NTg1NDU3OV8xMTY1OTI5NTUwMF8xXzM=_b_Bec3c02ba14c1ec2c25d7cf6c3d5ce6ae.mp4?tag=1-1555123613-nil-0-amgxyjnuth-182954b966b1ffa1&type=hot"
     
        //document.body.appendChild(video);
 
        //监听video的play事件，一旦开始，就把video逐帧绘制到canvas上
        video.addEventListener('play',() => {
            let play = () => {
                ctx.drawImage(video,0,0);
                requestAnimationFrame(play);
            };
 
            play();
        },false)
 
        //暂停/播放视频
        canvas.addEventListener('click',() => {
            if (!video.paused) {
                video.pause();
            } else {
                video.play();
            }
        },false);
    }
}