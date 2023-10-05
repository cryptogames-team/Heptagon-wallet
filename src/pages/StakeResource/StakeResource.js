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
  import './StakeResource.css';
  import Logo from '../../assets/heptagon_logo_final.png';
  import axios from 'axios';
  import More from '../../assets/more.png';
  import DownArrow from '../../assets/down_arrow.png';
  import StakeBtn from './StakeBtn'
  export default function StakeResource() {
    const [ModalState, setModalState] = useState(false); 
    const [account, setAccount] = useState([]);
    const [type, setType] = useState('');
    const [stake, setStake] = useState('');
    const [privateKey,setPrivateKey] = useState('');
    const fetchData = async () => {
        try {
        const result = await chrome.storage.local.get(["selectAccount"]);
          const response = await axios.post('http://221.148.25.234:8989/getAccountInfo',
          {accountName : result.selectAccount.account_name});
          setPrivateKey(result.selectAccount.privateKey);
          const account_result = response.data.account;
          setAccount(account_result);
          console.log(account)
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
                    <span className='account_box'>{account.account_name}<img src={DownArrow} className='arrow-down'></img></span>
                    <img src={More} className='more'></img>
                </div>
                <div className='resource_container'>
                <span className='cancels'  onClick={()=>{goBack()}}>취소</span>
                <h2>Resource OverView</h2>
                    <div className='resource_box top'>
                        <div className='graph_container'>
                            <span className='resource_type'>CPU : </span>
                            <div className='chart_container' style={{ width: '100%',height:'35px', backgroundColor:'#0000001A',borderRadius:5, marginTop:10}}>
                                <div className='chart_data' style={{ width: `${account.cpu_limit ? (parseInt(account.cpu_limit.used)/parseInt(account.cpu_limit.max))*100 : 0}%` ,height:'35px',minWidth: '10px',backgroundColor:'#00B5AD',borderRadius:5,textAlign:'end',alignItems:'center',color:'white',display:'flex'}}><span className='resource_used_text' style={{width:'100%', height:'15px'}}>{account.cpu_limit ? parseInt(account.cpu_limit.used).toLocaleString() : "0"}µs/{account.cpu_limit ? parseInt(account.cpu_limit.max).toLocaleString() : "0"}µs</span></div>
                            </div>
                        </div>
                        <div className='resource_btn_container'>
                            <button className='stake_btn' onClick={()=>{setModalState(true); setStake('stake');setType('CPU')}}>Stake</button>
                            <button className='un_stake_btn' onClick={()=>{setModalState(true); setStake('unstake');setType('CPU')}}>UnStake</button>
                        </div>
                    </div>
                    <div className='resource_box'>
                        <div className='graph_container'>
                            <span className='resource_type'>NET : </span>
                            <div className='chart_container' style={{ width: '100%',height:'35px', backgroundColor:'#0000001A',borderRadius:5, marginTop:10}}>
                                <div className='chart_data' style={{ width: `${account.net_limit ? (parseInt(account.net_limit.used)/parseInt(account.net_limit.max))*100 : 0}%` ,height:'35px',minWidth: '10px',backgroundColor:'#21BA45',borderRadius:5,textAlign:'end',alignItems:'center',color:'white',display:'flex'}}><span className='resource_used_text' style={{width:'100%', height:'15px'}}>{account.net_limit ? parseInt(account.net_limit.used).toLocaleString() : "0"}µs/{account.net_limit ? parseInt(account.net_limit.max).toLocaleString() : "0"}µs</span></div>
                            </div>
                        </div>
                        <div className='resource_btn_container'>
                            <button className='stake_btn' onClick={()=>{setModalState(true); setStake('stake');setType('NET')}}>Stake</button>
                            <button className='un_stake_btn' onClick={()=>{setModalState(true); setStake('unstake');setType('NET')}}>UnStake</button>
                        </div>
                    </div>
                    <div className='resource_box'>
                        <div className='graph_container'>
                            <span className='resource_type'>RAM : </span>
                            <div className='chart_container' style={{ width: '100%',height:'35px', backgroundColor:'#0000001A',borderRadius:5, marginTop:10}}>
                                <div className='chart_data' style={{ width: `${(parseInt(account.ram_usage)/parseInt(account.ram_quota))*100}%` ,height:'35px',minWidth: '10px',backgroundColor:'#2185D0',borderRadius:5,textAlign:'end',alignItems:'center',color:'white',display:'flex'}}><span className='resource_used_text' style={{width:'100%', height:'15px'}}>{parseInt(account.ram_usage).toLocaleString()}µs/{parseInt(account.ram_quota).toLocaleString()}µs</span></div>
                            </div>
                        </div>
                        <div className='resource_btn_container'>
                            <button className='stake_btn' onClick={()=>{setModalState(true); setStake('stake');setType('RAM')}}>Buy</button>
                            <button className='un_stake_btn' onClick={()=>{setModalState(true); setStake('unstake');setType('RAM')}}>Sell</button>
                        </div>
                    </div>
                </div>
                {ModalState === true ? //모달 상태가 true면 1번, false면 2번이 작동합니다.
                    <div style={{display:"flex",position:"fixed",top:"0",left: "0", bottom: "0", right: "0",justifyContent:"center",alignItems:"center", zIndex : "100"}}>
                        <StakeBtn setModalState={setModalState} type={type} stake={stake} account={account} privateKey={privateKey} /> 
                     </div>
      
                : ""}
            </div>
        </>
    );
  }