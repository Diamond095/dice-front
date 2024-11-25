import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import BackButton from "../../shared/ui/BackButton/BackButton";
import { PlayButton } from "../../shared/ui/PlayButton";
import { useCreateGameStore } from "../../app/stores/createGameStore";
import "./CreateGamePage.scss";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'
import useGameStore from "../../app/stores/gameStore";
import { useUserStore } from "../../app/stores/userStore";
import translate from '../../../i18n.js';


const CreateGamePage: React.FC = () => {
  const { gameType, winsTillEnd } = useCreateGameStore();
  const [gameBet, setGameBet] = useState(null)
  const { setSelectedToken, id } = useUserStore()
  const [gameToken, setGameToken] = useState('m5')
  const navigate = useNavigate();
  const [points, setPoints] = useState(15)
  const { type } = useParams()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState(null)
  const { setBet } = useGameStore()
  const [isCreated, setIsCreated] = useState(false)
  const { walletM5Balance, walletTonBalance, walletDfcBalance, decrementBalance } = useUserStore()


  const handleBetClick = (amount: number) => {
    window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
    if (amount == 0) {
      if (type == 'with-bot') {
        switch (gameToken) {
          case 'm5':
            setGameBet(0.5)
            break
          case 'ton':
            setGameBet(0.3)
            break
          case 'dfc':
            setGameBet(1)
            break
        }
      } else {
        switch (gameToken) {
          case 'm5':
            setGameBet(3)
            break
          case 'ton':
            setGameBet(1)
            break
          case 'dfc':
            setGameBet(6)
            break
        }
      }
    } else {
      setGameBet(amount)
    }
  };

  const handleCreateGame = () => {
    console.log(points)
    const postData = {
      sumOfBet: gameBet,
      pointstillend: points,
      createUserId: id,
      type: gameToken
    };
    console.log(postData)
    if (gameBet == null) {
      setErrors(translate.t('enterBet'))
      return
    }
    if ((gameToken == 'm5' && gameBet < 0.5 && type == 'with-bot')
      || (gameToken == 'ton' && gameBet < 1 && type == 'with-user')
      || (gameToken == 'ton' && gameBet < 0.3 && type == 'with-bot')
      || (gameToken == 'm5' && gameBet < 3 && type == 'with-user')
      || (gameToken == 'dfc' && gameBet < 6 && type == 'with-user')
      || (gameToken == 'dfc' && gameBet < 1 && type == 'with-bot')) {
      setErrors(translate.t('enterValidBetMin'))
      return
    }
    if (points < 15 || points > 45) {
      setErrors(translate.t('correctPoints'))
      return
    }
    if (((gameToken == 'm5' || gameToken == 'dfc') && gameBet >= 1000)
      || (gameToken == 'ton' && gameBet >= 100)) {
      setErrors(translate.t('enterValidBetMax'))
      return
    }
    if ((gameToken == 'm5' && walletM5Balance < gameBet)
      || (gameToken == 'dfc' && walletDfcBalance < gameBet)
      || (gameToken == 'ton' && walletTonBalance < gameBet)) {
      setErrors(translate.t('notEnoughBalance'))
      return
    }
    if (type == 'with-bot') {
      if ((gameToken == 'ton' && gameBet <= 100)
        || (gameToken == 'm5' && gameBet <= 1000)
        || (gameToken == 'dfc' && gameBet <= 150)) {
        if (gameBet && winsTillEnd) {
          setLoading(true);
        }
        setIsCreated(true)
        axios.post('/api/gamewithbot', postData)
          .then((response) => {
            setLoading(false);
            navigate(`/game/${response.data.id}/with-bot`)
            decrementBalance(gameToken, gameBet)
          })
          .catch((error) => {
            setLoading(false);
            if (error.response) {
              setErrors(error.response.data.errors);
            }
          });
      }
    }
    if (type == 'with-user') {
      setIsCreated(true)
      if (gameBet && points) {
        setLoading(true);
      }
      axios.post('/api/game', postData)
        .then(res => {
          setBet(res.data.data.sumOfbet)
          decrementBalance(gameToken, gameBet)
          navigate(`/waiting/${res.data.data.number}`)
        }).catch((error) => {
          setLoading(false);
          if (error.response) {
            setErrors(error.response.data.errors);
          }
        });
    }
  }
  const handleChangeToken = (token) => {
    setGameToken(token)
    setSelectedToken(token)
    window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
  }
  const handleBetInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setGameBet(value);
  };
  const handlePointsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setPoints(value)
  };


  const incrementWins = () => {
    window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
    setPoints(Math.min(MAX_WINS, points + 1))
  };
  const decrementWins = () => {
    setPoints(Math.max(15, points - 1))
    window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
  }
  const MAX_WINS = 45;

  return (
    <>
      <div className="CreateGameWrapper">
        <span className="CreateGame--title">
          <span>{translate.t('creation')}</span>
        </span>
        <div className="CreateGame--type">
          <Tabs>
            <div className="tabs">
              <TabList>
                <Tab onClick={() => handleChangeToken('m5')}>M5</Tab>
                <Tab onClick={() => handleChangeToken('ton')}>Ton</Tab>
                <Tab onClick={() => handleChangeToken('dfc')}>DFC</Tab>
              </TabList>
            </div>
            <TabPanel>
              <BetInput
                gameBet={gameBet}
                handleBetClick={handleBetClick}
                handleBetInputChange={handleBetInputChange}
                gameToken={gameToken}
              />
            </TabPanel>
            <TabPanel>
              <BetInput
                gameBet={gameBet}
                handleBetClick={handleBetClick}
                handleBetInputChange={handleBetInputChange}
                gameToken={gameToken}
              />
            </TabPanel>
            <TabPanel>
              <BetInput
                gameBet={gameBet}
                handleBetClick={handleBetClick}
                handleBetInputChange={handleBetInputChange}
                gameToken={gameToken}
              />
            </TabPanel>
          </Tabs>
          <div style={{ fontSize: '14px', margin: '1vh auto', color: '#E92E38' }} >
            {errors}
          </div>
          <div className="game-setup__wins-till-end">
            <span>{translate.t('sumPoints')}</span>
            <div className="wins-selector">
              <button onClick={decrementWins} disabled={winsTillEnd <= 1}>
                -
              </button>
              <input value={points} type="number" className="winsTillEnd" onChange={handlePointsChange} />
              <button onClick={incrementWins} disabled={winsTillEnd >= MAX_WINS}>
                +
              </button>
            </div>
          </div>
        </div>
        <div className="CreateGame--navigation">
          <BackButton />
          {!isCreated && <div onClick={handleCreateGame}>
            <PlayButton className="play-button" />
          </div>}
        </div>
      </div>
    </>
  );
};

interface BetInputProps {
  gameBet: number;
  handleBetClick: (amount: number) => void;
  handleBetInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  gameToken: string
}

const BetInput: React.FC<BetInputProps> = ({
  gameBet,
  handleBetClick,
  handleBetInputChange,
  gameToken
}) => {
  const { type } = useParams()
  const [MAXBET, setMAXBET] = useState(null)
  const [quickBet, setQuickBet] = useState([0.5, 1, 2])
  useEffect(() => {
    if (type == 'with-bot') {
      switch (gameToken) {
        case 'ton':
          setQuickBet([0.5, 1, 2])
          setMAXBET(100)
          break
        case 'm5':
          setQuickBet([3, 5, 10])
          setMAXBET(1000)
          break
        case 'dfc':
          setQuickBet([6, 10, 20])
          setMAXBET(150)
          break
      }
    } else {
      switch (gameToken) {
        case 'ton':
          setQuickBet([1, 2, 5])
          setMAXBET(100)
          break
        case 'm5':
          setQuickBet([5, 10, 20])
          setMAXBET(1000)
          break
        case 'dfc':
          setQuickBet([10, 20, 40])
          setMAXBET(150)
          break
      }
    }
  }, [])
  return (
    <div className="BetInput">
      <span className="BetInput--text">{translate.t('bet')}</span>
      <input placeholder={translate.t('enterBet')} type="number" value={gameBet} onChange={handleBetInputChange} />
      <div className="quickBet">
        <button onClick={() => handleBetClick(0)}>{translate.t('min')}</button>
        {quickBet.map((amount) => (
          <button
            key={amount}
            onClick={() => handleBetClick(amount)}
            className={gameBet === amount ? "active" : ""}
          >
            {amount}
          </button>
        ))}
        <button onClick={() => handleBetClick(MAXBET)}>{translate.t('max')}</button>
      </div>
    </div>
  );
};

export default CreateGamePage;
