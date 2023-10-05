 /* 
    초기 설정 관련 파일. 설치 시, welcome 페이지를 띄워준다.
 */


chrome.runtime.onInstalled.addListener(() => {
    console.log("설치 완료3.")

    chrome.storage.local.get(['request_state'], (result) => {
        if(!result){
            chrome.storage.local.set({request_state : "init"}).then(() => {
                console.log("request_state에 init 저장...")
                chrome.tabs.create({ url: "index.html"}); // welcome 페이지를 띄어준다.
            })
        }
    });
    
});

 /* 
    뱃지를 눌렀을 때, 니모닉이 저장되어있다면 index 페이지를, 없다면 init 페이지를 설정해준다..
 */
chrome.action.onClicked.addListener(async (tab) => {

    console.log("팝업 클릭 이벤트!")
    
    const result = await chrome.storage.local.get("isMnemonicStore");
    console.log("니모닉 저장 여부");
    console.log(result)

    if(result.isMnemonicStore == true) {

        // 메인 페이지  (니모닉이 저장되어있을 때)
        chrome.action.setPopup({ popup: 'index.html' });
        chrome.storage.local.set({request_state : "main"}).then(() => {
            console.log("request_state에 main 저장...")
            chrome.action.openPopup();
        })

    } else {

        // 초기 페이지  (니모닉이 저장되어있지 않을 때)
        chrome.storage.local.set({request_state : "init"}).then(() => {
            console.log("request_state에 init 저장...")
            chrome.tabs.create({ url: "index.html"}); // welcome 페이지를 띄어준다.
        })
    }

  });




  