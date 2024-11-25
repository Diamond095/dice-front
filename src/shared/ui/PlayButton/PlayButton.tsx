import React from "react";
import "./PlayButton.scss";
import translate from '../../../../i18n.js'

interface PlayButtonProps {
  className?: string;
}

const PlayButton: React.FC<PlayButtonProps> = ({ className }) => {
  return (
    <button className={`Button-play ${className ? className : ""}`}>
      {translate.t('play')}
    </button>
  );
};

export default PlayButton;
