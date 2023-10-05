/*
    새로운 탭 만들어 주는 예제
*/

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

    if (message.action === "tab_create") {

        chrome.tabs.create({ url: "hello2.html"});
        sendResponse("hello2.html 오픈.");

        return true; // 비동기 통신과 연관이 있다.
    }
 
});