import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
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

      const res = await fetch("http://localhost:5000/bookings", {
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
      const res = await fetch(`http://localhost:5000/bookings/${id}`, {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page">
      <div className="rowTop">
        <div>
          <h1 className="title">لوحة الحجوزات (Admin)</h1>
          <p className="muted">الحجوزات من قاعدة البيانات.</p>
        </div>

        <div className="rowBtns">
          <button className="btn" onClick={load} disabled={loading}>
            {loading ? "تحميل..." : "تحديث"}
          </button>
          <button className="btn btnGhost" onClick={logout}>
            خروج
          </button>
        </div>
      </div>

      <div style={{ marginTop: 12 }} className="card">
        {loading ? (
          <p>جارٍ التحميل...</p>
        ) : bookings.length === 0 ? (
          <p>لا يوجد حجوزات</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>الاسم</th>
                  <th>الجوال</th>
                  <th>الخدمة</th>
                  <th>التاريخ</th>
                  <th>الوقت</th>
                  <th>حذف</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.name}</td>
                    <td>{b.phone}</td>
                    <td>{b.service}</td>
                    <td>{b.date}</td>
                    <td>{b.time}</td>
                    <td>
                      <button
                        className="btn btnDanger"
                        onClick={() => removeBooking(b.id)}
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
