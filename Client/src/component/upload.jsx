import React, { Component } from 'react'
import { Progress, message, List, Menu } from 'antd'
import $ from 'jquery'
import SparkMD5 from 'spark-md5'

import Background from '../container/background'


let baseUrl = 'http://localhost:4000'
let chunkSize = 5 * 1024 * 1024
let fileSizes = []
let files = []
let hasUploaded = 0
let chunks = 0
let filePath = []
export default class Upload extends Component {
    state = {
        percent: 0,
        checkProcessValue: '',
        value: '',
        visible: true,
        path: []
    }
    fileChange = (e) => {

        files = e.target.files

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
                visible:false
            })
            return
        }
        await this.checkAndUploadChunk(file, fileSize, fileMd5Value, result.chunkList)
        // 第四步: 通知服务器所有分片已上传完成
        this.notifyServer(fileMd5Value, file).then(()=>{
            this.setState({
                path: filePath,
                visible:false
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
                    resolve(data.json())
                })
        })
    }
    // 3.上传chunk
    async  checkAndUploadChunk(file, fileSize, fileMd5Value, chunkList) {
        chunks = Math.ceil(fileSize / chunkSize)
        hasUploaded = chunkList.length
        for (let i = 0; i < chunks; i++) {
            let exit = chunkList.indexOf(i + "") > -1
            // 如果已经存在, 则不用再上传当前块
            if (!exit) {
                let index = await this.upload(file, fileSize, i, fileMd5Value, chunks)
                hasUploaded++
                let radio = Math.floor((hasUploaded / chunks) * 100)
                console.log('上传进度', radio)
                this.setState({
                    visible: true,
                    percent: radio,
                    value: '上传进度'
                })
            }
        }
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
            $.ajax({
                url: baseUrl + "/upload",
                type: "POST",
                data: form, //刚刚构建的form数据对象
                async: true, //异步
                processData: false, //很重要，告诉jquery不要对form进行处理
                contentType: false, //很重要，指定为false才能形成正确的Content-Type
                success: function (data) {
                    resolve(data.desc)
                }
            })
            // fetch(baseUrl + "/upload",{
            //     method:'POST',
            //     body:form,
            //     Headers:{'Content-Type': 'application/x-www-form-urlencoded'}
            // })
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
    handleClick = (e) => {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    }
    render() {
        return (
            <div>
                <Background />
                <div style={{ textAlign: 'center', background: 'white' }} className='bigvideo'>
                    <img src={require('../assets//img/bc.jpg')} style={{ position: 'relative', width: '100%', height: '150px' }} alt="sunshine"></img>
                    <div>
                        <input type='file' multiple="multiple" style={{ opacity: '0', position: 'absolute', marginTop: '12px', marginLeft: '70px', zIndex: '1' }} onChange={this.fileChange} />

                        <Menu mode="horizontal" onClick={this.handleClick} >
                            <Menu.Item key="text" style={{ padding: '0 28px' }}>
                                <img src={require('../assets/img/text.png')} style={{ height: '40px', width: '40px', right: '20px' }}></img>
                                <span style={{ fontSize: '.16rem', lineHeight: '.4rem', marginLeft: '2px' }}>文字</span>
                            </Menu.Item>
                            <Menu.Item key="picture" style={{ padding: '0 28px' }}>
                                <img src={require('../assets/img/picture.png')} style={{ height: '40px', width: '40px', right: '20px' }}></img>
                                <span style={{ fontSize: '.16rem', lineHeight: '.4rem', marginLeft: '2px' }}>图片</span>
                            </Menu.Item>
                            <Menu.Item key="uploadvideo" style={{ padding: '0 28px' }}>
                                <img src={require('../assets/img/uploadvideo.png')} style={{ height: '40px', width: '40px', right: '20px' }}></img>
                                <span style={{ fontSize: '.16rem', lineHeight: '.4rem', marginLeft: '2px' }}>上传视频</span>
                            </Menu.Item>
                        </Menu>
                        <List
                            okText='发表'
                            split={false}
                            grid={{ gutter: 16, column: 1 }}
                            dataSource={this.state.path}
                            renderItem={item => (

                                <List.Item>
                                    <div>
                                        <div >
                                            <video style={{ width: '100%', height: '200px' }} x5-video-player-fullscreen="true" x5-video-player-fullscreen="portraint" controls preload="true" controlsList="nodownload nofullscreen" src={item}>
                                            </video>
                                        </div>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </div>
                    <div style={{ position: 'absolute', left: '36%' }}>
                        {this.state.visible ? <Progress type="circle" percent={this.state.percent} /> : null}
                        <p>{this.state.value}</p>

                    </div>
                </div>
            </div>

        )
    }
}
