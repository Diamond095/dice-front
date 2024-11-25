import React from "react"
import "./CreateButton.scss"
import { Link } from "react-router-dom"
import {
  useCreateGameStore,
  GameType,
} from "../../../app/stores/createGameStore"
import translate from '../../../../i18n.js'


interface CreateButtonProps {
  className?: string;
  gameType: GameType;
}

const CreateButton: React.FC<CreateButtonProps> = ({ className, gameType }) => {
  const setGameType = useCreateGameStore((state) => state.setGameType);
  
  const path = `/creategame/${gameType}`
  const handleClick = () => {
    setGameType(gameType);
    window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
  };

  return (
    <Link to={path} style={{textDecoration: 'none'}}>
      <button
        className={`Button-create ${className ? className : ""}`}
        onClick={handleClick}
      >
        {translate.t('create')}
      </button>
    </Link>
  );
};

export default CreateButton;
