import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import {
  clearParticipantSession,
  getParticipantAuthEventName,
  loadParticipantSession,
} from "../auth";
import TulayLogo from "./TulayLogo";

const primary = [
  { to: "/about", label: "About" },
  { to: "/bridge", label: "Bridge" },
  { to: "/learn", label: "Learn" },
  { to: "/hinto", label: "HINTO" },
  { to: "/kapwa", label: "Stories" },
  { to: "/legal", label: "Rights" },
  { to: "/resources", label: "Support" },
  { to: "/quiz", label: "Smart Quiz", className: "nav-quiz-link", icon: Sparkles },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [session, setSession] = useState(() => loadParticipantSession());
  const accountMenuRef = useRef(null);
  const location = useLocation();

  const displayName = session?.participant?.username
    ? `@${session.participant.username}`
    : formatParticipantName(session?.participant?.full_name);

  useEffect(() => {
    setOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const syncSession = () => setSession(loadParticipantSession());
    const authEvent = getParticipantAuthEventName();

    window.addEventListener("storage", syncSession);
    window.addEventListener(authEvent, syncSession);

    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener(authEvent, syncSession);
    };
  }, []);

  useEffect(() => {
    if (!accountOpen) return undefined;

    function closeOnOutsideClick(event) {
      if (!accountMenuRef.current?.contains(event.target)) {
        setAccountOpen(false);
      }
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setAccountOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [accountOpen]);

  function handleLogout() {
    clearParticipantSession();
    setSession(null);
    setAccountOpen(false);
    setOpen(false);
  }

  return (
    <header className="nav">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="nav-inner">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <TulayLogo />
        </NavLink>

        <button
          className="nav-toggle"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} strokeWidth={2.2} /> : <Menu size={20} strokeWidth={2.2} />}
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`} aria-label="Main">
          {primary.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => [isActive ? "active" : undefined, link.className].filter(Boolean).join(" ")}
            >
              {link.icon && (
                <span className="nav-link-icon" aria-hidden="true">
                  <link.icon size={15} strokeWidth={2.2} />
                </span>
              )}
              <span>{link.label}</span>
            </NavLink>
          ))}
          {session?.participant ? (
            <div className="nav-user-menu" ref={accountMenuRef}>
              <button
                type="button"
                className="nav-user-link nav-user-trigger"
                aria-label="Open account menu"
                aria-haspopup="menu"
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((value) => !value)}
              >
                <span className="nav-user-icon" aria-hidden="true">
                  <UserRound size={18} strokeWidth={2} />
                </span>
                <span className="nav-user-copy">
                  <span className="nav-user-label">Account</span>
                  {displayName && <span className="nav-user-name">{displayName}</span>}
                </span>
                <ChevronDown
                  className={`nav-user-caret-icon${accountOpen ? " open" : ""}`}
                  size={16}
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
              </button>
              {accountOpen && (
                <div className="nav-account-dropdown" role="menu">
                  <div className="nav-account-summary">
                    <strong>
                      {session.participant.username
                        ? `@${session.participant.username}`
                        : session.participant.full_name}
                    </strong>
                    <span>{session.participant.email}</span>
                  </div>
                  <NavLink
                    to="/settings"
                    role="menuitem"
                    className="nav-account-link"
                    onClick={() => setAccountOpen(false)}
                  >
                    <Settings size={16} strokeWidth={2} aria-hidden="true" />
                    Settings
                  </NavLink>
                  <button type="button" role="menuitem" onClick={handleLogout}>
                    <LogOut size={16} strokeWidth={2} aria-hidden="true" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login" className="nav-user-link" aria-label="Sign in">
              <span className="nav-user-icon" aria-hidden="true">
                <UserRound size={18} strokeWidth={2} />
              </span>
              <span className="nav-user-copy">
                <span className="nav-user-label">Sign in</span>
              </span>
            </NavLink>
          )}
          <NavLink to="/pledge" className="nav-cta">
            Pledge
          </NavLink>
        </nav>
      </div>
      {open && (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}
    </header>
  );
}

function formatParticipantName(fullName) {
  if (!fullName) return "";

  const words = fullName.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "";

  return words.slice(0, 2).join(" ");
}
