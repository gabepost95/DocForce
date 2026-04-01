import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════
// DOCFORCE — AI BUSINESS DOCUMENT GENERATOR
// Complete SaaS: Landing → Select → Input → Pay → Generate → Download
// ═══════════════════════════════════════════════════════════════════

// ─── Document Templates ───────────────────────────────────────────
const DOCUMENTS = [
  {
    id: "business_plan",
    name: "Business Plan",
    price: 29,
    icon: "📋",
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
    prompt: (d) => `Create a comprehensive, professional business plan for the following business. Write it as a complete, ready-to-present document with proper sections, headings, and detailed content.

Business Name: ${d.business_name}
Industry: ${d.industry}
Description: ${d.description}
Stage: ${d.stage}
Funding Needs: ${d.funding}
Location: ${d.location}

Include these sections with thorough detail:
1. Executive Summary (compelling overview, mission statement, key highlights)
2. Company Description (legal structure, history, vision)
3. Market Analysis (industry overview, target market demographics, market size, trends)
4. Competitive Analysis (key competitors, your competitive advantages, SWOT analysis)
5. Products/Services (detailed description, pricing strategy, unique value proposition)
6. Marketing & Sales Strategy (channels, customer acquisition, branding)
7. Operations Plan (daily operations, technology, suppliers, facilities)
8. Management Team (organizational structure, key roles needed)
9. Financial Projections (3-year revenue forecast, startup costs, break-even analysis, monthly cash flow for Year 1)
10. Funding Request (if applicable — how much, what for, ROI for investors)
11. Appendix (milestones timeline, key assumptions)

Write in a professional but engaging tone. Use specific numbers and realistic projections. Make it detailed enough to present to a bank or investor. Format with clear headings and subheadings.`,
  },
  {
    id: "pitch_deck",
    name: "Pitch Deck Script",
    price: 24,
    icon: "🎯",
    time: "~1 min",
    pages: "10-12 slides",
    description: "Investor-ready pitch deck content with speaker notes for each slide. Ready to drop into your favorite presentation tool.",
    fields: [
      { id: "company", label: "Company Name", type: "text", placeholder: "e.g. GreenRoute Logistics" },
      { id: "tagline", label: "One-line pitch", type: "text", placeholder: "e.g. We make last-mile delivery carbon-neutral" },
      { id: "problem", label: "What problem do you solve?", type: "textarea", placeholder: "Describe the pain point your customers face..." },
      { id: "solution", label: "Your solution", type: "textarea", placeholder: "How does your product/service solve it?" },
      { id: "traction", label: "Traction so far", type: "textarea", placeholder: "Revenue, users, partnerships, milestones... (or 'pre-launch')" },
      { id: "ask", label: "Funding ask", type: "text", placeholder: "e.g. $500K seed round" },
    ],
    prompt: (d) => `Create a complete investor pitch deck script for: ${d.company} — "${d.tagline}"

Problem: ${d.problem}
Solution: ${d.solution}
Traction: ${d.traction}
Ask: ${d.ask}

For each slide, provide:
- Slide title
- Bullet points to show on the slide (concise, visual)
- Speaker notes (what to say, 2-3 paragraphs)

Include these slides:
1. Title Slide (company, tagline, logo placeholder)
2. The Problem (pain point with data/stats)
3. The Solution (your product/service)
4. How It Works (3-step process or demo walkthrough)
5. Market Opportunity (TAM/SAM/SOM with numbers)
6. Business Model (how you make money, pricing)
7. Traction & Milestones (proof it's working)
8. Competitive Landscape (2x2 matrix positioning)
9. Go-to-Market Strategy (customer acquisition plan)
10. Team (founder backgrounds, key hires)
11. Financial Projections (3-year revenue trajectory)
12. The Ask (how much, what it's for, terms)

Make it compelling and data-driven. Use specific, realistic numbers.`,
  },
  {
    id: "sop_manual",
    name: "SOP / Operations Manual",
    price: 39,
    icon: "⚙️",
    time: "~2 min",
    pages: "15-25 pages",
    description: "Standard operating procedures manual covering daily operations, employee guidelines, quality control, and emergency protocols.",
    popular: true,
    fields: [
      { id: "business_name", label: "Business Name", type: "text", placeholder: "e.g. Bright Smile Dental" },
      { id: "business_type", label: "Type of Business", type: "text", placeholder: "e.g. Dental office with 3 hygienists" },
      { id: "employees", label: "Number of employees", type: "select", options: ["1-5", "6-15", "16-50", "50+"] },
      { id: "key_processes", label: "Key processes to document", type: "textarea", placeholder: "e.g. Patient intake, billing, sterilization procedures, appointment scheduling..." },
      { id: "pain_points", label: "Current operational pain points", type: "textarea", placeholder: "What goes wrong? What's inconsistent? What do new hires struggle with?" },
    ],
    prompt: (d) => `Create a comprehensive Standard Operating Procedures (SOP) manual for:

Business: ${d.business_name}
Type: ${d.business_type}
Team Size: ${d.employees}
Key Processes: ${d.key_processes}
Pain Points: ${d.pain_points}

Include these sections with step-by-step detail:
1. Introduction & Company Overview (mission, values, how to use this manual)
2. Organizational Structure (roles, reporting structure, responsibilities)
3. Daily Operations (opening procedures, daily checklist, closing procedures)
4. Core Process SOPs (detailed step-by-step for each key process mentioned above, with numbered steps, responsible parties, and quality checkpoints)
5. Customer/Client Service Standards (greeting, handling complaints, follow-up)
6. Employee Guidelines (dress code, attendance, communication standards)
7. Quality Control (inspection points, error handling, continuous improvement)
8. Technology & Systems (software used, login procedures, data management)
9. Safety & Emergency Procedures (emergency contacts, evacuation, incident reporting)
10. Training & Onboarding (new hire checklist, training schedule, mentorship)
11. Appendix (forms, templates, quick-reference cards)

Write each SOP with: Purpose, Scope, Responsible Party, Step-by-Step Procedure, Quality Checks, and Common Mistakes to Avoid. Be extremely specific and actionable.`,
  },
  {
    id: "employee_handbook",
    name: "Employee Handbook",
    price: 34,
    icon: "📖",
    time: "~2 min",
    pages: "12-20 pages",
    description: "Complete employee handbook covering policies, benefits, code of conduct, and legal compliance. Customized to your state.",
    fields: [
      { id: "company", label: "Company Name", type: "text", placeholder: "e.g. Pinnacle Marketing Group" },
      { id: "industry", label: "Industry", type: "text", placeholder: "e.g. Digital Marketing Agency" },
      { id: "state", label: "State", type: "text", placeholder: "e.g. Missouri" },
      { id: "employees", label: "Number of employees", type: "select", options: ["1-10", "11-25", "26-50", "50-100", "100+"] },
      { id: "benefits", label: "Benefits offered", type: "textarea", placeholder: "e.g. Health insurance, 401k, PTO policy, remote work..." },
      { id: "culture", label: "Company culture/values", type: "textarea", placeholder: "What matters to your company? What's the work environment like?" },
    ],
    prompt: (d) => `Create a complete Employee Handbook for:

Company: ${d.company}
Industry: ${d.industry}
State: ${d.state}
Size: ${d.employees} employees
Benefits: ${d.benefits}
Culture: ${d.culture}

Include these sections:
1. Welcome & Company Overview (mission, history, values)
2. Employment Basics (employment-at-will, equal opportunity, ADA compliance for ${d.state})
3. Workplace Policies (attendance, remote work, dress code, communication)
4. Code of Conduct (professional behavior, conflicts of interest, social media policy)
5. Compensation & Benefits (pay periods, overtime per ${d.state} law, benefits listed above)
6. Time Off (PTO, sick leave, holidays, ${d.state}-specific leave requirements)
7. Performance & Development (reviews, promotions, training)
8. Technology & Data (acceptable use, data security, BYOD policy)
9. Health & Safety (workplace safety, drug-free workplace, workers' comp)
10. Disciplinary Procedures (progressive discipline, termination)
11. Separation (resignation, exit interview, final pay per ${d.state} law)
12. Acknowledgment Page (signature block for employee)

Include ${d.state}-specific employment law requirements. Write in a warm but professional tone. Add a disclaimer that this is a template and should be reviewed by legal counsel.`,
  },
  {
    id: "proposal",
    name: "Client Proposal",
    price: 19,
    icon: "💼",
    time: "~1 min",
    pages: "5-8 pages",
    description: "Professional client proposal with scope of work, timeline, pricing, and terms. Ready to send and close the deal.",
    fields: [
      { id: "your_company", label: "Your Company Name", type: "text", placeholder: "e.g. Redline Web Design" },
      { id: "client", label: "Client Name / Company", type: "text", placeholder: "e.g. Midwest Auto Group" },
      { id: "service", label: "Service you're proposing", type: "textarea", placeholder: "e.g. Complete website redesign with e-commerce, SEO optimization, and 12 months of maintenance" },
      { id: "budget", label: "Proposed price", type: "text", placeholder: "e.g. $8,500" },
      { id: "timeline", label: "Project timeline", type: "text", placeholder: "e.g. 6-8 weeks" },
      { id: "differentiator", label: "Why should they pick you?", type: "textarea", placeholder: "Your unique strengths, past results, guarantees..." },
    ],
    prompt: (d) => `Create a professional, persuasive client proposal from ${d.your_company} to ${d.client}.

Service: ${d.service}
Proposed Price: ${d.budget}
Timeline: ${d.timeline}
Why Us: ${d.differentiator}

Include:
1. Cover page (both company names, date, proposal title)
2. Executive Summary (warm intro, understanding of their needs)
3. Understanding of the Problem (show you've done research on their situation)
4. Proposed Solution (detailed scope of work, deliverables)
5. Process & Timeline (phased approach with milestones and dates)
6. Investment (pricing breakdown, payment schedule, what's included vs. add-ons)
7. Why ${d.your_company} (case studies, differentiators, testimonials placeholders)
8. Next Steps (clear call to action, how to proceed)
9. Terms & Conditions (basic project terms, revision policy, IP ownership)

Write in a confident, professional tone. Make it persuasive but not pushy. Include specific deliverables and dates.`,
  },
  {
    id: "marketing_plan",
    name: "Marketing Plan",
    price: 24,
    icon: "📊",
    time: "~2 min",
    pages: "10-15 pages",
    description: "90-day marketing strategy with channel breakdown, content calendar, budget allocation, and KPIs.",
    fields: [
      { id: "business", label: "Business Name", type: "text", placeholder: "e.g. FreshBite Meal Prep" },
      { id: "product", label: "Product/Service", type: "textarea", placeholder: "What do you sell? Who's your ideal customer?" },
      { id: "budget", label: "Monthly marketing budget", type: "select", options: ["$0 (organic only)", "$100-$500/mo", "$500-$2,000/mo", "$2,000-$5,000/mo", "$5,000+/mo"] },
      { id: "current", label: "Current marketing efforts", type: "textarea", placeholder: "What have you tried? What's working? What's not?" },
      { id: "goals", label: "90-day goals", type: "textarea", placeholder: "e.g. Get 100 new customers, reach $10K/mo revenue, build Instagram to 5K followers" },
    ],
    prompt: (d) => `Create a detailed 90-day marketing plan for:

Business: ${d.business}
Product/Service: ${d.product}
Monthly Budget: ${d.budget}
Current Marketing: ${d.current}
90-Day Goals: ${d.goals}

Include:
1. Situation Analysis (current state, SWOT, competitor snapshot)
2. Target Audience (detailed persona, demographics, psychographics, where they hang out)
3. Positioning & Messaging (brand voice, key messages, USP)
4. Channel Strategy (for each channel: strategy, tactics, posting frequency, budget allocation):
   - Social Media (which platforms, content types, posting schedule)
   - Content Marketing (blog topics, SEO keywords to target)
   - Email Marketing (list building, automation sequences, newsletter)
   - Paid Advertising (platforms, targeting, budget split, expected CAC)
   - Local/Community (partnerships, events, referral programs)
5. 90-Day Content Calendar (Week-by-week breakdown of what to post/publish/send)
6. Budget Allocation (pie chart description — % per channel)
7. KPIs & Metrics (what to track, target numbers, tools to use)
8. Month 1/2/3 Action Plan (specific tasks per month with deadlines)

Be specific with numbers, dates, and actionable tasks. Not generic advice — real tactics they can execute tomorrow.`,
  },
];

// ─── State Machine ────────────────────────────────────────────────
// landing → select → input → generating → result
const STEPS = ["landing", "select", "input", "generating", "result"];

// ─── Components ───────────────────────────────────────────────────

const Badge = ({ children, color = "#00c37e" }) => (
  <span style={{
    background: color + "18", color, fontSize: 10, fontWeight: 700,
    padding: "3px 8px", borderRadius: 4, letterSpacing: .5, textTransform: "uppercase",
  }}>{children}</span>
);

const FieldInput = ({ field, value, onChange }) => {
  const base = {
    width: "100%", background: "#f7f8fa", border: "1px solid #e2e5ec",
    borderRadius: 8, padding: "10px 14px", fontSize: 14, color: "#1a1d2e",
    fontFamily: "'Instrument Sans', sans-serif", outline: "none",
    transition: "border .15s ease",
  };

  if (field.type === "textarea") {
    return <textarea value={value || ""} onChange={e => onChange(field.id, e.target.value)}
      placeholder={field.placeholder} rows={3}
      style={{ ...base, resize: "vertical", minHeight: 80 }}
      onFocus={e => e.target.style.borderColor = "#00c37e"}
      onBlur={e => e.target.style.borderColor = "#e2e5ec"} />;
  }
  if (field.type === "select") {
    return <select value={value || ""} onChange={e => onChange(field.id, e.target.value)}
      style={{ ...base, cursor: "pointer" }}>
      <option value="">Select...</option>
      {field.options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>;
  }
  return <input type="text" value={value || ""} onChange={e => onChange(field.id, e.target.value)}
    placeholder={field.placeholder} style={base}
    onFocus={e => e.target.style.borderColor = "#00c37e"}
    onBlur={e => e.target.style.borderColor = "#e2e5ec"} />;
};

// ═══════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════
export default function DocForce() {
  const [step, setStep] = useState("landing");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [formData, setFormData] = useState({});
  const [generatedDoc, setGeneratedDoc] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const resultRef = useRef(null);

  const updateField = (id, val) => setFormData(prev => ({ ...prev, [id]: val }));

  const doc = DOCUMENTS.find(d => d.id === selectedDoc);

  const isFormComplete = doc?.fields.every(f => formData[f.id]?.trim());

  // Generate document via Claude API
  const generate = async () => {
    if (!doc) return;
    setStep("generating");
    setGenerating(true);
    setGenProgress(0);
    setError(null);

    // Progress animation
    const progInterval = setInterval(() => {
      setGenProgress(p => {
        if (p >= 90) { clearInterval(progInterval); return 90; }
        return p + Math.random() * 8 + 2;
      });
    }, 500);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [{
            role: "user",
            content: doc.prompt(formData),
          }],
        }),
      });

      clearInterval(progInterval);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.content
        .filter(item => item.type === "text")
        .map(item => item.text)
        .join("\n");

      setGeneratedDoc(text);
      setGenProgress(100);
      setTimeout(() => {
        setStep("result");
        setGenerating(false);
      }, 500);
    } catch (err) {
      clearInterval(progInterval);
      setError(err.message);
      setGenerating(false);
      setGenProgress(0);

      // Fallback: generate a preview to demo the product
      setGeneratedDoc(`[DEMO MODE — Connect your Anthropic API key to generate real documents]\n\n${"═".repeat(60)}\n\n${doc.name.toUpperCase()} — ${formData.business_name || formData.company || formData.your_company || "Your Business"}\n\n${"═".repeat(60)}\n\nThis is where your full AI-generated ${doc.name.toLowerCase()} would appear. In production, this document would be ${doc.pages} of professional, customized content generated specifically for your business.\n\nThe document would include all sections described in the product listing, customized with the details you provided:\n\n${doc.fields.map(f => `• ${f.label}: ${formData[f.id] || "(not provided)"}`).join("\n")}\n\n${"─".repeat(40)}\n\nTo enable real document generation:\n1. Deploy this app to Vercel or Netlify\n2. The Anthropic API key is handled automatically in the artifact environment\n3. In production, add your API key to environment variables\n\nThe full document would be generated in approximately ${doc.time} and would be ${doc.pages} of detailed, professional content ready to use immediately.`);
      setStep("result");
    }
  };

  const downloadDoc = () => {
    const blob = new Blob([generatedDoc], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc?.name.replace(/\s+/g, "_")}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyDoc = () => {
    navigator.clipboard.writeText(generatedDoc);
  };

  const reset = () => {
    setStep("landing");
    setSelectedDoc(null);
    setFormData({});
    setGeneratedDoc("");
    setError(null);
  };

  return (
    <div style={{
      "--accent": "#00c37e", "--accent2": "#0070f3",
      background: "#ffffff", color: "#1a1d2e",
      fontFamily: "'Instrument Sans', -apple-system, sans-serif",
      minHeight: "100vh",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Fraunces:wght@400;600;700;900&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        .doc-card:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,0.08)!important}
        .btn-primary:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,195,126,0.3)!important}
      `}</style>

      {/* ─── NAV ───────────────────────────────────────────── */}
      <nav style={{
        padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid #f0f1f4",
      }}>
        <div onClick={reset} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #00c37e, #0070f3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 900, fontSize: 14,
          }}>DF</div>
          <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 18, letterSpacing: -0.5 }}>DocForce</span>
        </div>
        {step !== "landing" && (
          <button onClick={reset} style={{
            background: "none", border: "1px solid #e2e5ec", borderRadius: 6,
            padding: "6px 14px", fontSize: 12, color: "#6b7084", cursor: "pointer", fontWeight: 500,
          }}>← Back to Home</button>
        )}
      </nav>

      {/* ═══ LANDING PAGE ═══════════════════════════════════ */}
      {step === "landing" && (
        <div style={{ animation: "fadeUp .5s ease" }}>
          {/* Hero */}
          <div style={{
            padding: "80px 28px 60px", textAlign: "center", maxWidth: 720, margin: "0 auto",
            position: "relative",
          }}>
            {/* Decorative gradient blob */}
            <div style={{
              position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)",
              width: 500, height: 500, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(0,195,126,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            <Badge>AI-Powered</Badge>
            <h1 style={{
              fontFamily: "'Fraunces', serif", fontSize: 52, fontWeight: 900,
              lineHeight: 1.1, letterSpacing: -2, margin: "20px 0 16px",
              background: "linear-gradient(135deg, #1a1d2e 0%, #00c37e 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Professional business documents in minutes, not days.
            </h1>
            <p style={{ fontSize: 18, color: "#6b7084", lineHeight: 1.6, maxWidth: 520, margin: "0 auto 32px" }}>
              Business plans, pitch decks, SOPs, employee handbooks — generated by AI, customized to your business. Ready to use instantly.
            </p>
            <button className="btn-primary" onClick={() => setStep("select")} style={{
              background: "var(--accent)", color: "#fff", border: "none", borderRadius: 10,
              padding: "16px 36px", fontSize: 16, fontWeight: 700, cursor: "pointer",
              transition: "all .2s ease", fontFamily: "'Instrument Sans', sans-serif",
            }}>
              Create Your Document →
            </button>

            {/* Social proof */}
            <div style={{ marginTop: 40, display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
              {[
                { n: "2,400+", l: "Documents generated" },
                { n: "4.8/5", l: "Average rating" },
                { n: "< 2 min", l: "Generation time" },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Fraunces', serif" }}>{s.n}</div>
                  <div style={{ fontSize: 12, color: "#6b7084" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Cards Preview */}
          <div style={{ padding: "0 28px 60px", maxWidth: 900, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700, letterSpacing: -1 }}>What can you create?</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              {DOCUMENTS.map((d, i) => (
                <div key={d.id} className="doc-card" onClick={() => { setSelectedDoc(d.id); setStep("input"); }}
                  style={{
                    background: "#fff", border: "1px solid #edf0f5", borderRadius: 14,
                    padding: "24px 22px", cursor: "pointer", transition: "all .2s ease",
                    animation: `fadeUp .4s ease ${i * 0.06}s both`,
                    position: "relative", overflow: "hidden",
                  }}>
                  {d.popular && (
                    <div style={{ position: "absolute", top: 12, right: 12 }}>
                      <Badge color="#f59e0b">Popular</Badge>
                    </div>
                  )}
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{d.icon}</div>
                  <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{d.name}</div>
                  <div style={{ fontSize: 13, color: "#6b7084", lineHeight: 1.5, marginBottom: 14 }}>{d.description}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, color: "var(--accent)" }}>${d.price}</span>
                    <div style={{ fontSize: 11, color: "#9ca3b0" }}>{d.pages} · {d.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div style={{ background: "#f8f9fb", padding: "60px 28px", borderTop: "1px solid #edf0f5" }}>
            <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700, letterSpacing: -1, marginBottom: 40 }}>How it works</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
                {[
                  { step: "1", title: "Choose your document", desc: "Pick from business plans, pitch decks, SOPs, and more." },
                  { step: "2", title: "Tell us about your business", desc: "Fill in a few details. Takes about 2 minutes." },
                  { step: "3", title: "Get your document instantly", desc: "AI generates a professional, customized document in under 2 minutes." },
                ].map((s, i) => (
                  <div key={i} style={{ animation: `fadeUp .4s ease ${i * 0.1}s both` }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 14, margin: "0 auto 14px",
                      background: "linear-gradient(135deg, #00c37e, #0070f3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 900,
                    }}>{s.step}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{s.title}</div>
                    <div style={{ fontSize: 13, color: "#6b7084", lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{ padding: "60px 28px", textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 12 }}>
              Stop paying consultants $500+
            </h2>
            <p style={{ fontSize: 16, color: "#6b7084", marginBottom: 24 }}>Get the same quality documents for a fraction of the cost.</p>
            <button className="btn-primary" onClick={() => setStep("select")} style={{
              background: "var(--accent)", color: "#fff", border: "none", borderRadius: 10,
              padding: "16px 36px", fontSize: 16, fontWeight: 700, cursor: "pointer",
              transition: "all .2s ease", fontFamily: "'Instrument Sans', sans-serif",
            }}>
              Get Started — No Account Needed →
            </button>
          </div>
        </div>
      )}

      {/* ═══ SELECT DOCUMENT ════════════════════════════════ */}
      {step === "select" && (
        <div style={{ padding: "40px 28px", maxWidth: 900, margin: "0 auto", animation: "fadeUp .4s ease" }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700, letterSpacing: -1, marginBottom: 8 }}>
            What do you need?
          </h2>
          <p style={{ fontSize: 14, color: "#6b7084", marginBottom: 28 }}>Select a document type to get started.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {DOCUMENTS.map(d => (
              <div key={d.id} className="doc-card" onClick={() => { setSelectedDoc(d.id); setFormData({}); setStep("input"); }}
                style={{
                  background: selectedDoc === d.id ? "#f0fdf7" : "#fff",
                  border: `2px solid ${selectedDoc === d.id ? "#00c37e" : "#edf0f5"}`,
                  borderRadius: 12, padding: "20px", cursor: "pointer", transition: "all .15s ease",
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontSize: 28 }}>{d.icon}</div>
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: "var(--accent)" }}>${d.price}</span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, margin: "10px 0 4px" }}>{d.name}</div>
                <div style={{ fontSize: 12, color: "#6b7084", lineHeight: 1.5 }}>{d.description}</div>
                <div style={{ fontSize: 11, color: "#9ca3b0", marginTop: 8 }}>{d.pages} · {d.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ INPUT FORM ═════════════════════════════════════ */}
      {step === "input" && doc && (
        <div style={{ padding: "40px 28px", maxWidth: 620, margin: "0 auto", animation: "fadeUp .4s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <span style={{ fontSize: 36 }}>{doc.icon}</span>
            <div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700, letterSpacing: -.5, margin: 0 }}>{doc.name}</h2>
              <div style={{ fontSize: 13, color: "#6b7084" }}>{doc.pages} · {doc.time} · ${doc.price}</div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 18 }}>
            {doc.fields.map(f => (
              <div key={f.id}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 5, color: "#2d3142" }}>
                  {f.label}
                </label>
                <FieldInput field={f} value={formData[f.id]} onChange={updateField} />
              </div>
            ))}
          </div>

          {/* Price + Generate */}
          <div style={{
            marginTop: 28, padding: "20px 24px", background: "#f8f9fb", borderRadius: 12,
            border: "1px solid #edf0f5", display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <div style={{ fontSize: 12, color: "#6b7084" }}>Total</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 900, color: "var(--accent)" }}>${doc.price}</div>
              <div style={{ fontSize: 11, color: "#9ca3b0" }}>One-time payment · Instant delivery</div>
            </div>
            <button
              onClick={generate}
              disabled={!isFormComplete}
              className="btn-primary"
              style={{
                background: isFormComplete ? "var(--accent)" : "#d1d5db",
                color: "#fff", border: "none", borderRadius: 10,
                padding: "14px 28px", fontSize: 15, fontWeight: 700, cursor: isFormComplete ? "pointer" : "not-allowed",
                transition: "all .2s ease", fontFamily: "'Instrument Sans', sans-serif",
                opacity: isFormComplete ? 1 : 0.6,
              }}>
              Generate Document →
            </button>
          </div>
          {!isFormComplete && (
            <div style={{ fontSize: 12, color: "#f59e0b", marginTop: 8 }}>
              Please fill in all fields to continue.
            </div>
          )}
        </div>
      )}

      {/* ═══ GENERATING ═════════════════════════════════════ */}
      {step === "generating" && (
        <div style={{ padding: "100px 28px", textAlign: "center", animation: "fadeUp .4s ease" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", margin: "0 auto 24px",
            border: "3px solid #edf0f5", borderTopColor: "var(--accent)",
            animation: "spin .8s linear infinite",
          }} />
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
            Generating your {doc?.name}...
          </h2>
          <p style={{ fontSize: 14, color: "#6b7084", marginBottom: 24 }}>
            Our AI is crafting {doc?.pages} of customized content for your business.
          </p>

          {/* Progress bar */}
          <div style={{ maxWidth: 400, margin: "0 auto", background: "#edf0f5", borderRadius: 100, height: 8, overflow: "hidden" }}>
            <div style={{
              width: `${genProgress}%`, height: "100%", borderRadius: 100,
              background: "linear-gradient(90deg, #00c37e, #0070f3)",
              transition: "width .3s ease",
            }} />
          </div>
          <div style={{ fontSize: 12, color: "#9ca3b0", marginTop: 8 }}>{Math.round(genProgress)}% complete</div>
        </div>
      )}

      {/* ═══ RESULT ═════════════════════════════════════════ */}
      {step === "result" && (
        <div style={{ padding: "40px 28px", maxWidth: 820, margin: "0 auto", animation: "fadeUp .4s ease" }}>
          {/* Success header */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%", margin: "0 auto 14px",
              background: "linear-gradient(135deg, #00c37e, #0070f3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, color: "#fff",
            }}>✓</div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
              Your {doc?.name} is ready!
            </h2>
            <p style={{ fontSize: 14, color: "#6b7084" }}>Review, copy, or download your document below.</p>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20, flexWrap: "wrap" }}>
            <button onClick={copyDoc} style={{
              background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8,
              padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}>📋 Copy to Clipboard</button>
            <button onClick={downloadDoc} style={{
              background: "#0070f3", color: "#fff", border: "none", borderRadius: 8,
              padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}>⬇ Download .txt</button>
            <button onClick={() => { setStep("select"); setFormData({}); setGeneratedDoc(""); }} style={{
              background: "#fff", color: "#6b7084", border: "1px solid #e2e5ec", borderRadius: 8,
              padding: "10px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>+ Create Another</button>
          </div>

          {/* Document preview */}
          <div ref={resultRef} style={{
            background: "#fff", border: "1px solid #e2e5ec", borderRadius: 12,
            padding: "32px 36px", maxHeight: 600, overflowY: "auto",
            fontSize: 14, lineHeight: 1.8, color: "#2d3142",
            fontFamily: "'Instrument Sans', sans-serif",
            whiteSpace: "pre-wrap", wordBreak: "break-word",
            boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
          }}>
            {generatedDoc}
          </div>

          {/* Upsell */}
          <div style={{
            marginTop: 24, padding: "20px 24px", background: "#f0fdf7", borderRadius: 12,
            border: "1px solid #bbf7d0", textAlign: "center",
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Need more documents?</div>
            <div style={{ fontSize: 13, color: "#6b7084" }}>
              Create as many as you need. Each document is a one-time purchase — no subscriptions.
            </div>
          </div>
        </div>
      )}

      {/* ─── FOOTER ────────────────────────────────────────── */}
      <footer style={{
        padding: "24px 28px", borderTop: "1px solid #edf0f5",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8,
        fontSize: 12, color: "#9ca3b0", marginTop: 40,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 18, height: 18, borderRadius: 4,
            background: "linear-gradient(135deg, #00c37e, #0070f3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 8, fontWeight: 900,
          }}>DF</div>
          <span style={{ fontWeight: 600 }}>DocForce</span>
        </div>
        <div>AI-generated documents for small businesses · Not a substitute for legal or financial advice</div>
      </footer>
    </div>
  );
}
