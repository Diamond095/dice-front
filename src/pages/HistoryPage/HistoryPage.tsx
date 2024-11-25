import HistoryList from "../../widgets/HistoryList/HistoryList";
import { Navbar } from "../../widgets/Navbar";
import "./HistoryPage.scss";
import { useGameCardStore, GameType, GameResult } from "../../app/stores/gameCardsStore";
import axios from 'axios'
import React, { useEffect, useState } from "react";
import { useUserStore } from "../../app/stores/userStore";
import translate from '../../../i18n.js';

const HistoryPage: React.FC = () => {
  const addInactiveGame = useGameCardStore((state) => state.addInactiveGame);
  const addMyInactiveGame = useGameCardStore((state) => state.addMyInactiveGame);
  const [myHistorySelected, setMyHistorySelected] = useState(false)
  const {id} = useUserStore()
  

  useEffect(() => {
    axios.get('/api/lastgames').then(
      res => {
          res.data.reverse().map((game: any) => {
              addInactiveGame({
                  type: game.enterUserId != 1 ? 'player' as GameType : 'bot' as GameType,
                  gameNumber: game.id,
                  creatorUsername: game.create_user.name,
                  token: game.typePayment,
                  betSize: game.sumOfBet,
                  result: (game.winner.id !== 1) ? 'WIN' : 'LOSE' as GameResult,
                  time: game.updated_at,
                  winnerName: game.winner.name,
                  opponentName: game.enter_user.name,
                  pointsNeeded: game.maxAmountOfWins,
                  createUserPoints: game.createUserPoints, 
                  enterUserPoints: game.enterUserPoints
              })
          }
          );
      })
      axios.get(`/api/history/${id}`).then(
        res => {
            res.data.reverse().map((game: any) => {
                addMyInactiveGame({
                    type: game.enterUserId != 1 ? 'player' as GameType : 'bot' as GameType,
                    gameNumber: game.id,
                    creatorUsername: game.create_user.name,
                    token: game.typePayment,
                    betSize: game.sumOfBet,
                    result: (game.winner.id !== 1) ? 'WIN' : 'LOSE' as GameResult,
                    time: game.updated_at,
                    winnerName: game.winner.name,
                    opponentName: game.enter_user.name,
                    pointsNeeded: game.maxAmountOfWins,
                    createUserPoints: game.createUserPoints, 
                    enterUserPoints: game.enterUserPoints
                })
            }
            );
        })
  }, [])

  const toggleHistory = (status: boolean) => {
    setMyHistorySelected(status)
    window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
  }
  return (
    <>
      <div className="switch">
        <div className={`switch-element right ${!myHistorySelected ? `selected` : null}`} onClick={() =>  toggleHistory(false)}>
          {translate.t('generalHistory')}
        </div>
        <div className={`switch-element left ${myHistorySelected ? `selected` : null}`} onClick={(e) =>  toggleHistory(true)}>
          {translate.t('myHistory')}
        </div>
      </div>
      <div className="HistoryPageWrapper">
        <HistoryList type={myHistorySelected ? 'my': 'general'}/>
      </div>
      <Navbar />
    </>
  );
};

export default HistoryPage;
