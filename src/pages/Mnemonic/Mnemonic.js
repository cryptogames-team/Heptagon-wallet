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
  import './Mnemonic.css';
  import Eye from '../../assets/eye.png'
  import Mnemonic2 from '../Mnemonic2/Mnemonic2'
  function CircleText(props) {
    return (
      <div className="circle-text-container">
        
            {props.words.map((word, index) => (
            <div key={index} className="circle-text-item blurred">
                {word}
            </div>
            ))}
            
            <div className='warning-text'>다른 사람이 이 화면을 보고 있지 않은지 확인하세요.</div>
            <img className='eye_img' src={Eye} style={{width:"30px",height:"30px"}}></img>
      </div>
    );
  }
export default function Mnemonic() {
    const recoveryWords = [
        'word1', 'word2', 'word3', 'word4',
        'word5', 'word6', 'word7', 'word8',
        'word9', 'word10', 'word11', 'word12',
      ];
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
                        <CircleText words={recoveryWords} />
                    </div>
                    <button onClick={() => goTo(Mnemonic2)} className='see_mnemonic_btn'>비밀번호 복구 구문 공개</button>
                </div>
            </div>
        </div>
        </>
    );
}