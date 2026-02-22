import { useState, useEffect, useRef } from "react";

// ─── Storage helpers ──────────────────────────────────────────────────────────
const S = window.storage;
const sGet = async (k) => { try { const r = await S.get(k); return r ? JSON.parse(r.value) : null; } catch { return null; } };
const sSet = async (k, v) => { try { await S.set(k, JSON.stringify(v)); } catch {} };
const sDel = async (k) => { try { await S.delete(k); } catch {} };
const sList = async (p) => { try { const r = await S.list(p); return r ? r.keys : []; } catch { return []; } };

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  bg: "#f5f0eb",
  bgAlt: "#ede8e1",
  white: "#ffffff",
  text: "#2d2520",
  textMid: "#7a6e65",
  textLight: "#b0a49a",
  accent: "#c0725a",
  accentHover: "#a85e49",
  accentLight: "#f0e0d8",
  border: "#e5ddd6",
  shadow: "0 2px 16px rgba(45,37,32,0.08)",
  shadowLg: "0 8px 40px rgba(45,37,32,0.12)",
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; font-family: 'DM Sans', sans-serif; color: ${C.text}; }
  ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: ${C.bgAlt}; } ::-webkit-scrollbar-thumb { background: ${C.textLight}; border-radius: 3px; }
  input, textarea { font-family: 'DM Sans', sans-serif; }
  button { cursor: pointer; font-family: 'DM Sans', sans-serif; }
`;

// ─── Reusable components ──────────────────────────────────────────────────────
const Btn = ({ children, onClick, variant = "primary", style = {}, disabled }) => {
  const base = { border: "none", borderRadius: 50, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, padding: "10px 22px", display: "inline-flex", alignItems: "center", gap: 7, transition: "all 0.18s", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1 };
  const styles = {
    primary: { background: C.accent, color: "#fff" },
    ghost: { background: "transparent", color: C.text, border: `1px solid ${C.border}` },
    danger: { background: "#fee2e2", color: "#b91c1c", border: "1px solid #fecaca" },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...styles[variant], ...style }}
    onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = "brightness(0.92)"; }}
    onMouseLeave={e => { e.currentTarget.style.filter = ""; }}>{children}</button>;
};

const Input = ({ label, ...props }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 13, fontWeight: 500, color: C.textMid }}>{label}</label>}
    <input {...props} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 14px", fontSize: 14, color: C.text, outline: "none", width: "100%", ...props.style }}
      onFocus={e => e.target.style.borderColor = C.accent}
      onBlur={e => e.target.style.borderColor = C.border} />
  </div>
);

const Card = ({ children, style = {}, ...rest }) => (
  <div style={{ background: C.white, borderRadius: 20, boxShadow: C.shadow, overflow: "hidden", ...style }} {...rest}>{children}</div>
);

const Avatar = ({ src, name, size = 36 }) => (
  src
    ? <img src={src} alt="avatar" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
    : <div style={{ width: size, height: size, borderRadius: "50%", background: C.accentLight, color: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.42, fontWeight: 600, flexShrink: 0 }}>
        {(name || "A")[0].toUpperCase()}
      </div>
);

function Toast({ msg, type }) {
  return (
    <div style={{ position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)", zIndex: 9999,
      background: C.white, borderRadius: 12, boxShadow: C.shadowLg, padding: "12px 20px",
      display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: C.text,
      border: `1px solid ${type === "error" ? "#fecaca" : C.border}`, minWidth: 240, maxWidth: 380 }}>
      <span style={{ color: type === "error" ? "#ef4444" : "#22c55e", fontSize: 16 }}>{type === "error" ? "⚠" : "✓"}</span>
      {msg}
    </div>
  );
}

// ─── Rich Text Editor ─────────────────────────────────────────────────────────
function RichEditor({ value, onChange }) {
  const ref = useRef();
  const [textColor, setTextColor] = useState("#c0725a");
  const [bgColor, setBgColor] = useState("#4ade80");
  const tcRef = useRef(); const bgRef = useRef();

  useEffect(() => { if (ref.current && !ref.current.innerHTML) ref.current.innerHTML = value || ""; }, []);

  const exec = (cmd, val = null) => { ref.current.focus(); document.execCommand(cmd, false, val); onChange(ref.current.innerHTML); };

  const ToolBtn = ({ children, cmd, val }) => (
    <button onClick={() => exec(cmd, val)}
      style={{ width: 34, height: 34, border: `1px solid ${C.border}`, borderRadius: 8, background: C.white, color: C.text, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}
      onMouseEnter={e => e.currentTarget.style.background = C.bgAlt}
      onMouseLeave={e => e.currentTarget.style.background = C.white}>{children}</button>
  );

  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden", background: C.white }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 12px", borderBottom: `1px solid ${C.border}`, background: C.bg, flexWrap: "wrap" }}>
        <ToolBtn cmd="bold"><strong>B</strong></ToolBtn>
        <ToolBtn cmd="italic"><em>I</em></ToolBtn>
        <ToolBtn cmd="underline"><u>U</u></ToolBtn>
        <ToolBtn cmd="strikeThrough"><s>S</s></ToolBtn>
        <div style={{ width: 1, height: 24, background: C.border, margin: "0 2px" }} />
        {/* Text color swatch */}
        <div style={{ position: "relative" }}>
          <div onClick={() => tcRef.current.click()}
            style={{ width: 34, height: 34, border: `1px solid ${C.border}`, borderRadius: 8, background: C.white, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", gap: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: textColor, lineHeight: 1 }}>A</span>
            <div style={{ width: 20, height: 3, borderRadius: 2, background: textColor }} />
          </div>
          <input ref={tcRef} type="color" value={textColor} onChange={e => { setTextColor(e.target.value); exec("foreColor", e.target.value); }}
            style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
        </div>
        {/* BG color swatch */}
        <div style={{ position: "relative" }}>
          <div onClick={() => bgRef.current.click()}
            style={{ width: 34, height: 34, border: `1px solid ${C.border}`, borderRadius: 8, background: bgColor, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>BG</span>
          </div>
          <input ref={bgRef} type="color" value={bgColor} onChange={e => { setBgColor(e.target.value); exec("hiliteColor", e.target.value); }}
            style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
        </div>
      </div>
      <div ref={ref} contentEditable suppressContentEditableWarning
        onInput={() => onChange(ref.current.innerHTML)}
        style={{ minHeight: 160, padding: "16px", fontSize: 15, lineHeight: 1.75, color: C.text, outline: "none" }}
        data-placeholder="What's on your mind?" />
      <style>{`[contenteditable]:empty:before{content:attr(data-placeholder);color:${C.textLight}}`}</style>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [session, setSession] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const loadPosts = async () => {
    const keys = await sList("post:");
    const arr = [];
    for (const k of keys) { const p = await sGet(k); if (p) arr.push(p); }
    arr.sort((a, b) => b.createdAt - a.createdAt);
    setPosts(arr);
  };

  useEffect(() => {
    (async () => {
      await loadPosts();
      const s = await sGet("session:current");
      if (s) setSession(s);
      setLoading(false);
    })();
  }, []);

  const logout = async () => {
    await sDel("session:current");
    setSession(null);
    setPage("home");
    showToast("Signed out. Take care 🌿");
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <style>{GLOBAL_CSS}</style>
      {toast && <Toast {...toast} />}
      <Nav session={session} page={page} nav={setPage} logout={logout} />
      {loading
        ? <div style={{ textAlign: "center", paddingTop: 120, color: C.textLight, fontSize: 15 }}>Loading…</div>
        : page === "home" ? <HomePage posts={posts} nav={setPage} session={session} />
        : page === "create" ? <CreatePage session={session} nav={setPage} showToast={showToast} reload={loadPosts} />
        : page === "profile" ? <ProfilePage session={session} setSession={setSession} nav={setPage} showToast={showToast} reload={loadPosts} />
        : page === "login" ? <LoginPage nav={setPage} setSession={setSession} showToast={showToast} />
        : null}
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav({ session, nav, logout }) {
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(245,240,235,0.92)", backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${C.border}`, padding: "0 clamp(16px,4vw,48px)", height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <button onClick={() => nav("home")} style={{ background: "none", border: "none", fontFamily: "'Cormorant Garant', serif", fontSize: 22, fontWeight: 600, color: C.text, letterSpacing: 0.3 }}>
        Mindful Moments
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {session ? (
          <>
            <Btn onClick={() => nav("create")} style={{ padding: "9px 20px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              Share Thought
            </Btn>
            <button onClick={() => nav("profile")} style={{ background: "none", border: "none", padding: 0 }}>
              <Avatar src={session.pfp} name={session.name || session.username} size={38} />
            </button>
          </>
        ) : (
          <Btn onClick={() => nav("login")}>Sign In</Btn>
        )}
      </div>
    </nav>
  );
}

// ─── HOME PAGE ─────────────────────────────────────────────────────────────────
function HomePage({ posts, nav, session }) {
  return (
    <div>
      {/* Hero */}
      <section style={{ position: "relative", minHeight: "93vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0,
          backgroundImage: `url(https://images.unsplash.com/photo-1510936111840-65e151ad71bb?w=1600&auto=format&fit=crop&q=60)`,
          backgroundSize: "cover", backgroundPosition: "center", filter: "blur(1px) brightness(1.08)", transform: "scale(1.04)" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(245,240,235,0.75)" }} />
        <div style={{ position: "relative", textAlign: "center", padding: "0 clamp(20px,6vw,80px)", maxWidth: 840 }}>
          <h1 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: "clamp(48px,8vw,100px)", fontWeight: 300, lineHeight: 1.08, color: C.text, marginBottom: 20 }}>
            Transform Sadness into<br />
            <em style={{ color: C.accent }}>Growth &amp; Learning</em>
          </h1>
          <p style={{ fontSize: "clamp(14px,1.8vw,17px)", color: C.textMid, lineHeight: 1.8, maxWidth: 580, margin: "0 auto 40px", fontWeight: 300 }}>
            A sanctuary for reflection, where every moment of sadness becomes an opportunity to understand yourself better. Share your thoughts, connect with others, and grow together.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn onClick={() => nav(session ? "create" : "login")} style={{ padding: "13px 32px", fontSize: 16 }}>
              ✦ Start Your Journey
            </Btn>
            <Btn variant="ghost" onClick={() => document.getElementById("feed")?.scrollIntoView({ behavior: "smooth" })}
              style={{ padding: "13px 32px", fontSize: 16 }}>
              Explore Thoughts
            </Btn>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px clamp(16px,5vw,64px)" }}>
        <h2 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: "clamp(30px,4vw,50px)", fontWeight: 300, textAlign: "center", marginBottom: 48, color: C.text }}>
          A Space for Healing
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
          {[
            { icon: "♡", title: "Share Authentically", desc: "Express your feelings openly, with or without revealing your identity. Your vulnerability is your strength." },
            { icon: "✦", title: "Reflect & Grow", desc: "Track your emotional journey. Archive your thoughts and revisit them to see how far you've come." },
            { icon: "⊙", title: "Connect Deeply", desc: "Find comfort in knowing others share similar struggles. We're all learning together." },
          ].map(f => (
            <Card key={f.title} style={{ padding: "36px 30px" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: C.accent, marginBottom: 20 }}>{f.icon}</div>
              <div style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 24, color: C.text, marginBottom: 10 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: C.textMid, lineHeight: 1.7 }}>{f.desc}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Feed */}
      <section id="feed" style={{ padding: "0 clamp(16px,5vw,64px) 100px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: "clamp(30px,4vw,50px)", fontWeight: 300, color: C.text, marginBottom: 8 }}>
            Recent Reflections
          </h2>
          <p style={{ color: C.textMid, fontSize: 14 }}>Thoughts shared by our community</p>
        </div>
        {posts.filter(p => !p.archived).length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🌱</div>
            <p style={{ color: C.textMid, fontSize: 15 }}>No thoughts shared yet. Be the first to share your reflection.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 24 }}>
            {posts.filter(p => !p.archived).map(post => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </section>
    </div>
  );
}

function PostCard({ post }) {
  return (
    <Card style={{ display: "flex", flexDirection: "column", transition: "box-shadow 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = C.shadowLg}
      onMouseLeave={e => e.currentTarget.style.boxShadow = C.shadow}>
      {post.image && <img src={post.image} alt="" style={{ width: "100%", height: 200, objectFit: "cover" }} />}
      <div style={{ padding: "20px 22px", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        {post.content && (
          <div style={{ fontSize: 14, lineHeight: 1.75, color: C.text, flex: 1, wordBreak: "break-word" }}
            dangerouslySetInnerHTML={{ __html: post.content }} />
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
          {post.anonymous
            ? <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.bgAlt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: C.textLight, flexShrink: 0, fontWeight: 600 }}>A</div>
            : <Avatar src={post.authorPfp} name={post.authorName || post.authorUsername} size={32} />}
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{post.anonymous ? "Anonymous" : (post.authorName || post.authorUsername)}</div>
            <div style={{ fontSize: 11, color: C.textLight }}>{new Date(post.createdAt).toLocaleDateString("en-US")}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─── CREATE PAGE ──────────────────────────────────────────────────────────────
function CreatePage({ session, nav, showToast, reload }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [anonymous, setAnonymous] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef();

  if (!session) return (
    <div style={{ textAlign: "center", padding: "100px 20px 0" }}>
      <p style={{ color: C.textMid, marginBottom: 20 }}>Sign in to share a thought.</p>
      <Btn onClick={() => nav("login")}>Sign In</Btn>
    </div>
  );

  const handleImg = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => setImage(r.result); r.readAsDataURL(f);
  };

  const submit = async () => {
    if (!content.replace(/<[^>]*>/g, "").trim() && !image) return showToast("Add some text or an image", "error");
    setBusy(true);
    const id = `post:${Date.now()}-${Math.random().toString(36).slice(2)}`;
    await sSet(id, { id, content, image, anonymous, authorId: session.userId,
      authorName: session.name, authorUsername: session.username, authorPfp: session.pfp,
      createdAt: Date.now(), archived: false });
    await reload();
    showToast("Thought shared ✨");
    nav("home");
    setBusy(false);
  };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px clamp(16px,4vw,32px)" }}>
      <h1 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 300, color: C.text, marginBottom: 32 }}>
        Share Your <em style={{ color: C.accent }}>Thought</em>
      </h1>
      <Card style={{ padding: "32px 28px", display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Image */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: C.textMid, display: "block", marginBottom: 10 }}>Image (optional)</label>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImg} style={{ display: "none" }} />
          {image ? (
            <div style={{ position: "relative" }}>
              <img src={image} alt="preview" style={{ width: "100%", borderRadius: 12, maxHeight: 260, objectFit: "cover" }} />
              <button onClick={() => setImage(null)} style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
          ) : (
            <div onClick={() => fileRef.current.click()}
              style={{ border: `2px dashed ${C.border}`, borderRadius: 12, padding: "28px", textAlign: "center", cursor: "pointer", color: C.textLight, fontSize: 14, transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>🖼</div>
              Click to upload an image
            </div>
          )}
        </div>
        {/* Rich text */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: C.textMid, display: "block", marginBottom: 10 }}>Your Thought</label>
          <RichEditor value={content} onChange={setContent} />
        </div>
        {/* Anonymous toggle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.bg, borderRadius: 14, padding: "16px 20px" }}>
          <div>
            <div style={{ fontWeight: 500, fontSize: 14, color: C.text, marginBottom: 2 }}>Post Anonymously</div>
            <div style={{ fontSize: 12, color: C.textMid }}>Hide your identity from others</div>
          </div>
          <button onClick={() => setAnonymous(v => !v)}
            style={{ width: 50, height: 28, borderRadius: 14, background: anonymous ? C.accent : C.border, border: "none", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
            <span style={{ position: "absolute", top: 3, left: anonymous ? 24 : 3, width: 22, height: 22, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.12)" }} />
          </button>
        </div>
        {/* Submit */}
        <Btn onClick={submit} disabled={busy} style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 16 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          {busy ? "Sharing…" : "Share Thought"}
        </Btn>
      </Card>
    </div>
  );
}

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
function ProfilePage({ session, setSession, nav, showToast, reload }) {
  const [tab, setTab] = useState("thoughts");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: session?.name || "", bio: session?.bio || "" });
  const [pwForm, setPwForm] = useState({ current: "", newPw: "" });
  const [emailForm, setEmailForm] = useState({ email: session?.email || "", password: "" });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [editPost, setEditPost] = useState(null);
  const [editContent, setEditContent] = useState("");
  const pfpRef = useRef();

  const loadMyPosts = async () => {
    const keys = await sList("post:");
    const arr = [];
    for (const k of keys) { const p = await sGet(k); if (p && p.authorId === session?.userId) arr.push(p); }
    arr.sort((a, b) => b.createdAt - a.createdAt);
    setUserPosts(arr);
  };

  useEffect(() => { if (session) loadMyPosts(); }, [session]);

  if (!session) return (
    <div style={{ textAlign: "center", padding: "80px 20px 0" }}>
      <Btn onClick={() => nav("login")}>Sign In</Btn>
    </div>
  );

  const saveProfile = async () => {
    const u = { ...session, name: form.name, bio: form.bio };
    await sSet(`user:${session.userId}`, u); await sSet("session:current", u);
    setSession(u); setEditMode(false); showToast("Profile updated successfully");
  };

  const handlePfp = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = async () => {
      const u = { ...session, pfp: r.result };
      await sSet(`user:${session.userId}`, u); await sSet("session:current", u);
      setSession(u); showToast("Photo updated");
    };
    r.readAsDataURL(f);
  };

  const changePw = async () => {
    const user = await sGet(`user:${session.userId}`);
    if (user.password !== pwForm.current) return showToast("Incorrect current password", "error");
    if (pwForm.newPw.length < 4) return showToast("Password must be at least 4 characters", "error");
    const u = { ...user, password: pwForm.newPw };
    await sSet(`user:${session.userId}`, u); await sSet("session:current", u);
    setSession(u); setPwForm({ current: "", newPw: "" }); showToast("Password changed");
  };

  const changeEmail = async () => {
    const user = await sGet(`user:${session.userId}`);
    if (user.password !== emailForm.password) return showToast("Incorrect password", "error");
    const keys = await sList("user:");
    for (const k of keys) { const u = await sGet(k); if (u?.email === emailForm.email && u.userId !== session.userId) return showToast("Email already in use", "error"); }
    const u = { ...user, email: emailForm.email };
    await sSet(`user:${session.userId}`, u); await sSet("session:current", u);
    setSession(u); showToast("Email updated");
  };

  const deletePost = async (postId) => { await sDel(postId); await loadMyPosts(); await reload(); showToast("Thought deleted"); };
  const archivePost = async (post) => {
    const u = { ...post, archived: !post.archived }; await sSet(post.id, u);
    await loadMyPosts(); showToast(u.archived ? "Archived" : "Unarchived");
  };
  const saveEdit = async () => {
    const u = { ...editPost, content: editContent }; await sSet(editPost.id, u);
    await loadMyPosts(); await reload(); setEditPost(null); showToast("Updated");
  };
  const deleteAccount = async () => {
    const keys = await sList("post:");
    for (const k of keys) { const p = await sGet(k); if (p?.authorId === session.userId) await sDel(k); }
    await sDel(`user:${session.userId}`); await sDel("session:current");
    setSession(null); await reload(); nav("home"); showToast("Account deleted");
  };

  const TabBtn = ({ id, label }) => (
    <button onClick={() => setTab(id)}
      style={{ flex: 1, padding: "12px", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
        background: tab === id ? C.white : "transparent", color: tab === id ? C.text : C.textMid,
        boxShadow: tab === id ? C.shadow : "none", transition: "all 0.18s" }}>{label}</button>
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px clamp(16px,4vw,32px)" }}>
      {/* Profile card */}
      <Card style={{ padding: "32px", marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 22, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => pfpRef.current.click()}>
            <input ref={pfpRef} type="file" accept="image/*" onChange={handlePfp} style={{ display: "none" }} />
            <Avatar src={session.pfp} name={session.name || session.username} size={86} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 26, height: 26, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#fff" }}>✎</div>
          </div>
          <div style={{ flex: 1 }}>
            {editMode ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Input label="Display Name" value={form.name} onChange={e => setForm(v => ({ ...v, name: e.target.value }))} placeholder={session.username} />
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: C.textMid }}>Bio</label>
                  <textarea value={form.bio} onChange={e => setForm(v => ({ ...v, bio: e.target.value }))} rows={2}
                    placeholder="Why are you here?"
                    style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 14px", fontSize: 14, color: C.text, outline: "none", resize: "vertical", fontFamily: "'DM Sans', sans-serif" }}
                    onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.border} />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Btn onClick={saveProfile}>Save</Btn>
                  <Btn variant="ghost" onClick={() => setEditMode(false)}>Cancel</Btn>
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 30, fontWeight: 400, color: C.text }}>{session.name || session.username}</div>
                <div style={{ color: C.textMid, fontSize: 14, marginTop: 2 }}>@{session.username}</div>
                {session.bio && <div style={{ color: C.textMid, fontSize: 14, marginTop: 8, lineHeight: 1.6 }}>{session.bio}</div>}
                <Btn variant="ghost" onClick={() => setEditMode(true)} style={{ marginTop: 14, padding: "8px 18px" }}>✎ Edit Profile</Btn>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div style={{ display: "flex", background: C.bgAlt, borderRadius: 16, padding: 4, marginBottom: 24 }}>
        <TabBtn id="thoughts" label="My Thoughts" />
        <TabBtn id="security" label="Security" />
        <TabBtn id="danger" label="Danger Zone" />
      </div>

      {tab === "thoughts" && (
        <div>
          {userPosts.length === 0
            ? <div style={{ textAlign: "center", padding: "48px 0", color: C.textMid, fontSize: 15 }}>No thoughts yet</div>
            : <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {userPosts.map(post => (
                  <Card key={post.id} style={{ opacity: post.archived ? 0.65 : 1 }}>
                    {post.archived && <div style={{ background: C.bgAlt, padding: "6px 20px", fontSize: 12, color: C.textMid }}>📦 Archived</div>}
                    {post.image && <img src={post.image} alt="" style={{ width: "100%", maxHeight: 180, objectFit: "cover" }} />}
                    <div style={{ padding: "18px 20px" }}>
                      {editPost?.id === post.id ? (
                        <div style={{ marginBottom: 12 }}>
                          <RichEditor value={editContent} onChange={setEditContent} />
                          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                            <Btn onClick={saveEdit} style={{ padding: "8px 16px" }}>Save</Btn>
                            <Btn variant="ghost" onClick={() => setEditPost(null)} style={{ padding: "8px 16px" }}>Cancel</Btn>
                          </div>
                        </div>
                      ) : (
                        <div style={{ fontSize: 14, lineHeight: 1.7, color: C.text, marginBottom: 14, wordBreak: "break-word" }}
                          dangerouslySetInnerHTML={{ __html: post.content || "<em style='color:#b0a49a'>Image only</em>" }} />
                      )}
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <Btn variant="ghost" onClick={() => { setEditPost(post); setEditContent(post.content); }} style={{ padding: "6px 14px", fontSize: 12 }}>✎ Edit</Btn>
                        <Btn variant="ghost" onClick={() => archivePost(post)} style={{ padding: "6px 14px", fontSize: 12 }}>
                          {post.archived ? "📤 Unarchive" : "📦 Archive"}
                        </Btn>
                        <Btn variant="danger" onClick={() => deletePost(post.id)} style={{ padding: "6px 14px", fontSize: 12 }}>🗑 Delete</Btn>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>}
        </div>
      )}

      {tab === "security" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Card style={{ padding: "26px" }}>
            <div style={{ fontWeight: 500, color: C.text, marginBottom: 16 }}>Change Email</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Input label="New Email" type="email" value={emailForm.email} onChange={e => setEmailForm(v => ({ ...v, email: e.target.value }))} />
              <Input label="Confirm with Password" type="password" value={emailForm.password} onChange={e => setEmailForm(v => ({ ...v, password: e.target.value }))} />
              <Btn onClick={changeEmail} style={{ alignSelf: "flex-start" }}>Update Email</Btn>
            </div>
          </Card>
          <Card style={{ padding: "26px" }}>
            <div style={{ fontWeight: 500, color: C.text, marginBottom: 16 }}>Change Password</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Input label="Current Password" type="password" value={pwForm.current} onChange={e => setPwForm(v => ({ ...v, current: e.target.value }))} />
              <Input label="New Password" type="password" value={pwForm.newPw} onChange={e => setPwForm(v => ({ ...v, newPw: e.target.value }))} placeholder="min 4 characters" />
              <Btn onClick={changePw} style={{ alignSelf: "flex-start" }}>Change Password</Btn>
            </div>
          </Card>
        </div>
      )}

      {tab === "danger" && (
        <Card style={{ padding: "28px" }}>
          <div style={{ fontWeight: 500, color: "#b91c1c", marginBottom: 10 }}>Delete Account</div>
          <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.7, marginBottom: 20 }}>
            This will permanently remove your account and all your thoughts. This action cannot be undone.
          </p>
          {!confirmDelete ? (
            <Btn variant="danger" onClick={() => setConfirmDelete(true)}>Delete My Account</Btn>
          ) : (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 14, padding: "20px" }}>
              <p style={{ fontWeight: 500, color: "#b91c1c", marginBottom: 6 }}>Are you absolutely sure?</p>
              <p style={{ fontSize: 13, color: C.textMid, marginBottom: 18 }}>This cannot be undone. All your data will be permanently deleted.</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={deleteAccount}
                  style={{ background: "#dc2626", border: "none", borderRadius: 50, color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, padding: "10px 22px", cursor: "pointer" }}>
                  Yes, Delete
                </button>
                <Btn variant="ghost" onClick={() => setConfirmDelete(false)}>No, Go Back</Btn>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ nav, setSession, showToast }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const login = async () => {
    if (!form.email || !form.password) return showToast("Fill in all fields", "error");
    setBusy(true);
    const keys = await sList("user:");
    for (const k of keys) {
      const u = await sGet(k);
      if (u?.email === form.email && u.password === form.password) {
        await sSet("session:current", u); setSession(u); nav("home");
        showToast(`Welcome back, ${u.name || u.username} 🌿`); setBusy(false); return;
      }
    }
    showToast("Invalid email or password", "error"); setBusy(false);
  };

  const signup = async () => {
    if (!form.username || !form.email || !form.password) return showToast("Fill in all fields", "error");
    if (form.password.length < 4) return showToast("Password must be at least 4 characters", "error");
    if (!/^[a-zA-Z0-9_]+$/.test(form.username)) return showToast("Username: letters, numbers, underscores only", "error");
    setBusy(true);
    const keys = await sList("user:");
    for (const k of keys) {
      const u = await sGet(k); if (!u) continue;
      if (u.email === form.email) { showToast("Email already registered", "error"); setBusy(false); return; }
      if (u.username === form.username) { showToast("Username taken", "error"); setBusy(false); return; }
    }
    const userId = `user:${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const newUser = { userId, username: form.username, email: form.email, password: form.password, name: "", bio: "", pfp: null };
    await sSet(userId, newUser); await sSet("session:current", newUser);
    setSession(newUser); nav("profile"); showToast(`Welcome, ${form.username} ✨`); setBusy(false);
  };

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: "clamp(34px,6vw,56px)", fontWeight: 300, color: C.text, marginBottom: 8 }}>
            {mode === "login" ? <>Welcome <em style={{ color: C.accent }}>Back</em></> : <>Join <em style={{ color: C.accent }}>Us</em></>}
          </h1>
          <p style={{ color: C.textMid, fontSize: 14 }}>
            {mode === "login" ? "Sign in to continue your journey" : "Create your account to begin"}
          </p>
        </div>
        <Card style={{ padding: "30px 26px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Google btn */}
            <button style={{ width: "100%", padding: "12px", border: `1px solid ${C.border}`, borderRadius: 50, background: C.white, fontSize: 14, color: C.text, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.background = C.bg}
              onMouseLeave={e => e.currentTarget.style.background = C.white}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: C.textLight, fontSize: 12 }}>
              <div style={{ flex: 1, height: 1, background: C.border }} /> or <div style={{ flex: 1, height: 1, background: C.border }} />
            </div>
            {mode === "signup" && <Input label="Username" value={form.username} onChange={e => setF("username", e.target.value)} placeholder="your_unique_name" />}
            <Input label="Email" type="email" value={form.email} onChange={e => setF("email", e.target.value)} placeholder="you@example.com" />
            <Input label={mode === "signup" ? "Password (min 4 characters)" : "Password"} type="password" value={form.password} onChange={e => setF("password", e.target.value)} placeholder="••••••••" />
            <Btn onClick={mode === "login" ? login : signup} disabled={busy} style={{ width: "100%", justifyContent: "center", padding: "13px", fontSize: 15, marginTop: 4 }}>
              {busy ? "…" : mode === "login" ? "Sign In" : "Create Account"}
            </Btn>
            <div style={{ textAlign: "center", fontSize: 13, color: C.textMid }}>
              {mode === "login"
                ? <>Don't have an account?{" "}<button onClick={() => setMode("signup")} style={{ background: "none", border: "none", color: C.accent, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Sign up</button></>
                : <>Already have an account?{" "}<button onClick={() => setMode("login")} style={{ background: "none", border: "none", color: C.accent, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Sign in</button></>}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}