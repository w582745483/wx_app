const  ffmpeg = require('fluent-ffmpeg')
   
 const captureImageOne = (src)=> {
    return new Promise((reslove, reject) => {
        try {
            console.log('src',src)
            let imageName = '';
            let fileName = src.substring( src.lastIndexOf('/') + 1).split(".")[0];
            let width,height
            ffmpeg.ffprobe(src,(err,data)=>{
               console.log(data.streams)
                 width=data.streams[0].width?data.streams[0].width:data.streams[1].width
                 height=data.streams[0].height?data.streams[0].height:data.streams[1].height
                 if(width<height){
                     width=393
                     height=640
                 }
                 console.log('width',width,'height',height)
                 ffmpeg(src)
                 .on('filenames', (filenames)=> {
                     imageName = filenames[0];
                     console.log(filenames);
                 })
                 .on('end', ()=> {
                     reslove(imageName);
                 })
                 .screenshots({
                     // Will take screens at 20%, 40%, 60% and 80% of the video
                     //timestamps: [30.5, '50%', '01:10.123'],
                     timestamps: ['00:01.000'],
                     folder: 'img/Templates',
                     filename: fileName + '.jpg',
                     size: `${width}x${height}`
                 })
            })      
        } catch(err) {
            reject(err);
        }
    })
}
module.exports=captureImageOne
//captureImageOne("video/video(1).MP4")
// router.post('/uploadVideo', (req, res)=> {
//     try {
//         let form = new formidable.IncomingForm();
//         form.uploadDir = 'video';
//         let msger = {
//             fileName:[],
//             imageName:[]
//         };
//         form.parse(req, (error, fields, files)=> {
//             (function (fileLen) {
//                 let current = 0;
//                 for (let key in files) {
//                     let file = files[key];
//                     let fName =  key;
//                    console.log("filename==="+fName);
//                     if(file.size>MAX_SIZE_VIDEO){
//                         res.json({code: -1, msg: '视频大小不能超过150MB！'});
//                         return false;
//                     }
//                     switch (file.type) {
//                         case "video/mpeg":
//                             fName = fName + ".mpeg";
//                             break;
//                         case "video/mpg":
//                             fName = fName + ".mpg";
//                             break;
//                         case "video/mp4":
//                             fName = fName + ".mp4";
//                             break;
//                         case "video/mpeg4":
//                             fName = fName + ".mp4";
//                             break;
//                         case "video/ogg":
//                             fName = fName + ".ogg";
//                             break;
//                         case "video/webm":
//                             fName = fName + ".webm";
//                             break;
//                         default :
//                             fName = fName + ".mp4";
//                             break;
//                     }
//                    console.log(file.size);
//                     let uploadDir = "video" + fName;
//                     fs.rename(file.path, uploadDir,async (err)=> {
//                         if (err) {
//                             throw new Error(err);
//                         }else{
//                             captureImageOne(uploadDir).then(async (imgname)=> {
//                                 msger.imageName.push(imgname);
//                                 msger.fileName.push(fName);
//                                 current++;
//                                 if(current==fileLen){
//                                     res.json({code: 0, msg: msger,filePath:'video',imagePath:'img'});
//                                 }
//                             },async (err)=>{
//                                 console.log(err);
//                                 throw new Error(err);
//                             });
//                         }
//                     });
//                 }
//             })(Object.keys(files).length);
//         });
//     }
//     catch (err) {
//         res.json({code: -1, msg: err});
//     }
// });
