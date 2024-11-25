import { create } from "zustand";

export type Token = "ton" | "m5" | "dfc";

interface DepositState {
  token: Token;
  amount: number;
  setToken: (token: Token) => void;
  setAmount: (amount: number) => void;
  reset: () => void;
  statusDeposit: boolean,
  toggleStatusDeposit: () => void
}

const useDepositStore = create<DepositState>((set) => ({
  token: "ton",
  amount: 0, 
  setToken: (token) => set({ token }),
  setAmount: (amount) => set({ amount }),
  reset: () => set({ token: "ton", amount: 0 }),
  statusDeposit: false,
  toggleStatusDeposit: () => {
      set((state) => {
          return {statusDeposit: !state.statusDeposit} 
      })
  },
}));

export default useDepositStore;
