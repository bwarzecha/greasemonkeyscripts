// ==UserScript==
// @name         Simplified YouTube
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

var removeTimeout;
var loaded = false;
(function() {
    'use strict';
    Element.prototype.remove = function() {
        this.parentElement.removeChild(this);
    }
    NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
        for(var i = this.length - 1; i >= 0; i--) {
            if(this[i] && this[i].parentElement) {
                this[i].parentElement.removeChild(this[i]);
            }
        }
    }
    function reloadIfPrimaryMissing() {
        if(!document.getElementById('primary')){
            location.reload();
        }
    }

    var deleteObjects = {
        main:{ url_regex: /.*watch.*/, removeIds: [ 'secondary','sections','guide-button']},
        watch: { url_regex: /.*www.youtube.com[\/]?$/, removeIds: ['primary', 'secondary','sections','guide-inner-content','guide-button']},
        search: { url_regex: /.*www.youtube.com\/results.*/, removeIds: [ 'secondary','sections','guide-inner-content','guide-button'], handler: reloadIfPrimaryMissing}

    }

    function removeElements(){
        for (var key in deleteObjects) {
            var conf = deleteObjects[key];
            if (conf.url_regex.exec(document.URL)){
                conf.removeIds.forEach(id => {
                    console.log('Removing #'+ id);
                    var element = document.getElementById(id)
                    if (element){
                        element.remove()
                    }
                })
                if(conf.handler){
                    console.log(typeof(conf.handler));
                    conf.handler();
                }
            }
        }
        if(!loaded){
            removeTimeout = setTimeout(removeElements,1000)
        }
    }

    removeElements()

})();
