console.log("지갑으로 스크립트 주입 : 크립토 익스플로러 - 트랜잭션 처리 ~ (content_transactions.js)")
window.onload = function () {
  // 페이지가 로드된 후에 실행할 코드

  transactions_inject();

};

const max_count = 15;
let current_count = 0;
function transactions_inject() {
  const btn_transactions = document.getElementById("transactions");

  if (btn_transactions != null) {
    //서비스 워커에게 데이터 요청.. 트랜잭션 처리를 위해 input 데이터의 값들을 읽어온 뒤, 서비스워커에 전달해준다.
    console.log(`transactions 버튼에 스크립트 주입 성공`);
    btn_transactions.addEventListener("click", function (event) {
      console.log("트랜잭션 버튼 클릭 이벤트 발생")

      const input_authName_for_multi = document.getElementById("auth_name_for_multi").value;
      const input_datas_for_multi = document.getElementById("datas_for_multi").value;

      console.log("input으로부터 읽은 데이터", input_authName_for_multi, input_datas_for_multi)
      console.log(input_authName_for_multi)
      console.log(input_datas_for_multi)

      chrome.runtime.sendMessage(
        { action: "dapp_trxs", auth_name: input_authName_for_multi, datas: input_datas_for_multi },
        (respoonse) => {
          console.log("클릭 이벤트 관련 서비스 워커로부터 응답")
          console.log(respoonse)
        });
    })


    chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {

        if (request.action === "trxs_complete_from_extension") {

          console.log("여기다 로직을 작성하면됨!")
          const buttonElement = document.getElementById('transaction_complete_for_multi');
          const resultInput = document.getElementById('result_for_multi');
          const statusInput = document.getElementById('status_for_multi');

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
    // console.log("멀티 트랜잭션 버튼 없음")
    // console.log('Div가 주입 재시도');
    if(current_count < max_count) {
      current_count++;
      setTimeout(transactions_inject, 1000); // 1초마다 다시 시도
    }
    
  }

}



