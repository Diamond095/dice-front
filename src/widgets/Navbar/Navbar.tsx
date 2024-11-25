import "./Navbar.scss";
import { Link, useLocation } from "react-router-dom";
import CompassIcon from "../../app/assets/Compas.png";
import ActiveCompassIcon from "../../app/assets/CompasActive.png";
import HomeIcon from "../../app/assets/Home.png";
import ActiveHomeIcon from "../../app/assets/HomeActive.png";
import HistoryIcon from "../../app/assets/Clock.png";
import ActiveHistoryIcon from "../../app/assets/ClockActive.png";
import RankingActive from '../../app/assets/RankingActive.png'
import Ranking from '../../app/assets/Ranking.png'
import translate from '../../../i18n.js';



const Navbar: React.FC = () => {
  const location = useLocation();
  const hideNavbarPaths = ["/wallet", "/game", "/creategame", "/deposit", "/withdraw"];
  const shouldHideNavbar = hideNavbarPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  if (shouldHideNavbar) {
    return null;
  }

  return (
    <nav className="Navbar">
      <Link
        className={`Navbar__item ${
          location.pathname === "/activegames" ? "active" : ""
        }`}
        onClick={() =>window.Telegram.WebApp.HapticFeedback.impactOccurred('light')}
        to="/activegames"
      >
        <img
          src={location.pathname === "/activegames" ? ActiveCompassIcon : CompassIcon}
          alt=""
          className="Navbar__item--icon"
        />
        <span className="Navbar__item--text">{translate.t('games')}</span>
      </Link>
      <Link
        className={`Navbar__item ${location.pathname === "/" ? "active" : ""}`}
        to="/"
        onClick={() =>window.Telegram.WebApp.HapticFeedback.impactOccurred('light')}
      >
        <img
          src={location.pathname === "/" ? ActiveHomeIcon : HomeIcon}
          alt=""
          className="Navbar__item--icon"
        />
        <span className="Navbar__item--text">{translate.t('main')}</span>
      </Link>
      <Link
        className={`Navbar__item ${
          location.pathname === "/history" ? "active" : ""
        }`}
        onClick={() =>window.Telegram.WebApp.HapticFeedback.impactOccurred('light')}
        to="/history"
      >
        <img
          src={
            location.pathname === "/history" ? ActiveHistoryIcon : HistoryIcon
          }
          alt=""
          className="Navbar__item--icon"
        />
        <span className="Navbar__item--text">{translate.t('history')}</span>
      </Link>
      <Link
       onClick={() =>window.Telegram.WebApp.HapticFeedback.impactOccurred('light')}
        className={`Navbar__item ${
          location.pathname === "/rate" ? "active" : ""
        }`}
        to="/rate"
      >
        <img
          src={
            location.pathname === "/rate" ? RankingActive: Ranking
          }
          alt=""
          className="Navbar__item--icon"
        />
        <span className="Navbar__item--text">{translate.t('rating')}</span>
      </Link>
    </nav>
  );
};

export default Navbar;
