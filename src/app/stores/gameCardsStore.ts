import { create } from 'zustand';

export type GameType = 'with-user' | 'with-bot';
export type TokenType = 'ton' | 'm5' | 'dfc';
export type GameResult = 'WIN' | 'LOSE';
export type GameMode = 'with-user' | 'with-bot';

interface ActiveGame {
    type: GameType;
    gameNumber: number;
    creatorUsername: string;
    token: TokenType;
    betSize: number;
    pointsNeeded: number;
}

interface InactiveGame {
    type: GameType;
    gameNumber: number;
    creatorUsername: string;
    token: TokenType;
    betSize: number;
    result: GameResult;
    time: string;
    winnerName: string;
    pointsNeeded: number;
    opponentName: string;
    createUserPoints: number, 
    enterUserPoints: number
}

interface GameCardStore {
    activeGames: ActiveGame[];
    inactiveGames: InactiveGame[];
    myInactiveGames: InactiveGame [];
    selectedGameType: GameMode | null;
    gameBetToken: TokenType | null;
    gameBetAmount: number | null;
    pointsTillEnd: number;
    errors: any,
    setGameType: (type: GameMode) => void;
    setGameBetToken: (token: TokenType) => void;
    setGameBetAmount: (amount: number | null) => void;
    setWinsTillEnd: (points: number) => void;
    addActiveGame: (game: ActiveGame) => void;
    addMyInactiveGame: (game: InactiveGame) => void;
    removeActiveGame: (gameNumber: number) => void;
    setErrors: (errors: any) => void
    moveToInactive: (
        gameNumber: number,
        result: GameResult,
        time: string,
        winnerName: string,
        opponentName: string
    ) => void;
    addInactiveGame: (game: InactiveGame) => void;
}

export const useGameCardStore = create<GameCardStore>((set) => ({
    activeGames: [],
    inactiveGames: [],
    selectedGameType: null,
    gameBetToken: null,
    gameBetAmount: null,
    pointsTillEnd: 1,
    errors: [],
    myInactiveGames: [],
    setGameType: (type) => set({ selectedGameType: type }),
    setGameBetToken: (token) => set({ gameBetToken: token }),
    setGameBetAmount: (amount) => set({ gameBetAmount: amount }),
    setWinsTillEnd: (points) => set({ pointsTillEnd: points }),
    addActiveGame: (game) => {
        set((state) => {
            if (state.activeGames.some((g) => g.gameNumber === game.gameNumber)) {
                return state;
            }
            return { activeGames: [game, ...state.activeGames] };
        });
    },
    moveToInactive: (gameNumber, result, time, winnerName, opponentName) =>
        set((state) => {
            const gameIndex = state.activeGames.findIndex((game) => game.gameNumber === gameNumber);
            if (gameIndex === -1) {
                return state;
            }
            const game = state.activeGames[gameIndex];
            return {
                activeGames: state.activeGames.filter((_, index) => index !== gameIndex)
            };
        }),
    addInactiveGame: (game) => {
        set((state) => {
            if (state.inactiveGames.some((g) => g.gameNumber === game.gameNumber)) {
                return state;
            }
            return { inactiveGames: [game, ...state.inactiveGames] };
        });
    },
    addMyInactiveGame: (game) => {
        set((state) => {
            if (state.myInactiveGames.some((g) => g.gameNumber === game.gameNumber)) {
                return state;
            }
            return { myInactiveGames: [game, ...state.myInactiveGames] };
        });
    },
    removeActiveGame: (gameNumber) => {
        console.log('Removing active game:', gameNumber);
        set((state) => ({
            activeGames: state.activeGames.filter((game) => game.gameNumber != gameNumber),
        }));
        
    },

    setErrors: (errors) => set({ errors: errors })
}));
