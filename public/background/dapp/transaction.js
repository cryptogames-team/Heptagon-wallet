/*
    디앱 트랜잭션 관련 파일
*/

let popupWindow = null; // 팝업창의 id를 저장한다.
let tab_id_vote = null; // 해당 버튼을 누른 tab의 id를 저장한다.

let auth_name = null;
let data = null;
let action_account = null;
let action_name = null;

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

    
    if (message.action === "dapp_trx") {
        // 디앱 트랜잭션 요청 시

        auth_name = message.auth_name;
        data = JSON.parse(message.data);
        action_account = message.action_account;
        action_name = message.action_name; // 정보 저장

        // request_state 저장. 이 정보를 통해 index.html이 팝업창에 어떤 ui를 띄어줄지 결정한다.        
        chrome.storage.local.set({request_state : "dapp_trx"}).then(() => {
            
            console.log("request_state에 dapp_transaction 저장...")
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
            tab_id_vote = tabs[0].id;
            console.log("tab id 저장.", tab_id_vote)
            // 여기에서 tab 변수를 사용하여 원하는 작업을 수행
          });


        sendResponse("디앱 트랜잭션 처리를 위한 index.html 오픈.");

    
    } else if(message.action === "trx_request") {

        console.log("트랜잭션 처리 요청. 계정 정보 조회...")

        // 선택된 계정의 이름과 public 키
        trx_process();


    } else if(message.action === "trx_close") {

        console.log("트랜잭션 팝업 창 닫기. ")
        console.log(popupWindow)

        chrome.windows.remove(popupWindow, function() {
            console.log("로그인 팝업 창 닫기 완료 ")            
        });
    }
 
});

// 버튼을 누르면 input태그에 있는 auth_name, data, action_account, action_name을 가져온다.
async function trx_process() {

    // 계정들을 가져오고
    const result_accounts = await chrome.storage.local.get(['accounts']);
    const accounts = result_accounts.accounts;

    console.log("계정 가져오기");
    console.log(accounts);

    // 그 중에서 account_name에 매칭되는 privateKey를 추출한다.
    const filteredData = accounts.filter(item => item.account_name === auth_name);

    if (filteredData.length < 0) {
        console.log('일치하는 데이터를 찾을 수 없습니다.');
        return false;
    }

    console.log(filteredData);
    const senderPrivateKey = filteredData[0].privateKey;
    console.log("가지고 온 privateKey "+senderPrivateKey)

    const url = "http://221.148.25.234:8989/startTransaction";
    const datas = {
        senderPrivateKey,
        action_account,
        action_name,
        auth_name,
        data
    };
    
    const response = await postJSON(url, {datas : datas});
    trx_complete(response);    
}

function trx_complete (data) {

    chrome.tabs.sendMessage(tab_id_vote, { 
        action: "trx_complete_from_extension", 
        result: data.result,
        status : data.status}, (response) => {
        
        // 여기에서 response를 사용하여 원하는 작업을 수행
        console.log("콘텐츠 스크립트로 데이터 전송..", response)

        chrome.storage.local.set({request_state : "main"});
        chrome.windows.remove(popupWindow, function() {
            console.log("트랜잭션 팝업 창 닫기 완료 ")            
        });
      });      
}

async function postJSON(url = "", data = {}) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      console.log("postJSON Success:", result);
      return result;
      
    } catch (error) {
      console.error("postJSON Error:", error);
    }
  }
