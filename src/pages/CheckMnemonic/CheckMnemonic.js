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
  import './CheckMnemonic.css';
  import axios from 'axios';
  import CreateAccount from '../CreateAccount/CreateAccount'

  function getRandomIndices(array, count) {
    const length = array.length;
    const indices = [];
    
    while (indices.length < count) {
      const index = Math.floor(Math.random() * length);
      if (!indices.includes(index)) {
        indices.push(index);
      }
    }
    
    return indices;
  }

  function CircleText2(props) {

    const selectedIndices = props.selectedWords.map(item => item.index);
  
  
    return (
      <div className="circle-text-container">
             {props.words?.map((word, index) => (
              
              selectedIndices.includes(index) ? (
                <div key={index} className="circle-text-confirm-item">
                  <span className="circle-text-index">{index + 1}.</span>
      
                    <input
                      className="circle-text-input"
                      type="text"
                      value={word}
                      onChange={event => props.handleWordChange(index, event.target.value)}
                    />
                </div>
              ) : (
                <div key={index} className="circle-text-item">
                  <span className="circle-text-index">{index + 1}.</span>
      
                    <input
                      className="circle-text-input"
                      type="text"
                      value={word}
                      readOnly
                    />
                </div>
                )
                             
            ))}
      </div>
    );
  }
  export default function CheckMnemonic(message) {
    const [recoveryWords, setRecoveryWords] = useState([]);
    const [confirmWords, setConfirmWords] = useState([]);
    const [selectedWords, setSelectedWords] = useState([]);
    
    const [isCorrect, setIsCorrect] = useState(false); // 사용자가 니모닉 검증을 완료했는지 알아내는 변수

    const handleInitMnemonic = async () => {
        console.log("니모닉을 크롬 스토리지에 저장")
        console.log(recoveryWords)
       
        // 니모닉 저장 요청
        await chrome.storage.local.set({user_mnemonic : recoveryWords});
        const mnemonic_result = await chrome.storage.local.get(["user_mnemonic"]);
        console.log("mnemonic 저장..")
        console.log(mnemonic_result)
    
        await chrome.storage.local.set({isMnemonicStore : true});
        const isMnemonicStore_result = await chrome.storage.local.get(["isMnemonicStore"]);
        console.log("isMnemonicStore 저장..")
        console.log(isMnemonicStore_result)
        
        goTo(CreateAccount);
        
      };
    
      const handleWordChange = (index, value) => {
        const newWords = [...confirmWords];
        newWords[index] = value;
    
        setConfirmWords(newWords);
      };

        // 전달받은 니모닉을 저장하고, 검증할 단어들을 추리는 작업
  useEffect(() => {
    const words = Object.values(message).slice(0, 12); // 전달받은 니모닉
    
    setRecoveryWords(words); // 저장, 비동기적..

    const randomIndices = getRandomIndices(words, 3);
    const selected = randomIndices.map(index => {
      return {
        index: index,
        word: words[index]
      };
    });

    console.log("선택된 값들 : ",selected)
    setSelectedWords(selected); // 저장, 비동기적..


    const modifiedWords = [...words]; // words 배열을 복사하여 수정할 배열 생성
    selected.forEach(item => {
      if (item.index !== null) {
        modifiedWords[item.index] = ''; // 해당 인덱스의 값을 null로 변경
      }
    });

    setConfirmWords(modifiedWords);

    

  }, [message]); // 이 부분에서 message가 변경될 때만 실행

  
  // 사용자가 니모닉 단어를 입력할 때마다 검증해주는 메서드
  useEffect(() => {
    
    if (recoveryWords.length === 0 || confirmWords.length === 0) {
      setIsCorrect(false);
      return;
    }

    const isEqual = recoveryWords.every((value, index) => value === confirmWords[index]);
    if(isEqual) {
      setIsCorrect(true);
    }

  }, [confirmWords, recoveryWords]);
    return(
        <>
            <div className='body'>
                <div className='container'>
                    <div className='process_container'>
                        <div className='radius_container clear'>
                            <span className='box clear'>1</span>
                        </div>
                        <div className='line clear'></div>
                        <div className='radius_container clear'>
                            <span className='box clear'>2</span>
                        </div>
                        <div className='line clear'></div>
                        <div className='radius_container active'>
                            <span className='box active'>3</span>
                        </div>
                    </div>
                    <div className='process_text_container'>
                        <div className='text_container'>
                            <span className='text active'>비밀번호 생성</span>
                        </div>
                        <div className='text_container'>
                            <span className='text active'>보안 지갑</span>
                        </div>
                        <div className='text_container'>
                            <span className='text active'>비밀 복구 구문 확인</span>
                        </div>
                    </div>
                    {/* 여기까지 번호박스 */}
                    <h2>비밀 복구 구문 기록</h2>
                    <span className='h2_mini'>비밀 복구 구문 확인</span>
                    <div className='mnemonic_container'>
                        <CircleText2 words={confirmWords} selectedWords={selectedWords} handleWordChange={handleWordChange} />
                    </div>
                    <button onClick={handleInitMnemonic} disabled={!isCorrect} className={isCorrect ? 'start_create_btn checked' : 'start_create_btn'}>확인</button>
                </div>
            </div>
        </>
    );
  }