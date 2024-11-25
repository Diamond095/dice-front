import { create } from "zustand";

interface GameState {
  yourPoints: number;
  opponentPoints: number;
  myFirstDice: number;
  opponentFirstDice: number;
  mySecondDice: number;
  opponentSecondDice: number;
  bet: number;
  setYourPoints: (yourPoints: number) => void,
  setOpponentPoints: (opponentPoints: number) => void,
  setMyFirstDice: (yourFirstDice: number) => void;
  setOpponentFirstDice: (opponentFirstDice: number) => void;
  setMySecondDice: (yourSecondDice: number) => void;
  setOpponentSecondDice: (opponentSecondDice: number) => void;
  setTimer: (timer: number) => void;
  setIsRed: (red: boolean) => void;
  setBet: (bet: number) => void;
  timer: number;
  isRed: boolean;
  reset: () => void;
}

const useGameStore = create<GameState>((set) => ({
  yourPoints: 0,
  opponentPoints: 0,
  myFirstDice: 0,
  mySecondDice: 0,
  opponentFirstDice: 0,
  opponentSecondDice: 0,
  isRed: false,
  timer: 60,
  bet: 0,
  setYourPoints: (yourPoints: number) => set({yourPoints: yourPoints}),
  setOpponentPoints: (opponentPoints: number) => set({opponentPoints:opponentPoints}),
  setBet: (bet) => set({ bet: bet }),
  setMyFirstDice: (yourFirstDice) => set({ myFirstDice: yourFirstDice }),
  setOpponentFirstDice: (opponentFirstDice) => set({ opponentFirstDice: opponentFirstDice }),
  setMySecondDice: (yourSecondDice) => set({ mySecondDice: yourSecondDice }),
  setOpponentSecondDice: (opponentSecondDice) => set({ opponentSecondDice: opponentSecondDice }),
  setTimer: (timer) => set({ timer: timer }),
  setIsRed: (red) => set({ isRed: red }),
  reset: () =>
    set({
      yourPoints: 0,
      opponentPoints: 0,
      myFirstDice: 0,
      mySecondDice: 0,
      opponentFirstDice: 0,
      opponentSecondDice: 0,
      isRed: false,
      timer: 60,
    }),
}));

export default useGameStore;
