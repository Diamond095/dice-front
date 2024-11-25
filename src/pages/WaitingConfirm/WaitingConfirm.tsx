import './WaitingConfirm.scss'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useGameStore from '../../app/stores/gameStore';
import DiceDark from '../../app/assets/DiceDark.png'
import translate from '../../../i18n.js';
import { useUserStore } from '../../app/stores/userStore.js';

declare global {
    interface Window {
        Telegram: any;
    }
}

const WaitingConfirm: React.FC = () => {
    const navigate = useNavigate();
    const { incrementBalance  } = useUserStore()
    const { number, type } = useParams();
    const [token, setToken] = useState(null)
    const [statusConfirm, setStatusConfirm] = useState(false)
    const { bet, setBet } = useGameStore();
    const [timer, setTimer] = useState(60)
    const [isRed, setIsRed] = useState(false)
    useEffect(() => {
        axios.post('/api/readyinfo', {
            gameId: number
        }).then(res => {
            setTimer(res.data.amountOfTime)
            setToken(res.data.token);
            setStatusConfirm(res.data.status)
            if (res.data.status == 0) {
                setStatusConfirm(false)
            } else {
                setStatusConfirm(true)
            }
        })
    }, [type]);
    useEffect(() => {
        const interval = setInterval(() => {
            if (timer > 0) {
                setTimer(timer - 1);
            }
            if (timer <= 15) {
                setIsRed(!isRed);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);
    useEffect(() => {
        window.Echo.channel(`redirecttogame${number}`).listen('.redirecttogame', () => {
            navigate(`/game/${number}/${type}`);
        });
        window.Echo.channel(`timerready${number}`).listen('.timerready', () => {
            axios.get(`/api/bet/${number}`).then(
                res => {
                    incrementBalance(res.data.token, res.data.bet)
                }
            )
            setBet(0)
            navigate('/');
        });
    }, []);
    const handleConfirm = () => {
        axios.post('/api/ready', {
            type: type,
            gameId: number
        }).then(() => {
            setStatusConfirm(true)
        })
    }
    return (
            <div className='waiting-confirm' >
                    <img className='dice-dark' src={DiceDark}></img>
                <div>
                <div>
                    <div className='main-text' style={{fontSize: '2rem', color:'#E92E38',   textShadow: '0 0 3vw rgb(255, 255, 25, 20%)'}}>
                       {translate.t('playerFound')}
                    </div>
                    <div className='secondary-text' style={{fontSize: '16px'}}>
                        {translate.t('confirmMessage')}
                    </div>
                </div>
                <div style={{marginTop: '2.5vh'}}>
                    <div style={{fontSize: '20px', color:'#E92E38',   textShadow: '0 0 3vw rgb(255, 255, 25, 20%)'}}>
                        {timer} {translate.t('sec')}
                    </div>
                    <div style={{fontSize:'15px'}}>
                     {translate.t('timeToConfirm')}
                    </div>
                </div>
                </div>
              { !statusConfirm &&  ( <div className='confirm-button' onClick={handleConfirm}>
                    <div className='confirm'>
                        {translate.t('confirm')}
                    </div>
                </div>)}
        </div>
    )
}

export default WaitingConfirm 