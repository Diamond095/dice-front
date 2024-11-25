import { create } from "zustand";

export type GameToken = "m5" | "ton" | "dfc";
export type GameType = "with-bot" | "with-user";

interface CreateGameStore {
  gameToken: GameToken;
  gameType: GameType;
  gameBet: number;
  setGameToken: (token: GameToken) => void;
  setGameType: (type: GameType) => void;
  setGameBet: (bet: number) => void;
  setWinsTillEnd: (wins: number) => void;
  winsTillEnd: number;
}

export const useCreateGameStore = create<CreateGameStore>((set) => ({
  gameToken: "m5",
  gameType: "with-bot",
  gameBet: 0,
  winsTillEnd: 15,
  setGameToken: (token: GameToken) => set({ gameToken: token }),
  setGameType: (type: GameType) => set({ gameType: type }),
  setGameBet: (bet: number) => set({ gameBet: bet }),
  setWinsTillEnd: (wins) => set({ winsTillEnd: wins })
}));
