/*global chrome*/
import React, {useState, useEffect,useRef, forwardRef, } from 'react';
import { Link } from 'react-router-dom';
import './AccountsPage.css';
import Logo from '../../assets/heptagon_logo_final.png';
import Plus from '../../assets/plus.png'
import AddAccount from './AddAccount';
const AccountsPage = forwardRef((props, ref) =>{
    let wrapperRef = useRef();
    let fetchData_parent = props.fetchData;
    let account = props.account;
    const setModalState = props.setModalState;
    const [accounts,setAccounts] = useState([]);
    const [ModalState, setModalsState] = useState(false); 
    const fetchData = async () => {
        try {
          const result = await chrome.storage.local.get(["accounts"]);
          setAccounts(result.accounts)
        } catch (error) {
          console.error('Error fetching transaction data:', error);
        }
      };
    useEffect(() => {
        fetchData(); 
      },[]);
    return(
        <>
            <div className='accounts_container'>
                <div className='accounts_header'>
                    <span className='accounts_header_title'>계정 선택</span>
                    <span className='exit_btn' onClick={()=>{setModalState(false)}}>X</span>
                </div>
                <div className='accounts_body'>
                    <div className='accounts_box'>
                        {accounts.map((item, index) => (
                            <div className='account_item' onClick={()=>{
                                chrome.storage.local.set({selectAccount : item});
                                fetchData_parent();
                                setModalState(false);
                            }}>
                                <img src={Logo} className='account_img'></img>
                                <span className='item_name'>{item.account_name}</span>
                            </div>
                        ))}
                    </div>
                    <div className='add_account' onClick={()=>{setModalsState(true)}}>
                        <img src={Plus} className='plus_img'></img>
                        <span className='plus_account_text'>Add account</span>
                    </div>
                </div>

                {ModalState === true ? //모달 상태가 true면 1번, false면 2번이 작동합니다.
                    <div className="AccountPage" style={{display:"flex",position:"fixed",top:"0",left: "0", bottom: "0", right: "0",justifyContent:"center",alignItems:"center", zIndex : "100"}}>
                        <AddAccount setModalsState={setModalsState} fetchData={fetchData}/> 
                     </div>
      
                : ""}  
            </div>
            
        </>
    );
});
  
export default AccountsPage;
