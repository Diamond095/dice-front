import { PlayButton } from "../../shared/ui/PlayButton";
import "./NewGame.scss";
import { useGameCardStore } from "../../app/stores/gameCardsStore";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../app/stores/userStore";
import useGameStore from "../../app/stores/gameStore";
import translate from '../../../i18n.js';

interface NewGameProps {
  statusEmpty: boolean
}

const NewGame: React.FC<NewGameProps> = ({statusEmpty}) => {
  const { activeGames } = useGameCardStore()
  const { walletM5Balance, walletTonBalance,walletDfcBalance, id,
    decrementBalance } = useUserStore();
  const { setBet } = useGameStore();
  const navigate = useNavigate();
  const handleJoinGame = async () => {
    let userBalance;
    switch(activeGames[0].token){
      case 'ton':
        userBalance = walletTonBalance;
        break
      case 'dfc':
          userBalance = walletDfcBalance;
          break
      case 'm5':
          userBalance = walletM5Balance;
          break
    }
    
    if (userBalance < activeGames[0].betSize) {
      alert(`Недостаточно средств на балансе ${activeGames[0].token.toUpperCase()}`);
      return;
    } else {
      
      await axios.post('/api/entergame', {
        id: activeGames[0].gameNumber,
        user_id: id,
      }).then(() => {
        setBet(activeGames[0].betSize)
        decrementBalance(activeGames[0].token,activeGames[0].betSize)
        navigate(`/waitingconfirm/${activeGames[0].gameNumber}/enter`);
      });
    }
  };
  return (
    <div>
      {!statusEmpty && activeGames[0] ? (
        <div className="NewGameWrapper">
          <span className="NewGame--title">{translate.t('newGame')}</span>
          <div className="NewGame__details">
            <div className="NewGame__details-data">
              <span className="NewGame-id">#{activeGames[0].gameNumber}</span>
              <span className="NewGame-username">@{activeGames[0].creatorUsername}</span>
              <span className="NewGame-bet">{activeGames[0].betSize + ' ' + activeGames[0].token}</span>
            </div>
            <div onClick={handleJoinGame}>
            <PlayButton className="NewGame__details-button" />
            </div>
          </div>
        </div>) :
        (<div className="NewGameWrapper">
          <span className="NewGame--title">{translate.t('nobody')}</span>
          <div className="NewGame__details">
            <div className="NewGame__details-data">
              <span className="NewGame-id" style={{color: '#767676',fontSize: '16px'}}>{translate.t('createLobby')}</span>
            </div>
          </div>
        </div>)}
    </div>)
};

export default NewGame;
