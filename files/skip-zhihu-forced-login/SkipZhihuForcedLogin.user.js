// ==UserScript==
// @name         Skip Zhihu Forced Login (跳过知乎强制登录)
// @namespace    PCDOS
// @version      0.01
// @description  跳过知乎强制登录
// @author       PC-DOS
// @match        *://www.zhihu.com/question/*
// @match        *://www.zhihu.com/question/*/answer/*
// @match        *://www.zhihu.com/question/*/
// @match        *://www.zhihu.com/question/*/answer/*/
// @grant        none
// ==/UserScript==

(function() {
    //'use strict';

    // Code by PC-DOS, some code adapted from https://greasyfork.org/zh-CN/scripts/399464-gray-filter-remove
    console.log("SkipZhihuLogin(): Started.")

    function addNewStyle(newStyle) {
        var styleElement = document.getElementById('styles_skip_zhihu_login');

        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.type = 'text/css';
            styleElement.id = 'styles_skip_zhihu_login';
            document.getElementsByTagName('head')[0].appendChild(styleElement);
        }

        styleElement.appendChild(document.createTextNode(newStyle));
    }

    addNewStyle(".Modal-wrapper {visibility: collapse;}");

	//document.getElementsByClassName("Modal-wrapper undefined Modal-enter-done")[0].remove();

    document.getElementsByTagName("html")[0].style.cssText="";

    console.log("SkipZhihuLogin(): Execution Finished.");
})();