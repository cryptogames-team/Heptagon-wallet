import React, {useState, useEffect,useRef, forwardRef, } from 'react';
import { Link } from 'react-router-dom';
import './StakeBtn.css';
const StakeBtn = forwardRef((props, ref) =>{
    let wrapperRef = useRef(); //모달창 가장 바깥쪽 태그를 감싸주는 역할
    let type = props.type;
    let account = props.account;
    let stake = props.stake;
    let privateKey = props.privateKey;
    let staked = '';
    if(type === "CPU"){
        staked = parseInt(account.total_resources.cpu_weight);
    }else if(type === "NET"){
        staked = parseInt(account.total_resources.net_weight);
    }else {
        staked = account.ram_quota;
    }
    const tableData = [
        ['Account', account.account_name],
        ["Tokens", account.core_liquid_balance],
        ["Staked", parseInt(staked).toLocaleString()]
      ];
      const [number, setNumber] = useState(0);
      useEffect(()=>{
        document.addEventListener('mousedown', handleClickOutside);
        return()=>{
          document.removeEventListener('mousedown', handleClickOutside);
        }
      })
      const handleClickOutside=(event)=>{
        if (wrapperRef && !wrapperRef.current.contains(event.target)) {
          props.setModalState(false);
        }
      }
  
      function BtnEvent(){
        props.setModalState(false);
      }
      function StakeAction(){
        if(type === 'CPU'){
            if(stake === 'stake'){
                const apiUrl = 'http://221.148.25.234:8989/resourceStaking';
                const data = {
                datas: {
                    privateKey: privateKey,
                    accountName: account.account_name, // 실제 데이터 값
                    cpuQuantity: number + ".0000",
                    netQuantity: '0.0000'
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
                        alert("스테이킹에 성공하였습니다.")
                        props.setModalState(false);
                    }else
                    {
                        alert("스테이킹에 실패하였습니다.")
                        props.setModalState(false);
                    }
                })
                .catch(error => {
                    console.error('Error posting data:', error);
                });
            }else {
                const apiUrl = 'http://221.148.25.234:8989/unstakeResource';
                const data = {
                datas: {
                    privateKey: privateKey,
                    accountName: account.account_name, // 실제 데이터 값
                    cpuQuantity: number + ".0000",
                    netQuantity: "0.0000"
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
                        alert("언스테이킹에 성공하였습니다.")
                        props.setModalState(false);
                    }else
                    {
                        alert("언스테이킹에 실패하였습니다.")
                        props.setModalState(false);
                    }
                })
                .catch(error => {
                    console.error('Error posting data:', error);
                });
            }
        }else if(type === 'NET'){
            if(stake === 'stake'){
                const apiUrl = 'http://221.148.25.234:8989/resourceStaking';
                const data = {
                datas: {
                    privateKey: privateKey,
                    accountName: account.account_name, // 실제 데이터 값
                    cpuQuantity: "0.0000",
                    netQuantity: number + '.0000'
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
                        alert("스테이킹에 성공하였습니다.")
                        props.setModalState(false);
                    }else
                    {
                        alert("스테이킹에 실패하였습니다.")
                        props.setModalState(false);
                    }
                })
                .catch(error => {
                    console.error('Error posting data:', error);
                });
            }else {
                const apiUrl = 'http://221.148.25.234:8989/unstakeResource';
                const data = {
                datas: {
                    privateKey: privateKey,
                    accountName: account.account_name, // 실제 데이터 값
                    cpuQuantity: "0.0000",
                    netQuantity: number + ".0000"
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
                        alert("언스테이킹에 성공하였습니다.")
                        props.setModalState(false);
                    }else
                    {
                        alert("언스테이킹에 실패하였습니다.")
                        props.setModalState(false);
                    }
                })
                .catch(error => {
                    console.error('Error posting data:', error);
                });
            }
        }else {
            if(stake === 'stake'){
                const apiUrl = 'http://221.148.25.234:8989/buyRam';
                const data = {
                datas: {
                    privateKey: privateKey,
                    accountName: account.account_name, // 실제 데이터 값
                    quantity: number + ".0000"
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
                        alert("구매에 성공하였습니다.")
                        props.setModalState(false);
                    }else
                    {
                        alert("구매에 실패하였습니다.")
                        props.setModalState(false);
                    }
                })
                .catch(error => {
                    console.error('Error posting data:', error);
                });
            }else {
                const apiUrl = 'http://221.148.25.234:8989/sellRam';
                const data = {
                datas: {
                    privateKey: privateKey,
                    accountName: account.account_name, // 실제 데이터 값
                    bytes: number
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
                        alert("판매에 성공하였습니다.")
                        props.setModalState(false);
                    }else
                    {
                        alert("판매에 실패하였습니다.")
                        props.setModalState(false);
                    }
                })
                .catch(error => {
                    console.error('Error posting data:', error);
                });
            }
        }
      }
      const handleInputChange = (e) => {
        const inputNumber = parseInt(e.target.value, 10);
        if(stake === "stake"){
                if(inputNumber >= parseFloat(account.core_liquid_balance.replace(" HEP",""))){
                    setNumber(parseInt(account.core_liquid_balance.replace(" HEP","")))
                }else if (inputNumber >= 0) {
                    setNumber(inputNumber);
                }  else if(!inputNumber){
                    setNumber('');
                }
        }else {
            if(staked < inputNumber){
                setNumber(staked);
            }else if (inputNumber >= 0){
                setNumber(inputNumber);
            }else if(!inputNumber){
                setNumber('');
            }
        }
        
      };
   
        return (
          <div className="modal_container" ref={wrapperRef}>
            <div className='modal_header'>
                <span className='type'>{type}</span>
                <button type='button' className='close_btn' onClick={BtnEvent}>X</button>
            </div>
            <div className='modal_body'>
                    <span className='stake_text'>{stake}</span>
                    <div className='input_container'>
                        <input type='number'  value={number} onChange={handleInputChange} className='input_token' placeholder='0.0000'></input>
                        <button className='stake_action_btn' onClick={StakeAction}>{stake}</button>
                    </div>
                <div className='account_info_container'>
                    <table className='custom-table'>
                        <tbody>
                        {tableData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className={cellIndex === 0 ? 'gray-bg' : ''}>{cell}</td>
                            ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        )
    
  });
  
  export default StakeBtn;