// ==UserScript==
// @name         Bilibili CV Downloader
// @version      0.1
// @description  Easy to download images from BilibiliCV!!
// @author       EdgeNeko
// @match        https://www.bilibili.com/read/cv*
// @grant       GM_download
// @grant       GM_info
// @grant       GM_xmlhttpRequest
// @connect     i0.hdslb.com
// ==/UserScript==

var baseDownload = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTQ1Mzk5NzI5NzM1IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI5MzciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMTYwIDMyYy0xMiAwLTI0LjggNC44LTMzLjYgMTQuNFMxMTIgNjggMTEyIDgwdjg2NGMwIDEyIDQuOCAyNC44IDE0LjQgMzMuNiA5LjYgOS42IDIxLjYgMTQuNCAzMy42IDE0LjRoNzA0YzEyIDAgMjQuOC00LjggMzMuNi0xNC40IDkuNi05LjYgMTQuNC0yMS42IDE0LjQtMzMuNlYzMDRMNjQwIDMySDE2MHoiIGZpbGw9IiM1QUNDOUIiIHAtaWQ9IjI5MzgiPjwvcGF0aD48cGF0aCBkPSJNOTEyIDMwNEg2ODhjLTEyIDAtMjQuOC00LjgtMzMuNi0xNC40LTkuNi04LjgtMTQuNC0yMS42LTE0LjQtMzMuNlYzMmwyNzIgMjcyeiIgZmlsbD0iI0JERUJENyIgcC1pZD0iMjkzOSI+PC9wYXRoPjxwYXRoIGQ9Ik01MDAuOCA2ODQuOGMzLjIgMi40IDYuNCA0LjggMTEuMiA0LjggNCAwIDgtMS42IDExLjItNC44bDE0Mi40LTEzNmMyLjQtMi40IDMuMi01LjYgMS42LTguOC0xLjYtMy4yLTQtNC44LTcuMi00LjhINTc2di0xMzZjMC00LTEuNi04LTQuOC0xMS4yLTMuMi0zLjItNy4yLTQuOC0xMS4yLTQuOEg0NjRjLTQgMC04IDEuNi0xMS4yIDQuOC0zLjIgMy4yLTQuOCA3LjItNC44IDExLjJ2MTM2SDM2NGMtMy4yIDAtNi40IDEuNi03LjIgNC44LTEuNiAzLjIgMCA2LjQgMS42IDguOGwxNDIuNCAxMzZ6TTcxMiA3NTEuMkgzMTJjLTguOCAwLTE2IDcuMi0xNiAxNnM3LjIgMTYgMTYgMTZoNDAwYzguOCAwIDE2LTcuMiAxNi0xNnMtNy4yLTE2LTE2LTE2eiIgZmlsbD0iI0ZGRkZGRiIgcC1pZD0iMjk0MCI+PC9wYXRoPjwvc3ZnPg==";

function ondownload() {
    var elements = document.getElementsByClassName("img-box");
    for (var i = 0; i < elements.length; i++) {
        var img = elements[i].children[0].dataset.src;
        var txt = elements[i].children[1].innerText;
        var imgOriginal = img.split("@")[0];
        var extSplits = imgOriginal.split(".");
        var ext = extSplits[extSplits.length - 1];
        var fileName = txt + "." + ext;
        console.log(imgOriginal);
        console.log(txt);
        //downloadFile(imgOriginal, fileName);
        console.log(GM_info.downloadMode);
        // GM_download({
        //     url: imgOriginal,
        //     name: fileName,
        // });
        downloadFileBlob("https:"+imgOriginal, fileName);
    }
}

function downloadFileBlob(url, fileName) {
    GM_xmlhttpRequest({
        headers: {
            referer: 'https://i0.hdslb.com/'
        },
        method: 'GET',
        url: url,
        responseType: 'blob',
        timeout: 180000,
        onload: function (xhr) {
            let blobURL = window.URL.createObjectURL(xhr.response); // 返回的blob对象是整个response，而非responseText
            // 控制点击下载按钮的时间间隔大于0.5秒
            // if (new Date().getTime() - click_time > time_interval) {
            //     click_time = new Date().getTime();
            //     click_download_a(blobURL, fullFileName, downloadBar_no);
            // } else {
            //     time_delay += time_interval;
            //     setTimeout(() => {
            //         click_download_a(blobURL, fullFileName, downloadBar_no);
            //     }, time_delay);
            // }
            var a = $("<a>")
                .attr("href", blobURL)
                .attr("download", fileName)
                .appendTo("body");

            a[0].click();

            a.remove();
            window.URL.revokeObjectURL(blobURL);
        },
        onprogress: function (xhr) {
            let loaded = parseInt(xhr.loaded / 1000);
            let total = parseInt(xhr.total / 1000);
            console.log("fileName:"+fileName+"  progress:"+ ( loaded/total));
        },
    });


}

(function () {
    'use strict';
    // Your code here...
    onload = function () {
        // <a href="javascript:void(0)" id="bilibilicv_Download" target="_blank">
        //     <div class="help">
        //       <span class="icon" style="background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTQ1Mzk5NzI5NzM1IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI5MzciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMTYwIDMyYy0xMiAwLTI0LjggNC44LTMzLjYgMTQuNFMxMTIgNjggMTEyIDgwdjg2NGMwIDEyIDQuOCAyNC44IDE0LjQgMzMuNiA5LjYgOS42IDIxLjYgMTQuNCAzMy42IDE0LjRoNzA0YzEyIDAgMjQuOC00LjggMzMuNi0xNC40IDkuNi05LjYgMTQuNC0yMS42IDE0LjQtMzMuNlYzMDRMNjQwIDMySDE2MHoiIGZpbGw9IiM1QUNDOUIiIHAtaWQ9IjI5MzgiPjwvcGF0aD48cGF0aCBkPSJNOTEyIDMwNEg2ODhjLTEyIDAtMjQuOC00LjgtMzMuNi0xNC40LTkuNi04LjgtMTQuNC0yMS42LTE0LjQtMzMuNlYzMmwyNzIgMjcyeiIgZmlsbD0iI0JERUJENyIgcC1pZD0iMjkzOSI+PC9wYXRoPjxwYXRoIGQ9Ik01MDAuOCA2ODQuOGMzLjIgMi40IDYuNCA0LjggMTEuMiA0LjggNCAwIDgtMS42IDExLjItNC44bDE0Mi40LTEzNmMyLjQtMi40IDMuMi01LjYgMS42LTguOC0xLjYtMy4yLTQtNC44LTcuMi00LjhINTc2di0xMzZjMC00LTEuNi04LTQuOC0xMS4yLTMuMi0zLjItNy4yLTQuOC0xMS4yLTQuOEg0NjRjLTQgMC04IDEuNi0xMS4yIDQuOC0zLjIgMy4yLTQuOCA3LjItNC44IDExLjJ2MTM2SDM2NGMtMy4yIDAtNi40IDEuNi03LjIgNC44LTEuNiAzLjIgMCA2LjQgMS42IDguOGwxNDIuNCAxMzZ6TTcxMiA3NTEuMkgzMTJjLTguOCAwLTE2IDcuMi0xNiAxNnM3LjIgMTYgMTYgMTZoNDAwYzguOCAwIDE2LTcuMiAxNi0xNnMtNy4yLTE2LTE2LTE2eiIgZmlsbD0iI0ZGRkZGRiIgcC1pZD0iMjk0MCI+PC9wYXRoPjwvc3ZnPg==);">
        //       </span>
        //       <p class="title">专栏帮助</p>
        //       <p class="info">查看专栏使用说明</p>
        //     </div>
        //   </a>

        var replaceTarget = this.document.getElementsByClassName("help")[0];
        var replaceA = replaceTarget.parentElement;
        replaceA.href = "javascript:void(0)";
        replaceA.onclick = function () {
            ondownload();
        }
        replaceTarget.children[0].style.backgroundImage = "url(" + baseDownload + ")";
        replaceTarget.children[1].innerText = "下载所有图片";
        replaceTarget.children[2].innerText = "by EdgeNeko"
    }
})();


