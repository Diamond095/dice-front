import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";  // useNavigate вместо useHistory
import { TonConnectButton } from "@tonconnect/ui-react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import BackButton from "../../shared/ui/BackButton/BackButton";
import ArrowTop from "../../app/assets/arrow_top.svg";
import ArrowBottom from "../../app/assets/arrow_bottom.svg";
import { useTonAddress } from '@tonconnect/ui-react';
import { useUserStore } from "../../app/stores/userStore";
import axios from 'axios'
import translate from '../../../i18n.js';
import Alert from '../../widgets/Alert/Alert'
import './WalletPage.scss'

const WalletPage: React.FC = () => {
  const userAddress = useTonAddress();
  const { id } = useUserStore()
  const [showAlert, setShowAlert] = useState(false)
  const alertTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [messange, setMessange] = useState(null)


  const navigate = useNavigate(); 

  const handleLinkClick = async (event:  React.MouseEvent<HTMLElement>, to: string) => {
    event.preventDefault(); 
    if (!userAddress) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
      setShowAlert(true)
      setMessange(translate.t('connectWallet'))
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current)
      }
      alertTimeoutRef.current = setTimeout(() => setShowAlert(false), 3000)
    } else {
      try {
        const res = await axios.get(`/api/getwallet/${id}`);
        if (res.data == 'multi') {
          window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
          setShowAlert(true);  
          setMessange(translate.t('messangeMultiConnect'));
          if (alertTimeoutRef.current) {
            clearTimeout(alertTimeoutRef.current); 
          }
          alertTimeoutRef.current = setTimeout(() => {
            setShowAlert(false);  
          }, 3000);
        } else {
          navigate(to)
        }
      } catch (error) {
        console.error("Error fetching wallet data:", error);
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
        setShowAlert(true);
        setMessange(translate.t('errorOccurred'));
        if (alertTimeoutRef.current) {
          clearTimeout(alertTimeoutRef.current);
        }
        alertTimeoutRef.current = setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      }
    }
  };

  useEffect(() => {
    if (userAddress) {
      axios.post('/api/changewallet', {
        wallet: userAddress,
        id: id
      })
    } else {
      axios.post('/api/changewallet', {
        wallet: null,
        id: id
      })
    }
  }, [userAddress]);

  return (
    <div className="WalletPageWrapper">
      <TonConnectButton className="wallet-page__connect-button" />
      <Tabs className="wallet-page__tabs">
        <TabList className="wallet-page__tab-list">
          <Tab
            className="wallet-page__tab"
            selectedClassName="wallet-page__tab--selected"
            onClick={() => window.Telegram.WebApp.HapticFeedback.impactOccurred('light')}
          >

            {translate.t('deposit')}
            <img src={ArrowTop} alt="" />
          </Tab>
          <Tab
            className="wallet-page__tab"
            selectedClassName="wallet-page__tab--selected"
            onClick={() => window.Telegram.WebApp.HapticFeedback.impactOccurred('light')}
          >
            {translate.t('withdraw')}
            <img src={ArrowBottom} alt="" />
          </Tab>
        </TabList>

        <TabPanel
          className="wallet-page__tab-panel"
          selectedClassName="wallet-page__tab-panel--selected"
        >
          <div className="wallet-page__deposit-panel">
            <span className="WalletPage_wallet-text">{translate.t('wallet')}</span>
            <div className="WalletPage_tokens">
              <div
                onClick={(e) => handleLinkClick(e, "/deposit/ton")}
                className="TokenTon Token"
              >
                <span className="TokenName">Ton</span>
              </div>
              <div
                onClick={(e) => handleLinkClick(e, "/deposit/m5")}
                className="TokenM5 Token"
              >
                <div className="TokenName">M5</div>
              </div>
              <div
                onClick={(e) => handleLinkClick(e, "/deposit/dfc")}
                className="TokenDfc Token"
              >
                <span className="TokenName">DFC</span>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel
          className="wallet-page__tab-panel"
          selectedClassName="wallet-page__tab-panel--selected"
        >
          <div className="wallet-page__withdraw-panel">
            <span className="WalletPage_wallet-text">{translate.t('wallet')}</span>
            <div className="WalletPage_tokens">
              <div
                onClick={(e) => handleLinkClick(e, "/withdraw/ton")}
                className="TokenTon Token"
              >
                <span className="TokenName">Ton</span>
              </div>

              <div
                onClick={(e) => handleLinkClick(e, "/withdraw/m5")}
                className="TokenM5 Token"
              >
                <div className="TokenName">M5</div>
              </div>
              <div
                onClick={(e) => handleLinkClick(e, "/withdraw/dfc")}
                className="TokenDfc Token"
              >
                <div className="TokenName">DFC</div>
              </div>
            </div>
          </div>
        </TabPanel>
      </Tabs>
      <BackButton className="wallet-page__back-button" />
      {showAlert && <Alert onClose={() => setShowAlert(false)}>{messange}</Alert>}
    </div>
  );
};

export default WalletPage;
