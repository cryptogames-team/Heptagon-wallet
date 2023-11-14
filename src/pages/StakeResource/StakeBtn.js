import React, {useState, useEffect,useRef, forwardRef, } from 'react';
import { Link } from 'react-router-dom';
import './StakeBtn.css';
import { Api, JsonRpc, RpcError } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig.js';
import { Buffer } from 'buffer';
  var global = global || window;
  global.Buffer = global.Buffer || require("buffer").Buffer;
  const rpc = new JsonRpc('http://14.63.34.160:8888');
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
      async function unstakeResource(privateKey, accountName, cpuQuantity, netQuantity){
        const signatureProvider = new JsSignatureProvider([privateKey]);
        const hep = new Api({rpc,signatureProvider});
        try {
            const result = await hep.transact({
              actions: [{
                  account: 'eosio',
                  name: 'undelegatebw',
                  authorization: [{
                    actor: accountName,  
                    permission: 'active',
                  }],
                  data: {
                    from: accountName,  
                    receiver: accountName,  
                    unstake_net_quantity: netQuantity + " HEP", 
                    unstake_cpu_quantity: cpuQuantity + " HEP", 
                    transfer: false,
                  },
                }]
              }, {
                blocksBehind: 3,
                expireSeconds: 30,
              });
              alert("언스테이킹에 성공하였습니다.")
              props.setModalState(false);
        }catch(error){
            alert("언스테이킹에 실패하였습니다.")
            props.setModalState(false);
        }
      }
      async function BuyRam(privateKey,accountName,quantity){
        const signatureProvider = new JsSignatureProvider([privateKey]);
        const hep = new Api({rpc,signatureProvider});
        try {
            const result = await hep.transact({
              actions: [{
                  account: 'eosio',
                  name: 'buyram',
                  authorization: [{
                    actor: accountName,  // RAM을 구매할 계정
                    permission: 'active',
                  }],
                  data: {
                    payer: accountName,  // RAM을 구매할 계정
                    receiver: accountName,  // RAM을 받을 계정
                    quant: quantity + ' HEP',  // 구매할 RAM 수량
                  },
                }]
              }, {
                blocksBehind: 3,
                expireSeconds: 30,
              });
              alert("구매에 성공하였습니다.")
              props.setModalState(false);
        }catch(error){
            alert("구매에 실패하였습니다.")
            props.setModalState(false);
        }
      }
      async function SellRam(privateKey,accountName,bytes){
        const signatureProvider = new JsSignatureProvider([privateKey]);
        const hep = new Api({rpc,signatureProvider});
        try {
            const result = await hep.transact({
              actions: [{
                  account: 'eosio',
                  name: 'sellram',
                  authorization: [{
                    actor: accountName,  
                    permission: 'active',
                  }],
                  data: {
                    account: accountName,  
                    bytes: bytes,  
                  },
                }]
              }, {
                blocksBehind: 3,
                expireSeconds: 30,
              });
              alert("판매에 성공하였습니다.")
            props.setModalState(false);
        }catch(error){
            alert("판매에 실패하였습니다.")
            props.setModalState(false);
        }
      }
      async function StakeResource(privateKey, accountName, cpuQuantity, netQuantity){
        const signatureProvider = new JsSignatureProvider([privateKey]);
        const hep = new Api({rpc,signatureProvider});
        try {
            const result = await hep.transact({
              actions: [{
                  account: 'eosio',
                  name: 'delegatebw',
                  authorization: [{
                    actor: accountName,  // CPU 스테이킹을 할 계정
                    permission: 'active',
                  }],
                  data: {
                    from: accountName,  // CPU 스테이킹을 할 계정
                    receiver: accountName,  // CPU 스테이킹을 할 계정
                    stake_net_quantity: netQuantity + " HEP",  // 네트워크 스테이킹 수량 (0으로 설정하려면 해당 필드를 제거하세요)
                    stake_cpu_quantity: cpuQuantity + " HEP",  // CPU 스테이킹 수량
                    transfer: false,
                  },
                }]
              }, {
                blocksBehind: 3,
                expireSeconds: 30,
              });
              alert("스테이킹에 성공하였습니다.")
            props.setModalState(false);
        }catch(error){
            alert("스테이킹에 실패하였습니다.")
            props.setModalState(false);
        }
      }
      function StakeAction(){
        if(type === 'CPU'){
            if(stake === 'stake'){
                StakeResource(privateKey,account.account_name,number + ".0000",'0.0000');
            }else {
                unstakeResource(privateKey,account.account_name,number + ".0000","0.0000");
            }
        }else if(type === 'NET'){
            if(stake === 'stake'){
                StakeResource(privateKey,account.account_name,"0.0000",number + '.0000');
            }else {
                unstakeResource(privateKey,account.account_name,"0.0000",number + ".0000");
            }
        }else {
            if(stake === 'stake'){
                BuyRam(privateKey,account.account_name,number+".0000");
            }else {
                SellRam(privateKey,account.account_name,number)
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