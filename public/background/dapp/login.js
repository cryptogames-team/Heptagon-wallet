/*
    디앱 로그인 관련 파일
*/

let popupWindow = null;
let tab_id = null;
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

    
    if (message.action === "dapp_login") {
        // 디앱 로그인 요청 시
        
        chrome.storage.local.set({request_state : "dapp_login"}).then(() => {
            
            console.log("request_state에 dapp_login 저장...")
            chrome.windows.create({
                url: "index.html",
                type: "popup",
                width: 400,
                height: 600
              }, function(data) {
                popupWindow = data.id;
                console.log(popupWindow)
              });
            
        })

        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
            tab_id = tabs[0].id;
            console.log("tab id 저장.", tab_id)
            // 여기에서 tab 변수를 사용하여 원하는 작업을 수행
          });


        sendResponse("디앱 로그인을 위한 index.html 오픈.");
    
    } else if(message.action === "login_request") {

        console.log("로그인 요청. 계정 정보 조회...")

        // 선택된 계정의 이름과 public 키
        const accountName = message.account_name;
        const publicKey = message.public_key;
        console.log(accountName)
        process_login(accountName, publicKey);

        
    } else if(message.action === "login_close") {

        console.log("로그인 팝업 창 닫기. ")
        console.log(popupWindow)

        chrome.windows.remove(popupWindow, function() {
            console.log("로그인 팝업 창 닫기 완료 ")            
        });
    }


    // return true; // 비동기 통신과 연관이 있다.
});


function process_login(accountName, publicKey) {
    chrome.storage.local.set({request_state : "main"});

    chrome.tabs.sendMessage(tab_id, { 
        action: "login_complete_from_extension", 
        account_name: accountName,
        public_key : publicKey}, (response) => {
        
        // 여기에서 response를 사용하여 원하는 작업을 수행
        console.log("콘텐츠 스크립트로 데이터 전송..", response)

        chrome.windows.remove(popupWindow, function() {
            console.log("로그인 팝업 창 닫기 완료 ")            
        });
      });
}