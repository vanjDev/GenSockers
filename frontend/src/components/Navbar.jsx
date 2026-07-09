import { useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/about", label: "About" },
  { to: "/hinto", label: "Programs" },
  { to: "/kapwa", label: "Stories" },
  { to: "/resources", label: "Campus Map" },
  { to: "/pledge", label: "Pledge Now", cta: true },
  { to: "/learn", label: "Learn" },
  { to: "/legal", label: "Rights" },
  { to: "/quiz", label: "Quiz" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="nav-inner">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 22C8 12 12 8 16 8C20 8 24 12 28 22"
                stroke="#0D3B2E"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <path
                d="M8 22C11 16 13.5 13 16 13C18.5 13 21 16 24 22"
                stroke="#0D3B2E"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.55"
              />
              <circle cx="16" cy="20" r="2.2" fill="#0D3B2E" />
            </svg>
          </span>
          <span className="brand-text">
            <strong>
              Project <span>TULAY</span>
            </strong>
            <small>FEU Tech Inclusion</small>
          </span>
        </NavLink>

        <button
          className="nav-toggle"
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "☰"}
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                [link.cta ? "nav-cta" : "", isActive ? "active" : ""].filter(Boolean).join(" ") ||
                undefined
              }
            >
              {link.label}
            </NavLink>
          ))}
          <a
            className="nav-campus"
            href="https://www.feutech.edu.ph/"
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
          >
            FEU Tech
          </a>
        </nav>
      </div>
    </header>
  );
}
