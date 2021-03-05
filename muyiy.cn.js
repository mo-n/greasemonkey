// ==UserScript==
// @name         muyiy clear
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       mo_n
// @match        https://muyiy.cn/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';
  function clearQcode() {
    const _t = window.setInterval(() => {
      const container = document.getElementById('container');
      if (container.querySelector('#read-more-wrap')) {
        container.querySelector('#read-more-wrap').remove();
        container.removeAttribute('style');
      }
      window.clearInterval(_t);
    }, 1000);
  }

  const originalPushState = window.history.pushState;
  window.history.pushState = function (state, title, url) {
    originalPushState.apply(this, arguments);
    if (/^\/question\//.test(location.pathname) ) {
      clearQcode();
    }
  };
  const originalReplaceState = window.history.replaceState;
  window.history.replaceState = function (state, title, url) {
    originalReplaceState.apply(this, arguments);
    if (/^\/question\//.test(location.pathname) ) {
      clearQcode();
    }
  };

  //回退拦截
  window.addEventListener('popstate', function () {
    if (/^\/question\//.test(location.pathname) ) {
      clearQcode();
    }
  })
  clearQcode();
  document.querySelector('main.page .right-group').remove();
})();;