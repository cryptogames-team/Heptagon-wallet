/*global chrome*/
import React, {useState, useEffect,useRef, forwardRef, } from 'react';
import './AddAccount.css';
const AddAccount = forwardRef((props, ref) =>{
    const setModalsState = props.setModalsState;
    const [accountName, setAccountName] = useState('');
    const [tid, setTid] = useState('');
    let fetchData_parent = props.fetchData;
    const handleAccountNameChange = (event) => {
        const value = event.target.value.replace(/[^a-zA-Z.1-5]/g, '');
        setAccountName(value);
    };
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
    async function account_store(new_account) {
  
        // 1. 현재 chrome.storage에 저장된 키 값들의 배열을 가져오고
        const result = await chrome.storage.local.get(["accounts"]);
        console.log("현재 저장된 accounts 값들",result);
        console.log(new_account)
        chrome.storage.local.set({selectAccount : new_account});
        const results = await chrome.storage.local.get(["selectAccount"]);
        console.log(results)
        let updateData = [];
        if(result.accounts) {
            //accounts라는 key의 데이터가 존재하지 않거나 해당 값의 값들이 배열이 아닐때.. 즉, 초기값일 때를 의미함.
            try {
                const accountsArray = result.accounts;
                if (Array.isArray(accountsArray)) {
                  updateData = accountsArray;
                  console.log("updateData에 과거 데이터 추가.")
                }
              } catch (error) {
                console.error("Error parsing keys:", error);
              }
        }
        console.log("updateData 확인 : ",updateData)
      
        
        // 2. 해당 배열에 새로 추가된 계정을 넣어준다
        updateData.push(new_account); // 기존 데이터를 추가해준다.
      
        
        // 3. 해당 배열을 chrome.storage에 다시 넣어준다. (갱신한다)
        await chrome.storage.local.set({accounts : updateData}); // 테스트를 위해 await 함
        const result2 = await chrome.storage.local.get(["accounts"]);
        console.log("갱신된 account 값들",result2);
      
        chrome.storage.local.set({request_state : "main"});
        
      }
    const createAccount = async () => {
        
        try {
          
          // 1. 저장된 니모닉과 계정 개수를 바탕으로 키를 생성한다.
          
          const result_user_mnemonic = await chrome.storage.local.get(["user_mnemonic"]); // 니모닉 가져오기
          const result_accounts = await chrome.storage.local.get(["accounts"]); // 계정 가져오기
    
          console.log("createAccount : result_user_mnemonic : ");
          console.log(result_user_mnemonic)
          console.log("createAccount : result_accounts : ");
          console.log(result_accounts)
    
          let account_num = 0; // 계정의 수 가져오기
          if(Object.keys(result_accounts).length !== 0) {
            account_num = result_accounts.accounts.length;
          }
          console.log("createAccount : 계정의 수 : "+account_num);
    
          
          // 2. 니모닉을 기반으로 키 생성을 요청한다. (니모닉 기반 키 요청)
          const url_for_key = "http://221.148.25.234:3100/key_create_from_mnemonic";
          const data_for_key = {
              mnemonic: result_user_mnemonic.user_mnemonic,
              num_child: account_num,
            };
          
          const keyData = await postJSON(url_for_key, data_for_key);
    
          const publicKey = keyData.keyPairs[0].publicKey;
          const privateKey = keyData.keyPairs[0].privateKey;
    
    
          // 2.5 해당 public 키로 설정된 계정이 있는지 조회한다. (공개키의 계정 여부 조회)
          const url_for_publicKeyAccount = "http://221.148.25.234:8989/getAccountList";
          const data_for_publicKeyAccount = {
              publicKey: publicKey
            };
          
          const result_publicKeyAccount = await postJSON(url_for_publicKeyAccount, {datas : data_for_publicKeyAccount});
          const publicKeyAccount = result_publicKeyAccount.accounts;
          console.log("createAccount : 계정조회 결과")
          console.log(publicKeyAccount)
          if(Array.isArray(publicKeyAccount) && publicKeyAccount.length !== 0) {
            console.log("이미 계정이 존재하는 public key입니다.")
            return;
          }    
    
    
          // 3. 해당 public key로 설정된 계정이 없다면 public과 private키를 기반으로 계정 생성을 요청한다..
          
          const createName = accountName // 계정이름
    
          const url_for_account = "http://221.148.25.234:8989/createAccount";
          const data_for_account = {
              createName: createName,
              publicKey: publicKey,
            };
    
          const response_account = await postJSON(url_for_account, {datas : data_for_account});
          if(response_account.status == "SUCCESS") {
              
            console.log("계정생성 성공")
            console.log("트랜잭션 아이디 : "+response_account.result.transaction_id);
            setTid(response_account.result.transaction_id)
            
            const new_account = {account_name : accountName, publicKey :publicKey, privateKey : privateKey }
            account_store(new_account); // 계정 생성에 성공하면 해당 계정을 storage에 저장한다.
            alert("계정생성에 성공하였습니다.");
            fetchData_parent();
            setModalsState(false);
          } else {
            alert("계정생성에 실패하였습니다.")
          }
    
        
        } catch (error) {
            alert("계정생성에 실패하였습니다.")
          console.error('Error fetching data:', error);
        }
      };
    return(
        <>
            <div className='add_account_container'>
                <div className='add_account_header'>
                    <span className='accounts_header_title'>계정 생성</span>
                    <span className='exit_btn' onClick={()=>{setModalsState(false)}}>X</span>
                </div>
                <div className='add_account_body'>
                    <input type='text' maxLength="12" value={accountName} id='account' onChange={handleAccountNameChange} className='input_account_name_to_add' placeholder='계정이름을 입력하세요(12자 이내)'></input>
                    <button className='add_account_btn' onClick={createAccount}>생성하기</button>
                </div>
            </div>
            
        </>
    );
});
  
export default AddAccount;