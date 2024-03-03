/*global chrome*/
import './App.css';
import React, { useState, useEffect } from 'react';
import NewHeader from './pages/NewHeader/NewHeader';
import StartApp from './pages/StartApp/StartApp';
import DaapLogin from './pages/DappLogin/DappLogin'
import DappSign from './pages/DappSign/DappSign'
import DappSigns from './pages/DappSign/DappSigns'
import MainPage from './pages/MainPage/MainPage';
import {
  goBack,
  goTo,
  popToTop,
  Link,
  Router,
  getCurrent,
  getComponentStack,
} from 'react-chrome-extension-router';
import RecoveryAccount1 from './pages/RecoveryAccount1/RecoveryAccount1';
import RecoveryAccount2 from './pages/RecoveryAccount2/RecoveryAccount2';
function App() {
  const [request, setRequest] = useState('');
  const [componentsToRender, setComponentsToRender] = useState([]);
  
  useEffect(() => {

    chrome.storage.local.get(['user_mnemonic'], (result) => {
      console.log(`니모닉`, result);
    });

    chrome.storage.local.get(['request_state'], (result) => {
      const storedData = result.request_state;
      setRequest(storedData);

      console.log(storedData)

      if (storedData == "init") {
        let updateData = [];
        updateData.push(<NewHeader />);
        updateData.push(<Router><StartApp /></Router>);
        setComponentsToRender(updateData);

      } else if (storedData == "dapp_login") {
        let updateData = [];
        updateData.push(<DaapLogin />);
        setComponentsToRender(updateData);

      } else if (storedData == "dapp_trx") {
        let updateData = [];
        updateData.push(<DappSign />);
        setComponentsToRender(updateData);

      } else if (storedData == "dapp_trxs") {
        let updateData = [];
        updateData.push(<DappSigns />);
        setComponentsToRender(updateData);

      } else if (storedData == "main") {
        let updateData = [];
        updateData.push(<Router><MainPage /></Router>);
        setComponentsToRender(updateData);
      }
    });

    // let updateData = [];
    // updateData.push(<RecoveryAccount2 />);
    // setComponentsToRender(updateData);

  }, []);
  

  return (
    <div className="App">
      {
        componentsToRender
      } 
      
    </div>
  );
}

export default App;
