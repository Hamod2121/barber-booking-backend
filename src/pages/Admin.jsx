import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const API = import.meta.env.VITE_API_URL;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const adminKey = localStorage.getItem("adminKey");

  async function load() {
    try {
      setLoading(true);

      if (!adminKey) {
        navigate("/admin-login");
        return;
      }

      const res = await fetch(`${API}/bookings`, {
        headers: { "x-admin-key": adminKey },
      });

      if (res.status === 401) {
        localStorage.removeItem("adminKey");
        navigate("/admin-login");
        return;
      }

      const data = await res.json();
      setBookings(data);
    } catch (e) {
      console.error(e);
      alert("ما قدرت أجيب الحجوزات");
    } finally {
      setLoading(false);
    }
  }

  async function removeBooking(id) {
    if (!confirm("متأكد تبغى تحذف هذا الحجز؟")) return;

    try {
      const res = await fetch(`${API}/bookings/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });

      if (res.status === 401) {
        localStorage.removeItem("adminKey");
        navigate("/admin-login");
        return;
      }

      await load();
    } catch (e) {
      console.error(e);
      alert("فشل الحذف");
    }
  }

  function logout() {
    localStorage.removeItem("adminKey");
    navigate("/admin-login");
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page">
      <div className="rowTop">
        <h1 className="title">لوحة الحجوزات</h1>
        <button onClick={logout}>خروج</button>
      </div>

      {loading ? (
        <p>تحميل...</p>
      ) : bookings.length === 0 ? (
        <p>لا يوجد حجوزات</p>
      ) : (
        bookings.map((b) => (
          <div key={b.id}>
            {b.name}
            <button onClick={() => removeBooking(b.id)}>حذف</button>
          </div>
        ))
      )}
    </div>
  );
}
