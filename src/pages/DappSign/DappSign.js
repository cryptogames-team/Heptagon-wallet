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
import { Api, JsonRpc, RpcError } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig.js';

  var global = global || window;
  global.Buffer = global.Buffer || require("buffer").Buffer;
  const rpc = new JsonRpc('http://14.63.34.160:8888');
export default function DappSign() {
    const [privateKey,setPrivateKey] = useState('');
    const [authName,setAuthName] = useState('');
    const [actionData,setActionData] = useState('');
    const [actionName,setActionName] = useState('');
    const [actionAccount,setActionAccount] = useState('');
    const handleRequestTrx = () => {
        
        chrome.runtime.sendMessage(
            { action: "trx_request"}
        );
    };

    const handleCloseTrx = () => {
        
        chrome.runtime.sendMessage(
            { action: "trx_close"}
        );
    };
    const startTransaction = async () => {
        const signatureProvider = new JsSignatureProvider([privateKey]);
        const hep = new Api({rpc,signatureProvider});
        try {
            const result = await hep.transact({
                actions: [{
                  account: actionAccount,
                  name: actionName,
                  authorization: [{
                    actor: authName,
                    permission: 'active',
                  }],
                  data: actionData,
                }]
              }, {
                blocksBehind: 3,
                expireSeconds: 30,
              });
              chrome.storage.local.set({result : result});
              chrome.storage.local.set({status : "SUCCESS"});
              chrome.runtime.sendMessage(
                { action: "trx_request"}
            ); 
              
        }catch(error){
          console.log(error)
          chrome.storage.local.set({result : error});
        chrome.storage.local.set({status : "FAILED"});
          chrome.runtime.sendMessage(
            { action: "trx_request"}
        );
          
        }
    }
    const fetchData = async () => {
        try {
            const auth_name = await chrome.storage.local.get(['auth_name']);
            const data = await chrome.storage.local.get(['data']);
            const action_account = await chrome.storage.local.get(['action_account']);
            const action_name = await chrome.storage.local.get(['action_name']);
            const result_accounts = await chrome.storage.local.get(['accounts']);
            const accounts = result_accounts.accounts;
            console.log(auth_name)
            console.log(auth_name.auth_name)
            const filteredData = accounts.filter(item => item.account_name === auth_name.auth_name);
            const senderPrivateKey = filteredData[0].privateKey;
            setPrivateKey(senderPrivateKey)
            setAuthName(auth_name.auth_name)
            setActionData(data.data)
            setActionAccount(action_account.action_account)
            setActionName(action_name.action_name)
        } catch (error) {
          console.error('Error fetching transaction data:', error);
        }
      };
    useEffect(() => {
        fetchData(); 
      },[]);
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
                    <button className='login_btn' onClick={startTransaction}>서명</button>
                </div>
            </div>
        </>
    );
}