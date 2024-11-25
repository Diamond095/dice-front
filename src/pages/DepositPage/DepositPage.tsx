import React, { useState, useEffect } from "react";
import useDepositStore from "../../app/stores/depositStore";
import BackButton from "../../shared/ui/BackButton/BackButton";
import "./DepositPage.scss";
import { useParams } from "react-router-dom";
import { sendJetton } from '../../app/sendJetton';
import { getJettonWallet } from '../../app/getJettonWallet';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { useUserStore } from "../../app/stores/userStore";
import axios from "axios";
import translate from '../../../i18n.js';


const DepositPage: React.FC = () => {
  const { amount, setAmount, toggleStatusDeposit } = useDepositStore()
  const [isError, setError] = useState(false);
  const { token } = useParams()
  const { id } = useUserStore()
  const handleQuickDeposit = (value: number) => {
    if (value == 0) {
      value = 0.5;
    }
    setAmount(value);
  }

  const userAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const [jettonWallet, setJettonWallet] = useState(null);
  const handleChangeDeposit = (amount: number) => {
    setAmount(amount)
  }
  const handleDeposit = async () => {
    if (amount < 0.5) {
      setError(true)
      return
    } else {
      setError(false)
    }
    const myJettonWallet = jettonWallet ? jettonWallet.result : null;
    if (amount >= 0.5) {
      const code = generateCode()
      await axios.post('/api/deposit', {
        amount: amount,
        type: token,
        userId: id,
        code: code
      })
      try {
        const jettonWalletData = await getJettonWallet(userAddress, token);
        setJettonWallet(jettonWalletData);
        await sendJetton(code, token, amount, userAddress, tonConnectUI);
      } catch (error) {
        console.error("Error sending jetton: ", error);
      }
      toggleStatusDeposit()
    }
  };

  return (
    <>
      <div className="DepositPageWrapper">
        <span className="WalletPage_wallet-text">{translate.t('wallet')}</span>
        <div className="DepositForm">
          <span>{translate.t('depositAmount')}</span>
          <input
            type="number"
            className="DepositInput"
            value={amount}
            onChange={(e) => {setAmount(parseFloat(e.target.value))}}
          />
          <div className="Deposit_quick">
            <button onClick={() => handleQuickDeposit(0)}>{translate.t('min')}</button>
            <button onClick={() => handleQuickDeposit(3)}>3</button>
            <button onClick={() => handleQuickDeposit(5)}>5</button>
            <button onClick={() => handleQuickDeposit(10)}>10</button>
            <button onClick={() => handleQuickDeposit(20)}>20</button>
          </div>
        </div>
      </div>
      <div>
      </div>
      {isError && (<div style={{ margin: '1rem', color: 'red' }}>
        Min amount of deposit is 0.5 {token}
      </div>)
      }
      <div className="DepositPage__navigation">
        <div className="DepositButton" onClick={handleDeposit} >{translate.t('deposit')}</div>
        <BackButton className="DepositPage__navigation-back" />
      </div>
    </>
  );
};

export default DepositPage;

function generateCode() {
  let referralCode = '#';

  for (let i = 0; i < 8; i++) {
    const randomNum = Math.floor(Math.random() * 62);
    if (randomNum < 10) {
      referralCode += String.fromCharCode(randomNum + 48);
    } else if (randomNum < 36) {
      referralCode += String.fromCharCode(randomNum + 55); // A-Z (ASCII 65-90)
    } else {
      referralCode += String.fromCharCode(randomNum + 61); // a-z (ASCII 97-122)
    }
  }

  return referralCode;
}
