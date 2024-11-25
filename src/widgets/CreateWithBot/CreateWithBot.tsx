import { CreateButton } from "../../shared/ui/CreateButton";
import "./CreateWithBot.scss";
import translate from '../../../i18n.js';

const CreateWithBot: React.FC = () => {
  return (
    <div className="CreateWithBotWrapper">
      <div className="CreateWithBot--text">
        <span className="CreateWithBot--text_title">{translate.t('lobbyWithBot')}</span>
        <span className="CreateWithBot--text_title-additional">
          {translate.t('playWithBot')}
        </span>
      </div>
      <CreateButton gameType="with-bot" className="CreateWithBot--button" />
    </div>
  );
};

export default CreateWithBot;
