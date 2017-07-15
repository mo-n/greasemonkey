// ==UserScript==
// @name         知乎新版添加快捷键
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为新版知乎添加快捷键
// @author       You
// @match        *://www.zhihu.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let selectId = 0;
    let gFlag = false, scFlag = false, fxFlag = false;
    let listItems;
    const answerClass = getAnswerClass();
    // add hotkey event
    document.onkeydown = hotkey;
    const mainTag = document.getElementsByTagName("main")[0];
    mainTag.addEventListener('mouseover', mouseoverEvent, true);
    const observer = new MutationObserver(setAnswersitems);
    observer.observe(mainTag, { childList: true, subtree: true });

    function setAnswersitems() {
      let items;
      items = document.querySelectorAll(`.${answerClass}`);
      if(!items) return -1;
      listItems = items;
    }

    function setSelectId(value){
      const newId = Number(value);
      if (isNaN(newId)) return;
      selectId = newId;
    }

    function getAnswerClass() {
      if(/^(http|https):\/\/www.zhihu.com(\/)?$/.test(window.location.href)) { // 匹配主页
        return 'TopstoryItem';
      }
      else if (/^(http|https):\/\/www.zhihu.com\/question\/*/.test(window.location.href)) { //匹配问题页面
        return 'AnswerItem';
      }
    }

    function mouseoverEvent(e){
      mainTag.removeEventListener('mouseover', mouseoverEvent, true);
      let element = e.target;
      setSelectId(parents(element));
      setTimeout(function() {
        mainTag.addEventListener('mouseover', mouseoverEvent, true);
      }, 3000);
    }

    function parents(element){
      let parent = element.parentNode;
      if(!parent || !listItems) {
        return NaN;
      }
      if(!parent.className || !parent.className.includes(answerClass)){
        return parents(parent);
      }
      return Array.from(listItems).findIndex(elm=>elm === parent
      );
    }

    function findAnswers(count) {
      if(!listItems) {
        setAnswersitems();
      }
      return listItems[count];
    }

    function answersCount() {
      if(!listItems) {
        setAnswersitems();
      }
      return listItems.length-1;
    }

　　function getElementTop(element){
      let actualTop = element.offsetTop;
      let current = element.offsetParent;
      while (current !== null){
        actualTop += current.offsetTop;
        current = current.offsetParent;
      }
      return actualTop;
　　}

    function setLocation(id) {
      let element = findAnswers(id);
      const elementTop = getElementTop(element);
      window.scrollTo(0, elementTop-70);
    }

    function nextItem() {
      let length = answersCount();
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
      if(gFlag){
        gFlag = false;
        setSelectId(0);
        setLocation(selectId);
      }
      gFlag = true;
    }

    function lastItem(){
      setSelectId(answersCount());
      setLocation(selectId);
    }

    function voteButtonUp() {
      let answers = findAnswers(selectId);
      let voteButton = answers.getElementsByClassName('VoteButton--up')[0];
      voteButton.click();
    }

    function voteButtonDown() {
      let answers = findAnswers(selectId);
      let voteButton = answers.getElementsByClassName('VoteButton--down')[0];
      voteButton.click();
    }

    function search()
    {
      const searchInput = document.querySelector('.SearchBar-input input');
      searchInput.focus();
    }

    function openComment()
    {
      let answers = findAnswers(selectId);
      let comment = answers.getElementsByClassName('ContentItem-actions')[0].childNodes[1];
      comment.click();
    }

    function thank()
    {
      let answers = findAnswers(selectId);
      let thinkButton = answers.getElementsByClassName('ContentItem-actions')[0].childNodes[4];
      thinkButton.click();
    }

    function collection()
    {
      let answers = findAnswers(selectId);
      let thinkButton = answers.getElementsByClassName('ContentItem-actions')[0].childNodes[3];
      thinkButton.click();
    }

    function share()
    {
      let answers = findAnswers(selectId);
      let share = answers.getElementsByClassName('ContentItem-actions')[0].childNodes[2];
      let button = share.getElementsByTagName('button')[0];
      button.click();
    }

    function hotkey()
    {
      if(window.event.altKey || window.event.ctrlKey) return;

      if(window.event.key =='s') {
        scFlag = true;
      } else if(window.event.key =='f') {
        fxFlag = true;
      } else if(scFlag && window.event.key=='c') {
        scFlag = fxFlag = false;
        collection();
        return;
      } else if(fxFlag && window.event.key=='x') {
        scFlag = fxFlag = false;
        share();
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
