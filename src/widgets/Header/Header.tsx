import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../../app/stores/userStore";
import Ton from "../../app/assets/tonlogo.png";
import LogoImage from "../../app/assets/Logo.png";
import WalletIcon from "../../app/assets/Wallet.png";
import M5 from '../../app/assets/m5_balance.png'
import "./Header.scss";
import axios from "axios";
import burnIcon from '../../app/assets/burn-icon.png'
import dfc from '../../app/assets/dfc_balance.png'

const Header: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  const { walletTonBalance, walletM5Balance, walletDfcBalance, setWalletDfcBalance, setWalletM5Balance, setWalletTonBalance, selectedToken, setSelectedToken, id } =
    useUserStore();

  const balances = {
    m5: { icon: M5, balance: walletM5Balance, label: "m5" },
    ton: { icon: Ton, balance: walletTonBalance, label: "ton" },
    dfc: { icon: dfc, balance: walletDfcBalance, label: "dfc" },
  };

  const orderedBalances = Object.entries(balances)
    .filter(([key]) => key != selectedToken)

  useEffect(() => {
    axios.get(`/api/tokenlastgame/${id}`).then(
      res => {
        setSelectedToken(res.data);
      }
    );
    getBalance()
    window.Echo.channel(`deposit${id}`).listen('.deposit', data => {
      setSelectedToken(data.type);
      switch (data.type) {
        case 'm5':
          setWalletM5Balance(walletM5Balance + (data.amount));
          break;
        case 'ton':
          setWalletTonBalance(walletTonBalance + (data.amount));
          break;
        case 'dfc':
          setWalletDfcBalance(walletDfcBalance + (data.amount));
          break;
      }
    });
  }, [walletM5Balance, walletTonBalance, walletDfcBalance]);

  const getBalance = async () => {
    try {
      axios.get(`/api/balance/${id}`).then(res => {
        setWalletTonBalance(res.data.ton_balance)
        setWalletM5Balance(res.data.m5_balance)
        setWalletDfcBalance(res.data.dfc_balance)
      })
    } catch (error) {
      console.error('Ошибка получения баланса:', error)
    }
  }

  const handleWalletClick = () => {
    setExpanded(!expanded);
  };

  return (
    <header className="Header">
      <Link to="/" className="Header__item Header__item--logo">
        <img src={LogoImage} alt="Logo" style={{width: '6vh', height: '6vh'}} />
      </Link>
      <div style={{ display: 'flex', justifyContent: 'space-around', width: '64vw', alignItems: 'center' }}>
        <div className="burn">
          <div className="burn-elements"><div className="burn-number">
            6.81k
          </div>
            <img src={burnIcon} className="burn-icon"></img></div>
        </div>
        <div className="wallet">
          <div className="wallet-main" style={expanded ? { height: '7' } : null}>
            <div
              className={`Header__item Header__item--wallet-balance ${expanded ? "expanded" : ""}`}
              onClick={handleWalletClick}
            >
              <div className="balance-slider">
                <div>
                  {balances[selectedToken].balance.toFixed(2)}
                </div>
                <img
                  src={balances[selectedToken].icon}
                  alt={balances[selectedToken].label}
                  className="balance-icon"
                  style={selectedToken == 'm5' ? { marginBottom: '0' } : { width: '1.3rem', marginBottom: '0' }}
                />
              </div>

            </div>
            <div className="points" onClick={handleWalletClick}>
              <div className="point">
              </div>
              <div className="point">
              </div>
              <div className="point">
              </div>
            </div>
            <div>
              <Link to={"/wallet"} className="Header__item Header__item--wallet-link">
                <img src={WalletIcon} alt="Wallet" className="wallet-icon" />
              </Link>
            </div>
          </div>
          <div>
            {expanded && (
              <div>
              <div className="gorizont-separate">

              </div>
              <div className="balance-column">
                {orderedBalances.map(([key, { icon, balance, label }]) => (
                  <div key={key} className={`balance-row ${selectedToken != key ? 'not-selected' : ''}`} >
                    <div>
                      {balance.toFixed(2)}
                    </div>
                    <img src={icon} alt={label} className="balance-icon" />
                  </div>
              
                ))}
              </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;