/*
    비밀번호를 크롬 스토리지에 저장한다.
*/

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

    
    if (message.action === "password_store") {
        // 비밀번호 저장

        chrome.storage.local.set({password : message.password}).then(() => {
            console.log("비밀번호 저장")
            console.log(message.password)
        })

    }
 
});