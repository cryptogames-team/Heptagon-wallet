/*global chrome*/
import './App.css';
import React, { useState, useEffect } from 'react';
import NewHeader from './pages/NewHeader/NewHeader';
import StartApp from './pages/StartApp/StartApp';
import DaapLogin from './pages/DappLogin/DappLogin'
import DappSign from './pages/DappSign/DappSign'
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
function App() {
  const [request, setRequest] = useState('');
  const [componentsToRender, setComponentsToRender] = useState([]);
  
  useEffect(() => {
      chrome.storage.local.get(['request_state'], (result) => {
      const storedData = result.request_state; 
      setRequest(storedData);
      
      console.log(storedData)

      if(storedData == "init") {
    let updateData = [];
      updateData.push(<NewHeader/>);
      updateData.push(<Router><StartApp/></Router>);
      setComponentsToRender(updateData);

      } else if(storedData == "dapp_login") {
        let updateData = [];
        updateData.push(<DaapLogin/>);
        setComponentsToRender(updateData);

      } else if(storedData == "dapp_trx") {
        let updateData = [];
        updateData.push(<DappSign/>);
        setComponentsToRender(updateData);
        
      } else if(storedData == "main") {
        let updateData = [];
      updateData.push(<Router><MainPage/></Router>);
      setComponentsToRender(updateData);
      }
       });
      

      
  },[]);
  

  return (
    <div className="App">
      {
        componentsToRender
      } 
      
    </div>
  );
}

export default App;
