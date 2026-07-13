import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Handshake,
  MessageCircle,
  PenLine,
  Search,
  Sparkles,
} from "lucide-react";
import { campaign, features } from "../campaign";

const featureIcons = {
  1: EyeIcon,
  2: Search,
  3: MessageCircle,
  4: Sparkles,
  5: PenLine,
};

export default function Home() {
  return (
    <div className="page home-page">
      <section className="hero home-hero">
        <div className="hero-copy">
          <h1>
            Bridge to
            <br />
            <span className="underline">Belonging</span>
          </h1>
          <p className="hero-tag">“{campaign.shortTagline}”</p>
          <p className="hero-body">
            From tolerance to true inclusion — connection, practice, and a public
            commitment.
          </p>
          <div className="btn-row">
            <Link className="btn btn-primary" to="/bridge">
              <Handshake size={18} strokeWidth={2} aria-hidden="true" />
              Join Bridge
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
            <Link className="btn btn-text" to="/about">
              How it works
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <figure className="hero-visual hero-visual-img">
          <img
            src="/art/v2/hero-bridge.png"
            alt="A diverse group of students crossing a stone bridge on campus"
            className="hero-art"
            loading="eager"
          />
          <figcaption>Building a campus where everyone belongs.</figcaption>
        </figure>
      </section>

      <section className="journey-band" aria-label="Tolerance to Belonging">
        <div className="section-label">Our path</div>
        <h2 className="section-title left">From tolerance to true belonging.</h2>
        <ol className="journey-track">
          {campaign.progression.map((stage, i) => (
            <li key={stage} className="journey-step">
              <span className="journey-num">{String(i + 1).padStart(2, "0")}</span>
              <strong>{stage}</strong>
              {i < campaign.progression.length - 1 && (
                <span className="journey-arrow" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="section home-destinations" aria-label="Campaign features">
        <div className="section-heading-row">
          <div>
            <div className="section-label">Explore the bridge</div>
            <h2 className="section-title left">Five destinations. One bridge.</h2>
          </div>
          <p className="section-heading-note">Learn, listen, practice, and take a step.</p>
        </div>
        <div className="destination-list">
          {features.map((feature) => {
            const Icon = featureIcons[feature.n];
            return (
              <Link key={feature.n} to={feature.to} className="destination-row">
                <span className="destination-icon" aria-hidden="true">
                  <Icon size={26} strokeWidth={1.7} />
                </span>
                <span className="destination-index">0{feature.n}</span>
                <span className="destination-copy">
                  <strong>{feature.title}</strong>
                  <small>{feature.body}</small>
                </span>
                <ArrowRight className="destination-arrow" size={21} strokeWidth={1.8} aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section bridge-options" aria-label="Ways to participate">
        <article className="bridge-option bridge-option-gold">
          <img src="/art/v2/bridge-circles.png" alt="Students sharing a conversation in a campus circle" loading="lazy" />
          <div>
            <div className="section-label">In person</div>
            <h2>Bridge Circles</h2>
            <p>Safe, guided conversations that build empathy, trust, and everyday inclusion.</p>
            <Link to="/bridge" className="btn btn-text">Learn more <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </article>
        <article className="bridge-option bridge-option-lilac">
          <img src="/art/v2/digital-bridge.png" alt="Laptop and phone showing an abstract digital bridge" loading="lazy" />
          <div>
            <div className="section-label">Always on</div>
            <h2>Digital bridge</h2>
            <p>Connect, learn, and take action online — anytime, anywhere.</p>
            <Link to="/learn" className="btn btn-text">Explore online <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </article>
      </section>

      <section className="cta-band home-pledge-band">
        <div className="cta-art-wrap">
          <img src="/art/v2/pledge-hands.png" alt="Hands holding a small bridge made from connected wooden planks" loading="lazy" />
        </div>
        <div>
          <h2>Take the pledge. Build the bridge.</h2>
          <p>Every pledge is a step toward a campus where everyone belongs.</p>
          <Link className="btn btn-primary" to="/pledge">
            <PenLine size={18} strokeWidth={2} aria-hidden="true" />
            Pledge now
          </Link>
        </div>
      </section>
    </div>
  );
}

function EyeIcon({ size = 24, strokeWidth = 1.7, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2.5 12s3.2-5 9.5-5 9.5 5 9.5 5-3.2 5-9.5 5-9.5-5-9.5-5Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  );
}
