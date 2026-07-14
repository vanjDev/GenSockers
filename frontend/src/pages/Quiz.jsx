import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, HeartHandshake, RotateCcw } from "lucide-react";
import { api } from "../api";

const CHOICES = ["q1", "q2", "q3", "q4"];

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState("ready");
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .getQuizV2()
      .then(setQuestions)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const current = questions[index];
  const progress = questions.length
    ? Math.round(((index + (stage === "result" ? 1 : 0)) / questions.length) * 100)
    : 0;
  const questionImage = current ? `/quiz/v2/questions/${current.id}/question.png` : "";
  const responseImage = current ? `/quiz/v2/questions/${current.id}/response.png` : "";

  const responseData = response?.data || { q1: 0, q2: 0, q3: 0, q4: 0 };
  const totalResponses = Object.values(responseData).reduce((sum, value) => sum + value, 0);
  const selectedCount = selectedChoice ? responseData[selectedChoice] : 0;
  const samePercent = totalResponses
    ? Math.round((selectedCount / totalResponses) * 100)
    : 0;

  function resetCurrent() {
    setSelectedChoice(null);
    setResponse(null);
    setStage("ready");
    setBusy(false);
  }

  async function loadChoice(choice) {
    if (!current || stage !== "choices" || busy) return;
    setBusy(true);
    setSelectedChoice(choice);
    try {
      const answerIndex = Number(choice.slice(1));
      const res = await api.answerQuizV2({ question_id: current.id, answer: answerIndex });
      setResponse(res);
      setStage("result");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  function showChoices() {
    if (!current) return;
    setStage("choices");
  }

  function goPrevious() {
    if (stage !== "choices") return;
    setStage("ready");
  }

  function goNext() {
    if (index + 1 >= questions.length) {
      setStage("complete");
      return;
    }
    setIndex((i) => i + 1);
    resetCurrent();
  }

  function restart() {
    setIndex(0);
    setStage("ready");
    setSelectedChoice(null);
    setResponse(null);
    setError("");
  }

  if (loading) {
    return (
      <div className="page">
        <div className="skeleton-grid quiz-skeleton" aria-busy="true" aria-label="Loading quiz">
          <div className="skeleton-card tall" />
          <div className="skeleton-card tall" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <p className="alert error" role="alert">{error}</p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="page">
        <div className="empty-state">
          <p className="muted">No quiz questions are available yet.</p>
        </div>
      </div>
    );
  }

  if (stage === "complete") {
    return (
      <div className="page narrow">
        <div
          className="panel hover-lift quiz-finish"
          style={{ maxWidth: "760px", margin: "0 auto", padding: "1.1rem 1.25rem" }}
        >
          <div className="quiz-finish-layout" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div
              className="page-hero-band"
              style={{
                padding: 0,
                background: "transparent",
                boxShadow: "none",
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <header
                className="page-header"
                style={{
                  gap: "0.35rem",
                  alignItems: "center",
                  textAlign: "center",
                  width: "fit-content",
                  margin: "0 auto",
                }}
              >
                <span className="pill" style={{ alignSelf: "center" }}>
                  Light novel quiz
                </span>
                <h1 style={{ fontSize: "1.7rem", margin: 0, textAlign: "center" }}>
                  Thank you for playing
                </h1>
                <p className="lead" style={{ fontSize: "0.98rem", margin: 0, textAlign: "center" }}>
                  You journeyed through each scene and shared your voice.
                </p>
              </header>
            </div>
          </div>
          <div className="quiz-finish-copy" style={{ marginTop: "0.9rem" }}>
            <p style={{ margin: "0 0 0.9rem" }}>
              Every choice matters. Keep reflecting and choosing ways that make campus safer
              and more welcoming for everyone.
            </p>
            <div className="btn-row" style={{ justifyContent: "center" }}>
              <button className="btn btn-primary" type="button" onClick={restart}>
                Play again
              </button>
              <Link className="btn btn-ghost" to="/">
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page quiz-page">
      <div className="quiz-layout">
        <section className="panel quiz-card novel-panel">
          <div className="quiz-progress">
            <div
              className="progress-track"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Quiz progress"
            >
              <div className="progress-fill" style={{ width: `${Math.max(progress, 8)}%` }} />
            </div>
            <span className="progress-label">
              Scene {index + 1} / {questions.length}
            </span>
          </div>

          <div className="novel-image">
            <img src={stage === "result" ? responseImage : questionImage} alt="Scene illustration" className="page-art" />
            {(stage === "ready" || stage === "choices" || stage === "result") && (
              <div className="image-overlay">
                <div className="overlay-gradient" />
                <div className="overlay-content">
                  {stage === "ready" && (
                    <>
                      <p className="scene-label">Scene {index + 1}</p>
                      <p className="question-text">{current.question}</p>
                    </>
                  )}
                  {stage === "choices" && (
                    <div className="option-list choice-board overlay-choices" role="group" aria-label="Answer choices">
                      {CHOICES.map((key) => {
                        const label = current.choices[key];
                        return (
                          <div
                            key={key}
                            role="button"
                            tabIndex={0}
                            className="overlay-choice-text"
                            onClick={() => loadChoice(key)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                loadChoice(key);
                              }
                            }}
                          >
                            <span className="opt-key">{key.toUpperCase()}</span>
                            {label}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                {stage === "result" && (
                  <>
                    <button
                      className="btn see-metrics-btn see-metrics-overlay"
                      type="button"
                      onClick={() => document.getElementById("response-panel")?.scrollIntoView({ behavior: "smooth", block: "center" })}
                    >
                      evaluations
                    </button>
                    <button
                      className="btn btn-primary overlay-next-btn"
                      type="button"
                      onClick={goNext}
                    >
                      {index + 1 >= questions.length ? "Finish" : "Next scene"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="novel-body">
            {(stage === "ready" || stage === "choices") && (
              <>
                {stage === "choices" && (
                  <div className="option-list choice-board mobile-choice-list" role="group" aria-label="Answer choices">
                    {CHOICES.map((key) => {
                      const label = current.choices[key];
                      return (
                        <button
                          key={key}
                          type="button"
                          className="option-btn novel"
                          onClick={() => loadChoice(key)}
                          disabled={busy}
                        >
                          <span className="opt-key">{key.toUpperCase()}</span>
                          <span>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
                <div className="stage-controls">
                  <button className="btn btn-ghost" type="button" onClick={goPrevious} disabled={stage === "ready"}>
                    {stage === "choices" ? "Read question again" : "Previous"}
                  </button>
                  {stage === "ready" && (
                    <button className="btn btn-primary" type="button" onClick={showChoices}>
                      Next
                    </button>
                  )}
                </div>
              </>
            )}
            {stage === "result" && response && (
              <div className="response-panel" id="response-panel">
                <div className="response-panel-header">
                  <span className="ai-pill">Automated Response System v6.7</span>
                </div>
                <h2>The response</h2>
                <p>{response.opinion}</p>
                <div className="metrics-grid">
                  <div className="metric-pill selected">
                    <strong>{samePercent}%</strong>
                    <span>of people chose the same as you</span>
                  </div>
                  <div className="metric-pill total">
                    <strong>{totalResponses}</strong>
                    <span>total responses recorded</span>
                  </div>
                </div>
                <div className="answer-breakdown">
                  {CHOICES.map((key) => (
                    <div key={key} className={`answer-row ${selectedChoice === key ? "selected-row" : ""}`}>
                      <span>{current.choices[key]}</span>
                      <strong>{responseData[key]} people</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
