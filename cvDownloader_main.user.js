// ==UserScript==
// @name         Bilibili CV Downloader
// @namespace    https://github.com/hv0905/bilibiliCv_downloader
// @version      1.5
// @description  Easy to download images from BilibiliCV!!
// @author       EdgeNeko(Github@hv0905)
// @match        *://www.bilibili.com/read/cv*
// @grant        GM_download
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @connect      i0.hdslb.com
// ==/UserScript==

//Bilibili CV Downloader
//build with love by EdgeNeko
//Github: @hv0905
//github project: https://github.com/hv0905/bilibiliCv_downloader/

'use strict';

var lastDownloadTime = 0;
var missionCount = 0;
var completedMissionCount = 0;
var downloadbtn;
var downloaded = false;

function ondownload() {
    'use strict';
    setNotifyText('开始下载');
    let elements = document.getElementsByClassName('img-box');
    for (let i = 0; i < elements.length; i++) {
        let img = elements[i].querySelector('img').dataset.src;
        if (!img) {
            continue;
        }
        let txt = "";
        if (elements[i].querySelector('.caption')) {
            //caption
            txt = elements[i].querySelector('.caption').innerHTML.trim();
        }
        let imgOriginal = img.split('@')[0];
        let fileName;
        if (txt.length == 0) {
            let urlSplit = imgOriginal.split('/');
            fileName = urlSplit[urlSplit.length - 1];
        } else {
            let extSplits = imgOriginal.split('.');
            fileName = txt.replace('\\', '_').replace('/', '_').replace('?', '_').replace(':', '_').replace('*', '_').replace('|', '_').replace('<', '_').replace('>', '_').replace('"', '_') + '.' + extSplits[extSplits.length - 1];
        }
        console.log(`[${i}]准备下载:${imgOriginal}  文件名:${fileName}`);
        missionCount++;
        //瞬间完成
        downloadFileBlob('https:' + imgOriginal, fileName, i);
    }
}

function downloadFileBlob(url, fileName, i) {
    'use strict';
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        responseType: 'blob',
        timeout: 180000,
        onload: function (xhr) {
            let blobURL = window.URL.createObjectURL(xhr.response); // 返回的blob对象是整个response，而非responseText
            saveBlob(blobURL, fileName);
        },
        onprogress: function (xhr) {
            let loaded = parseInt(xhr.loaded / 1000);
            let total = parseInt(xhr.total / 1000);
            console.log(`[${i}]正在下载:${fileName}  进度:${(loaded / total)}`);
        },
    });


}

function saveBlob(blob, fileName) {
    'use strict';
    if (new Date().getTime() - lastDownloadTime < 200) {
        setTimeout(() => {
            saveBlob(blob, fileName);
        }, 200 - (new Date().getTime() - lastDownloadTime));
        return;
    }
    lastDownloadTime = new Date().getTime();
    console.log("正在保存:" + fileName);
    let a = $('<a>')
        .attr('href', blob)
        .attr('download', fileName)
        .appendTo('body');

    a[0].click();

    a.remove();
    window.URL.revokeObjectURL(blob);
    completedMissionCount++;
    checkIfCompleted();
}

function checkIfCompleted() {
    'use strict';
    if (missionCount <= completedMissionCount) {
        alert('所有下载操作已完成!\n你可以关闭网页了');
        setNotifyText('下载完成!');
    } else {
        setNotifyText(`下载进度:${completedMissionCount}/${missionCount}`);
    }
}

function setNotifyText(text) {
    'use strict';
    downloadbtn.children[1].innerText = text;
}

function setDownloadBtn() {
    downloadbtn = document.createElement('div');
    downloadbtn.className = 'toolbar-item';
    downloadbtn.style = 'display:flex;flex-direction:column;justify-content:center;align-items:center;';
    downloadbtn.innerHTML = '<svg role="img" xmlns="http://www.w3.org/2000/svg" width="35px" height="35px" viewBox="0 0 24 24" stroke="#505050" stroke-width="1.3714285714285714" stroke-linecap="round" stroke-linejoin="round" fill="none" color="#505050"><path d="M12,3 L12,16" /><polyline points="7 12 12 17 17 12" /><path d="M20,21 L4,21" /></svg>';

    var spanText = document.createElement("span");
    spanText.className = 'toolbar-item__num';
    spanText.innerText = '下载';

    downloadbtn.appendChild(spanText);

    downloadbtn.href = 'javascript:void(0)';
    downloadbtn.target = '';
    downloadbtn.onclick = function () {
        if (downloaded) {
            alert('已下载！');
        }
        else if (confirm('确认下载全部图片?\n注意:在弹出下载成功提示前请不要关闭窗口,否则无法保证所有图片均下载完成\n要查看进度,请点击F12并转到Console')) {
            ondownload();
            downloaded = true;
        }
    }
}

(function () {
    'use strict';
    onload = function () {
        setDownloadBtn();
        let toolbar = document.getElementsByClassName('side-toolbar')[0];
        toolbar.appendChild(downloadbtn);
    };
})();
