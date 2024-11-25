import React, { useRef, useState, useEffect } from "react";
import "./GamePage.scss";
import { MyDiceTurn } from "../../widgets/MyDiceTurn";
import { OpponentDiceTurn } from "../../widgets/OpponentDiceTurn";
import useGameStore from "../../app/stores/gameStore";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useUserStore } from "../../app/stores/userStore";
import { useNavigate } from "react-router-dom";
import translate from '../../../i18n.js';
import clock from '../../app/assets/clock-image.png'

const GamePage: React.FC = () => {
  const navigate = useNavigate()
  const { number, type } = useParams()
  const [round, setRound] = useState(0)
  const [colorResult, setColorResult] = useState('')
  const myDicesRef = useRef<{ throwDice: () => void }>(null);
  const opponentDicesRef = useRef<{ throwDice: () => void }>(null)

  const {
    setMyFirstDice, setOpponentFirstDice,
    setMySecondDice, setOpponentSecondDice,
    yourPoints, setYourPoints,
    timer, setTimer, setIsRed,
    isRed, reset } = useGameStore()
  const { 
    walletDfcBalance,
    walletM5Balance, walletTonBalance, id, incrementBalance } = useUserStore()

  const [result, setResult] = useState(null);
  const [statusTurn, setStatusTurn] = useState(false);
  const [opponent, setOpponent] = useState('')
  const [opponentPoints, setOpponentPoints] = useState(0)

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
    window.Echo.channel(`timerend${number}`).listen('.timerend', (data) => {
      setResult(data.winner === id ? translate.t('win') : translate.t('lose'));
    });
    if (type == 'create') {
      axios.get(`/api/turnsforusersgame/${number}/${id}`).then((res) => {
        setTimer(res.data.amountOfSecondsForTurn);
        if (res.data.whoseTurn == type) {
          setStatusTurn(true)
        } else {
          setStatusTurn(false)
        }
        setRound(res.data.round)
        setOpponent(res.data.opponent);
        setOpponentPoints(res.data.enterUserPoints)
        setYourPoints(res.data.createUserPoints)
        if (res.data.result) {
          if (res.data.result == 'WIN') {
            setResult(translate.t('win'))
          } else {
            setResult(translate.t('lose'))
          }
        }
      });
      window.Echo.channel(`enteruserturn${number}`).listen(
        '.enteruserturn',
        (data: any) => {
          setRound(round + 1)
          setOpponentFirstDice(data.firstDice)
          setOpponentSecondDice(data.secondDice)
          opponentDicesRef.current?.throwDice();
          setTimeout(() => {
            setOpponentPoints(prevPoints => prevPoints + data.secondDice + data.firstDice + data.bonus);
            if(data.result){
            if (data.result == 'LOSE') {
              setResult(translate.t('lose'))
            } else {
              setResult(translate.t('win'))
              incrementBalance(data.typePayment,1.9 * data.sumOfBet)
            }
          }
            setStatusTurn(true)
          }, 2000)
          setTimer(60);
          setIsRed(false);
        }
      );
    } else if (type == 'enter') {
      axios.get(`/api/turnsforusersgame/${number}/${id}`).then((res) => {
        setTimer(res.data.amountOfSecondsForTurn);
        if (res.data.whoseTurn == type) {
          setStatusTurn(true)
        } else {
          setStatusTurn(false)
        }
        setRound(res.data.round)
        setOpponent(res.data.opponent);
        setOpponentPoints(res.data.createUserPoints)
        setYourPoints(res.data.enterUserPoints)
        if (res.data.result) {
          if (res.data.result == 'WIN') {
            setResult(translate.t('win'))
          } else {
            setResult(translate.t('lose'))
          }
        }
      });
      window.Echo.channel(`createuserturn${number}`).listen('.createuserturn', (data: any) => {
        setOpponentFirstDice(data.firstDice)
        setOpponentSecondDice(data.secondDice)
        opponentDicesRef.current?.throwDice();
        setTimeout(() => {
          setOpponentPoints(prevPoints => prevPoints + data.secondDice + data.firstDice + data.bonus);
          setStatusTurn(true)
        }, 2000)
        setTimer(60);
        setIsRed(false);
      });
    } else {
      setStatusTurn(true)
      axios.get(`/api/turns/${number}/${id}`).then((res) => {
        setTimer(res.data.amountOfSecondsForTurn);
        setYourPoints(res.data.userPoints)
        setOpponent(translate.t('bot'));
        setOpponentPoints(res.data.botPoints)
        if (res.data.result) {
          if (res.data.result == 'WIN') {
            setResult(translate.t('win'))
                    } else {
            setResult(translate.t('lose'))
          }
        }
      });
    }
    window.Echo.channel(`timerend${number}`).listen('.timerend', (data) => {
      setResult(data.winner === id ? translate.t('win') : translate.t('lose') );
    });
  }, [walletM5Balance, walletTonBalance, walletDfcBalance]);

  const handleThrowDice = async () => {
    setTimer(60);
    setIsRed(false);
    setStatusTurn(false)

    if (type === 'create') {
      setStatusTurn(false)
      axios.post('/api/createuserturn', {
        gameId: number,
        userId: id
      })
        .then(res => {
          setMyFirstDice(res.data.firstDice)
          setMySecondDice(res.data.secondDice)
          myDicesRef.current?.throwDice()
          
          setTimeout(() => {
            setYourPoints(yourPoints + res.data.secondDice + res.data.firstDice + res.data.bonus)
          }, 2000)
        });
    } else if (type === 'enter') {
      axios.post('/api/enteruserturn', {
        gameId: number,
        userId: id
      }).then(res => {
          setMyFirstDice(res.data.firstDice)
          setMySecondDice(res.data.secondDice)
          setRound(round + 1)
          myDicesRef.current?.throwDice();
          setTimeout(() => {
            setYourPoints(yourPoints + res.data.secondDice + res.data.firstDice + res.data.bonus)
            if (res.data.result) {
              if (res.data.result == 'LOSE') {
                setResult(translate.t('lose'))
              } else {
                setResult(translate.t('win'))
                incrementBalance(res.data.typePayment,1.9 * res.data.sumOfBet)
              }
            }
          }, 2000)
        });
    } else {
      await axios.post('/api/turnbot', {
        gameId: number,
        userId: id
      }).then(res => {
        setRound(round + 1)
        setMyFirstDice(res.data.firstDice)
        setOpponentFirstDice(res.data.firstDiceBot)
        setOpponentSecondDice(res.data.secondDiceBot)
        setMySecondDice(res.data.secondDice)
        myDicesRef.current?.throwDice();
        opponentDicesRef.current?.throwDice();
        setTimeout(() => {
          setYourPoints(yourPoints + res.data.secondDice + res.data.firstDice + res.data.bonus)
          setOpponentPoints(opponentPoints + res.data.secondDiceBot + res.data.firstDiceBot + res.data.bonusBot)
          if (res.data.result) {
            if (res.data.result == 'LOSE') {
              setResult(translate.t('lose'))
            } else {
              setResult(translate.t('win'))
              incrementBalance(res.data.typePayment,2 * res.data.sumOfBet)
            }
          }
          setStatusTurn(true)
        }, 2000)
      })
    };
  }
  const handleHome = () => {
    reset()
    navigate('/')
  }
  return (
    <div>
      {result && (
        <div className="result" style={{ background: colorResult }}>
          <div className="result-text">
            {translate.t('you')} {result}
          </div>
        </div>)
      }
      {!result && (<div className="top">
        <div className="timer" style={{ color: isRed ? 'red' : 'white' }}>
          <div style={{height: '5vw'}}><img style={{width:'5vw', height: '5vw'}} src={clock}></img></div>
          <div>{timer} {translate.t('secLeft')}</div>
        </div>
        <div className="whose-turn">
          {type != 'with-bot' && (statusTurn ?  translate.t('your') + " " + translate.t('turn') : translate.t('opponent') + " " + translate.t('turn'))}
        </div>
      </div>)}
      <div className="GamePageContainer">
        <div className="GamePageWrapper">
          <div className="Game--header">
            <div className="Game--round-number">{translate.t('round')} {round !=0 ? round : 1}</div>
            <div className="Game--opponent-username">
              <div style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '24vw'
              }}>@{opponent}</div> 
              <div>{opponentPoints}</div>
              </div>
          </div>
          <div className="Game--body">
            <MyDiceTurn
              ref={myDicesRef}
            />
            <OpponentDiceTurn
              ref={opponentDicesRef}
            />
            <div className="MySum">{translate.t('you')}: {yourPoints}</div>
          </div>
          {!result && statusTurn && (<div className="Game--navigation" onClick={handleThrowDice}>
            <button className="Game--throw-button" >
              {translate.t('throw')}
            </button>
          </div>)}
          {result && (<div className="Game--navigation" onClick={handleHome}>
            <button className="Game--throw-button" >
              {translate.t('toMain')}
            </button>
          </div>)}
        </div>
      </div>
    </div>
  );
};

export default GamePage;