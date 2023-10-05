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

  export default function Vote() {
    const [account, setAccount] = useState([]);
    const [producers, setProducers] = useState([]);
    const [blockProducer, setBlockProducer] = useState('');
    const [selectProducer,setselectProducer] = useState([]);
    const [privateKey,setPrivateKey] = useState('');
    const fetchDataFromHep = async () => {

      };
    const voteProducer = () => {
        const apiUrl = 'http://221.148.25.234:8989/voteProducer';
        const data = {
          datas: {
            voterPrivateKey: privateKey,
            voterName: account.account_name, // 실제 데이터 값
            producerName: selectProducer,
          }
        };
        // POST 요청 보내기
        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            if(data.status ==='SUCCESS')
              {
                alert("투표에 성공하였습니다.")
                goBack();
                // setResult("트랜잭션 완료 ID : "+data.result.transaction_id);
                // setHeader("투표 성공");
              }else
              {
                alert("투표에 실패하였습니다.")
                // setResult("투표 실패하였습니다.");
                // setHeader("투표 실패");
              }
              //openModal();
          })
          .catch(error => {
            console.error('Error posting data:', error);
          });
      };

      const GetProducers = () => {
        const apiUrl = 'http://221.148.25.234:8989/getProducerList';
    
        // POST 요청 보내기
        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            setProducers(data.producers);
          })
          .catch(error => {
            console.error('Error posting data:', error);
          });
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
          const response = await axios.post('http://221.148.25.234:8989/getAccountInfo',
          {accountName : result.selectAccount.account_name});
          const account_result = response.data.account;
          setPrivateKey(result.selectAccount.privateKey);
          setAccount(account_result);
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