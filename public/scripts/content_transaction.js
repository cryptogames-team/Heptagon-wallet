console.log("지갑으로 스크립트 주입 : 크립토 익스플로러 - 트랜잭션 처리 ~ (content_transaction.js)")

const btn_transaction = document.getElementById("transaction");

if(btn_transaction != null) {
    //서비스 워커에게 데이터 요청.. 트랜잭션 처리를 위해 input 데이터의 값들을 읽어온 뒤, 서비스워커에 전달해준다.
    btn_transaction.addEventListener("click", function(event) {
    console.log("트랜잭션 버튼 클릭 이벤트 발생")

    const input_authName = document.getElementById("auth_name").value;
    const input_data = document.getElementById("data").value;    
    const input_actionAccount = document.getElementById("action_account").value;    
    const input_actionName = document.getElementById("action_name").value;

    console.log("input으로부터 읽은 데이터", input_authName, input_data, input_actionAccount, input_actionName)
    console.log(input_actionAccount)
    console.log(input_actionName)

    chrome.runtime.sendMessage(
        { action: "dapp_trx", auth_name : input_authName, data : input_data, action_account:input_actionAccount, action_name:input_actionName}, 
        (respoonse) => {
            console.log("클릭 이벤트 관련 서비스 워커로부터 응답")
            console.log(respoonse)
    });
  })


  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      
      if (request.action === "trx_complete_from_extension") {
        
        console.log("여기다 로직을 작성하면됨!")
        const buttonElement = document.getElementById('transaction_complete');
        const resultInput = document.getElementById('result');
        const statusInput = document.getElementById('status');

        if (buttonElement) {
          console.log(request.result)
          console.log(request.status)
          resultInput.value = JSON.stringify(request.result);
          statusInput.value = request.status;
          buttonElement.click(); // 이벤트 트리거 시켜주기

        } else {
            console.error('버튼을 찾을 수 없음');
        }
      }
        
    }
  );
  
} else {
  console.log("트랜잭션 버튼 없음")
}


