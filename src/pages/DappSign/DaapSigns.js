/*global chrome*/
import React, { useEffect, useState } from 'react';
import {
    goBack,
    goTo,
    popToTop,
    Link,
    Router,
    getCurrent,
    getComponentStack,
  } from 'react-chrome-extension-router';
  // css 모음
import './DappSign.css'
import Logo from '../../assets/heptagon_logo_final.png';

export default function DappSigns() {
    const handleRequestTrx = () => {
        
        chrome.runtime.sendMessage(
            { action: "trxs_request"}
        );
    };

    const handleCloseTrx = () => {
        
        chrome.runtime.sendMessage(
            { action: "trx_close"}
        );
    };
    return(
        <>
            <div className='sign_container'>
                <div className='sign_headers'>
                    <span className='sign_title'>서명 요청</span>
                    <span className='sign_content'>요청하는 사이트를 신뢰하고 그 내용을 완전히 이해하는 경우에만 이 메시지에 서명하세요.</span>
                    <span className='sign_content_child'>서명 중입니다.</span>
                </div>
                <div className='sign_body'>
                    <div className='sign_message'>
                        메시지 :
                        <br></br><br></br>
                        Heptagon의 WEB3 세계에 오신걸 환영합니다!
                        <br></br><br></br>
                        트랜잭션을 요청합니다.
                        <br></br><br></br>
                        해당 요청은 계정의 cpu와 net의 스테이킹을 필요로 합니다.
                    </div>
                </div>
                <div className='sign_footer'>
                    <button className='cancel_login_btn'  onClick={handleCloseTrx}>취소</button>
                    <button className='login_btn' onClick={handleRequestTrx}>서명</button>
                </div>
            </div>
        </>
    );
}