import React from "react";
import { PlayButton } from "../PlayButton";
import "./ActiveGame.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../../app/stores/userStore";
import useGameStore from "../../../app/stores/gameStore";
interface ActiveGameProps {
  gameNumber: number
  user1: string
  betAmount: number
  token: "m5" | "ton" | "dfc"
  onPlay: (gameNumber: number) => void
}

const ActiveGame: React.FC<ActiveGameProps> = ({
  gameNumber,
  user1,
  betAmount,
  token,
}) => {
  const { walletM5Balance, walletTonBalance, walletDfcBalance, id,
    decrementBalance } = useUserStore()
  const { setBet } = useGameStore()
  const navigate = useNavigate()
  const handleJoinGame = async () => {
    console.log(walletDfcBalance)
    if ((token == 'dfc' && Number(walletDfcBalance) < betAmount)
    || (token == 'm5' && walletM5Balance < betAmount)
    ||(token == 'ton' && walletTonBalance < betAmount)) {
      alert(`Недостаточно средств на балансе ${token.toUpperCase()}`)
      return;
    } else {
      await axios.post('/api/entergame', {
        id: gameNumber,
        user_id: id,
      }).then(() => {
        setBet(betAmount)
        decrementBalance(token, betAmount)
        navigate(`/waitingconfirm/${gameNumber}/enter`)
      });
    }
  };
  return (
    <div className="ActiveGameWrapper">
      <span className="ActiveGame--number">Game #{gameNumber}</span>
      <div className="ActiveGame--details">
        <span className="ActiveGame--user">@{user1}</span>
        <span className="ActiveGame--bet">
          {betAmount} {token}
        </span>
        <div onClick={handleJoinGame}>
          <PlayButton className="ActiveGame--button" />
        </div>
      </div>
    </div>
  );
};

export default ActiveGame;
