import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [key, setKey] = useState("");
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    if (!key.trim()) return;

    localStorage.setItem("adminKey", key.trim());
    navigate("/admin");
  }

  return (
    <div className="page">
      <div className="box">
        <h1 className="title">دخول الادمن</h1>
      

        <form className="form" onSubmit={submit}>
          <label>
            Admin Key
            <input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="مثال: 1234"
            />
          </label>

          <button className="btn" type="submit">
            دخول
          </button>
        </form>
      </div>
    </div>
  );
}
