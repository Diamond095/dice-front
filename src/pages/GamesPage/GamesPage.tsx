import ActiveList from "../../widgets/ActiveList/ActiveList";
import { Navbar } from "../../widgets/Navbar";
import "./GamesPage.scss";


const GamesPage: React.FC = () => {
  return (
    <>
      <span style={{ opacity: 0.25, fontWeight: "bold", marginLeft: "1rem" }}>
      </span>
      <div className="GamesPageWrapper">
        <ActiveList />
      </div>
      <Navbar />
    </>
  );
};

export default GamesPage;
