import React, { useState } from "react";
import useWithdrawStore from "../../app/stores/withdrawStore";
import BackButton from "../../shared/ui/BackButton/BackButton";
import "./WithdrawPage.scss";
import { useParams } from "react-router-dom";
import { useUserStore } from "../../app/stores/userStore";
import axios from "axios";
import translate from '../../../i18n.js';

const WithdrawPage: React.FC = () => {
  const {amount, setAmount } = useWithdrawStore(); 
  const {setWalletM5Balance, setWalletTonBalance, setWalletDfcBalance, walletDfcBalance, walletM5Balance, walletTonBalance, id} = useUserStore();
  const {token} = useParams()
  const [ isError, setError] = useState(false);
  const [message, setMessage] = useState(false);


  const handleQuickWithdraw = (value: number) => {
    if(value == 0){
      switch(token){
        case 'm5':
          value = 3
          break
        case 'dfc':
          value = 8
          break
        case 'ton':
          value = 0.5
          break
      }
    } 
    setAmount(value);
  };

  const handleWithdrawal = () => {
    if(amount < 3){
      setError(true)
    }  else{
      setError(false)
    }
    if((amount <= walletM5Balance && token == 'm5') 
    || (amount <= walletTonBalance && token == 'ton')
    || (amount <= walletDfcBalance && token == 'dfc')){
    axios.post('/api/withdrawal', {
        userId: id, 
        amount: amount, 
        type: token
    }).then(res=>{
    setMessage(true);
    switch(token){
      case "m5":
        setWalletM5Balance(walletM5Balance - amount)
        break
      case "ton":
        setWalletTonBalance(walletTonBalance - amount)
        break
        case "dfc":
          setWalletDfcBalance(walletDfcBalance - amount)
          break
    }
    })
}
};
  return (
    <>
      <div className="WithdrawPageWrapper">
        <span className="WalletPage_wallet-text">{translate.t('wallet')}</span>
        <div className="WithdrawForm">
          <span>{translate.t('withdrawAmount')}</span>
          <input
            type="number"
            className="WithdrawInput"
            value={amount}
            onChange={(e) =>{setAmount(parseFloat(e.target.value))}}
          />
            {(() => {
  switch (token) {
    case 'm5':
      return (
        <div className="Withdraw_quick">
          <button onClick={() => handleQuickWithdraw(0)}>{translate.t('min')}</button>
          <button onClick={() => handleQuickWithdraw(3)}>3</button>
          <button onClick={() => handleQuickWithdraw(5)}>5</button>
          <button onClick={() => handleQuickWithdraw(10)}>10</button>
          <button onClick={() => handleQuickWithdraw(walletM5Balance)}>{translate.t('max')}</button>
        </div>
      );
      break
    case 'ton':
      return (
        <div className="Withdraw_quick">
          <button onClick={() => handleQuickWithdraw(0)}>{translate.t('min')}</button>
          <button onClick={() => handleQuickWithdraw(1)}>1</button>
          <button onClick={() => handleQuickWithdraw(5)}>5</button>
          <button onClick={() => handleQuickWithdraw(10)}>10</button>
          <button onClick={() => handleQuickWithdraw(walletTonBalance)}>{translate.t('max')}</button>
        </div>
      );
      break
    case 'dfc':
      return (
        <div className="Withdraw_quick">
          <button onClick={() => handleQuickWithdraw(0)}>{translate.t('min')}</button>
          <button onClick={() => handleQuickWithdraw(10)}>10</button>
          <button onClick={() => handleQuickWithdraw(20)}>20</button>
          <button onClick={() => handleQuickWithdraw(50)}>50</button>
          <button onClick={() => handleQuickWithdraw(walletTonBalance)}>{translate.t('max')}</button>
        </div>
      );
      break
  }
})()}

        </div>
      </div>
       { message && (<div style={{margin: '1rem', color: 'green'}}>
        {translate.t('withdrawSuccess')}
        </div>) }
      <div className="WithdrawPage__navigation">
        <div className="WithdrawButton" onClick={handleWithdrawal} >{translate.t('withdraw')}</div>
        <BackButton className="WithdrawPage__navigation-back" />
      </div>
    </>
  );
};

export default WithdrawPage;
