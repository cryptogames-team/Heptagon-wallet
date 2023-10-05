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
import './DappLogin.css'
import Logo from '../../assets/heptagon_logo_final.png';
  function ShortenKey({ keyString }) {
    const maxLength = 10; // 원하는 최대 길이
  
    if (keyString.length <= maxLength) {
      return <span>({keyString})</span>;
    }
  
    const shortenedKey = `${keyString.substring(0, maxLength / 2)}...${keyString.substring(keyString.length - maxLength / 2)}`;
  
    return <span className='public_keys'>({shortenedKey})</span>;
  }



export default function DaapLogin() {
    const [choiceAccount, setChoiceAccount] = useState('');
    const [accounts, setAccounts] = useState([]);
    useEffect(() => {
        chrome.storage.local.get(['accounts'], (result) => {
            const storedData = result.accounts; 
            let updateData = [];
            updateData = storedData;
            
            setAccounts(updateData);
            console.log(updateData);           
          });


    }, [])
    
    const handleChoiceAccount = (account) => {
        setChoiceAccount(account);
    };

    const handleCloseLogin = () => {
        
        chrome.runtime.sendMessage(
            { action: "login_close"}
        );
    };
    const handleRequestLogin = () => {
        if(choiceAccount){
            chrome.storage.local.set({selectAccount : choiceAccount});
            chrome.runtime.sendMessage(
                { action: "login_request", account_name : choiceAccount.account_name, public_key : choiceAccount.publicKey}
            );
        }else {
            alert("계정을 선택해주세요.");
        }
        
    };
    return(
        <>
            <div className='login_container'>
                <div className='login_headers'>
                    <span className='login_title'>Heptagon으로 연결</span>
                    <span className='login_content'>계정 선택</span>
                </div>
                <div className='login_body'>
                    {accounts.map((account, index) => (
                        <div className='account_item_box'>
                            <input type='radio' onChange={()=>handleChoiceAccount(account)} checked={choiceAccount === account}></input>
                            <img className='account_img' src={Logo}></img>
                            <span className='account_name'>{account.account_name}</span>
                            <ShortenKey keyString={account.publicKey}/>
                        </div>
                    ))}
                </div>
                <div className='login_footer'>
                    <button className='cancel_login_btn' onClick={handleCloseLogin}>취소</button>
                    <button className='login_btn' onClick={handleRequestLogin}>연결</button>
                </div>
            </div>
        </>
    );
}