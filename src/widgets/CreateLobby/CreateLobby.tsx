import React from "react";
import "./CreateLobby.scss";
import CreateButton from "../../shared/ui/CreateButton/CreateButton";
import translate from '../../../i18n.js';
import swords from '../../app/assets/grey-swords.png'

const CreateLobby: React.FC = () => {
  return (
    <div className="CreateLobbyWrapper">
      <div className="CreateLobby--text">
        <span className="CreateLobby--text_title">{translate.t('lobby')}</span>
        <div className="extra-text">
          <div>
            <img src={swords} style={{width: '5vw'}}></img>
          </div>
          <div className="CreateLobby--text_title-additional">
            {translate.t('pvp')}
          </div>
        </div>
      </div>
      <CreateButton gameType="with-user" className="CreateLobby--button" />
    </div>
  );
};

export default CreateLobby;
