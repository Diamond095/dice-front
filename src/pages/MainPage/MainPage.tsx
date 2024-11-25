import React, { useEffect, useState, useRef } from "react";
import { NewGame } from "../../widgets/NewGame";
import { CreateLobby } from "../../widgets/CreateLobby";
import { CreateWithBot } from "../../widgets/CreateWithBot";
import { Navbar } from "../../widgets/Navbar";
import { SecondaryButtons } from "../../widgets/SecondaryButtons";
import "./MainPage.scss";
import axios from 'axios'
import { useGameCardStore, GameType, TokenType, GameResult } from "../../app/stores/gameCardsStore";
import { useNavigate } from "react-router-dom";
import '../../app/echo'
import { useUserStore } from "../../app/stores/userStore";
import translate from '../../../i18n.js';
import Training from "../../widgets/Training/Training";
declare global {
    interface Window {
        Echo: any;
        Pusher: any;
    }
}
const MainPage: React.FC = () => {
    let { id } = useUserStore()
    const [loading, setLoading] = useState(false);
    //let name = null;
    const addActiveGame = useGameCardStore((state) => state.addActiveGame);
    const removeGame = useGameCardStore((state) => state.removeActiveGame)
    const navigate = useNavigate()
    const isTraining = JSON.parse(localStorage.getItem('training'));

    useEffect(() => {
        axios.get(`/api/games/${id}`).then(res => {
            setLoading(true)
            res.data.data.map((game: {
                type: GameType;
                number: number;
                name: string;
                typePayment: TokenType;
                sumOfBet: number;
                pointstillend: number;
            }) => (
                addActiveGame({
                    type: 'player' as GameType,
                    gameNumber: game.number,
                    creatorUsername: game.name,
                    token: game.typePayment,
                    betSize: game.sumOfBet,
                    pointsNeeded: game.pointstillend,
                })
            ));
        });

        axios.get(`https://diceton.xyz/api/checkgameswhereuser/${id}`)
            .then(res => {
                if (res.data) {
                    if (res.data.status == 'waitingForPayment') {
                        if (res.data.typeGame == 'withPlayer') {
                            navigate(`/waitingconfirm/${res.data.gameId}/${res.data.type}`)
                        }
                    } else if (res.data.status == 'playing') {
                        if (res.data.typeGame == 'withPlayer') {
                            navigate(`/game/${res.data.gameId}/${res.data.type}`);
                        } else {
                            navigate(`/game/${res.data.gameId}/with-bot`);
                        }
                    } else {
                        navigate(`/waiting/${res.data.gameId}`)
                    }
                }
            });
        window.Echo.channel('games').listen('.games', (data: any) => {
            if (data.createUserId != id) {
                addActiveGame({
                    type: 'player' as GameType,
                    gameNumber: data.number,
                    creatorUsername: data.name,
                    token: data.typePayment,
                    betSize: data.sumOfBet,
                    pointsNeeded: data.turns,
                })
            }
        });
        window.Echo.channel('entergame').listen('.entergame', (data: any) => {
            removeGame(data.id)
        });

        window.Echo.channel('exitgame').listen('.exitgame', (data: any) => {
            removeGame(data.id)
        });
    }, []);
    return (
        <div>
            <Training />
        </div>
    );
};

export default MainPage;
