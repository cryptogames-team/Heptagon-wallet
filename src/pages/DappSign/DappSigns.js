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
export default function DappSigns() {
    const [privateKey,setPrivateKey] = useState('');
    const [authName,setAuthName] = useState('');
    const [actionData,setActionData] = useState('');
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
    const startTransactions = async() =>{
        const signatureProvider = new JsSignatureProvider([privateKey]);
        const hep = new Api({rpc,signatureProvider});
        let results = [];
        const promises = actionData.map(async (data) => {
            try {
                const result = await hep.transact({
                    actions: [{
                        account: data.action_account,
                        name: data.action_name,
                        authorization: [{
                            actor: authName,
                            permission: 'active',
                        }],
                        data: data.data,
                    }]
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30,
                });
                results.push(result.transaction_id)

            } catch (error) {
                console.log(error)
                chrome.storage.local.set({ result: error });
                chrome.storage.local.set({ status: "FAILED" });
                chrome.runtime.sendMessage(
                    { action: "trxs_request" }
                );
            }
        });
        await Promise.all(promises);

        if(results.length > 0){
            chrome.storage.local.set({result : results});
            chrome.storage.local.set({status : "SUCCESS"});
            chrome.runtime.sendMessage(
              { action: "trxs_request"}
          ); 
        }
    }
    const fetchData = async () => {
        try {
            const auth_name = await chrome.storage.local.get(['auth_name']);
            const datas_by_front = await chrome.storage.local.get(['datas_by_front']);
            const result_accounts = await chrome.storage.local.get(['accounts']);
            const accounts = result_accounts.accounts;

            const filteredData = accounts.filter(item => item.account_name === auth_name.auth_name);
            const senderPrivateKey = filteredData[0].privateKey;
            setPrivateKey(senderPrivateKey)
            setAuthName(auth_name.auth_name)
            setActionData(datas_by_front.datas_by_front)
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
                    <button className='login_btn' onClick={startTransactions}>서명</button>
                </div>
            </div>
        </>
    );
}