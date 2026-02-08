import { useNavigate } from "react-router-dom";
import { services } from "../data/services";

export default function Services() {
  const navigate = useNavigate();

  function handleBook(service) {
    localStorage.setItem("service", JSON.stringify(service));
    navigate("/booking");
  }

  return (
    <div className="page">
      <h1 className="title">الخدمات</h1>
      <p className="muted">اختر خدمة ثم احجز موعدك.</p>

      <div className="grid">
        {services.map((s) => (
          <div className="card" key={s.id}>
            <h3>{s.name}</h3>
            <div className="row">
              <span className="muted">السعر</span>
              <b>{s.price} ر.س</b>
            </div>
            <button className="btn" onClick={() => handleBook(s)}>
              احجز
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
