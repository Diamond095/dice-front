import React, { useState, useRef, useEffect } from 'react';
import './Training.scss'
import burnGif from '../../app/assets/burn.gif'
import diceGif from '../../app/assets/dice.gif'
import moneyGif from '../../app/assets/money.gif'
import pvpImg from '../../app/assets/pvp-img.jpg'
import botImg from '../../app/assets/bot-img.jpg'
import bonusImg from '../../app/assets/bonus-img.jpg'
import defaultBackground from '../../app/assets/default-background.jpg'
import clock from '../../app/assets/clock-image.png'
import translate from '../../../i18n.js';
import useGameStore from '../../app/stores/gameStore';
import { useNavigate } from "react-router-dom";
import { MyDiceTurn } from "../../widgets/MyDiceTurn";
import { OpponentDiceTurn } from "../../widgets/OpponentDiceTurn";
import { useUserStore } from '../../app/stores/userStore.js';

const Training: React.FC = () => {

    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate()
    const slides = [1, 2, 3, 4, 5, 6, 7];
    const [text, setText] = useState([translate.t('throwCubes'), translate.t('collectPoints'), translate.t('winner')])
    const [gif, setGif] = useState(diceGif)
    const [title, setTitle] = useState('main')
    const [backgroundImage, setBackground] = useState(defaultBackground)
    const [statusGame, setStatusGame] = useState(false)
    const [round, setRound] = useState(0)
    const [colorResult, setColorResult] = useState('')
    const myDicesRef = useRef<{ throwDice: () => void }>(null);
    const opponentDicesRef = useRef<{ throwDice: () => void }>(null)
    const [result, setResult] = useState(null);
    const [textPositionY, setTextPosition] = useState()
    const [statusTurn, setStatusTurn] = useState(true);
    const [opponentPoints, setOpponentPoints] = useState(0)
    const [yourPoints, setYourPoints] = useState(0)
    const [statusMargin, setStatusMargin] = useState(false)
    const [img, setImg] = useState(null)
    const { setTraining } = useUserStore()
    const {
        setMyFirstDice, setOpponentFirstDice,
        setMySecondDice, setOpponentSecondDice,
        timer, setTimer, setIsRed,
        isRed, reset } = useGameStore()
    const goToSlide = (index) => {
        setCurrentSlide(index);
    }

    const rollDice = () => {
        return Math.floor(Math.random() * 6) + 1
    }

    const handleHome = () => {
        localStorage.setItem('training', JSON.stringify(true))
        reset()
        navigate('/')
        setTraining(true)
    }
    const goToNextSlide = () => {
        switch (currentSlide + 1) {
            case 1:
                setTitle('pvp')
                setGif(null)
                setText([translate.t('')])
                setImg(pvpImg)
                setBackground(null)
                break;
            case 2:
                setTitle('bot')
                setGif(null)
                setBackground(null)
                setImg(botImg)
                break;
            case 3:
                setTitle('bonus')
                setBackground(null)
                setImg(bonusImg)
                setGif(null)
                break;
            case 4:
                setTitle('payment')
                setText([translate.t('paymentInfo1'), translate.t('paymentInfo2'), translate.t('paymentInfo3')])
                setGif(moneyGif)
                setImg(null)
                setStatusMargin(false)
                setBackground(defaultBackground)
                break;
            case 5:
                setTitle('burn')
                setBackground(defaultBackground)
                setStatusMargin(false)
                setImg(null)
                setText([translate.t('burnTitle'), translate.t('burnInfo1'), translate.t('burnInfo2'), translate.t('burnInfo3')])
                setGif(burnGif)
                break;
            case 6:
                setStatusGame(true)
                setTitle(null)
                setImg(null)
                setBackground(defaultBackground)
                setGif(null)
                break;
        }
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    };
    const determineWinner = (myFirstDice, mySecondDice, botFirstDice, botSecondDice) => {
        const updatedYourPoints = yourPoints + myFirstDice + mySecondDice
        const updatedOpponentPoints = opponentPoints + botFirstDice + botSecondDice
        if (updatedYourPoints >= 30 || updatedOpponentPoints >= 30) {
            let result = '';
            if (updatedYourPoints === updatedOpponentPoints) {
                return
            } else if (updatedYourPoints >= 30 && updatedOpponentPoints >= 30) {
                if (updatedYourPoints > updatedOpponentPoints) {
                    setResult(translate.t('win'))
                } else {
                    setResult(translate.t('lose'))
                }
            } else if (updatedYourPoints >= 30) {
                setResult(translate.t('win'))
            } else if (updatedOpponentPoints >= 30) {
                setResult(translate.t('lose'))
            }
        }
    }
    useEffect(() => {
        const interval = setInterval(() => {
            console.log(currentSlide)
            if (currentSlide == 6) {
                if (timer > 0) {
                    setTimer(timer - 1);
                }
                if (timer <= 15) {
                    setIsRed(!isRed);
                }
                if (timer == 0) {
                    setResult('lose')
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [timer, currentSlide]);
    const handleThrowDice = () => {
        setRound(round + 1)
        setStatusTurn(false)
        const myFirstDice = rollDice()
        const mySecondDice = rollDice()
        const botFirstDice = rollDice()
        const botSecondDice = rollDice()
        const myBonus = myFirstDice == mySecondDice ? 2 : 0
        const botBonus = botFirstDice == botSecondDice ? 2 : 0
        setMyFirstDice(myFirstDice)
        setOpponentFirstDice(botFirstDice)
        setOpponentSecondDice(botSecondDice)
        setMySecondDice(mySecondDice)
        myDicesRef.current?.throwDice();
        opponentDicesRef.current?.throwDice();
        setTimeout(() => {
            setYourPoints(yourPoints + mySecondDice + myFirstDice + myBonus)
            setOpponentPoints(opponentPoints + botSecondDice + botFirstDice + botBonus)
            determineWinner(myFirstDice, mySecondDice, botFirstDice, botSecondDice)
            setStatusTurn(true)
        }, 2000)
    }

    return (
        <div className='training' style={{ backgroundImage: `url(${backgroundImage})` }}>
            {!statusGame ?
                <div><div className="slider-container" >

                </div>
                    {gif && <div className='gif-block'>
                        <img className='gif' src={gif}></img>
                    </div>
                    }
                    {img ? <div className='img-block'>
                        <img className="img" src={img}></img>
                    </div>
                        : null}
                    <div className='slide-text'>
                        {
                            text.map((partText, index) => (
                                <div style={{ margin: statusMargin ? '0.7vh' : null }}>
                                    {partText}
                                </div>
                            ))
                        }
                    </div>
                    <div className='bottom'>
                        <div className="dots-container">
                            {slides.map((_, index) => (
                                <span
                                    key={index}
                                    className={`dot ${currentSlide === index ? 'active' : ''}`}
                                    onClick={() => goToSlide(index)}
                                ></span>
                            ))}
                        </div>

                        <div className="next-button" onClick={goToNextSlide}>
                            {translate.t('continue')}
                        </div>
                        <div className="dots">
                            {slides.map((_, index) => (
                                <span
                                    key={index}
                                    className={`dot ${index === currentSlide ? 'active' : ''}`}
                                    onClick={() => setCurrentSlide(index)}
                                ></span>
                            ))}
                        </div>
                    </div>
                </div> :
                <div style={{ paddingTop: '6vh', fontFamily: "Rubik" }}>
                    <div style={{textAlign: "center", padding: '2vh 0', fontSize: '18px', fontWeight:'600'}}>
                    {translate.t('demoInfo')}
                    </div>

                    {result && (
                        <div className="result" style={{ background: colorResult }}>
                            <div className="result-text">
                                {translate.t('you')} {result}
                            </div>
                        </div>)
                    }
                    {!result && (<div className="top">
                        <div className="timer" style={{ color: isRed ? 'red' : 'white' }}>
                            <div style={{ height: '5vw' }}><img style={{ width: '5vw', height: '5vw' }} src={clock}></img></div>
                            <div>{timer} {translate.t('secLeft')}</div>
                        </div>
                        <div className="whose-turn">
                            {(statusTurn ? translate.t('your') + " " + translate.t('turn') : translate.t('opponent') + " " + translate.t('turn'))}
                        </div>
                    </div>)}
                    <div className="GamePageContainer">
                        <div className="GamePageWrapper">
                            <div className="Game--header">
                                <div className="Game--round-number">{translate.t('round')} {round != 0 ? round : 1}</div>
                                <div className="Game--opponent-username">
                                    <div style={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        width: '24vw'
                                    }}>{translate.t('bot')}</div>
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
                </div>}
        </div>

    );
}
export default Training