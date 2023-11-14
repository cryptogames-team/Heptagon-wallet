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
  import './MainPage.css';
  import Logo from '../../assets/heptagon_logo_final.png';
  import DownArrow from '../../assets/down_arrow.png';
  import More from '../../assets/more.png';
  import expand from '../../assets/expand.png'
  import SendBtn from '../../assets/send.png';
  import BridgeBtn from '../../assets/bridge.png';
  import VoteBtn from '../../assets/vote.png';
  import ResourceBtn from '../../assets/resource.png'
  import Reload from '../../assets/reload.png'
  import axios from 'axios';
  import SendToken from '../../pages/SendToken/SendToken'
  import Vote from '../../pages/Vote/Vote'
  import Resource from '../../pages/StakeResource/StakeResource'
  import AccountsPage from '../AccountsPage/AccountsPage';
  import { Api, JsonRpc, RpcError } from 'eosjs';
  import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig.js';
  import { Buffer } from 'buffer';
    var global = global || window;
    global.Buffer = global.Buffer || require("buffer").Buffer;
    const rpc = new JsonRpc('http://14.63.34.160:8888');
    
  function ShortenKey({ keyString }) {
    const maxLength = 10; // 원하는 최대 길이
  
    if (keyString.length <= maxLength) {
      return <span>({keyString})</span>;
    }
  
    const shortenedKey = `${keyString.substring(0, maxLength / 2)}...${keyString.substring(keyString.length - maxLength / 2)}`;
  
    return <span className='public_key'>{shortenedKey}</span>;
  }
  function TokenPage(props) {
    return (
        <>
            <div className='token_container'>
                <img src={Logo} className='token_logo'></img>
                <div className='token_box'>
                    <span className='token_symbol'>Hep</span>
                    <span className='token_balance'>{props.account.core_liquid_balance ? props.account.core_liquid_balance : "0 HEP"}</span>
                </div>
                <span className='token_price'>$0.00 USD</span>
            </div>
            <div className='reload_box'>
                <img src={Reload} className='reload_img'></img>
                <span className='reload_text' onClick={props.reset} >새로 고침</span>
            </div>
        </>
    );
  }
  function NFTPage(props){
    
  }
  function Accounts(){
        return(
            <>
                <li>마이페이지</li>
                <li>로그아웃</li>
            </>
        );
  }

    function TransactionPage(props){
        
        const [transaction, setTransaction] = useState([]);
        function formatDate(date_string){
            const date = new Date(date_string); // 날짜를 Date 객체로 파싱
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            const formattedDate = date.toLocaleDateString('en-US', options);
            return formattedDate;
        }
        useEffect(() => {
          const fetchData = async () => {
            try{
                const result = await rpc.history_get_actions(props.account.account_name);
                const transactions = result.actions;
                setTransaction(transactions);
            }catch(error){
                console.error('Error fetching transaction data:', error);
            }
          };
          fetchData();
        }, []); 
        function openExplorerToTransaction(tnx){
            const url = "http://cryptoexplorer.store/Transaction/"+tnx;
            window.open(url, "_blank");
        }
    return(
        <>
            <div className='transactions_container'>
                {transaction.map((trx,index) => (
                    <>
                    <p className='date_box'>{formatDate(trx.block_time)}</p>
                    <div className='transaction_container' key={index} onClick={()=>openExplorerToTransaction(trx.action_trace.trx_id)}>
                        <img src={Logo} className='action_token_logo'></img>
                        <div className='action_box'>
                            <span className='transaction_action_name'>{trx.action_trace.act.name}</span>
                            <span className='action_result'>확인됨</span>
                        </div>
                        <span className='transaction_token'>{trx.action_trace.act.name === 'transfer' ? trx.action_trace.act.data.quantity: "0 HEP"}</span>
                    </div>
                    </>
                ))}
            </div>
        </>
    );
  }

export default function MainPage() {
    const [ModalState, setModalState] = useState(false); 
    const [account, setAccount] = useState([]);
    const [selectedTab, setSelectedTab] = useState('Tokens');
    const [publicKey,setPublicKey] = useState('');
    const fetchData = async () => {
        try {
          const result = await chrome.storage.local.get(["selectAccount"]);
          console.log(result)
          setPublicKey(result.selectAccount.publicKey);
          try{
            const account = await rpc.get_account(result.selectAccount.account_name);
            setAccount(account);
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
      
    return(
        <>
            <div className='main-body'>
                <div className='main-big-header'>
                    <img className='main-logo' src={Logo}></img>
                    <span className='main-logo_title'>Heptagon</span>
                </div>
                <div className='main-header'>
                    <img src={expand} className='expand' onClick={()=>{
                        chrome.tabs.create({ url: "index.html"});
                    }}></img>
                    <span className='account_box' onClick={()=>{
                        if(ModalState === true){
                            setModalState(false)
                        }else {
                            setModalState(true)
                        }
                        console.log(ModalState)
                        }}>{account ? account.account_name : ""}<img src={DownArrow} className='arrow-down'></img></span>
                    <img src={More} className='more'></img>
                </div>
                <div className='main-container'>
                    <div className='main-home-balance'>
                        <div className='balance_container'>
                            <ShortenKey keyString={publicKey} />
                            <span className='balance'>{account.core_liquid_balance ? account.core_liquid_balance : "0 HEP"}</span>
                        </div>
                        <div className='action_container'>
                            <div className='button_container'>
                                <img src={SendBtn} className='action_button' onClick={()=>{goTo(SendToken)}}></img>
                                <span className='action_name'>보내기</span>
                            </div>
                            <div className='button_container'>
                                <img src={BridgeBtn} className='action_button'></img>
                                <span className='action_name'>브릿지</span>
                            </div>
                            <div className='button_container'>
                                <img src={ResourceBtn} className='action_button' onClick={()=>{goTo(Resource)}}></img>
                                <span className='action_name'>리소스</span>
                            </div>
                            <div className='button_container'>
                                <img src={VoteBtn} className='action_button' onClick={()=>{goTo(Vote)}}></img>
                                <span className='action_name'>투표하기</span>
                            </div>
                        </div>
                    </div>
                    <div className='content_container'>
                        <div className='content_header'>
                            <span className={`header_item ${selectedTab === 'Tokens' ? 'select' : ''}`} onClick={() => setSelectedTab('Tokens')}>Tokens</span>
                            <span className={`header_item ${selectedTab === 'NFT' ? 'select' : ''}`} onClick={() => setSelectedTab('NFT')}>NFT</span>
                            <span className={`header_item ${selectedTab === 'Transaction' ? 'select' : ''}`} onClick={() => setSelectedTab('Transaction')}>활동</span>
                        </div>
                        {selectedTab === 'Tokens' && <TokenPage account={account} reset={fetchData}/>}
                        {selectedTab === 'NFT' && <NFTPage account={account} />}
                        {selectedTab === 'Transaction' && <TransactionPage account={account} />}
                    </div>
                </div>
                {ModalState === true ? //모달 상태가 true면 1번, false면 2번이 작동합니다.
                    <div className="AccountPage" style={{display:"flex",position:"fixed",top:"0",left: "0", bottom: "0", right: "0",justifyContent:"center",alignItems:"center", zIndex : "100"}}>
                        <AccountsPage setModalState={setModalState} account={account} fetchData={fetchData} /> 
                     </div>
      
                : ""}  
            </div>
        </>
    );
}