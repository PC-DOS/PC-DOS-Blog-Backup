// ==UserScript==
// @name         雨课堂网页版显示播放中的PPT
// @namespace    http://pc-dos.scp-eq.org/
// @version      0.2
// @description  雨课堂网页版显示播放中的PPT
// @author       PC-DOS
// @include      https://www.yuketang.cn/lesson/fullscreen/v3/*
// @icon         https://www.yuketang.cn/static/images/favicon.ico
// ==/UserScript==

(function() {
    'use strict';

    //由于页面动态加载内容，故使用一个5000毫秒的延时执行
    //若网络延迟较大可修改此数值
    setTimeout(()=>{
        MainFunction()
    }, 5000)

})();

function MainFunction(){
    console.log("YktShowPlayingSlide: Started.");

    //扫描PPT容器
    var arrPPTContainer = document.getElementsByClassName("slide__cmp");
    console.log("YktShowPlayingSlide: %d slide container(s) found.", arrPPTContainer.length);

    //显示PPT容器
    for (var i=0; i<arrPPTContainer.length; i++){
        arrPPTContainer[i].style.display="block";
    }

    //扫描遮罩
    var arrPPTOverlay = document.getElementsByClassName("ppt__modal box-center");
    console.log("YktShowPlayingSlide: %d slide overlay(s) found.", arrPPTOverlay.length);

    //移除遮罩
    for (i=0; i<arrPPTOverlay.length; i++){
        arrPPTOverlay[i].outerHTML="";
    }

    //注册循环执行
    console.log("YktShowPlayingSlide: 1 loop finished.");
    setTimeout(()=>{
        MainFunction()
    }, 5000)
}