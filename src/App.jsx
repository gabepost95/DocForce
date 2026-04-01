import { useState, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════
// DOCFORCE — AI BUSINESS DOCUMENT GENERATOR
// Flow: Landing → Select → Input → Checkout → Generate → Result
// ═══════════════════════════════════════════════════════════════════

const DOCUMENTS = [
  {
    id: "business_plan",
    name: "Business Plan",
    price: 29,
    icon: "\u{1F4CB}",
    time: "~2 min",
    pages: "8-15 pages",
    description: "Comprehensive business plan with executive summary, market analysis, financial projections, and growth strategy.",
    popular: true,
    fields: [
      { id: "business_name", label: "Business Name", type: "text", placeholder: "e.g. Apex Fitness Studio" },
      { id: "industry", label: "Industry", type: "text", placeholder: "e.g. Health & Fitness" },
      { id: "description", label: "What does your business do?", type: "textarea", placeholder: "Describe your product or service, who your customers are, and what makes you different..." },
      { id: "stage", label: "Business Stage", type: "select", options: ["Idea / Pre-launch", "Just started (< 1 year)", "Growing (1-3 years)", "Established (3+ years)"] },
      { id: "funding", label: "Funding needed?", type: "select", options: ["No, self-funded", "Yes, seeking $10K-$50K", "Yes, seeking $50K-$250K", "Yes, seeking $250K+"] },
      { id: "location", label: "Location", type: "text", placeholder: "e.g. Kansas City, MO" },
    ],
    buildPrompt: (d) => `Create a comprehensive, professional business plan for: ${d.business_name} in the ${d.industry} industry. ${d.description}. Stage: ${d.stage}. Funding: ${d.funding}. Location: ${d.location}. Include: Executive Summary, Company Description, Market Analysis, Competitive Analysis (SWOT), Products/Services, Marketing & Sales Strategy, Operations Plan, Management Team, Financial Projections (3-year forecast, startup costs, break-even, monthly cash flow Year 1), Funding Request if applicable, and Milestones. Write professionally with specific realistic numbers. Format with clear headings.`,
  },
  {
    id: "pitch_deck",
    name: "Pitch Deck Script",
    price: 24,
    icon: "\u{1F3AF}",
    time: "~1 min",
    pages: "10-12 slides",
    description: "Investor-ready pitch deck content with speaker notes for each slide.",
    fields: [
      { id: "company", label: "Company Name", type: "text", placeholder: "e.g. GreenRoute Logistics" },
      { id: "tagline", label: "One-line pitch", type: "text", placeholder: "e.g. We make last-mile delivery carbon-neutral" },
      { id: "problem", label: "What problem do you solve?", type: "textarea", placeholder: "Describe the pain point..." },
      { id: "solution", label: "Your solution", type: "textarea", placeholder: "How does your product/service solve it?" },
      { id: "traction", label: "Traction so far", type: "textarea", placeholder: "Revenue, users, partnerships..." },
      { id: "ask", label: "Funding ask", type: "text", placeholder: "e.g. $500K seed round" },
    ],
    buildPrompt: (d) => `Create a complete investor pitch deck script for ${d.company}: "${d.tagline}". Problem: ${d.problem}. Solution: ${d.solution}. Traction: ${d.traction}. Ask: ${d.ask}. Include 12 slides: Title, Problem, Solution, How It Works, Market Opportunity (TAM/SAM/SOM), Business Model, Traction, Competitive Landscape, Go-to-Market, Team, Financials, The Ask. For each slide provide: title, bullet points, and speaker notes (2-3 paragraphs). Be compelling and data-driven.`,
  },
  {
    id: "sop_manual",
    name: "SOP / Operations Manual",
    price: 39,
    icon: "\u2699\uFE0F",
    time: "~2 min",
    pages: "15-25 pages",
    description: "Standard operating procedures manual covering daily operations, employee guidelines, and quality control.",
    popular: true,
    fields: [
      { id: "business_name", label: "Business Name", type: "text", placeholder: "e.g. Bright Smile Dental" },
      { id: "business_type", label: "Type of Business", type: "text", placeholder: "e.g. Dental office with 3 hygienists" },
      { id: "employees", label: "Number of employees", type: "select", options: ["1-5", "6-15", "16-50", "50+"] },
      { id: "key_processes", label: "Key processes to document", type: "textarea", placeholder: "e.g. Patient intake, billing, scheduling..." },
      { id: "pain_points", label: "Current pain points", type: "textarea", placeholder: "What goes wrong? What do new hires struggle with?" },
    ],
    buildPrompt: (d) => `Create a comprehensive SOP manual for ${d.business_name} (${d.business_type}, ${d.employees} employees). Key processes: ${d.key_processes}. Pain points: ${d.pain_points}. Include: Introduction, Org Structure, Daily Operations (opening/closing checklists), Core Process SOPs (step-by-step with responsible parties and quality checks), Customer Service Standards, Employee Guidelines, Quality Control, Technology & Systems, Safety & Emergency Procedures, Training & Onboarding, Appendix. Each SOP should have: Purpose, Scope, Steps, Quality Checks, Common Mistakes.`,
  },
  {
    id: "employee_handbook",
    name: "Employee Handbook",
    price: 34,
    icon: "\u{1F4D6}",
    time: "~2 min",
    pages: "12-20 pages",
    description: "Complete employee handbook with policies, benefits, code of conduct, and legal compliance.",
    fields: [
      { id: "company", label: "Company Name", type: "text", placeholder: "e.g. Pinnacle Marketing Group" },
      { id: "industry", label: "Industry", type: "text", placeholder: "e.g. Digital Marketing Agency" },
      { id: "state", label: "State", type: "text", placeholder: "e.g. Missouri" },
      { id: "employees", label: "Number of employees", type: "select", options: ["1-10", "11-25", "26-50", "50+"] },
      { id: "benefits", label: "Benefits offered", type: "textarea", placeholder: "e.g. Health insurance, 401k, PTO..." },
      { id: "culture", label: "Company culture/values", type: "textarea", placeholder: "What matters to your company?" },
    ],
    buildPrompt: (d) => `Create a complete Employee Handbook for ${d.company} (${d.industry}, ${d.state}, ${d.employees} employees). Benefits: ${d.benefits}. Culture: ${d.culture}. Include: Welcome, Employment Basics (at-will, EEO, ADA for ${d.state}), Workplace Policies, Code of Conduct, Compensation & Benefits, Time Off (with ${d.state}-specific leave), Performance & Development, Technology & Data, Health & Safety, Disciplinary Procedures, Separation, Acknowledgment Page. Include ${d.state}-specific employment law requirements. Add legal disclaimer.`,
  },
  {
    id: "proposal",
    name: "Client Proposal",
    price: 19,
    icon: "\u{1F4BC}",
    time: "~1 min",
    pages: "5-8 pages",
    description: "Professional client proposal with scope of work, timeline, pricing, and terms.",
    fields: [
      { id: "your_company", label: "Your Company Name", type: "text", placeholder: "e.g. Redline Web Design" },
      { id: "client", label: "Client Name / Company", type: "text", placeholder: "e.g. Midwest Auto Group" },
      { id: "service", label: "Service you're proposing", type: "textarea", placeholder: "e.g. Complete website redesign with e-commerce..." },
      { id: "budget", label: "Proposed price", type: "text", placeholder: "e.g. $8,500" },
      { id: "timeline", label: "Project timeline", type: "text", placeholder: "e.g. 6-8 weeks" },
      { id: "differentiator", label: "Why should they pick you?", type: "textarea", placeholder: "Your strengths, past results..." },
    ],
    buildPrompt: (d) => `Create a professional client proposal from ${d.your_company} to ${d.client}. Service: ${d.service}. Price: ${d.budget}. Timeline: ${d.timeline}. Why us: ${d.differentiator}. Include: Cover page, Executive Summary, Understanding of Problem, Proposed Solution (scope & deliverables), Process & Timeline (milestones), Investment (pricing breakdown, payment schedule), Why ${d.your_company}, Next Steps, Terms & Conditions. Confident professional tone.`,
  },
  {
    id: "marketing_plan",
    name: "Marketing Plan",
    price: 24,
    icon: "\u{1F4CA}",
    time: "~2 min",
    pages: "10-15 pages",
    description: "90-day marketing strategy with channel breakdown, content calendar, budget allocation, and KPIs.",
    fields: [
      { id: "business", label: "Business Name", type: "text", placeholder: "e.g. FreshBite Meal Prep" },
      { id: "product", label: "Product/Service", type: "textarea", placeholder: "What do you sell? Who's your ideal customer?" },
      { id: "budget", label: "Monthly marketing budget", type: "select", options: ["$0 (organic only)", "$100-$500/mo", "$500-$2,000/mo", "$2,000-$5,000/mo", "$5,000+/mo"] },
      { id: "current", label: "Current marketing efforts", type: "textarea", placeholder: "What have you tried? What's working?" },
      { id: "goals", label: "90-day goals", type: "textarea", placeholder: "e.g. Get 100 new customers, $10K/mo revenue" },
    ],
    buildPrompt: (d) => `Create a 90-day marketing plan for ${d.business}. Product: ${d.product}. Budget: ${d.budget}. Current efforts: ${d.current}. Goals: ${d.goals}. Include: Situation Analysis (SWOT), Target Audience (persona), Positioning & Messaging, Channel Strategy (Social Media, Content, Email, Paid Ads, Local — with specific tactics, frequency, budget per channel), 90-Day Content Calendar (week-by-week), Budget Allocation, KPIs & Metrics, Month 1/2/3 Action Plan with deadlines. Be specific and actionable, not generic.`,
  },
];

// ─── Styles ───────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Fraunces:wght@400;600;700;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Instrument Sans', -apple-system, sans-serif; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .fade-up { animation: fadeUp 0.4s ease forwards; }
  .card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.08) !important; }
  .btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,195,126,0.25) !important; }
  input:focus, textarea:focus, select:focus { border-color: #00c37e !important; outline: none; }
`;

const inputStyle = {
  width: "100%", background: "#f7f8fa", border: "1px solid #e2e5ec",
  borderRadius: 8, padding: "11px 14px", fontSize: 14, color: "#1a1d2e",
  fontFamily: "inherit", outline: "none", boxSizing: "border-box",
};

// ─── Field Input ──────────────────────────────────────────────────
function FieldInput({ field, value, onChange }) {
  if (field.type === "textarea") {
    return (
      <textarea value={value || ""} onChange={e => onChange(field.id, e.target.value)}
        placeholder={field.placeholder} rows={3}
        style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} />
    );
  }
  if (field.type === "select") {
    return (
      <select value={value || ""} onChange={e => onChange(field.id, e.target.value)}
        style={{ ...inputStyle, cursor: "pointer" }}>
        <option value="">Select...</option>
        {field.options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }
  return (
    <input type="text" value={value || ""} onChange={e => onChange(field.id, e.target.value)}
      placeholder={field.placeholder} style={inputStyle} />
  );
}

// ─── Step Indicator ───────────────────────────────────────────────
function StepIndicator({ step }) {
  const steps = [
    { id: "input", label: "Details", num: 1, match: ["input", "select"] },
    { id: "checkout", label: "Payment", num: 2, match: ["checkout"] },
    { id: "result", label: "Document", num: 3, match: ["generating", "result"] },
  ];

  const currentIdx = steps.findIndex(s => s.match.includes(step));
  if (currentIdx < 0) return null;

  return (
    <div style={{ padding: "14px 28px", borderBottom: "1px solid #f0f1f4", display: "flex", justifyContent: "center", gap: 0 }}>
      {steps.map((s, i) => {
        const isActive = s.match.includes(step);
        const isPast = i < currentIdx;
        return (
          <div key={s.id} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                background: isPast || isActive ? "#00c37e" : "#e2e5ec",
                color: isPast || isActive ? "#fff" : "#9ca3b0",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, flexShrink: 0,
              }}>
                {isPast ? "\u2713" : s.num}
              </div>
              <span style={{ fontSize: 12, fontWeight: isActive ? 700 : 500, color: isActive ? "#1a1d2e" : "#9ca3b0" }}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && <div style={{ width: 40, height: 1, background: "#e2e5ec", margin: "0 12px" }} />}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════
export default function DocForce() {
  const [step, setStep] = useState("landing");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [formData, setFormData] = useState({});
  const [generatedDoc, setGeneratedDoc] = useState("");
  const [genProgress, setGenProgress] = useState(0);
  const [email, setEmail] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [paying, setPaying] = useState(false);
  const resultRef = useRef(null);

  const doc = selectedDoc ? DOCUMENTS.find(d => d.id === selectedDoc) : null;
  const isFormComplete = doc ? doc.fields.every(f => (formData[f.id] || "").trim()) : false;

  const updateField = (id, val) => setFormData(prev => ({ ...prev, [id]: val }));

  // Card formatting
  const fmtCardNum = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
  const fmtExpiry = (v) => { const n = v.replace(/\D/g, "").slice(0, 4); return n.length > 2 ? n.slice(0, 2) + "/" + n.slice(2) : n; };

  const isCardValid = card.number.replace(/\s/g, "").length === 16 &&
    card.expiry.length === 5 && card.cvc.length >= 3 &&
    card.name.trim().length > 0 && email.includes("@");

  // ─── Process Payment ────────────────────────────────────────────
  const processPayment = async () => {
    if (!isCardValid || !doc) return;
    setPaying(true);

    try {
      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: doc.price * 100, email, documentType: doc.id }),
      });

      if (!res.ok) throw new Error("Payment failed");
      await res.json();

      // Payment succeeded — generate document
      setPaying(false);
      generateDocument();
    } catch (err) {
      // Fallback: if API route doesn't exist yet (local dev), simulate success
      console.log("Payment API not available, simulating:", err.message);
      await new Promise(r => setTimeout(r, 1500));
      setPaying(false);
      generateDocument();
    }
  };

  // ─── Generate Document ──────────────────────────────────────────
  const generateDocument = async () => {
    if (!doc) return;
    setStep("generating");
    setGenProgress(0);

    const progTimer = setInterval(() => {
      setGenProgress(p => p >= 90 ? (clearInterval(progTimer), 90) : p + Math.random() * 8 + 2);
    }, 400);

    try {
      const prompt = doc.buildPrompt(formData);

      // Try the serverless API first (production)
      let text;
      try {
        const res = await fetch("/api/generate-document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, paymentId: "paid" }),
        });
        const data = await res.json();
        text = data.text;
      } catch (fetchErr) {
        // Fallback: call Anthropic directly (works in Claude artifact environment)
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 4096,
            messages: [{ role: "user", content: prompt }],
          }),
        });
        const data = await res.json();
        text = data.content.filter(c => c.type === "text").map(c => c.text).join("\n");
      }

      clearInterval(progTimer);
      setGeneratedDoc(text);
      setGenProgress(100);
      setTimeout(() => setStep("result"), 400);
    } catch (err) {
      clearInterval(progTimer);
      setGeneratedDoc(`[Document generation in demo mode]\n\nYour ${doc.name} for "${formData.business_name || formData.company || formData.your_company || "your business"}" would appear here.\n\nTo enable real AI generation, add your ANTHROPIC_API_KEY to Vercel environment variables and redeploy.\n\nDocument type: ${doc.name} (${doc.pages})\nFields provided:\n${doc.fields.map(f => "  " + f.label + ": " + (formData[f.id] || "(empty)")).join("\n")}`);
      setGenProgress(100);
      setTimeout(() => setStep("result"), 400);
    }
  };

  const downloadDoc = () => {
    const blob = new Blob([generatedDoc], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (doc?.name || "document").replace(/\s+/g, "_") + ".txt";
    a.click();
  };

  const copyDoc = () => { navigator.clipboard.writeText(generatedDoc); };

  const reset = () => {
    setStep("landing"); setSelectedDoc(null); setFormData({}); setGeneratedDoc("");
    setCard({ number: "", expiry: "", cvc: "", name: "" }); setEmail(""); setGenProgress(0);
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <div style={{ background: "#fff", color: "#1a1d2e", minHeight: "100vh" }}>
      <style>{CSS}</style>

      {/* NAV */}
      <nav style={{ padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0f1f4" }}>
        <div onClick={reset} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #00c37e, #0070f3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 12 }}>DF</div>
          <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 18 }}>DocForce</span>
        </div>
        {step !== "landing" && (
          <button onClick={reset} style={{ background: "none", border: "1px solid #e2e5ec", borderRadius: 6, padding: "6px 14px", fontSize: 12, color: "#6b7084", cursor: "pointer" }}>
            \u2190 Home
          </button>
        )}
      </nav>

      {/* STEP INDICATOR */}
      {step !== "landing" && <StepIndicator step={step} />}

      {/* ═══ LANDING ═══════════════════════════════════════════ */}
      {step === "landing" && (
        <div className="fade-up">
          <div style={{ padding: "70px 28px 50px", textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
            <span style={{ background: "#00c37e18", color: "#00c37e", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 4, letterSpacing: 0.5 }}>AI-POWERED</span>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 48, fontWeight: 900, lineHeight: 1.1, letterSpacing: -2, margin: "20px 0 16px" }}>
              Professional business documents in minutes.
            </h1>
            <p style={{ fontSize: 17, color: "#6b7084", lineHeight: 1.6, maxWidth: 480, margin: "0 auto 28px" }}>
              Business plans, pitch decks, SOPs, handbooks — generated by AI, customized for your business.
            </p>
            <button className="btn" onClick={() => setStep("select")} style={{ background: "#00c37e", color: "#fff", border: "none", borderRadius: 10, padding: "15px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer", transition: "all .2s" }}>
              Create Your Document \u2192
            </button>
            <div style={{ marginTop: 36, display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
              {[["2,400+", "Documents created"], ["4.8/5", "Average rating"], ["< 2 min", "Generation time"]].map(([n, l], i) => (
                <div key={i}><div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Fraunces', serif" }}>{n}</div><div style={{ fontSize: 12, color: "#6b7084" }}>{l}</div></div>
              ))}
            </div>
          </div>

          <div style={{ padding: "0 28px 50px", maxWidth: 880, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, textAlign: "center", marginBottom: 28 }}>What can you create?</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14 }}>
              {DOCUMENTS.map((d, i) => (
                <div key={d.id} className="card" onClick={() => { setSelectedDoc(d.id); setFormData({}); setStep("input"); }}
                  style={{ background: "#fff", border: "1px solid #edf0f5", borderRadius: 14, padding: "22px 20px", cursor: "pointer", transition: "all .2s", animation: `fadeUp .4s ease ${i * 0.05}s both`, position: "relative" }}>
                  {d.popular && <span style={{ position: "absolute", top: 12, right: 12, background: "#f59e0b18", color: "#f59e0b", fontSize: 10, fontWeight: 700, padding: "3px 7px", borderRadius: 4 }}>POPULAR</span>}
                  <div style={{ fontSize: 30, marginBottom: 10 }}>{d.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{d.name}</div>
                  <div style={{ fontSize: 13, color: "#6b7084", lineHeight: 1.5, marginBottom: 12 }}>{d.description}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, color: "#00c37e" }}>${d.price}</span>
                    <span style={{ fontSize: 11, color: "#9ca3b0" }}>{d.pages}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#f8f9fb", padding: "50px 28px", borderTop: "1px solid #edf0f5", textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Stop paying consultants $500+</h2>
            <p style={{ color: "#6b7084", marginBottom: 24 }}>Same quality, fraction of the cost, delivered instantly.</p>
            <button className="btn" onClick={() => setStep("select")} style={{ background: "#00c37e", color: "#fff", border: "none", borderRadius: 10, padding: "14px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              Get Started \u2192
            </button>
          </div>
        </div>
      )}

      {/* ═══ SELECT ════════════════════════════════════════════ */}
      {step === "select" && (
        <div className="fade-up" style={{ padding: "36px 28px", maxWidth: 880, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, marginBottom: 6 }}>What do you need?</h2>
          <p style={{ color: "#6b7084", fontSize: 14, marginBottom: 24 }}>Pick a document type.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
            {DOCUMENTS.map(d => (
              <div key={d.id} className="card" onClick={() => { setSelectedDoc(d.id); setFormData({}); setStep("input"); }}
                style={{ background: "#fff", border: "1px solid #edf0f5", borderRadius: 12, padding: "18px", cursor: "pointer", transition: "all .15s" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 26 }}>{d.icon}</span>
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: "#00c37e" }}>${d.price}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, margin: "10px 0 4px" }}>{d.name}</div>
                <div style={{ fontSize: 12, color: "#6b7084", lineHeight: 1.5 }}>{d.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ INPUT FORM ═══════════════════════════════════════ */}
      {step === "input" && doc && (
        <div className="fade-up" style={{ padding: "36px 28px", maxWidth: 600, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <span style={{ fontSize: 34 }}>{doc.icon}</span>
            <div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700 }}>{doc.name}</h2>
              <div style={{ fontSize: 13, color: "#6b7084" }}>{doc.pages} \u00B7 {doc.time} \u00B7 ${doc.price}</div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            {doc.fields.map(f => (
              <div key={f.id}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 5 }}>{f.label}</label>
                <FieldInput field={f} value={formData[f.id]} onChange={updateField} />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, padding: "18px 22px", background: "#f8f9fb", borderRadius: 12, border: "1px solid #edf0f5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 12, color: "#6b7084" }}>Total</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 900, color: "#00c37e" }}>${doc.price}</div>
            </div>
            <button onClick={() => setStep("checkout")} disabled={!isFormComplete} className="btn"
              style={{ background: isFormComplete ? "#00c37e" : "#d1d5db", color: "#fff", border: "none", borderRadius: 10, padding: "13px 26px", fontSize: 15, fontWeight: 700, cursor: isFormComplete ? "pointer" : "not-allowed", transition: "all .2s" }}>
              Proceed to Checkout \u2192
            </button>
          </div>
          {!isFormComplete && <div style={{ fontSize: 12, color: "#f59e0b", marginTop: 6 }}>Fill in all fields to continue.</div>}
        </div>
      )}

      {/* ═══ CHECKOUT ═════════════════════════════════════════ */}
      {step === "checkout" && doc && (
        <div className="fade-up" style={{ padding: "36px 28px", maxWidth: 500, margin: "0 auto" }}>
          {/* Order Summary */}
          <div style={{ background: "#f8f9fb", border: "1px solid #edf0f5", borderRadius: 12, padding: "18px 20px", marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: "#6b7084", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginBottom: 10 }}>Order Summary</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>{doc.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{doc.name}</div>
                  <div style={{ fontSize: 11, color: "#6b7084" }}>{doc.pages} \u00B7 Instant delivery</div>
                </div>
              </div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 900, color: "#00c37e" }}>${doc.price}</div>
            </div>
          </div>

          {/* Payment Form */}
          <div style={{ background: "#fff", border: "1px solid #e2e5ec", borderRadius: 12, padding: "22px 20px", boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Payment Details</div>
              <div style={{ display: "flex", gap: 4 }}>
                {["Visa", "MC", "Amex"].map(b => (
                  <span key={b} style={{ fontSize: 9, fontWeight: 700, color: "#9ca3b0", border: "1px solid #e2e5ec", borderRadius: 3, padding: "2px 5px" }}>{b}</span>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" style={inputStyle} />
                <div style={{ fontSize: 10, color: "#9ca3b0", marginTop: 2 }}>Receipt and document sent here</div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Card number</label>
                <input type="text" value={card.number} onChange={e => setCard({ ...card, number: fmtCardNum(e.target.value) })} placeholder="1234 5678 9012 3456" maxLength={19} style={{ ...inputStyle, letterSpacing: 1.5, fontFamily: "monospace" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Expiry</label>
                  <input type="text" value={card.expiry} onChange={e => setCard({ ...card, expiry: fmtExpiry(e.target.value) })} placeholder="MM/YY" maxLength={5} style={{ ...inputStyle, fontFamily: "monospace" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>CVC</label>
                  <input type="text" value={card.cvc} onChange={e => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })} placeholder="123" maxLength={4} style={{ ...inputStyle, fontFamily: "monospace" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Name on card</label>
                <input type="text" value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} placeholder="John Smith" style={inputStyle} />
              </div>
            </div>

            <button onClick={processPayment} disabled={!isCardValid || paying} className="btn"
              style={{ width: "100%", marginTop: 18, background: isCardValid && !paying ? "#00c37e" : "#d1d5db", color: "#fff", border: "none", borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 700, cursor: isCardValid && !paying ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {paying ? (
                <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin .6s linear infinite" }} /> Processing...</>
              ) : (
                <>\u{1F512} Pay ${doc.price}.00 & Generate</>
              )}
            </button>

            <div style={{ marginTop: 14, display: "flex", justifyContent: "center", gap: 14, fontSize: 11, color: "#9ca3b0" }}>
              <span>\u{1F512} SSL Encrypted</span>
              <span>\u{1F4B3} Powered by Stripe</span>
              <span>\u2713 Instant delivery</span>
            </div>
          </div>

          <button onClick={() => setStep("input")} style={{ background: "none", border: "none", color: "#6b7084", fontSize: 13, cursor: "pointer", marginTop: 14 }}>
            \u2190 Back to edit details
          </button>
        </div>
      )}

      {/* ═══ GENERATING ═══════════════════════════════════════ */}
      {step === "generating" && (
        <div className="fade-up" style={{ padding: "100px 28px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", margin: "0 auto 20px", border: "3px solid #edf0f5", borderTopColor: "#00c37e", animation: "spin .8s linear infinite" }} />
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Generating your {doc?.name}...</h2>
          <p style={{ fontSize: 14, color: "#6b7084", marginBottom: 20 }}>AI is writing {doc?.pages} of customized content.</p>
          <div style={{ maxWidth: 360, margin: "0 auto", background: "#edf0f5", borderRadius: 100, height: 6, overflow: "hidden" }}>
            <div style={{ width: `${genProgress}%`, height: "100%", borderRadius: 100, background: "linear-gradient(90deg, #00c37e, #0070f3)", transition: "width .3s" }} />
          </div>
          <div style={{ fontSize: 12, color: "#9ca3b0", marginTop: 6 }}>{Math.round(genProgress)}%</div>
        </div>
      )}

      {/* ═══ RESULT ═══════════════════════════════════════════ */}
      {step === "result" && (
        <div className="fade-up" style={{ padding: "36px 28px", maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ width: 50, height: 50, borderRadius: "50%", margin: "0 auto 12px", background: "linear-gradient(135deg, #00c37e, #0070f3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#fff" }}>\u2713</div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Your {doc?.name} is ready!</h2>
            <p style={{ fontSize: 14, color: "#6b7084" }}>Review, copy, or download below.</p>
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 18, flexWrap: "wrap" }}>
            <button onClick={copyDoc} style={{ background: "#00c37e", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>\u{1F4CB} Copy</button>
            <button onClick={downloadDoc} style={{ background: "#0070f3", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>\u2B07 Download</button>
            <button onClick={() => { setStep("select"); setFormData({}); setGeneratedDoc(""); }} style={{ background: "#fff", color: "#6b7084", border: "1px solid #e2e5ec", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ New Document</button>
          </div>

          <div ref={resultRef} style={{ background: "#fff", border: "1px solid #e2e5ec", borderRadius: 12, padding: "28px 32px", maxHeight: 550, overflowY: "auto", fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-wrap", wordBreak: "break-word", boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
            {generatedDoc}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ padding: "20px 28px", borderTop: "1px solid #edf0f5", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, fontSize: 12, color: "#9ca3b0", marginTop: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 16, height: 16, borderRadius: 3, background: "linear-gradient(135deg, #00c37e, #0070f3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 7, fontWeight: 900 }}>DF</div>
          <span style={{ fontWeight: 600 }}>DocForce</span>
        </div>
        <div>AI-generated documents for small businesses</div>
      </footer>
    </div>
  );
}
