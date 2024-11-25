import React from "react";
import "./ActiveList.scss";
import { ActiveGame } from "../../shared/ui/ActiveGame";
import { useGameCardStore } from "../../app/stores/gameCardsStore";
import translate from '../../../i18n.js';

interface ActiveGameProps {
  gameNumber: number;
  user1: string;
  betAmount: number;
  token:  "ton" | "m5" | "dfc" 
}

const ActiveList: React.FC = () => {
  const { activeGames } = useGameCardStore();
  const handlePlay = (gameNumber: number) => {
    console.log(`Playing game #${gameNumber}`);
  };

  return (
    <div className="ActiveListWrapper">
      {activeGames.map((game) => (
        <ActiveGame
          key={game.gameNumber}
          gameNumber={game.gameNumber}
          user1={game.creatorUsername}
          betAmount={game.betSize}
          token={game.token}
          onPlay={handlePlay}
        />
      ))}
      {activeGames.length == 0 && (
        <div style={{display:'flex', alignItems: 'center',height:'100%'}}>
          <div style={{margin: 'auto',textAlign: 'center'}}>
            <div style={{fontSize: '30px'}}>
            {translate.t('nobody')}
            </div>
            <div style={{fontSize: '18px', color: '#767676'}}>
              {translate.t('createLobby')}
              </div>
            </div>
          </div>
      )}
    </div>
  );
      }

export default ActiveList;
