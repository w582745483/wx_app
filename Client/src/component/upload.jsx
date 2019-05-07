import React, { Component } from 'react'
import { Progress, message, List, Menu, Modal, Icon } from 'antd'
import SparkMD5 from 'spark-md5'
import { connect } from 'react-redux'

import Background from '../container/background'


let baseUrl = 'http://e24589943k.wicp.vip' //http://localhost:4000  //http://e24589943k.wicp.vip
let chunkSize = 5 * 1024 * 1024
let fileSizes = []
let files = []
let hasUploaded = 0
let chunks = 0
let filePath = []
let totalProgress = []
let saveimgResult = false
class Upload extends Component {
    state = {
        percent: 0,
        checkProcessValue: '',
        value: '',
        visible: false,
        path: [],
        modalvisible: false,
        imgPoster: '',
        type: 'play-circle',
        iconVisible: true,
        imgUrl: ''
    }
    fileChange = (e) => {
        files = e.target.files
        console.log(files)
        for (var i = 0; i < files.length; i++) {
            fileSizes.push(files[i].size)
            this.responseChange(files[i], files[i].size)
            filePath.push(`${baseUrl}/${files[i].name}`)
        }

        //this.responseChange(files[0], files[0].size)
    }
    async  responseChange(file, fileSize) {
        // 第一步：按照 修改时间+文件名称+最后修改时间-->MD5
        // 显示文件校验进度
        let fileMd5Value = await this.md5File(file)
        // 第二步：校验文件的MD5

        let result = await this.checkFileMD5(file.name, fileMd5Value)
        console.log(result)
        // 如果文件已存在, 就秒传
        if (result.file) {
            message.destroy()
            message.success('文件已经秒传!')
            this.setState({
                path: filePath,
                visible: false,
                value: '',
                modalvisible: true
            })
            return
        }
        await this.checkAndUploadChunk(file, fileSize, fileMd5Value, result.chunkList)
        // 第四步: 通知服务器所有分片已上传完成
        this.notifyServer(fileMd5Value, file).then(() => {
            this.setState({
                path: filePath,
                visible: false,
                value: '',
                modalvisible: true
            })
        })
    }
    // 1.修改时间+文件名称+最后修改时间-->MD5
    md5File = (file) => {
        return new Promise((resolve, reject) => {
            var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
                //chunkSize = 2097152, // Read in chunks of 2MB
                chunkSize = file.size / 100,
                //chunks = Math.ceil(file.size / chunkSize),
                chunks = 100,
                currentChunk = 0,
                spark = new SparkMD5.ArrayBuffer(),
                fileReader = new FileReader();

            fileReader.onload = function (e) {
                // console.log('read chunk nr', currentChunk + 1, 'of', chunks);
                spark.append(e.target.result); // Append array buffer
                currentChunk++;

                if (currentChunk < chunks) {
                    loadNext();
                } else {
                    let cur = +(new Date())
                    console.log('finished loading');
                    // alert(spark.end() + '---' + (cur - pre)); // Compute hash
                    let result = spark.end()
                    resolve(result)
                }
            }
            fileReader.onerror = function () {
                console.warn('oops, something went wrong.');
            }
            var loadNext = () => {
                var start = currentChunk * chunkSize,
                    end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

                fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
                // console.log('校验进度', currentChunk + 1)

                this.setState({
                    visible: true,
                    percent: currentChunk + 1,
                    value: '校验进度'
                })
            }
            loadNext()
        })
    }
    // 2.校验文件的MD5
    checkFileMD5(fileName, fileMd5Value) {
        return new Promise((resolve, reject) => {
            let url = baseUrl + '/check/file?fileName=' + fileName + "&fileMd5Value=" + fileMd5Value
            fetch(url)
                .then((data) => {
                    this.setState({
                        visible: true,
                        percent: 0,
                        value: '准备上传'
                    })
                    resolve(data.json())
                })
        })
    }
    // 3.上传chunk
    checkAndUploadChunk(file, fileSize, fileMd5Value, chunkList) {
        return new Promise(resolve => {
            chunks = Math.ceil(fileSize / chunkSize)
            hasUploaded = chunkList.length
            let promiseArray = []
            for (let i = 0; i < chunks; i++) {
                let exit = chunkList.indexOf(i + "") > -1
                // 如果已经存在, 则不用再上传当前块
                if (!exit) {
                    promiseArray.push(this.upload(file, fileSize, i, fileMd5Value, chunks))
                }
            }
            Promise.all(promiseArray).then(() => {
                resolve()
            })
        })

    }
    componentWillUnmount() {
        filePath = []
    }
    // 3-2. 上传chunk
    upload(file, fileSize, i, fileMd5Value, chunks) {
        return new Promise((resolve, reject) => {
            //构造一个表单，FormData是HTML5新增的
            let end = (i + 1) * chunkSize >= fileSize ? fileSize : (i + 1) * chunkSize
            let form = new FormData()
            form.append("data", file.slice(i * chunkSize, end)) //file对象的slice方法用于切出文件的一部分
            form.append("total", chunks) //总片数
            form.append("index", i) //当前是第几片     
            form.append("fileMd5Value", fileMd5Value)
            console.log('form', form)

            var ot, oloaded
            var xhr = new XMLHttpRequest()
            xhr.open("post", baseUrl + "/upload", true);
            xhr.onload = uploadComplete; //请求完成
            xhr.onerror = uploadFailed; //请求失败
            //xhr.upload.onprogress = progressFunction;
            xhr.upload.onloadstart = function () {//上传开始执行方法
                ot = new Date().getTime();   //设置上传开始时间
                oloaded = 0;//设置上传开始时，以上传的文件大小为0
            };

            xhr.send(form); //开始上传，发送form数据
            //上传进度实现方法，上传过程中会频繁调用该方法
            xhr.upload.onprogress = (evt) => {

                // event.total是需要传输的总字节，event.loaded是已经传输的字节。如果event.lengthComputable不为真，则event.total等于0
                if (evt.lengthComputable) {
                    var progress = Math.round(evt.loaded / evt.total * 100);
                    totalProgress[i] = progress
                    var value = totalProgress.reduce((total, curr) => {
                        return total + curr
                    })
                    console.log(Math.round(value / chunks))
                    this.setState({
                        visible: true,
                        percent: Math.round(value / chunks),
                        value: '上传进度'
                    })

                }

                var nt = new Date().getTime();//获取当前时间
                var pertime = (nt - ot) / 1000; //计算出上次调用该方法时到现在的时间差，单位为s
                ot = new Date().getTime(); //重新赋值时间，用于下次计算
                var perload = evt.loaded - oloaded; //计算该分段上传的文件大小，单位b
                oloaded = evt.loaded;//重新赋值已上传文件大小，用以下次计算
                //上传速度计算
                var speed = perload / pertime;//单位b/s
                var bspeed = speed;
                var units = 'b/s';//单位名称
                if (speed / 1024 > 1) {
                    speed = speed / 1024;
                    units = 'k/s';
                }
                if (speed / 1024 > 1) {
                    speed = speed / 1024;
                    units = 'M/s';
                }
                speed = speed.toFixed(1);
                //剩余时间
                var resttime = ((evt.total - evt.loaded) / bspeed).toFixed(1);

            }
            //上传成功响应
            function uploadComplete(evt) {
                console.log('uploadComplete')
                //服务断接收完文件返回的结果
                var data = JSON.parse(evt.target.responseText);
                resolve(data.desc)
            }
            //上传失败
            function uploadFailed(evt) {
                alert("上传失败！");
            }
        })
    }
    // 第四步: 通知服务器所有分片已上传完成
    notifyServer = (fileMd5Value, file) => {
        return new Promise((resolve) => {
            let url = baseUrl + '/merge?md5=' + fileMd5Value + "&fileName=" + file.name + "&size=" + file.size
            fetch(url)
                .then((data) => {
                    message.destroy()
                    message.success('上传成功')
                    resolve()
                })
        })
    }

    getDate = () => {
        let d = new Date()
        return d.getMinutes() + ':' + d.getSeconds() + ' ' + d.getMilliseconds()
    }
    handleClick = () => {
        this.setState({
            modalvisible: true
        });
    }

    handleCancel = (e) => {
        this.setState({
            modalvisible: false,
        });
    }
    // canvas 绘制
    dragVideo = (index) => {
        console.log('dragVideo')
        let video = document.querySelectorAll('video')[index],
            canvas = document.querySelectorAll('canvas')[index],
            ctx = canvas.getContext('2d')

        //video.play()
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight;

        let dataUrl
        const Random=Math.ceil(Math.random()*10000000)
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
        // 竖屏视频改变画布大小
        if (video.videoWidth < video.videoHeight) {
            canvas.width = 393
            canvas.height = 640;
            ctx.drawImage(video, 0, 0, 393, 640)
            dataUrl = canvas.toDataURL('image/jpg')
        }
        // img.setAttribute('crossOrigin', 'anonymous');
        dataUrl = canvas.toDataURL('image/jpg')
        //img.src = dataUrl
        this.setState({
            imgPoster: dataUrl,
            imgUrl: `${baseUrl}/${Random}.jpg`
        }, () => {
            fetch(baseUrl + "/saveimg", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imgPoster: this.state.imgPoster,
                    imgName: Random
                })
            }).then(() => {
                saveimgResult = true
            })
        })
    }

    sendLine = () => {
        if (!saveimgResult) {
            message.destroy()
            message.warning('视频正在加载中...请稍等！', 5)
            return
        }
        message.destroy()
        message.loading('正在发送朋友圈，请等候...', 0)
        const playAddr = this.state.path[0]
        console.log('playAddr', playAddr)
        console.log('imgUrl', this.state.imgUrl)
        const bigvideo = {
            //text: this.state.videoText,
            videoimage: this.state.imgUrl,
            videourl: playAddr,
            uuid: this.props.uuid
        }
        console.log('bigvideo', bigvideo)
        fetch('http://47.93.189.47:22221/api/sns/sendbigvideo', {
            method: 'POST',
            //credentials: 'include',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': ' application/json'
            },
            body: JSON.stringify(bigvideo)
        }).then(res => {
            message.destroy()
            message.success('发送成功！', 1)
            console.log(res)
            saveimgResult=false
            filePath = []
            this.setState({
                modalvisible: false,
                path: [],
            });
        })
    }

    render() {
        return (
            <div>
                <Background />
                <div style={{ textAlign: 'center', background: 'white' }} className='bigvideo'>
                    <img src={require('../assets//img/bc.jpg')} style={{ position: 'relative', width: '100%', height: '150px' }} alt="sunshine"></img>
                    <div>
                        <Menu mode="horizontal" onClick={this.handleClick} >
                            <Menu.Item key="text" style={{ padding: '0 28px' }}>
                                <img src={require('../assets/img/text.png')} style={{ height: '40px', width: '40px', right: '20px' }}></img>
                                <span style={{ fontSize: '13px', lineHeight: '.4rem', marginLeft: '2px' }}>文字</span>
                            </Menu.Item>
                            <Menu.Item key="picture" style={{ padding: '0 28px' }}>
                                <img src={require('../assets/img/picture.png')} style={{ height: '40px', width: '40px', right: '20px' }}></img>
                                <span style={{ fontSize: '13px', lineHeight: '.4rem', marginLeft: '2px' }}>图片</span>
                            </Menu.Item>
                            <Menu.Item key="uploadvideo" style={{ padding: '0 28px' }}>
                                <img src={require('../assets/img/uploadvideo.png')} style={{ height: '40px', width: '40px', right: '20px' }}></img>
                                <span style={{ fontSize: '13px', lineHeight: '.4rem', marginLeft: '2px' }}>上传视频</span>
                            </Menu.Item>
                        </Menu>
                        <Modal
                            visible={this.state.modalvisible}
                            onOk={this.sendLine}
                            onCancel={this.handleCancel}
                            centered={true}
                            closable={false}
                            width={400}
                        >
                            <input type='file' multiple="multiple" style={{ opacity: '0', position: 'absolute', marginTop: '7px', right: '-150px', zIndex: '1' }} onChange={this.fileChange} />
                            <img style={{ marginLeft: '310px', width: '50px' }} src={require('../assets/img/choosevideo.png')} />
                            <div style={{ position: 'relative', left: '42%', marginTop: '50px', zIndex: '2' }}>
                                {this.state.visible ? <Progress type="circle" percent={this.state.percent} width={80} /> : null}
                                <p style={{ marginLeft: '11px' }}>{this.state.value}</p>
                            </div>
                            <List
                                locale={{ emptyText: ' ' }}
                                okText='发表'
                                split={false}
                                grid={{ gutter: 16, column: 1 }}
                                dataSource={this.state.path}
                                renderItem={(item, index) => (
                                    <List.Item>
                                        <div>
                                            <div>
                                                <video onLoadedData={() => this.dragVideo(index)} crossOrigin='true' style={{ width: '100%', height: '200px' }} x5-video-player-fullscreen="true" x5-video-player-fullscreen="portraint" controls preload="true" controlsList="nodownload nofullscreen" src={item}>
                                                </video>
                                                <div style={{ background: 'black', textAlign: 'center',display:'none' }}>
                                                    <canvas> </canvas>
                                                </div>
                                            </div>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </Modal>
                    </div>

                </div>
            </div>

        )
    }
}
export default connect(
    state => state.Qr,
)(Upload)