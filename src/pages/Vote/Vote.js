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
  import './Vote.css';
  import Logo from '../../assets/heptagon_logo_final.png';
  import DownArrow from '../../assets/down_arrow.png';
  import link_img from '../../assets/web.png'
  import More from '../../assets/more.png';
  import axios from 'axios';
  import { Api, JsonRpc, RpcError } from 'eosjs';
  import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig.js';
  import { Buffer } from 'buffer';
    var global = global || window;
    global.Buffer = global.Buffer || require("buffer").Buffer;
    const rpc = new JsonRpc('http://14.63.34.160:8888');
  export default function Vote() {
    const [account, setAccount] = useState([]);
    const [producers, setProducers] = useState([]);
    const [blockProducer, setBlockProducer] = useState('');
    const [selectProducer,setselectProducer] = useState([]);
    const [privateKey,setPrivateKey] = useState('');
    const fetchDataFromHep = async () => {

      };
    const voteProducer = async() => {
      const signatureProvider = new JsSignatureProvider([privateKey]);
      const hep = new Api({rpc,signatureProvider});
          try{
            const result = await hep.transact({
              actions: [{
                account: 'eosio',
                name: 'voteproducer',
                authorization: [{
                  actor: account.account_name,
                  permission: 'active',
                }],
                data: {
                  voter: account.account_name,
                  proxy: '',
                  producers: selectProducer
                },
              }]
            }, {
              blocksBehind: 3,
              expireSeconds: 30,
              broadcast: true,
              sign: true
            });
            alert("투표에 성공하였습니다.")
            goBack();
          }catch(error){
            alert("투표에 실패하였습니다.")
            console.log(error);
          }
      };

      const GetProducers = async() => {
          try {
            let producerLength = 0;
            let producerData;
            while (producerLength <= 24) {
              producerData = await rpc.get_producers(true, '', 100);
              producerLength = producerData.rows.length;
            }
            producerData.rows.sort((a, b) => parseFloat(b.total_votes) - parseFloat(a.total_votes));
            setProducers(producerData.rows);
          }catch(error){
            console.error(error)
          }
      };
    
      useEffect(() => {
        const intervalId = setInterval(fetchDataFromHep, 500);
        GetProducers();

        return () => clearInterval(intervalId);
      }, []);
      const formatVotes = (votes) => {
        const num = parseInt(votes);
        return num.toLocaleString();
      };
      const isProducing = (producer) => {
        return blockProducer === producer;
      };
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
      const calculateVoteRate = (votes) => {
        const totalVotes = calculateTotalVotes();
        const producerVotes = parseFloat(votes);
        const voteRate = (producerVotes / totalVotes) * 100;
        return voteRate.toFixed(2);
      };
    
      const calculateTotalVotes = () => {
        return producers.reduce((total, producer) => total + parseFloat(producer.total_votes), 0);
      };
      const handleCheckboxChange = (event) => {
        const value = event.target.value;
        if (selectProducer.includes(value)) {
          setselectProducer(selectProducer.filter(item => item !== value));
        } else {
          setselectProducer([...selectProducer, value]);
        }
      };
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
                <div className='vote_container'>
                <span className='cancels'  onClick={()=>{goBack()}}>취소</span>
                    <div className='vote_header'>
                    
                        <div className='selected_container'>
                        
                            <p>Selected Validators({selectProducer.length}/30)</p>
                            <ul className='selected_ul'>
                                {selectProducer.map(item =>(
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div className='vote_btn_container'>
                            <button type='button'id='transaction' onClick={()=>voteProducer()} className='vote_btn'>VOTE</button>
                        </div>
                    </div>
                    <div className='vote_body'>
                        <div className="producer_table_header">
                            <p className='select_header'>Select</p>
                            <p className="rank_header">Rank</p>
                            <p className="producer_name_header">Validator</p>
                            <p className="producer_status_header">Status</p>
                            <p className="producer_link_header">Link</p>
                            <p className="producer_vote_rate_header">Votes %</p>
                            <p className="producer_votes_header">Total Votes</p>
                            <p className="reward_per_day_header">Rewards Per Day</p>
                        </div>
                        {producers.map((producer, index) => (
                            <div className="producer_item" key={index}>
                            <input type="checkbox" value={producer.owner} className='select_container' checked={selectProducer.includes(producer.owner)} 
                            onChange={handleCheckboxChange} disabled={selectProducer.length >= 30 && !selectProducer.includes(producer.owner)}/>
                            <p className="rank">{index + 1}</p>
                            <span className="producer_name">
                                {producer.owner}
                            </span>
                            <div className="producer_status">
                                <p
                                className={`producer_status_box ${
                                    index > 20 ? 'standby' : isProducing(producer.owner) ? 'producing' : 'Top21'
                                }`}
                                >
                                {index > 20 ? 'stand by' : isProducing(producer.owner) ? 'producing' : 'Top 21'}
                                </p>
                            </div>
                            <a className="producer_link" href={producer.url} target="_blank" rel="noopener noreferrer">
                                <img className="internet_logo" src={link_img} alt="Producer Logo" />
                            </a>
                            <p className="producer_vote_rate">{calculateVoteRate(producer.total_votes)}%</p>
                            <p className="producer_votes">{formatVotes(producer.total_votes)}</p>
                            <p className="reward_per_day">{index > 20 ? '0 HEP' : '1,728 HEP'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
  }