import { create } from "zustand";

declare global {
  interface Window {
      Telegram: any
  }
}
export type Language = 'en' | 'ru';
export type Token = 'ton' | 'm5' | 'dfc';
interface UserStore {
  walletTonBalance: number;
  walletM5Balance: number;
  walletDfcBalance: number,
  selectedToken: Token,
  username: Window,
  first_name: Window, 
  last_name: Window,
  id:Window,
  training: JSON | boolean,
  setTraining: (training: boolean) => void,
  language: Language,
  setWalletTonBalance: (balance: number) => void;
  setWalletM5Balance: (balance: number) => void;
  setWalletDfcBalance: (balance: number) => void;
  statusModal: boolean, 
  setStatusModal: (status: boolean) => void, 
  setSelectedToken: (token: Token) => void,
  setLanguage: (language: Language) => void,
  decrementBalance: (token: string, amount: number) => void;
  incrementBalance: (token: string, amount: number) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  walletTonBalance: 0,
  walletDfcBalance: 0,
  walletM5Balance: 0,
  statusModal: false,
  selectedToken: 'm5',
  training: JSON.parse(localStorage.getItem('training')),
  language: 'en',
  setTraining: (training) => set({training: training}),
  username: window.Telegram?.WebApp?.initDataUnsafe?.user?.username,
  first_name: window.Telegram?.WebApp?.initDataUnsafe?.user?.first_name,
  last_name: window.Telegram?.WebApp?.initDataUnsafe?.user?.last_name,
  id: window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
  setSelectedToken: (selectedToken: Token) => set({ selectedToken }),
  setStatusModal: (statusModal) => set({ statusModal }),
  setWalletTonBalance: (balance: number) => set({ walletTonBalance: balance }),
  setWalletM5Balance: (balance: number) => set({ walletM5Balance: balance }),
  setWalletDfcBalance: (balance: number) => set({ walletDfcBalance: balance }),
  setWalletBalance: (balance: number) => set({ walletM5Balance: balance }),
  setLanguage: (language: Language) => set({ language }),
  decrementBalance: (token: string, amount: number) => {
    set((state) => {
      if (token === 'ton' && state.walletTonBalance >= amount) {
        return { walletTonBalance: state.walletTonBalance - amount };
      } 
      if (token === 'm5' && state.walletM5Balance >= amount) {
        return { walletM5Balance: state.walletM5Balance - amount };
      } 
      if (token === 'dfc' && state.walletDfcBalance >= amount) {
        return { walletDfcBalance: state.walletDfcBalance - amount };
      }
      return state;
    });
  },
  
  incrementBalance: (token: string, amount: number) => {
    set((state) => {
      if (token === 'ton') {
        return { walletTonBalance: state.walletTonBalance + amount };
      }
      if (token === 'm5') {
        return { walletM5Balance: state.walletM5Balance + amount };
      }
      if (token === 'dfc') {
        return { walletDfcBalance: state.walletDfcBalance + amount };
      }
      return state;
    });
  },
}));