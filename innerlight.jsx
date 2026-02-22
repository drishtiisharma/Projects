import { useState, useEffect, useRef, useCallback } from "react";

// ─── Persistent Storage Helpers ──────────────────────────────────────────────
const storage = window.storage;

async function sGet(key) {
  try { const r = await storage.get(key); return r ? JSON.parse(r.value) : null; }
  catch { return null; }
}
async function sSet(key, val) {
  try { await storage.set(key, JSON.stringify(val)); } catch {}
}
async function sDel(key) {
  try { await storage.delete(key); } catch {}
}
async function sList(prefix) {
  try { const r = await storage.list(prefix); return r ? r.keys : []; }
  catch { return []; }
}

// ─── Rich Text Toolbar ────────────────────────────────────────────────────────
function RichEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);

  const exec = (cmd, val = null) => {
    editorRef.current.focus();
    document.execCommand(cmd, false, val);
    onChange(editorRef.current.innerHTML);
  };

  const colors = ["#f87171","#fb923c","#fbbf24","#34d399","#60a5fa","#a78bfa","#f472b6","#ffffff","#000000"];

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, []);

  return (
    <div style={{ border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, overflow: "hidden", background: "rgba(255,255,255,0.03)" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "8px 10px", borderBottom: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)" }}>
        {[
          { label: "B", cmd: "bold", style: { fontWeight: 800 } },
          { label: "I", cmd: "italic", style: { fontStyle: "italic" } },
          { label: "U", cmd: "underline", style: { textDecoration: "underline" } },
          { label: "S", cmd: "strikeThrough", style: { textDecoration: "line-through" } },
        ].map(b => (
          <button key={b.cmd} onClick={() => exec(b.cmd)}
            style={{ ...b.style, background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 6, color: "#e8dcc8", width: 30, height: 28, cursor: "pointer", fontSize: 13 }}>
            {b.label}
          </button>
        ))}
        <div style={{ position: "relative" }}>
          <button onClick={() => { setShowColorPicker(v => !v); setShowBgPicker(false); }}
            style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 6, color: "#e8dcc8", padding: "0 8px", height: 28, cursor: "pointer", fontSize: 12 }}>
            A🎨
          </button>
          {showColorPicker && (
            <div style={{ position: "absolute", top: 32, left: 0, zIndex: 50, background: "#1a1412", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: 8, display: "flex", gap: 4 }}>
              {colors.map(c => <button key={c} onClick={() => { exec("foreColor", c); setShowColorPicker(false); }}
                style={{ width: 20, height: 20, borderRadius: "50%", background: c, border: "2px solid rgba(255,255,255,0.2)", cursor: "pointer" }} />)}
            </div>
          )}
        </div>
        <div style={{ position: "relative" }}>
          <button onClick={() => { setShowBgPicker(v => !v); setShowColorPicker(false); }}
            style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 6, color: "#e8dcc8", padding: "0 8px", height: 28, cursor: "pointer", fontSize: 12 }}>
            BG🎨
          </button>
          {showBgPicker && (
            <div style={{ position: "absolute", top: 32, left: 0, zIndex: 50, background: "#1a1412", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: 8, display: "flex", gap: 4 }}>
              {colors.map(c => <button key={c} onClick={() => { exec("hiliteColor", c); setShowBgPicker(false); }}
                style={{ width: 20, height: 20, borderRadius: "50%", background: c, border: "2px solid rgba(255,255,255,0.2)", cursor: "pointer" }} />)}
            </div>
          )}
        </div>
      </div>
      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(editorRef.current.innerHTML)}
        style={{ minHeight: 140, padding: "14px 16px", outline: "none", color: "#e8dcc8", fontSize: 15, lineHeight: 1.7, fontFamily: "'Lora', serif" }}
        data-placeholder="Pour your heart out…"
      />
      <style>{`[contenteditable]:empty:before { content: attr(data-placeholder); color: rgba(232,220,200,0.3); }`}</style>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [session, setSession] = useState(null); // logged-in user object
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load posts on mount
  useEffect(() => {
    (async () => {
      const keys = await sList("post:");
      const loaded = [];
      for (const k of keys) {
        const p = await sGet(k);
        if (p) loaded.push(p);
      }
      loaded.sort((a, b) => b.createdAt - a.createdAt);
      setPosts(loaded);
      // Check saved session
      const s = await sGet("session:current");
      if (s) setSession(s);
      setLoading(false);
    })();
  }, []);

  const refreshPosts = async () => {
    const keys = await sList("post:");
    const loaded = [];
    for (const k of keys) {
      const p = await sGet(k);
      if (p) loaded.push(p);
    }
    loaded.sort((a, b) => b.createdAt - a.createdAt);
    setPosts(loaded);
  };

  const logout = async () => {
    await sDel("session:current");
    setSession(null);
    setPage("home");
    showToast("Logged out. Take care 🌿");
  };

  const nav = (p) => setPage(p);

  const globalStyle = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0e0b09; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #1a1412; }
    ::-webkit-scrollbar-thumb { background: rgba(200,160,100,0.3); border-radius: 3px; }
    .btn-primary { background: linear-gradient(135deg, #c8a064, #9e7040); color: #fff8f0; border: none; border-radius: 10px; padding: 10px 22px; font-family: 'Lora', serif; font-size: 14px; cursor: pointer; transition: opacity 0.2s; }
    .btn-primary:hover { opacity: 0.85; }
    .btn-ghost { background: rgba(255,255,255,0.06); color: #c8b89a; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 10px 22px; font-family: 'Lora', serif; font-size: 14px; cursor: pointer; transition: background 0.2s; }
    .btn-ghost:hover { background: rgba(255,255,255,0.1); }
    input, textarea { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; color: #e8dcc8; font-family: 'Lora', serif; font-size: 14px; padding: 10px 14px; width: 100%; outline: none; transition: border-color 0.2s; }
    input:focus, textarea:focus { border-color: rgba(200,160,100,0.5); }
    input::placeholder, textarea::placeholder { color: rgba(232,220,200,0.3); }
    label { font-family: 'Lora', serif; color: #a89070; font-size: 13px; display: block; margin-bottom: 5px; }
  `;

  const layout = {
    minHeight: "100vh",
    background: "#0e0b09",
    color: "#e8dcc8",
    fontFamily: "'Lora', serif",
    position: "relative",
  };

  // Grain overlay
  const grain = (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, opacity: 0.025,
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />
  );

  return (
    <div style={layout}>
      <style>{globalStyle}</style>
      {grain}

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 30, left: "50%", transform: "translateX(-50%)", zIndex: 10000,
          background: toast.type === "error" ? "#5c1a1a" : "#1a3c2a",
          color: toast.type === "error" ? "#fca5a5" : "#86efac",
          border: `1px solid ${toast.type === "error" ? "#7f1d1d" : "#14532d"}`,
          borderRadius: 12, padding: "12px 24px", fontFamily: "'Lora', serif", fontSize: 14 }}>
          {toast.msg}
        </div>
      )}

      {/* NAV */}
      <Nav session={session} page={page} nav={nav} logout={logout} />

      {/* Pages */}
      {loading ? (
        <div style={{ textAlign: "center", paddingTop: 120, color: "#a89070", fontFamily: "'Playfair Display', serif", fontSize: 18 }}>
          gathering thoughts…
        </div>
      ) : page === "home" ? (
        <HomePage posts={posts} nav={nav} session={session} />
      ) : page === "create" ? (
        <CreatePage session={session} nav={nav} showToast={showToast} refreshPosts={refreshPosts} />
      ) : page === "profile" ? (
        <ProfilePage session={session} setSession={setSession} nav={nav} showToast={showToast} refreshPosts={refreshPosts} />
      ) : page === "login" ? (
        <LoginPage nav={nav} setSession={setSession} showToast={showToast} />
      ) : null}
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ session, page, nav, logout }) {
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(20px)",
      background: "rgba(14,11,9,0.85)", borderBottom: "1px solid rgba(200,160,100,0.1)",
      padding: "0 clamp(20px,5vw,80px)", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
      <button onClick={() => nav("home")} style={{ background: "none", border: "none", cursor: "pointer" }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#e8dcc8", letterSpacing: 1 }}>
          inner<span style={{ color: "#c8a064", fontStyle: "italic" }}>light</span>
        </span>
      </button>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {session && (
          <button onClick={() => nav("create")} className="btn-primary" style={{ padding: "7px 16px", fontSize: 13 }}>
            + New Thought
          </button>
        )}
        {session ? (
          <>
            <button onClick={() => nav("profile")} className="btn-ghost" style={{ padding: "7px 16px", fontSize: 13 }}>
              {session.name || session.username}
            </button>
            <button onClick={logout} style={{ background: "none", border: "none", color: "#a89070", cursor: "pointer", fontSize: 13, fontFamily: "'Lora', serif" }}>
              logout
            </button>
          </>
        ) : (
          <button onClick={() => nav("login")} className="btn-ghost" style={{ padding: "7px 16px", fontSize: 13 }}>
            sign in
          </button>
        )}
      </div>
    </nav>
  );
}

// ─── Home Page ─────────────────────────────────────────────────────────────────
function HomePage({ posts, nav, session }) {
  return (
    <div>
      {/* Hero */}
      <section style={{ padding: "90px clamp(20px,8vw,120px) 70px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,160,100,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <p style={{ fontFamily: "'Lora', serif", color: "#a89070", fontSize: 13, letterSpacing: 4, textTransform: "uppercase", marginBottom: 24 }}>
          a space for growth
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(42px,7vw,88px)", lineHeight: 1.1, fontWeight: 400, color: "#f0e6d3", marginBottom: 28 }}>
          your darkness<br />
          <em style={{ color: "#c8a064" }}>becomes the light</em>
        </h1>
        <p style={{ fontFamily: "'Lora', serif", color: "#a89070", fontSize: 16, maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.8 }}>
          A gentle space to transform moments of sadness into seeds of understanding. Share anonymously or openly — every thought matters.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          {session ? (
            <button onClick={() => nav("create")} className="btn-primary">Share a Thought</button>
          ) : (
            <button onClick={() => nav("login")} className="btn-primary">Begin Your Journey</button>
          )}
          <button onClick={() => document.getElementById("thoughts-feed")?.scrollIntoView({ behavior: "smooth" })} className="btn-ghost">
            Read Thoughts ↓
          </button>
        </div>
      </section>

      {/* Features strip */}
      <section style={{ padding: "0 clamp(20px,8vw,120px) 70px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20 }}>
        {[
          { icon: "🌱", title: "Grow from pain", desc: "Every struggle holds a lesson. We help you find it." },
          { icon: "🔒", title: "Share safely", desc: "Post anonymously or let the world know who you are." },
          { icon: "✨", title: "Express freely", desc: "Rich text, colors, images — make it truly yours." },
        ].map(f => (
          <div key={f.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "28px 24px" }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: "#e8dcc8", marginBottom: 8 }}>{f.title}</div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 13, color: "#a89070", lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </section>

      {/* Feed */}
      <section id="thoughts-feed" style={{ padding: "0 clamp(20px,8vw,120px) 100px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px,3vw,36px)", fontWeight: 400, color: "#f0e6d3" }}>
            Recent Thoughts
          </h2>
          <span style={{ color: "#a89070", fontFamily: "'Lora', serif", fontSize: 14 }}>{posts.length} shared</span>
        </div>

        {posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#a89070", fontFamily: "'Playfair Display', serif", fontSize: 18, fontStyle: "italic" }}>
            Be the first to share a thought…
          </div>
        ) : (
          <div style={{ columns: "clamp(280px,40vw,380px)", gap: 24 }}>
            {posts.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </section>
    </div>
  );
}

function PostCard({ post }) {
  return (
    <div style={{ breakInside: "avoid", marginBottom: 24, background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, overflow: "hidden",
      transition: "border-color 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(200,160,100,0.3)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}>
      {post.image && (
        <img src={post.image} alt="" style={{ width: "100%", display: "block", maxHeight: 280, objectFit: "cover" }} />
      )}
      <div style={{ padding: "20px 22px" }}>
        {post.content && (
          <div style={{ fontFamily: "'Lora', serif", fontSize: 14, lineHeight: 1.8, color: "#d4c4a8",
            marginBottom: 16, wordBreak: "break-word" }}
            dangerouslySetInnerHTML={{ __html: post.content }} />
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, color: "#a89070", fontStyle: "italic" }}>
            — {post.anonymous ? "anonymous" : (post.authorName || "a soul")}
          </span>
          <span style={{ fontFamily: "'Lora', serif", fontSize: 11, color: "rgba(168,144,112,0.5)" }}>
            {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Create Page ───────────────────────────────────────────────────────────────
function CreatePage({ session, nav, showToast, refreshPosts }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [anonymous, setAnonymous] = useState(false);
  const [posting, setPosting] = useState(false);
  const fileRef = useRef();

  if (!session) {
    return (
      <div style={{ textAlign: "center", paddingTop: 120, color: "#a89070", fontFamily: "'Lora', serif" }}>
        <p style={{ marginBottom: 20, fontSize: 16 }}>You need to be signed in to share a thought.</p>
        <button onClick={() => nav("login")} className="btn-primary">Sign In</button>
      </div>
    );
  }

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handlePost = async () => {
    if (!content.trim() && !image) return showToast("Add some text or an image first!", "error");
    setPosting(true);
    const id = `post:${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const post = {
      id, content, image, anonymous,
      authorId: session.userId,
      authorName: session.name || session.username,
      createdAt: Date.now(),
      archived: false,
    };
    await sSet(id, post);
    await refreshPosts();
    showToast("Thought shared ✨");
    nav("home");
    setPosting(false);
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "60px clamp(20px,5vw,40px)" }}>
      <p style={{ fontFamily: "'Lora', serif", color: "#a89070", fontSize: 12, letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>new entry</p>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 400, color: "#f0e6d3", marginBottom: 40 }}>
        What's on your <em style={{ color: "#c8a064" }}>mind?</em>
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {/* Image upload */}
        <div>
          <label>Image (optional)</label>
          <input type="file" accept="image/*" ref={fileRef} onChange={handleImage} style={{ display: "none" }} />
          <div onClick={() => fileRef.current.click()}
            style={{ border: "1.5px dashed rgba(200,160,100,0.3)", borderRadius: 12, padding: "20px", textAlign: "center",
              cursor: "pointer", color: "#a89070", fontFamily: "'Lora', serif", fontSize: 14, transition: "border-color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(200,160,100,0.6)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(200,160,100,0.3)"}>
            {image ? <img src={image} alt="preview" style={{ maxHeight: 200, borderRadius: 8, maxWidth: "100%", objectFit: "cover" }} />
              : "Click to upload image ↑"}
          </div>
          {image && <button onClick={() => setImage(null)} style={{ marginTop: 8, background: "none", border: "none", color: "#a89070", cursor: "pointer", fontFamily: "'Lora', serif", fontSize: 12 }}>remove image</button>}
        </div>

        {/* Rich text */}
        <div>
          <label>Your Thought</label>
          <RichEditor value={content} onChange={setContent} />
        </div>

        {/* Identity toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}>
          <button onClick={() => setAnonymous(v => !v)}
            style={{ width: 44, height: 24, borderRadius: 12,
              background: anonymous ? "rgba(200,160,100,0.8)" : "rgba(255,255,255,0.1)",
              border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
            <span style={{ position: "absolute", top: 3, left: anonymous ? 22 : 3, width: 18, height: 18,
              borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
          </button>
          <span style={{ fontFamily: "'Lora', serif", fontSize: 14, color: "#c8b89a" }}>
            {anonymous ? "🔒 Posting anonymously" : "🪪 Showing as " + (session.name || session.username)}
          </span>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={handlePost} disabled={posting} className="btn-primary" style={{ flex: 1 }}>
            {posting ? "sharing…" : "Share Thought ✨"}
          </button>
          <button onClick={() => nav("home")} className="btn-ghost">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Page ──────────────────────────────────────────────────────────────
function ProfilePage({ session, setSession, nav, showToast, refreshPosts }) {
  const [form, setForm] = useState({ name: session?.name || "", bio: session?.bio || "" });
  const [pwForm, setPwForm] = useState({ current: "", newPw: "" });
  const [emailForm, setEmailForm] = useState({ email: session?.email || "", password: "" });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState("");
  const pfpRef = useRef();

  useEffect(() => {
    if (!session) return;
    (async () => {
      const keys = await sList("post:");
      const loaded = [];
      for (const k of keys) {
        const p = await sGet(k);
        if (p && p.authorId === session.userId) loaded.push(p);
      }
      loaded.sort((a, b) => b.createdAt - a.createdAt);
      setUserPosts(loaded);
    })();
  }, [session]);

  if (!session) {
    return (
      <div style={{ textAlign: "center", paddingTop: 120, color: "#a89070", fontFamily: "'Lora', serif" }}>
        <p style={{ marginBottom: 20 }}>Sign in to view your profile.</p>
        <button onClick={() => nav("login")} className="btn-primary">Sign In</button>
      </div>
    );
  }

  const saveProfile = async () => {
    const updated = { ...session, name: form.name, bio: form.bio };
    await sSet(`user:${session.userId}`, updated);
    await sSet("session:current", updated);
    setSession(updated);
    showToast("Profile updated 🌿");
  };

  const changePw = async () => {
    const user = await sGet(`user:${session.userId}`);
    if (user.password !== pwForm.current) return showToast("Current password is incorrect", "error");
    if (pwForm.newPw.length < 4) return showToast("Password must be at least 4 characters", "error");
    const updated = { ...user, password: pwForm.newPw };
    await sSet(`user:${session.userId}`, updated);
    await sSet("session:current", updated);
    setSession(updated);
    setPwForm({ current: "", newPw: "" });
    showToast("Password changed ✓");
  };

  const changeEmail = async () => {
    const user = await sGet(`user:${session.userId}`);
    if (user.password !== emailForm.password) return showToast("Password is incorrect", "error");
    // Check if email taken
    const keys = await sList("user:");
    for (const k of keys) {
      const u = await sGet(k);
      if (u && u.email === emailForm.email && u.userId !== session.userId) {
        return showToast("Email already in use", "error");
      }
    }
    const updated = { ...user, email: emailForm.email };
    await sSet(`user:${session.userId}`, updated);
    await sSet("session:current", updated);
    setSession(updated);
    showToast("Email updated ✓");
  };

  const handlePfp = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const updated = { ...session, pfp: reader.result };
      await sSet(`user:${session.userId}`, updated);
      await sSet("session:current", updated);
      setSession(updated);
      showToast("Photo updated 🌟");
    };
    reader.readAsDataURL(file);
  };

  const deleteAccount = async () => {
    // Delete all user posts
    const keys = await sList("post:");
    for (const k of keys) {
      const p = await sGet(k);
      if (p && p.authorId === session.userId) await sDel(k);
    }
    await sDel(`user:${session.userId}`);
    await sDel("session:current");
    setSession(null);
    await refreshPosts();
    nav("home");
    showToast("Account deleted. Wishing you well 🌱");
  };

  const deletePost = async (postId) => {
    await sDel(postId);
    setUserPosts(prev => prev.filter(p => p.id !== postId));
    await refreshPosts();
    showToast("Thought removed");
  };

  const archivePost = async (post) => {
    const updated = { ...post, archived: !post.archived };
    await sSet(post.id, updated);
    setUserPosts(prev => prev.map(p => p.id === post.id ? updated : p));
    showToast(updated.archived ? "Archived 📦" : "Unarchived ✨");
  };

  const saveEdit = async () => {
    const updated = { ...editingPost, content: editContent };
    await sSet(editingPost.id, updated);
    setUserPosts(prev => prev.map(p => p.id === editingPost.id ? updated : p));
    await refreshPosts();
    setEditingPost(null);
    showToast("Updated ✓");
  };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px clamp(20px,5vw,40px)" }}>
      <p style={{ fontFamily: "'Lora', serif", color: "#a89070", fontSize: 12, letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>your space</p>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(30px,4vw,46px)", fontWeight: 400, color: "#f0e6d3", marginBottom: 40 }}>
        <em style={{ color: "#c8a064" }}>Profile</em>
      </h1>

      {/* Avatar + name */}
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", marginBottom: 40, flexWrap: "wrap" }}>
        <div style={{ position: "relative", cursor: "pointer" }} onClick={() => pfpRef.current.click()}>
          <input type="file" accept="image/*" ref={pfpRef} onChange={handlePfp} style={{ display: "none" }} />
          {session.pfp
            ? <img src={session.pfp} alt="pfp" style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(200,160,100,0.3)" }} />
            : <div style={{ width: 90, height: 90, borderRadius: "50%", background: "rgba(200,160,100,0.2)",
                border: "2px dashed rgba(200,160,100,0.4)", display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Playfair Display', serif", fontSize: 30, color: "#c8a064" }}>
                {(session.name || session.username || "?")[0].toUpperCase()}
              </div>}
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, borderRadius: "50%",
            background: "#c8a064", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>✎</div>
        </div>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#e8dcc8" }}>{session.name || session.username}</div>
          <div style={{ fontFamily: "'Lora', serif", fontSize: 13, color: "#a89070", marginTop: 4 }}>@{session.username}</div>
          <div style={{ fontFamily: "'Lora', serif", fontSize: 13, color: "#a89070", marginTop: 2 }}>{session.email}</div>
        </div>
      </div>

      <Section title="Edit Profile">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div><label>Display Name</label><input value={form.name} onChange={e => setForm(v => ({ ...v, name: e.target.value }))} placeholder={session.username} /></div>
          <div><label>Bio</label><textarea value={form.bio} onChange={e => setForm(v => ({ ...v, bio: e.target.value }))} rows={3} placeholder="Why are you here? What brings you to innerlight?" style={{ resize: "vertical" }} /></div>
          <button onClick={saveProfile} className="btn-primary" style={{ alignSelf: "flex-start" }}>Save</button>
        </div>
      </Section>

      <Section title="Change Email">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div><label>New Email</label><input type="email" value={emailForm.email} onChange={e => setEmailForm(v => ({ ...v, email: e.target.value }))} /></div>
          <div><label>Confirm with Password</label><input type="password" value={emailForm.password} onChange={e => setEmailForm(v => ({ ...v, password: e.target.value }))} /></div>
          <button onClick={changeEmail} className="btn-primary" style={{ alignSelf: "flex-start" }}>Update Email</button>
        </div>
      </Section>

      <Section title="Change Password">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div><label>Current Password</label><input type="password" value={pwForm.current} onChange={e => setPwForm(v => ({ ...v, current: e.target.value }))} /></div>
          <div><label>New Password</label><input type="password" value={pwForm.newPw} onChange={e => setPwForm(v => ({ ...v, newPw: e.target.value }))} placeholder="min 4 characters" /></div>
          <button onClick={changePw} className="btn-primary" style={{ alignSelf: "flex-start" }}>Change Password</button>
        </div>
      </Section>

      <Section title={`My Thoughts (${userPosts.length})`}>
        {userPosts.length === 0
          ? <p style={{ color: "#a89070", fontFamily: "'Lora', serif", fontSize: 14 }}>You haven't shared anything yet.</p>
          : userPosts.map(post => (
            <div key={post.id} style={{ marginBottom: 16, background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden",
              opacity: post.archived ? 0.5 : 1 }}>
              {post.archived && <div style={{ background: "rgba(200,160,100,0.1)", padding: "4px 16px", fontSize: 11, color: "#c8a064", fontFamily: "'Lora', serif" }}>📦 archived</div>}
              {post.image && <img src={post.image} alt="" style={{ width: "100%", maxHeight: 160, objectFit: "cover" }} />}
              <div style={{ padding: "14px 16px" }}>
                {editingPost?.id === post.id ? (
                  <div style={{ marginBottom: 10 }}>
                    <RichEditor value={editContent} onChange={setEditContent} />
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <button onClick={saveEdit} className="btn-primary" style={{ fontSize: 12, padding: "6px 14px" }}>Save</button>
                      <button onClick={() => setEditingPost(null)} className="btn-ghost" style={{ fontSize: 12, padding: "6px 14px" }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontFamily: "'Lora', serif", fontSize: 13, color: "#c8b89a", lineHeight: 1.7, marginBottom: 12 }}
                    dangerouslySetInnerHTML={{ __html: post.content || "<em>Image only</em>" }} />
                )}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button onClick={() => { setEditingPost(post); setEditContent(post.content); }} className="btn-ghost" style={{ fontSize: 11, padding: "4px 12px" }}>✎ Edit</button>
                  <button onClick={() => archivePost(post)} className="btn-ghost" style={{ fontSize: 11, padding: "4px 12px" }}>
                    {post.archived ? "📤 Unarchive" : "📦 Archive"}
                  </button>
                  <button onClick={() => deletePost(post.id)} style={{ background: "rgba(220,50,50,0.1)", border: "1px solid rgba(220,50,50,0.2)", borderRadius: 8, color: "#f87171", fontSize: 11, padding: "4px 12px", cursor: "pointer", fontFamily: "'Lora', serif" }}>
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        }
      </Section>

      {/* Danger zone */}
      <Section title="Danger Zone">
        {!confirmDelete ? (
          <div>
            <p style={{ color: "#a89070", fontFamily: "'Lora', serif", fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
              Deleting your account is permanent. All your thoughts and data will be removed.
            </p>
            <button onClick={() => setConfirmDelete(true)}
              style={{ background: "rgba(220,50,50,0.08)", border: "1px solid rgba(220,50,50,0.2)", borderRadius: 10,
                color: "#f87171", fontFamily: "'Lora', serif", fontSize: 13, padding: "9px 18px", cursor: "pointer" }}>
              Delete Account
            </button>
          </div>
        ) : (
          <div style={{ background: "rgba(220,50,50,0.06)", border: "1px solid rgba(220,50,50,0.2)", borderRadius: 12, padding: 20 }}>
            <p style={{ color: "#fca5a5", fontFamily: "'Playfair Display', serif", fontSize: 16, marginBottom: 8 }}>Are you sure?</p>
            <p style={{ color: "#a89070", fontFamily: "'Lora', serif", fontSize: 13, marginBottom: 18, lineHeight: 1.6 }}>
              This cannot be undone. Your account and all thoughts will be permanently deleted.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={deleteAccount}
                style={{ background: "#7f1d1d", border: "none", borderRadius: 10, color: "#fca5a5", fontFamily: "'Lora', serif", fontSize: 13, padding: "9px 18px", cursor: "pointer" }}>
                Yes, Delete
              </button>
              <button onClick={() => setConfirmDelete(false)} className="btn-ghost">No, Go Back</button>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: 20, color: "#e8dcc8", marginBottom: 18,
        borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: 10 }}>{title}</h3>
      {children}
    </div>
  );
}

// ─── Login / Signup Page ───────────────────────────────────────────────────────
function LoginPage({ nav, setSession, showToast }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);

  const setF = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleLogin = async () => {
    if (!form.email || !form.password) return showToast("Fill in all fields", "error");
    setBusy(true);
    const keys = await sList("user:");
    for (const k of keys) {
      const u = await sGet(k);
      if (u && u.email === form.email && u.password === form.password) {
        await sSet("session:current", u);
        setSession(u);
        nav("home");
        showToast(`Welcome back, ${u.name || u.username} 🌿`);
        setBusy(false);
        return;
      }
    }
    showToast("Invalid email or password", "error");
    setBusy(false);
  };

  const handleSignup = async () => {
    if (!form.username || !form.email || !form.password) return showToast("Fill in all fields", "error");
    if (form.password.length < 4) return showToast("Password must be at least 4 characters", "error");
    if (!/^[a-zA-Z0-9_]+$/.test(form.username)) return showToast("Username can only contain letters, numbers, underscores", "error");
    setBusy(true);
    const keys = await sList("user:");
    for (const k of keys) {
      const u = await sGet(k);
      if (!u) continue;
      if (u.email === form.email) { showToast("Email already registered", "error"); setBusy(false); return; }
      if (u.username === form.username) { showToast("Username taken", "error"); setBusy(false); return; }
    }
    const userId = `user:${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const newUser = { userId, username: form.username, email: form.email, password: form.password, name: "", bio: "", pfp: null };
    await sSet(userId, newUser);
    await sSet("session:current", newUser);
    setSession(newUser);
    nav("profile");
    showToast(`Welcome to innerlight, ${form.username} ✨`);
    setBusy(false);
  };

  return (
    <div style={{ maxWidth: 440, margin: "0 auto", padding: "80px clamp(20px,5vw,40px)" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <p style={{ fontFamily: "'Lora', serif", color: "#a89070", fontSize: 12, letterSpacing: 4, textTransform: "uppercase", marginBottom: 14 }}>
          {mode === "login" ? "welcome back" : "begin your journey"}
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(34px,6vw,52px)", fontWeight: 400, color: "#f0e6d3" }}>
          {mode === "login" ? <>sign <em style={{ color: "#c8a064" }}>in</em></> : <>create <em style={{ color: "#c8a064" }}>account</em></>}
        </h1>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "32px 28px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {mode === "signup" && (
            <div>
              <label>Username</label>
              <input value={form.username} onChange={e => setF("username", e.target.value)} placeholder="your_unique_name" />
            </div>
          )}
          <div>
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => setF("email", e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <label>Password {mode === "signup" && <span style={{ color: "rgba(168,144,112,0.5)" }}>(min 4 chars)</span>}</label>
            <input type="password" value={form.password} onChange={e => setF("password", e.target.value)} placeholder="••••••••" />
          </div>

          <button onClick={mode === "login" ? handleLogin : handleSignup} disabled={busy} className="btn-primary" style={{ marginTop: 6, width: "100%", padding: "12px" }}>
            {busy ? "…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>

          <div style={{ textAlign: "center", fontFamily: "'Lora', serif", fontSize: 13, color: "#a89070" }}>
            {mode === "login" ? (
              <>Don't have an account?{" "}<button onClick={() => setMode("signup")} style={{ background: "none", border: "none", color: "#c8a064", cursor: "pointer", fontFamily: "'Lora', serif", fontSize: 13 }}>Sign up</button></>
            ) : (
              <>Already have an account?{" "}<button onClick={() => setMode("login")} style={{ background: "none", border: "none", color: "#c8a064", cursor: "pointer", fontFamily: "'Lora', serif", fontSize: 13 }}>Sign in</button></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
