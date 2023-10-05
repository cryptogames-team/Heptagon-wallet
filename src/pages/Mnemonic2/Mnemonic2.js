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
  import './Mnemonic2.css';
  import axios from 'axios';
  import CheckMnemonic from '../CheckMnemonic/CheckMnemonic'
  function CircleText2(props) {
    return (
      <div className="circle-text-container">
        
            {props.words.map((word, index) => (
            <div key={index} className="circle-text-item">
                {word}
            </div>
            ))}
      </div>
    );
  }

  export default function Mnemonic2() {
    const [recoveryWords, setRecoveryWords] = useState([]);

    useEffect(() => {
      // 컴포넌트가 처음 렌더링될 때 데이터 가져오기
      fetchData();
    }, []);
  
  
    const fetchData = async () => {
      try {
        const response = await axios.post('http://221.148.25.234:3100/mnemonic_create');
        const mnemonicArray = response.data.mnemonic.split(' ');
        console.log(mnemonicArray);
        setRecoveryWords(mnemonicArray);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    return(
        <>
        <div className='body'>
            <div className='container'>
                <div className='process_container'>
                    <div className='radius_container clear'>
                        <span className='box clear'>1</span>
                    </div>
                    <div className='line clear'></div>
                    <div className='radius_container active'>
                        <span className='box active'>2</span>
                    </div>
                    <div className='line'></div>
                    <div className='radius_container'>
                        <span className='box'>3</span>
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
                        <span className='text'>비밀 복구 구문 확인</span>
                    </div>
                </div>
                {/* 여기까지 번호박스 */}
                <h2>비밀 복구 구문 기록</h2>
                <span className='mnemonic_content'>
                    12단어 비밀 복구 구문을 기록하고 본인만 접근 가능한, 믿을 만한 장소에 저장하세요.
                </span>
                <div className='tip_container'>
                    <span className='tip'>팁 :</span>
                    <ul>
                        <li>비밀번호 관리자에 저장</li>
                        <li>대여 금고에 보관</li>
                        <li>적어서 여러 비밀 장소에 보관하세요</li>
                    </ul>
                    <div className='mnemonic_container'>
                        <CircleText2 words={recoveryWords} />
                    </div>
                    <button onClick={() => goTo(CheckMnemonic,recoveryWords)} className='see_mnemonic_btn'>다음</button>
                </div>
            </div>
        </div>
        </>
    );
  }