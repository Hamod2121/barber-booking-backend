import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Confirm() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const b = localStorage.getItem("booking");
    if (!b) {
      navigate("/booking");
      return;
    }
    setData(JSON.parse(b));
  }, [navigate]);

  if (!data) return null;

  return (
    <div className="page">
      <div className="box">
        <h1 className="title">تم الحجز ✅</h1>

        <div className="card">
          <div className="row"><span className="muted">الاسم</span><b>{data.name}</b></div>
          <div className="row"><span className="muted">الجوال</span><b>{data.phone}</b></div>
          <div className="row"><span className="muted">الخدمة</span><b>{data.service?.name || "-"}</b></div>
          <div className="row"><span className="muted">التاريخ</span><b>{data.date}</b></div>
          <div className="row"><span className="muted">الوقت</span><b>{data.time}</b></div>

          <button
            className="btn"
            onClick={() => {
              localStorage.removeItem("booking");
              localStorage.removeItem("service");
              navigate("/services");
            }}
          >
            حجز جديد
          </button>
        </div>
      </div>
    </div>
  );
}
