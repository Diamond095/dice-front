import { useNavigate } from "react-router-dom";
import "./BackButton.scss";
import translate from '../../../../i18n.js'

interface BackButtonProps {
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ className }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
    window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
  };

  return (
    <button className={`Button-back ${className || ""}`} onClick={handleClick}>
      {translate.t('back')}
    </button>
  );
};

export default BackButton;
