// ==UserScript==
// @name         知乎新版添加快捷键
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  为新版知乎添加快捷键
// @author       You
// @match        *://www.zhihu.com/question/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let selectId=0;
    let gFlag = 0, scFlag = 0, fxFlag = 0;
    // add hotkey
    document.onkeydown = hotkey;
    const list = document.getElementsByClassName('List')[0];
    list.addEventListener('mouseover',showColor,true);

    const listItems = document.getElementsByClassName('List-item');

    function setSelectId(value){
      const newId = Number(value);
      if (isNaN(newId)) return;
      return selectId = newId;
    }
    function showColor(e){
      var element = e.target;
      setSelectId(parents(element));
    }

    function parents(element){
      var parent = element.parentNode;
      if(!parent){
        return NaN;
      }
      if(!parent.className || parent.className !== 'List-item'){
        return parents(parent);
      }

      return Array.from(listItems).findIndex(elm=>elm === parent
      );
    }

    function findAnswers(count) {
      return listItems[count];
    }

    function setLocation(id) {
      window.scrollTo(0, listItems[id].offsetTop-53);
    }

    function nextItem() {
      var length = listItems.length-1;
      if(selectId !== length){
        setSelectId(selectId + 1);
      }
      setLocation(selectId);
    }

    function previousItem() {
      if(selectId !== 0){
        setSelectId(selectId - 1);
      }
      setLocation(selectId);
    }

    function firstItem()
    {
      gFlag++;
      if(gFlag === 2){
        gFlag = 0;
        setSelectId(0);
        setLocation(selectId);
      }
    }

    function lastItem(){
      setSelectId(listItems.length - 1);
      setLocation(selectId);
    }

    function voteButtonUp() {
      var answers = findAnswers(selectId);
      var voteButton = answers.getElementsByClassName('VoteButton--up')[0];
      voteButton.click();
    }

    function voteButtonDown() {
      var answers = findAnswers(selectId);
      var voteButton = answers.getElementsByClassName('VoteButton--down')[0];
      voteButton.click();
    }

    function search()
    {
      const searchInput = document.querySelector('.SearchBar-input input');
      searchInput.focus();
    }

    function openComment()
    {
      var answers = findAnswers(selectId);
      var comment = answers.getElementsByClassName('ContentItem-actions')[0].childNodes[1];
      comment.click();
    }

    function thank()
    {
      var answers = findAnswers(selectId);
      var thinkButton = answers.getElementsByClassName('ContentItem-actions')[0].childNodes[4];
      thinkButton.click();
    }

    function collection()
    {
      var answers = findAnswers(selectId);
      var thinkButton = answers.getElementsByClassName('ContentItem-actions')[0].childNodes[3];
      thinkButton.click();
    }

    function share()
    {
      var answers = findAnswers(selectId);
      var share = answers.getElementsByClassName('ContentItem-actions')[0].childNodes[2];
      var button = share.getElementsByTagName('button')[0];
      button.click();
    }

    function hotkey()
    {
      if(window.event.key=='s') {
        scFlag = 1;
      } else if(window.event.key=='f') {
        fxFlag = 1;
      } else if(scFlag == 1 && window.event.key=='c') {
        collection();
        scFlag = fxFlag = 0;
        return;
      } else if(fxFlag == 1 && window.event.key=='x') {
        share();
        scFlag = fxFlag = 0;
        return;
      }
      else {
        scFlag = fxFlag = 0;
      }

      switch (window.event.key) {
        case 'j':
          nextItem();
          break;
        case 'k':
          previousItem();
          break;
        case '/':
          search();
          break;
        case '?':
          break;
        case 'g':
          firstItem();
          break;
        case 'o':
          break;
        case 'c':
          openComment();
          break;
        case 'v':
          voteButtonUp();
          break;
        case 'd':
          voteButtonDown();
          break;
        case 't':
          thank();
          break;
        case 'G':
          lastItem();
          break;
        default:

      }
    }
})();
