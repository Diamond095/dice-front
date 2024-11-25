import { create } from "zustand";

export type Token = "ton" | "m5" | "dfc"

interface WithdrawState {
  token: Token;
  amount: number;
  setToken: (token: Token) => void;
  setAmount: (amount: number) => void;
  reset: () => void;
}

const useWithdrawStore = create<WithdrawState>((set) => ({
  token: "ton",
  amount: 0,
  setToken: (token) => set({ token }),
  setAmount: (amount) => set({ amount }),
  reset: () => set({ token: "ton", amount: 0 }),
}));

export default useWithdrawStore;
