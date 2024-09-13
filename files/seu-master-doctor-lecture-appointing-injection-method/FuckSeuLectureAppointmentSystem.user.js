// ==UserScript==
// @name         东南大学硕博人文讲座预约系统按钮注入工具
// @namespace    http://pc-dos.scp-eq.org/
// @version      0.5-beta
// @description  草泥马的东大硕博人文讲座预约系统
// @author       PC-DOS
// @match        *://ehall.seu.edu.cn/gsapp/sys/jzxxtjapp/*
// @match        *://yjs.seu.edu.cn/gsapp/sys/jzxxtjapp/*
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
    var IsInDebug = false; //是否为调试版

    if (IsInDebug) console.log("FuckSeuLectureAppointmentSystem: Started");

    //枚举每一个讲座块
    var arrLecturePosters = document.getElementsByTagName("tbody")[0]; //获取活动海报容器
    if (typeof arrLecturePosters != "undefined"){ //避免相关网页元素没有加载完的情况
        arrLecturePosters = arrLecturePosters.getElementsByTagName("tr"); //获取每一个活动资料
        if (typeof arrLecturePosters != "undefined"){ //避免相关网页元素没有加载完的情况
            if (IsInDebug) console.log("FuckSeuLectureAppointmentSystem: %d lecture posters found.", arrLecturePosters.length);
            for (var i = 0; i < arrLecturePosters.length; i++){ //枚举每一个讲座
                //获取讲座名字
                var sLectureName = arrLecturePosters[i].getElementsByTagName("td")[3].getElementsByTagName("span")[0].innerHTML;
                //审查元素，查找子元素中的所有botton
                var arrButtons = arrLecturePosters[i].getElementsByTagName("a");
                //预设每个讲座poster存在两个button
                if (arrButtons.length >= 2){
                    var btnAppoint = arrButtons[0];
                    var btnLectureInfo = arrButtons[1];
                    if (btnAppoint.getAttribute("style") == null || btnAppoint.getAttribute("style") != "pointer-events: none;color: #bbb;"){
                        //如果讲座已经开放预约，跳过
                        if (IsInDebug) console.log("FuckSeuLectureAppointmentSystem: Lecture \"%s\" has been opened for applications, ignoring...", sLectureName);
                    }
                    else{
                        //如果讲座没有开放预约，进行按钮注入
                        if (IsInDebug) console.log("FuckSeuLectureAppointmentSystem: Injecting the Appointment button of lecture \"%s\" ...", sLectureName);
                        var sLectureId = btnLectureInfo.getAttribute("data-x-wid");
                        //判断是否获取成功
                        if (sLectureId != null){
                            //获取成功，继续注入
                            if (IsInDebug) console.log("FuckSeuLectureAppointmentSystem: ID of lecture \"%s\" is %s.", sLectureName, sLectureId);
                            //替换预约按钮的外部HTML（outerHTML）
                            var htmlInjectedButton = '<a href="javascript:void(0)" data-wid="LECTURE_ID_HERE" data-action="appointment">到点就点我</a>'; //待注入的HTML代码
                            btnAppoint.outerHTML = htmlInjectedButton.replace("LECTURE_ID_HERE", sLectureId);
                        }
                        else{
                            //获取失败，报错
                            console.log("FuckSeuLectureAppointmentSystem: Failed to get ID of lecture \"%s\".", sLectureName);
                        }
                    }
                }
            }
        }
    }

    if (IsInDebug) console.log("FuckSeuLectureAppointmentSystem: Operation Finished.");

    //注册每秒定时执行，避免误操作后需要刷新页面
    setTimeout(()=>{
        MainFunction()
    }, 500)
}