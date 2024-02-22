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
  import './RecoveryAccount2.css';
  import MainPage from '../MainPage/MainPage';

export default function RecoveryAccount2() {
    const [isChecked, setIsChecked] = useState(false);
    const [isRight, setIsRight] = useState(false);
    const [strength, setStrength] = useState("weak");
    const [Password, setPassWord] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
        console.log(isChecked)
    }
    const handleCreateNewWalletClick = async () => {
        if (isChecked && isRight) {
            chrome.runtime.sendMessage(
                { action: "password_store", password: Password}
            );

            const result_account = await chrome.storage.local.get(["accounts"]);
            chrome.storage.local.set({selectAccount : result_account.accounts[0]});
            const results = await chrome.storage.local.get(["selectAccount"]);
            console.log("전체 계정",result_account)
            console.log("첫번째 계정",result_account.accounts[0])
            console.log("현재 선택된 계정",results)

            chrome.storage.local.set({request_state : "main"});
            goTo(MainPage);
        }
    }
    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setPassWord(password)
        if (password.length >= 12 && /[A-Z]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            setStrength("safe"); // 안전
          } else if (password.length >= 8 && /[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            setStrength("normal"); // 보통
          } else {
            setStrength("weak"); // 약함
          }
    };
    const handleCheckPasswordChange = (e) => {
        const password = e.target.value;
        if(Password === password){
            setIsRight(true);
        }else{
            setIsRight(false);
        }
    };
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
      };

    return (
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
                    </div>
                    <div className='process_text_container'>
                        <div className='text_container2'>
                            <span className='text active'>비밀 복구 구문 확인</span>
                        </div>
                        <div className='text_container2'>
                            <span className='text active'>비밀번호 생성</span>
                        </div>
                    </div>
                    {/* 여기까지 번호박스 */}

                    <h2>비밀번호 생성</h2>
                    <span className='pw_content_text'>
                        이 비밀번호는 이 기기의 Heptagon Wallet의 잠금을 해제합니다.
                        Heptagon Wallet은 이 비밀번호를 복구할 수 없습니다.
                    </span>
                    <div className='register_form'>
                        <div className='new_pw_text_container'>
                            <span className='new_pw_text'>새 비밀번호(8자 이상)</span>
                            <span className='see_pw' onClick={toggleShowPassword}>{showPassword ? '숨기기' : '보기'}</span>
                        </div>
                        <input type={showPassword ? 'text' : 'password'} id='pw' className='input_pw' onChange={handlePasswordChange}></input>
                        <div className='password_strength_container'>
                            <span className='password_strength_title'>비밀번호 강도: <span className={`password_strength ${strength}`} id='password_strength'>
                                {strength === 'weak' && "약함"}
                                {strength === 'normal' && "보통"}
                                {strength === 'safe' && "안전"}
                                </span>
                            </span>
                            <span className='password_strength_content'>기기가 도난되거나 해킹되는 경우에 대비해 강력한 암호를 설정하면 지갑의 보안을 향상시킬 수 있습니다.</span>
                        </div>
                        <span className='check_pw_text'>비밀번호 확인</span>
                        <input type='password' id='check_pw' className='input_check_pw' onChange={handleCheckPasswordChange}></input>
                        <div className='check_container'>
                            <input type='checkbox' className='check_box' id='conditions_box' checked={isChecked} onChange={handleCheckboxChange}/>
                            <span className='check_content'>
                                Heptagon Wallet이 비밀번호를 복구할 수 없을을 이해합니다.
                            </span>
                        </div>
                        <button className={isRight&&isChecked ? 'create_new_wallet_btn checked' : 'create_new_wallet_btn'} onClick={handleCreateNewWalletClick}>새 지갑 생성</button>
                    </div>
                </div>
            </div>
        </>       
    )
}