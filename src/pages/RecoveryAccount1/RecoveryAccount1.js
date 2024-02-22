/*global chrome*/
import React, { useState,useEffect } from 'react';
import {
    goBack,
    goTo,
    popToTop,
    Link,
    Router,
    getCurrent,
    getComponentStack,
  } from 'react-chrome-extension-router';
  import './RecoveryAccount1.css';
  import RecoveryAccount2 from '../RecoveryAccount2/RecoveryAccount2'


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

  function CircleText(props) {
    return (
      <div className="circle-text-container">
        
            {props.words.map((word, index) => (
              <div key={index} className="circle-text-confirm-item2">
                <input className="circle-text-input" type='text' value={word} onChange={event => props.handleWordChange(index, event.target.value)} />
              </div>
            
            ))}
      </div>
    );
  }
  export default function RecoveryAccount1(message) {

    const [recoveryWords, setRecoveryWords] = useState([
      '', '', '', '',
      '', '', '', '',
      '', '', '', '',
    ]);

    const handleRecoveryAccount = async () => {
        console.log("니모닉 유효성 검증 후 계정 복구");
        console.log(recoveryWords);

        // 니모닉 기반 계정 복구 api 요청
        const url_for_recovery = "http://221.148.25.234:3100/recovery_accounts";
          const data_for_recovery = {
              mnemonic: recoveryWords
            };
          
        const keyData = await postJSON(url_for_recovery, data_for_recovery);

        console.log(`keyData`, keyData);

        if(keyData.isSuccess == false) {
          alert(keyData.msg);
          return;
        }
  
       
        // 니모닉 저장 요청
        await chrome.storage.local.set({user_mnemonic : recoveryWords});
        const mnemonic_result = await chrome.storage.local.get(["user_mnemonic"]);
        console.log("mnemonic 저장..")
        console.log(mnemonic_result)

        // 계정 저장
        await chrome.storage.local.set({accounts : keyData.data}); // 테스트를 위해 await 함
        const result2 = await chrome.storage.local.get(["accounts"]);
        console.log("갱신된 account 값들",result2);
        
        goTo(RecoveryAccount2);
        
      };
    
      const handleWordChange = (index, value) => {
    
        setRecoveryWords(prev => {
          return prev.map((item, i) => {
            if(index == i){
              return value              
            }
            return item;
          })
        });

      };


    return(
        <>
            <div className='body'>
                <div className='container'>
                    <div className='process_container'>
                        <div className='radius_container active'>
                            <span className='box active'>1</span>
                        </div>
                        <div className='line'></div>
                        <div className='radius_container'>
                            <span className='box'>2</span>
                        </div>
                    </div>
                    <div className='process_text_container'>
                        <div className='text_container2'>
                            <span className='text active'>비밀 복구 구문 확인</span>
                        </div>
                        <div className='text_container2'>
                            <span className='text'>비밀번호 생성</span>
                        </div>
                    </div>
                    {/* 여기까지 번호박스 */}
                    <h2>비밀 복구 구문으로 지갑에 액세스하세요.</h2>
                    <span className='h2_mini'>Hetagon Wallet은 사용자의 비밀번호를 복구할 수 없습니다. 사용자의 비밀복구구문을 이용하여 사용자의 소유권을 확인한 후, 지갑을 복구하고 새 비밀번호를 설정해 드립니다. 먼저 지갑을 생성할 때 받은 비밀복구구문을 입력하세요.</span>
                    <div className='mnemonic_container'>
                      <CircleText words={recoveryWords} handleWordChange={handleWordChange}/>
                    </div>
                    <button onClick={handleRecoveryAccount} className={'start_create_btn checked'}>확인</button>
                </div>
            </div>
        </>
    );
  }