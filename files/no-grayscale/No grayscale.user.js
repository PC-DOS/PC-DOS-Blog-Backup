// ==UserScript==
// @name         No Grayscale
// @namespace    PCDOS
// @version      0.44
// @description  铭记英烈不等于无法正常使用互联网服务。
// @author       PC-DOS
// @match        *://*.bilibili.com/*
// @match        *://*.suzhou-news.cn/*
// @match        *
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    //'use strict';

    // Code by PC-DOS
    console.log("NoGrayscale: Started.")

    let arrStyleSheets = document.getElementsByTagName("style");

    console.log(arrStyleSheets.length);

    for (var i=0; i<arrStyleSheets.length;i++){
        if (arrStyleSheets[i].innerHTML.search(/grayscale/i) != -1) {
            console.log("Gray scale detected!");
            console.log(arrStyleSheets[i].innerHTML);
        }
        if (arrStyleSheets[i].innerHTML.search(/grayscale/i) != -1) arrStyleSheets[i].remove(arrStyleSheets[i].firstChild);
    }

    // Code adapted from https://greasyfork.org/zh-CN/scripts/399463-find-the-color
    document.getElementsByTagName("html")[0].style.cssText="-webkit-filter: unset !important; filter: unset !important;";
    document.getElementsByTagName("body")[0].style.cssText="-webkit-filter: unset !important; filter: unset !important;";

    // Code adapted from https://greasyfork.org/zh-CN/scripts/399471-filter-remover
    document.documentElement.style.filter = "none"
    document.body.style.filter="none"

    // Coda adapted from https://greasyfork.org/zh-CN/scripts/399464-gray-filter-remove
    function addNewStyle(newStyle) {
        var styleElement = document.getElementById('styles_remove_gray_filter');

        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.type = 'text/css';
            styleElement.id = 'styles_remove_gray_filter';
            document.getElementsByTagName('head')[0].appendChild(styleElement);
        }

        styleElement.appendChild(document.createTextNode(newStyle));
    }

    addNewStyle('* {filter: unset!important;-webkit-filter: unset!important;}');
    document.getElementsByTagName("html")[0].style.cssText="-webkit-filter: unset !important; ";

    console.log("NoGrayscale: Execution Finished.");
})();