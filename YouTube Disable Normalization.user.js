// ==UserScript==
// @name         YouTube Disable Normalization(Auto Toggle)
// @namespace    http://tampermonkey.net/
// @version      0.1.valxe
// @description  Allows true 100% volume on youtube videos.
// @author       Wouter Gerarts, edited by Valxe
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

var alwaysEnable = true;

(function() {
    'use strict';

    function baseElement() {
        return document.querySelector('#content');
    }

    if (typeof fullVolumeButtonTaskId === 'number') {
        console.log('clearing interval');
        clearInterval(fullVolumeButtonTaskId);
    }

    function createFullVolumeButton() {
        var el = document.createElement('button');
        el.innerText = '100% Volume';
        el.classList.add('full-volume-addon-button');
        el.onclick = function(){setFullVolume();}
        return el;
    }

    function createVolumeDenormalizeToggle(){
        var vdt = document.createElement('button');
        vdt.innerText = "Auto Full Volume:" + GM_getValue('VDT');
        vdt.onclick = function(){
            var tog = GM_getValue('VDT');
            GM_setValue('VDT',!tog);
            if(!tog==true)setFullVolume();
            vdt.innerText = "Auto Full Volume:" + !tog;
        };
        return vdt;
    }

    function setFullVolume(){
        var video = baseElement().querySelector('video');
        video.volume = 1;
    }

    function getCurrentVolume(){
        var video = baseElement().querySelector('video');
        return video.volume;
    }

    function round (num, sig) {
        var mult = Math.pow(10, sig);
        return Math.round(num * mult) / mult;
    }

    var fullVolumeButtonTaskId = setInterval(function() {
        if (baseElement().querySelector('video') === undefined) {
            console.log('video element not found');
            return;
        }
        if (baseElement().querySelector('.full-volume-addon-button') != undefined) {
            console.log('full volume addon button already found');
            if(GM_getValue('VDT'))setFullVolume();
            clearInterval(fullVolumeButtonTaskId);
            return;
        }
        var volumeSlider = baseElement().querySelector('.ytp-volume-slider-handle')
        if (volumeSlider === undefined || volumeSlider === null) {
            console.log('volumeSlider not found');
            return;
        }
        var video = baseElement().querySelector('video');
        var volumeSliderLeftStr = volumeSlider.style.left;
        var volumeSliderLeft = volumeSliderLeftStr.substr(0, volumeSliderLeftStr.length - 2);
        var volumeSliderValue = parseFloat(volumeSliderLeft) * 2.5;
        console.log('Checking slider ' + round(volumeSliderValue / 100, 2).toString() + ' against value ' + round(video.volume, 2).toString());
        if (alwaysEnable || volumeSliderValue / 100 > video.volume) {
            var videoTitleElement = baseElement().querySelector('.ytd-video-primary-info-renderer');
            videoTitleElement.appendChild(createFullVolumeButton());
            videoTitleElement.appendChild(createVolumeDenormalizeToggle());
            console.log(GM_getValue('VDT'));
        } else {
            console.log('volume slider did not meet criteria for Full Volume button');
        }
    }, 250);

    var currenturl = "";
    var urlchange = setInterval(function(){
        if (currenturl != location.href)
        {
            currenturl = location.href;
            console.log(currenturl);
        }else{
            if(GM_getValue('VDT'))setFullVolume();
        }
    }, 250);
})();