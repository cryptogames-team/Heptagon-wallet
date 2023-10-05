/*
    계정 정보 조회 리스너 모음
    서비스 워커의 리스너. 
    dom 요소에 접근 못하기 때문에 콘텐츠 스크립트에게 정보를 보내주어야한다.

    fetch 메서드를 사용해서 api 서버와 통신한 뒤, 해당 응답값을 클라이언트로 전송해준다.
    message 를 통해 콘텐츠 스크립트로부터 요청값을 전달 받고, sendResponse를 통해 응답값을 콘텐츠 스크립트에 보내준다.
*/

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    
    
    if (message.action === "api_request") {

        // API의 URL
        const apiUrl = "http://221.148.25.234:3100/mnemonic_create";

        // fetch 함수를 사용하여 API 요청 보내기
        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                // 응답을 JSON으로 파싱
                return response.json();
            })
            .then(data => {
                // API 응답 데이터 처리
                console.log("API 응답 데이터:", data);
                sendResponse(data)
            })
            .catch(error => {
                // 에러 처리
                console.error("API 요청 중 에러:", error);
            });

        return true; // 비동기 통신과 연관이 있다.
    }
});