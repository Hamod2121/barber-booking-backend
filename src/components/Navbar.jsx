import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navWrap">
      <div className="navInner">
        <div className="brand">QuickCut</div>

        <nav className="navLinks">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            الرئيسية
          </NavLink>
          <NavLink to="/services" className={({ isActive }) => (isActive ? "active" : "")}>
            الخدمات
          </NavLink>
          <NavLink to="/booking" className={({ isActive }) => (isActive ? "active" : "")}>
          
            الحجز
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
