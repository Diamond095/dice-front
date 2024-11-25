import React from "react";
import "./HistoryList.scss";
import HistoryGame from "../../shared/ui/HistoryGame/HistoryGame";
import { useGameCardStore } from "../../app/stores/gameCardsStore";
import { useUserStore } from "../../app/stores/userStore";
import translate from '../../../i18n.js';

interface GameHistory {
  gameNumber: number;
  user1: string;
  user2?: string;
  betAmount: number;
  winner?: string;
  gameType: "with-bot" | "with-user"
  token: "m5" | "ton" | "dfc" 
}
interface HistoryListProps  {
  type: 'my' | 'general'
}
const HistoryList: React.FC<HistoryListProps> = ({type}) => {
  const { inactiveGames, myInactiveGames } = useGameCardStore()
  const {username, first_name, last_name}  = useUserStore()
  const name = username || (first_name ? `${first_name} ${last_name || ''}` : null);
  return (
    <div className="HistoryListWrapper">
      {type == 'general' ? inactiveGames.map((game) => (
        <HistoryGame
          key={game.gameNumber}
          gameNumber={game.gameNumber}
          user1={game.creatorUsername}
          user2={game.opponentName}
          betAmount={game.betSize}
          winner={game.winnerName}
          gameType={game.opponentName == 'Bot' ? 'with-bot' : 'with-user'}
          token={game.token}
          result={game.result}
          createUserPoints={game.createUserPoints}
          enterUserPoints={game.enterUserPoints}
          timeEnd={game.time}
          type={type}
        />
      )) :
      myInactiveGames.map((game) => (
        <HistoryGame
          key={game.gameNumber}
          gameNumber={game.gameNumber}
          user1={game.creatorUsername == name ? translate.t('you') : game.creatorUsername}
          user2={game.opponentName == name ? translate.t('you') : game.opponentName}
          betAmount={game.betSize}
          winner={game.winnerName == name ? translate.t('you') : game.opponentName}
          gameType={game.opponentName == 'Bot' ? 'with-bot' : 'with-user'}
          token={game.token}
          result={game.result}
          createUserPoints={game.createUserPoints}
          enterUserPoints={game.enterUserPoints}
          timeEnd={game.time}
          type={type}
        />
      ))}
    </div>
  );
};

export default HistoryList;
