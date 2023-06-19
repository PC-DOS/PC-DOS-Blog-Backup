// ==UserScript==
// @name         东南大学硕博人文讲座预约系统AJAX注入工具
// @namespace    http://pc-dos.scp-eq.org/
// @version      0.1
// @description  草泥马的东大硕博人文讲座预约系统（暴力版）
// @author       PC-DOS
// @match        *://ehall.seu.edu.cn/gsapp/sys/jzxxtjapp/*
// @icon         https://www.seu.edu.cn/_upload/tpl/09/bc/2492/template2492/favicon.ico
// ==/UserScript==

(function() {
    'use strict';

    //由于页面动态加载内容，故使用一个2000毫秒的延时执行
    //若网络延迟较大可修改此数值
    setTimeout(()=>{
        MainFunction()
    }, 2000)

})();

function MainFunction(){
    //等待依赖项BH_UTILS类库可用
    if (typeof BH_UTILS == "undefined"){
        console.log("BH_UTILS is currently undefined, pending it...");
        setTimeout(()=>{
            MainFunction()
        }, 2000)
        return;
    }

    console.log("FuckSeuLectureAppointmentSystemAjax: Start to send appointment requests");

    //讲座WID，可以从“查看活动详情”按钮的data-x-wid属性获取
    //这个地方要自己修改
    var sLectureID="0e9e5ea0162140e2b02828523164e8cb";

    //构造参数
    var arrParams = {
        HD_WID : sLectureID
    };

    //调用页面加载的BH_UTILS库，发送讲座预约AJAX请求
    console.log("FuckSeuLectureAppointmentSystemAjax: Sending appointment request of lecture ID %s", sLectureID);
    BH_UTILS.doAjax('/gsapp/sys/jzxxtjapp/hdyy/yySave.do', {paramJson : JSON.stringify(arrParams)}).done(function (sJsonData){
        console.log(sJsonData); //显示回报数据
        if (sJsonData.success){ //判断是否预约成功
            console.log("FuckSeuLectureAppointmentSystemAjax: Appointment has been made successfully, congratulations!");
            return;
        }
        else{
            //console.log("东大网信亲妈飞天");
            console.log("FuckSeuLectureAppointmentSystemAjax: AJAX request failed, retrying...");
        }
    })

    //注册定时执行
    setTimeout(()=>{
        MainFunction()
    }, 500)
}