import React, { useState } from 'react';
import './StartApp.css';
import Logo from '../../assets/heptagon_size.png';
import BlockChain from '../../assets/blockchain.png';
import CreatePW from '../CreatePW/CreatePW'
import {
    goBack,
    goTo,
    popToTop,
    Link,
    Router,
    getCurrent,
    getComponentStack,
  } from 'react-chrome-extension-router';
export default function StartApp() {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
        console.log(isChecked)
    }

    const handleCreateWalletClick = () => {
        if (isChecked) {
            goTo(CreatePW);
        }
    }

    const handleGetWalletClick = () => {
        if (isChecked) {
            console.log('기존 지갑 가져오기 버튼 클릭');

        }
    }
    return (
        <>
            <div className='body'>
                <div className='container'>
                    <span className='start_text'>시작하기</span>
                    <span className='content'>저희 Heptagon Wallet은 Heptagon 블록체인이 Web3의 세계에 접근할 수 있도록 하는 안전한 지갑입니다.</span>
                    <img src={BlockChain}></img>
                    <div className='conditions_container'>
                        <input type='checkbox' id='conditions_box' checked={isChecked} onChange={handleCheckboxChange}/>
                        <span className='conditions_text'>Heptagon Wallet <span className='link'>이용약관</span>에 동의합니다.</span>
                    </div>
                    <button className={isChecked ? 'create_wallet_btn checked' : 'create_wallet_btn'} onClick={handleCreateWalletClick}>새 지갑 생성</button>
                    <button className={isChecked ? 'get_wallet_btn checked' : 'get_wallet_btn'} onClick={handleGetWalletClick}>기존 지갑 가져오기</button>
                </div>
            </div>
        </>       
    )
}