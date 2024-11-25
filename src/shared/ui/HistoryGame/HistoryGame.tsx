import React, { useEffect } from "react";
import "./HistoryGame.scss";
import UserIcon from "../../../app/assets/User.png";
import { GameType, TokenType } from "@/app/stores/gameCardsStore";
import swords from '../../../app/assets/swords.png'
import translate from '../../../../i18n.js'
import { useState } from "react";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ru';
import { useUserStore } from "../../../app/stores/userStore.js";
import 'dayjs/locale/en';


interface HistoryGameProps {
  gameNumber: number;
  user1: string;
  user2?: string;
  betAmount: number;
  winner?: string;
  gameType: GameType;
  token: TokenType;
  result: 'WIN' | 'LOSE',
  createUserPoints: number,
  enterUserPoints: number,
  timeEnd: string,
  type: 'my' | 'general'
}

const HistoryGame: React.FC<HistoryGameProps> = ({
  gameNumber,
  user1,
  user2,
  betAmount,
  winner,
  gameType,
  token,
  result,
  createUserPoints,
  enterUserPoints,
  timeEnd,
  type
}) => {
  const isBotGame = gameType === "with-bot";
  const resultText = isBotGame ? (winner == "Bot" ? translate.t('lose') : translate.t('win')) : translate.t('win');
  const color = isBotGame ? (winner == 'Bot' ? 'linear-gradient(to left,#E92E38, #E92E38)' : 'linear-gradient(to left,#2F7F94, #2F7F94)') : 'linear-gradient(to left,#2F7F94, #2F7F94)'
  const [betGame, setBet] = isBotGame ? useState(betAmount.toFixed(2) + ' ' + token) : useState((betAmount * 0.9).toFixed(2) + ' ' + token)
  const { language } = useUserStore()
  dayjs.extend(relativeTime);
  dayjs.locale(language);

  const timeAgo = (dateString) => {
    const date = dayjs(dateString);
    if (!date.isValid()) {
      return null;
    }
    return date.fromNow();

  };

  const resultTextClass = isBotGame
    ? winner === "BOT"
      ? "HistoryGame--details_result-text--bot-lose"
      : "HistoryGame--details_result-text--bot-win"
    : "HistoryGame--details_result-text";

  return (
    <div className="HistoryGameWrapper">
      <div>
        <div className="nickname left">
          {user1}
        </div>
        <div>
          {isBotGame ?
            (<div className="extra-text left" style={{ backgroundImage: color }}>
              <div>
                {resultText}
              </div>
              <div>
                {betGame}
              </div>
            </div>)
            : user1 == winner ?
              (<div className="extra-text" style={{ backgroundImage: color }}>
                <div>
                  {resultText}
                </div>
                <div>
                  {betGame}
                </div>
              </div>)
              : (
                <div style={{ fontSize: '12px', textAlign: 'left', width: '27vw' }}>
                  {timeAgo(timeEnd)}
                </div>)}
        </div>
      </div>
      <div>
        <div className="points">
          <div>
            {createUserPoints}
          </div>
          <div>
            <img className="swords" src={swords}></img>
          </div>
          <div>
            {enterUserPoints}
          </div>
        </div>
        <div className="gameNumber">
          #{gameNumber}
        </div>
      </div>
      <div>
        <div className="nickname right">
          {!isBotGame ? user2 : translate.t('bot')}
        </div>
        {user2 == winner && !isBotGame ? (<div className="extra-text right" style={{ backgroundImage: color }}>
          <div>
            {resultText}
          </div>
          <div>
            {betGame}
          </div>
        </div>) : (
          <div style={{ fontSize: '12px', textAlign: 'right', width: '27vw' }}>
            {timeAgo(timeEnd)}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryGame;