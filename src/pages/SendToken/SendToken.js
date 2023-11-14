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
  import './SendToken.css';
  import Logo from '../../assets/heptagon_logo_final.png';
  import DownArrow from '../../assets/down_arrow.png';
  import More from '../../assets/more.png';
  import axios from 'axios';
  import { Api, JsonRpc, RpcError } from 'eosjs';
  import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig.js';
  import { Buffer } from 'buffer';
    var global = global || window;
    global.Buffer = global.Buffer || require("buffer").Buffer;
    const rpc = new JsonRpc('http://14.63.34.160:8888');

  export default function MainPage() {
    const [account, setAccount] = useState([]);
    const [selectedTab, setSelectedTab] = useState('Account');
    const [inputValue, setInputValue] = useState('');
    const [inputAccount, setInputAccount] = useState('');
    const [privateKey,setPrivateKey] = useState('');
    const fetchData = async () => {
        try {
          const result = await chrome.storage.local.get(["selectAccount"]);
          try{
            const account_request = await rpc.get_account(result.selectAccount.account_name);
            setAccount(account_request);
            const account_result = account_request;
            setPrivateKey(result.selectAccount.privateKey);
            setAccount(account_result);
          }catch(error){
            console.log(error);
          }
          
        } catch (error) {
          console.error('Error fetching transaction data:', error);
        }
      };
    useEffect(() => {
        fetchData(); 
      },[]);

      const handleChange = (e) => {
        let newValue = e.target.value;

        // 입력된 값이 숫자가 아닌 경우에만 상태를 업데이트
        if (!isNaN(newValue)) {
            const balanceNumber = parseFloat(account.core_liquid_balance.match(/\d+\.\d+/)[0]);
            if(parseFloat(newValue) > balanceNumber){
                newValue = balanceNumber;
                setInputValue(newValue);
            }else {
                setInputValue(newValue);
            }
          
        }
      }
      const handleAccountChange = (e) => {
        let newValue = e.target.value;
        setInputAccount(newValue);
      }
      const sendTokenEvent = async () => {{
        const signatureProvider = new JsSignatureProvider([privateKey]);
        const hep = new Api({rpc,signatureProvider});
        try {
          const result = await hep.transact({
              actions: [{
                account: 'eosio.token',
                name: 'transfer',
                authorization: [{
                  actor: account.account_name,
                  permission: 'active',
                }],
                data: {
                  from: account.account_name,
                  to: inputAccount,
                  quantity: inputValue + ".0000" + ' HEP',
                  memo: "sendToken",
                },
              }]
            }, {
              blocksBehind: 3,
              expireSeconds: 30,
            });
            alert("토큰 전송에 성공하였습니다.")
            goBack();
      }catch(error){
        alert("토큰 전송에 실패하였습니다.")
        console.log(error);
      }
      }}
    return(
        <>
            <div className='main-body'>
                <div className='main-big-header'>
                    <img className='main-logo' src={Logo}></img>
                    <span className='main-logo_title'>Heptagon</span>
                </div>
                <div className='main-header'>
                    <span className='account_box'>{account.account_name}<img src={DownArrow} className='arrow-down'></img></span>
                    <img src={More} className='more'></img>
                </div>
                <div className='send_token_container'>
                    <div className='send_text_container'>
                        <span className='send_text'>보낼 대상:</span>
                        <span className='cancel'  onClick={()=>{goBack()}}>취소</span>
                    </div>
                    <div className='input_account_container'>
                        <input type='text'onChange={handleAccountChange} value={inputAccount} className='input_acccount' placeholder='상대방의 계정을 입력해주세요'></input>
                    </div>
                    <span className='send_text'>보내기</span>
                    <div className='balance_container2'>
                        <span className='balance_container_text'>자산:</span>
                        <span className='balance_empty'></span>
                        <div className='balance_container_box'>
                            <img src={Logo} className='balance_symbol'></img>
                            <div className='balance_quantity_box'>
                                <span className='balance_quantity_symbol'>HEP</span>
                                <span className='balance_quantity'>잔액:  &nbsp; &nbsp;&nbsp;{account.core_liquid_balance}</span>
                            </div>
                        </div>
                    </div>
                    <div className='quantity_container'>
                    <span className='balance_container_text'>금액:</span>
                            <span className='balance_empty'><span className='empty_box' onClick={()=>{setInputValue(parseFloat(account.core_liquid_balance))}}>최대</span></span>
                            <div className='input_quantity_container'>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={handleChange}
                                    className='input_quantity'
                                    placeholder='0'
                                />
                                <span className='input_symbol'>HEP</span>
                            </div>
                    </div>
                    <div className='token_line'></div>
                    <div className='btn_container'>
                        <button className='cancel_button' onClick={()=>{goBack()}}>취소</button>
                        <button className='send_button' onClick={()=>sendTokenEvent()}>보내기</button>
                    </div>
                </div>
            </div>
        </>
    );
  }