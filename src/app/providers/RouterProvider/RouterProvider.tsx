import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainPage } from "../../../pages/MainPage";
import { Header } from "../../../widgets/Header";
import { GamesPage } from "../../../pages/GamesPage";
import { HistoryPage } from "../../../pages/HistoryPage";
import { WalletPage } from "../../../pages/WalletPage";
import { CreateGamePage } from "../../../pages/CreateGamePage";
import { WithdrawPage } from "../../../pages/WithdrawPage";
import { DepositPage } from "../../../pages/DepositPage";
import { WaitingConfirm } from "../../../pages/WaitingConfirm";
import { WaitingPlayer } from "../../../pages/WaitingPlayer";
import { GamePage } from "../../../pages/GamePage";
import { Rate } from "../../../pages/RatePage";
import Training from "../../../widgets/Training/Training";
import React, { useState } from 'react';
import { useUserStore } from "../../../app/stores/userStore";

interface RouterProviderProps {
  children?: React.ReactNode;
}


const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => {
  const { training } = useUserStore()
  return (
    <div >
        <Router>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/activegames" element={<GamesPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/creategame/:type" element={<CreateGamePage />} />
            <Route path="/waiting/:number" element={<WaitingPlayer />} />
            <Route path="/waitingconfirm/:number/:type" element={<WaitingConfirm />} />
            <Route path="/withdraw/:token" element={<WithdrawPage />} />
            <Route path="/deposit/:token" element={<DepositPage />} />
            <Route path="/game/:number/:type" element={<GamePage />} />
            <Route path="/rate" element={<Rate />} />
          </Routes>
          {children}
        </Router>
    </div>
  );
};

export default RouterProvider;
