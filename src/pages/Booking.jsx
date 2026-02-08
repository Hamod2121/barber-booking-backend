import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Booking() {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem("service");
    if (s) setService(JSON.parse(s));
  }, []);

  const canSubmit = name.trim() && phone.trim() && date && time && service;

  async function submit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setLoading(true);

      await fetch(`${API}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          service: service.name,
          date,
          time,
        }),
      });

      navigate("/confirm");
    } catch (err) {
      console.error(err);
      alert("صار خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h1 className="title">الحجز</h1>

      {service ? (
        <div className="notice">
          الخدمة المختارة: <b>{service.name}</b> — {service.price} ر.س
        </div>
      ) : (
        <div className="notice">
          ما اخترت خدمة. روح صفحة الخدمات واختر خدمة.
        </div>
      )}

      <form className="form" onSubmit={submit}>
        <label>
          الاسم
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label>
          رقم الجوال
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>

        <div className="two">
          <label>
            التاريخ
            <div className="inputIcon">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <span className="icon">📅</span>
            </div>
          </label>

          <label>
            الوقت
            <div className="inputIcon">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
              <span className="icon">⏰</span>
            </div>
          </label>
        </div>

        <button className="btn" type="submit" disabled={!canSubmit || loading}>
          {loading ? "جارٍ الحفظ..." : "تأكيد الحجز"}
        </button>
      </form>
    </div>
  );
}
