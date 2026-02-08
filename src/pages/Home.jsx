import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="box hero">
        
        {/* العنوان + اللوقو */}
        <div className="heroTitle">
          <img src={logo} alt="QuickCut Logo" className="heroLogo" />
          <h1 className="title">Barber Booking</h1>
        </div>

        <p className="muted">   </p>

        <button className="btn heroBtn" onClick={() => navigate("/services")}>
          ابدأ الآن
        </button>
      </div>
    </div>
  );
}
