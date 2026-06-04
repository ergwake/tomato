import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Sprout, Leaf, ListPlus, BarChart3, Trophy, Settings, Plus, Minus,
  Pencil, Trash2, Copy, Archive, X, Check, Download, ChevronRight,
  CalendarDays, MapPin, CircleAlert, Undo2, WifiOff, Wifi, Save,
  Crown, Sun, Sparkles, Search, Link2, LogOut, UserPlus, Users,
  ShieldAlert, UserMinus, Ban, Clock, Mail
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend
} from "recharts";
import { createClient } from "@supabase/supabase-js";

/* ------------------------------------------------------------------ */
/* Supabase client                                                     */
/* ------------------------------------------------------------------ */
const SUPA_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const AUTH_REDIRECT_URL = "https://tomato-syndicate-ten.vercel.app/";
const supa = createClient(SUPA_URL, SUPA_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: "tomato-syndicate-auth",
  },
});

/* ------------------------------------------------------------------ */
/* Design system                                                       */
/* ------------------------------------------------------------------ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,900&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=Space+Mono:wght@400;700&display=swap');

:root{
  --paper:#f3ebdb; --paper2:#eaddc6; --card:#fbf6ec; --ink:#241b14;
  --ink2:#6f5e4c; --line:#d9c7a6; --line2:#cdb892;
  --tomato:#c5311f; --tomato2:#9c2415; --vine:#2f5d3c; --vine2:#234731;
  --gold:#b88322; --gold2:#e7c266; --espresso:#1d1611; --sky:#3a6b7a;
}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
.ts-root{
  --w:480px;
  font-family:'Bricolage Grotesque',ui-sans-serif,system-ui,sans-serif;
  color:var(--ink); background:#2a211a;
  min-height:100%; width:100%; display:flex; justify-content:center;
}
.ts-app{
  position:relative; width:100%; max-width:var(--w); min-height:100vh;
  background:
    radial-gradient(120% 60% at 80% -10%, rgba(197,49,31,.08), transparent 60%),
    radial-gradient(100% 50% at 0% 0%, rgba(47,93,60,.08), transparent 55%),
    var(--paper);
  display:flex; flex-direction:column; overflow:hidden;
  box-shadow:0 0 60px rgba(0,0,0,.45);
}
.ts-app:before{
  content:""; position:absolute; inset:0; pointer-events:none; opacity:.5; mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
}

/* Header */
.ts-header{
  position:relative; z-index:3; background:var(--espresso); color:#f3ebdb;
  padding:14px 18px 13px; border-bottom:3px solid var(--tomato);
}
.ts-wordmark{display:flex; align-items:center; gap:10px}
.ts-mark{width:30px;height:30px;flex:0 0 auto}
.ts-title{font-family:'Fraunces',serif; font-weight:900; font-size:21px; letter-spacing:.2px; line-height:1}
.ts-title em{font-style:italic; color:var(--gold2)}
.ts-sub{font-size:10.5px; letter-spacing:2.5px; text-transform:uppercase; color:#b6a487; margin-top:3px}
.ts-headrow{display:flex; align-items:center; justify-content:space-between}
.ts-season-chip{
  display:flex;align-items:center;gap:6px; background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.14);
  color:#f3ebdb; padding:7px 11px; border-radius:999px; font-size:12.5px; font-weight:600; cursor:pointer;
}
.ts-season-chip:active{transform:scale(.97)}
.ts-syncpill{display:flex;align-items:center;gap:5px;font-size:10.5px;color:#b6a487;margin-top:8px;letter-spacing:.3px}
.ts-syncpill b{color:#dfb; font-weight:600}

/* Content */
.ts-content{position:relative; z-index:2; flex:1; overflow-y:auto; padding:16px 16px 96px}
.ts-view{animation:fade .45s cubic-bezier(.2,.7,.2,1) both}
@keyframes fade{from{opacity:0; transform:translateY(10px)}to{opacity:1;transform:none}}
.stagger>*{animation:fade .5s cubic-bezier(.2,.7,.2,1) both}

/* Section header */
.ts-sec{display:flex;align-items:flex-end;justify-content:space-between;margin:6px 2px 10px}
.ts-sec h2{font-family:'Fraunces',serif;font-weight:600;font-size:17px;margin:0;letter-spacing:.2px}
.ts-sec p{margin:2px 0 0;font-size:12px;color:var(--ink2)}
.ts-sec__act{display:flex;gap:8px}

/* Cards */
.ts-card{
  background:var(--card); border:1.5px solid var(--line);
  border-radius:14px; padding:14px; position:relative;
  box-shadow:0 1px 0 rgba(255,255,255,.6) inset, 0 6px 18px -14px rgba(40,20,0,.6);
}
.ts-card+.ts-card{margin-top:10px}
.ts-rule{border-style:double;border-width:3px}

/* Buttons */
.ts-btn{
  font-family:'Bricolage Grotesque',sans-serif; font-weight:600; font-size:14px;
  border-radius:11px; border:1.5px solid var(--line2); background:var(--paper2);
  color:var(--ink); padding:11px 14px; cursor:pointer; display:inline-flex;
  align-items:center; justify-content:center; gap:7px; transition:transform .08s, filter .15s;
}
.ts-btn:active{transform:scale(.96)}
.ts-btn--primary{background:var(--tomato); border-color:var(--tomato2); color:#fff; box-shadow:0 5px 0 var(--tomato2)}
.ts-btn--primary:active{box-shadow:0 2px 0 var(--tomato2); transform:translateY(3px) scale(.99)}
.ts-btn--vine{background:var(--vine); border-color:var(--vine2); color:#fff; box-shadow:0 5px 0 var(--vine2)}
.ts-btn--vine:active{box-shadow:0 2px 0 var(--vine2); transform:translateY(3px) scale(.99)}
.ts-btn--ghost{background:transparent; border-color:var(--line2)}
.ts-btn--danger{background:#fff0ec; border-color:var(--tomato); color:var(--tomato2)}
.ts-btn--block{width:100%}
.ts-btn--sm{padding:7px 10px; font-size:12.5px; border-radius:9px}
.ts-btn--icon{padding:8px;border-radius:9px}
.ts-btn:disabled{opacity:.45;cursor:not-allowed}

/* Stats grid */
.ts-grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.ts-stat{background:var(--card);border:1.5px solid var(--line);border-radius:13px;padding:13px 14px;position:relative;overflow:hidden}
.ts-stat__num{font-family:'Space Mono',monospace;font-weight:700;font-size:30px;line-height:1;color:var(--ink)}
.ts-stat__num small{font-size:14px;color:var(--ink2)}
.ts-stat__label{font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:var(--ink2);margin-top:7px;font-weight:600}
.ts-stat__ic{position:absolute;right:-6px;top:-6px;opacity:.10}

/* Lists */
.ts-row{display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid var(--line)}
.ts-row:last-child{border-bottom:none}
.ts-row__main{flex:1;min-width:0}
.ts-row__t{font-weight:600;font-size:14.5px;display:flex;align-items:center;gap:7px}
.ts-row__s{font-size:12px;color:var(--ink2);margin-top:2px}
.ts-row__actions{display:flex;gap:5px}

/* Badges */
.ts-badge{font-size:10.5px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;padding:3px 8px;border-radius:999px;border:1px solid}
.b-active{color:var(--vine2);background:#e9f3ea;border-color:#bcd9c1}
.b-retired{color:var(--gold);background:#fbf1d8;border-color:#e6d09a}
.b-removed{color:var(--tomato2);background:#fbe7e2;border-color:#edc3b7}

/* Bed bar (sticky) */
.ts-bedbar{position:sticky;top:-16px;z-index:4;margin:-16px -16px 12px;padding:12px 16px;
  background:linear-gradient(var(--paper),var(--paper) 70%, rgba(243,235,219,0));
  display:flex;gap:8px;overflow-x:auto;scrollbar-width:none}
.ts-bedbar::-webkit-scrollbar{display:none}
.ts-bedpill{flex:0 0 auto;padding:9px 15px;border-radius:999px;border:1.5px solid var(--line2);
  background:var(--card);font-weight:600;font-size:13.5px;cursor:pointer;white-space:nowrap}
.ts-bedpill.on{background:var(--espresso);color:#f3ebdb;border-color:var(--espresso)}
.ts-bedpill .n{font-family:'Space Mono',monospace;opacity:.7;margin-left:6px;font-size:12px}

/* Harvest stepper */
.ts-plant{background:var(--card);border:1.5px solid var(--line);border-radius:14px;padding:12px;margin-bottom:10px}
.ts-plant__top{display:flex;align-items:center;gap:11px}
.ts-plant__name{flex:1;min-width:0}
.ts-plant__name b{font-size:15px;font-weight:600;display:block;line-height:1.15}
.ts-plant__name span{font-size:11.5px;color:var(--ink2)}
.ts-stepper{display:flex;align-items:center;gap:0}
.ts-step{width:54px;height:54px;border-radius:14px;border:2px solid;display:flex;align-items:center;justify-content:center;cursor:pointer;flex:0 0 auto;transition:transform .07s}
.ts-step:active{transform:scale(.9)}
.ts-step--minus{border-color:var(--line2);background:var(--paper2);color:var(--ink)}
.ts-step--plus{border-color:var(--vine2);background:var(--vine);color:#fff;box-shadow:0 4px 0 var(--vine2)}
.ts-step--plus:active{box-shadow:0 1px 0 var(--vine2);transform:translateY(3px) scale(.97)}
.ts-count{width:62px;text-align:center;font-family:'Space Mono',monospace;font-weight:700;font-size:30px}
.ts-count.bump{animation:bump .25s ease}
@keyframes bump{0%{transform:scale(1)}40%{transform:scale(1.35);color:var(--tomato)}100%{transform:scale(1)}}
.ts-plant__extra{margin-top:11px;display:flex;gap:8px}
.ts-mini{flex:1}
.ts-mini label{font-size:10px;letter-spacing:1px;text-transform:uppercase;color:var(--ink2);font-weight:700}
.ts-mini input{width:100%;margin-top:3px;padding:8px 9px;border-radius:9px;border:1.5px solid var(--line2);background:var(--paper);font-family:inherit;font-size:13px}
.ts-disclose{margin-top:9px;font-size:12px;color:var(--sky);font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:5px}

/* Save bar */
.ts-savebar{margin-top:8px}
.ts-savebar .ts-btn{font-size:15.5px;padding:15px}
.ts-savebar small{font-family:'Space Mono',monospace;font-weight:700}

/* Bottom nav */
.ts-nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;z-index:30;
  background:var(--espresso);border-top:1px solid #3a2c20;display:flex;padding:8px 6px calc(8px + env(safe-area-inset-bottom,0px))}
.ts-navbtn{flex:1;background:none;border:none;color:#8c7a64;display:flex;flex-direction:column;align-items:center;gap:3px;
  font-size:10px;font-weight:600;letter-spacing:.3px;padding:6px 0;cursor:pointer;border-radius:10px}
.ts-navbtn.on{color:var(--gold2)}
.ts-navbtn.on svg{filter:drop-shadow(0 0 6px rgba(231,194,102,.4))}

/* Modal */
.ts-scrim{position:fixed;inset:0;z-index:50;background:rgba(20,12,6,.55);backdrop-filter:blur(3px);
  display:flex;align-items:flex-end;justify-content:center;animation:fade .25s ease both}
.ts-modal{width:100%;max-width:480px;background:var(--paper);border-radius:20px 20px 0 0;border-top:3px solid var(--tomato);
  max-height:90vh;overflow-y:auto;animation:up .35s cubic-bezier(.2,.8,.2,1) both;padding-bottom:24px}
@keyframes up{from{transform:translateY(60px);opacity:.6}to{transform:none;opacity:1}}
.ts-modal__head{position:sticky;top:0;background:var(--paper);display:flex;align-items:center;justify-content:space-between;
  padding:16px 18px 10px;border-bottom:1px solid var(--line);z-index:2}
.ts-modal__head h3{font-family:'Fraunces',serif;font-weight:600;font-size:18px;margin:0}
.ts-modal__body{padding:14px 18px 4px}
.ts-grab{width:38px;height:4px;border-radius:99px;background:var(--line2);margin:8px auto 0}

/* Fields */
.ts-field{margin-bottom:13px}
.ts-field>label{display:block;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--ink2);font-weight:700;margin-bottom:5px}
.ts-input,.ts-select,.ts-textarea{width:100%;padding:11px 12px;border-radius:11px;border:1.5px solid var(--line2);
  background:var(--card);font-family:inherit;font-size:15px;color:var(--ink)}
.ts-textarea{min-height:64px;resize:vertical}
.ts-rowf{display:flex;gap:10px}
.ts-rowf>*{flex:1}
.ts-segs{display:flex;gap:6px;flex-wrap:wrap}
.ts-seg{padding:9px 13px;border-radius:10px;border:1.5px solid var(--line2);background:var(--card);font-weight:600;font-size:13px;cursor:pointer}
.ts-seg.on{background:var(--ink);color:var(--paper);border-color:var(--ink)}

/* Empty */
.ts-empty{text-align:center;padding:30px 18px}
.ts-empty .e-ic{width:54px;height:54px;color:var(--line2);margin:0 auto 10px}
.ts-empty h3{font-family:'Fraunces',serif;font-weight:600;font-size:18px;margin:0 0 5px}
.ts-empty p{color:var(--ink2);font-size:13px;margin:0 auto 16px;max-width:280px}

/* Toast */
.ts-toast{position:absolute;bottom:150px;left:14px;right:14px;z-index:60;
  background:var(--espresso);color:#f3ebdb;border-radius:13px;padding:12px 14px;display:flex;align-items:center;gap:12px;
  box-shadow:0 12px 30px -10px rgba(0,0,0,.7);animation:up .3s ease both}
.ts-toast b{font-weight:600;font-size:13.5px}
.ts-toast button{margin-left:auto;background:var(--gold);color:var(--espresso);border:none;font-weight:700;
  padding:7px 12px;border-radius:9px;cursor:pointer;display:flex;align-items:center;gap:5px;font-size:12.5px}

/* misc */
.ts-note{background:#fbf1d8;border:1.5px solid #e6d09a;border-radius:12px;padding:12px 13px;font-size:12.5px;color:#6b531f;line-height:1.5}
.ts-note b{color:#4d3a12}
.ts-rank{display:flex;align-items:center;gap:11px;padding:10px 0;border-bottom:1px solid var(--line)}
.ts-rank:last-child{border:none}
.ts-rank__v{margin-left:auto;font-family:'Space Mono',monospace;font-weight:700;font-size:16px}
.ts-bar{height:9px;border-radius:99px;background:var(--paper2);overflow:hidden;margin-top:5px}
.ts-bar>i{display:block;height:100%;border-radius:99px}
.ts-divider{height:1px;background:var(--line);margin:14px 0}
.ts-link{color:var(--sky);font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:5px}
.ts-muted{font-size:12.5px;color:var(--ink2);line-height:1.45}
.ts-status{display:inline-flex;align-items:center;gap:5px;font-size:11px;color:var(--ink2);font-weight:600}
`;

/* ------------------------------------------------------------------ */
/* Utils                                                               */
/* ------------------------------------------------------------------ */
const uid = () =>
  (crypto && crypto.randomUUID) ? crypto.randomUUID()
  : "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
const nowISO = () => new Date().toISOString();
const todayKey = () => new Date().toISOString().slice(0, 10);
const STATUS = ["active", "retired", "removed"];
const STATUS_LABEL = { active: "Active", retired: "Retired", removed: "Removed / Failed" };
const UNITS = ["oz", "lb", "g", "kg"];

function fmtDate(d) {
  if (!d) return "-";
  const dt = new Date(d + (d.length === 10 ? "T00:00:00" : ""));
  return dt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
function fmtShort(d) {
  if (!d) return "-";
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
function daysBetween(a, b) {
  if (!a || !b) return null;
  const ms = new Date(b + "T00:00:00") - new Date(a + "T00:00:00");
  return Math.round(ms / 86400000);
}
function newestSessionFirst(a, b) {
  const dateTime = (s) => {
    const d = s.harvestDate ? Date.parse(s.harvestDate + "T00:00:00") : 0;
    return Number.isFinite(d) ? d : 0;
  };
  const createdTime = (s) => {
    const d = s.createdAt ? Date.parse(s.createdAt) : 0;
    return Number.isFinite(d) ? d : 0;
  };
  return dateTime(b) - dateTime(a) ||
    createdTime(b) - createdTime(a) ||
    String(b.id || "").localeCompare(String(a.id || ""));
}
function bumpLabel(label) {
  const m = label.match(/^(.*?)(\d+)\s*$/);
  if (m) return m[1] + (parseInt(m[2], 10) + 1);
  return label.replace(/\s+$/, "") + " 2";
}
function downloadCSV(filename, rows) {
  const esc = (v) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const csv = rows.map((r) => r.map(esc).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click();
  document.body.removeChild(a); setTimeout(() => URL.revokeObjectURL(url), 1500);
}
const live = (arr) => (arr || []).filter((x) => !x.deletedAt);

function buildSeasonView(data, activeSeason) {
  const gardens = live(data?.gardens);
  const beds = live(data?.beds);
  const seasonPlants = data && activeSeason ? live(data.plants).filter((p) => p.seasonId === activeSeason.id) : [];
  const gardenIds = new Set(gardens.map((g) => g.id));
  const bedIds = new Set(beds.map((b) => b.id));
  const plantIds = new Set(seasonPlants.map((p) => p.id));
  const rawSessions = data && activeSeason ? live(data.sessions).filter((s) => s.seasonId === activeSeason.id) : [];
  const rawSessionIds = new Set(rawSessions.map((s) => s.id));
  const allSeasonHarvests = data ? live(data.harvests).filter((h) => rawSessionIds.has(h.sessionId)) : [];
  const harvestSessionIds = new Set(allSeasonHarvests.map((h) => h.sessionId));
  const sessions = rawSessions.filter((s) => harvestSessionIds.has(s.id));
  const sessionIds = new Set(sessions.map((s) => s.id));
  const harvests = allSeasonHarvests.filter((h) => sessionIds.has(h.sessionId) && plantIds.has(h.plantId));
  const countByPlant = {};
  harvests.forEach((h) => { countByPlant[h.plantId] = (countByPlant[h.plantId] || 0) + (h.quantityCount || 0); });
  const activePlants = seasonPlants.filter((p) => p.status === "active");
  const activeBedIds = new Set(activePlants.map((p) => p.bedId).filter(Boolean));
  const activeBeds = beds.filter((b) => activeBedIds.has(b.id));
  const diagnostics = {
    orphanBeds: beds.filter((b) => !gardenIds.has(b.gardenId)),
    orphanPlants: seasonPlants.filter((p) => p.bedId && !bedIds.has(p.bedId)),
    emptySessions: rawSessions.filter((s) => !harvestSessionIds.has(s.id)),
    orphanHarvests: allSeasonHarvests.filter((h) => !plantIds.has(h.plantId)),
  };
  return {
    gardens,
    beds,
    seasonPlants,
    activePlants,
    activeBeds,
    seasonSessions: sessions,
    seasonHarvests: harvests,
    countByPlant,
    diagnostics,
  };
}

/* camelCase <-> snake_case */
const toSnake = (s) => s.replace(/([A-Z])/g, (c) => "_" + c.toLowerCase());
const toCamel = (s) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
function toDb(obj) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [toSnake(k), v]));
}
function fromDb(obj) {
  if (!obj) return obj;
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [toCamel(k), v]));
}
function dbProfile(profile) {
  const next = { ...profile };
  if ("username" in next) next.username = next.username || null;
  return toDb(next);
}
function normalizeProfile(profile) {
  return {
    ...(profile || {}),
    username: profile?.username || "",
    displayName: profile?.displayName || "",
    socialUrl: profile?.socialUrl || "",
  };
}

/* JS array key -> Supabase table name */
const TABLE_MAP = {
  seasons:     "seasons",
  gardens:     "gardens",
  beds:        "beds",
  plants:      "plants",
  sessions:    "harvest_sessions",
  harvests:    "harvests",
  friendships: "friendships",
};
const USER_DATA_KEYS = ["seasons", "gardens", "beds", "plants", "sessions", "harvests"];

/* ------------------------------------------------------------------ */
/* Local storage (offline fallback)                                   */
/* ------------------------------------------------------------------ */
const LS_KEY = "tomato-syndicate-v1";

async function localLoad() {
  try {
    if (typeof window !== "undefined" && window.storage) {
      const res = await window.storage.get(LS_KEY);
      return res?.value ? JSON.parse(res.value) : null;
    }
    return JSON.parse(localStorage.getItem(LS_KEY) || "null");
  } catch { return null; }
}
async function localSave(data) {
  try {
    const str = data ? JSON.stringify(data) : null;
    if (typeof window !== "undefined" && window.storage) {
      return str ? window.storage.set(LS_KEY, str) : window.storage.delete?.(LS_KEY);
    }
    if (str) localStorage.setItem(LS_KEY, str);
    else localStorage.removeItem(LS_KEY);
  } catch {}
}
function hasGardenData(data) {
  return !!data && USER_DATA_KEYS.some((key) => (data[key] || []).length > 0);
}
function gardenRecordCount(data) {
  return data ? USER_DATA_KEYS.reduce((sum, key) => sum + (data[key] || []).length, 0) : 0;
}
function withLocalOwner(data, userId) {
  return data && userId ? { ...data, ownerId: userId } : data;
}
async function syncAllToSupabase(data, userId) {
  if (!data || !userId) return;
  if (data.profile) await supa.from("profiles").upsert(dbProfile({ ...data.profile, id: userId }));
  for (const key of USER_DATA_KEYS) {
    const table = TABLE_MAP[key];
    const rows = (data[key] || []).map((rec) => toDb({ ...rec, userId }));
    if (rows.length) {
      const { error } = await supa.from(table).upsert(rows);
      if (error) throw error;
    }
  }
}
async function resetGardenDataInSupabase(data, userId) {
  if (!userId) return;
  const deleteOrder = ["harvests", "harvest_sessions", "plants", "beds", "gardens", "seasons"];
  for (const table of deleteOrder) {
    const { error } = await supa.from(table).delete().eq("user_id", userId);
    if (error) throw error;
  }
  await syncAllToSupabase(data, userId);
}

/* ------------------------------------------------------------------ */
/* Supabase data load                                                  */
/* ------------------------------------------------------------------ */
async function ensureProfile(user) {
  const userId = user.id || user;
  const profile = await supa.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (profile.data) return normalizeProfile(fromDb(profile.data));
  if (profile.error && profile.error.code !== "PGRST116") throw profile.error;

  const t = nowISO();
  const fallbackName = user.user_metadata?.full_name || user.email?.split("@")[0] || "";
  const created = {
    id: userId,
    username: null,
    displayName: fallbackName,
    socialUrl: "",
    createdAt: t,
    updatedAt: t,
  };
  const inserted = await supa.from("profiles").upsert(dbProfile(created)).select("*").single();
  if (inserted.error) throw inserted.error;
  return normalizeProfile(fromDb(inserted.data));
}

async function loadFromSupabase(user) {
  const userId = user.id || user;
  const local = await localLoad();
  const profile = await ensureProfile(user);
  const [prof, seasons, gardens, beds, plants, sessions, harvests, friendships] = await Promise.all([
    Promise.resolve({ data: profile }),
    supa.from("seasons").select("*").eq("user_id", userId),
    supa.from("gardens").select("*").eq("user_id", userId),
    supa.from("beds").select("*").eq("user_id", userId),
    supa.from("plants").select("*").eq("user_id", userId),
    supa.from("harvest_sessions").select("*").eq("user_id", userId),
    supa.from("harvests").select("*").eq("user_id", userId),
    supa.from("friendships").select("*").or(`requester_id.eq.${userId},recipient_id.eq.${userId}`),
  ]);
  const firstError = [prof, seasons, gardens, beds, plants, sessions, harvests, friendships].find((r) => r.error)?.error;
  if (firstError) throw firstError;

  const sortedSeasons = (seasons.data || []).map(fromDb).sort((a, b) => b.year - a.year);
  const activeSeasonId =
    sortedSeasons.find((s) => s.isActive)?.id || sortedSeasons[0]?.id || null;

  const localSettings = local?.settings || { weightUnit: "oz" };
  const cloudData = {
    profile:       normalizeProfile(fromDb(prof.data)),
    settings:      localSettings,
    activeSeasonId,
    seasons:       sortedSeasons,
    gardens:       (gardens.data || []).map(fromDb),
    beds:          (beds.data || []).map(fromDb),
    plants:        (plants.data || []).map(fromDb),
    sessions:      (sessions.data || []).map(fromDb),
    harvests:      (harvests.data || []).map(fromDb),
    friendships:   (friendships.data || []).map(fromDb),
  };
  const canUseLocalBackup = hasGardenData(local) && (!local.ownerId || local.ownerId === userId);
  if (canUseLocalBackup && gardenRecordCount(local) > gardenRecordCount(cloudData)) {
    await syncAllToSupabase(local, userId);
    return withLocalOwner({ ...local, profile: cloudData.profile, settings: localSettings }, userId);
  }
  return withLocalOwner(cloudData, userId);
}

/* ------------------------------------------------------------------ */
/* Seed demo garden                                                    */
/* ------------------------------------------------------------------ */
function seedData() {
  const seasonId = uid(), gardenId = uid();
  const bedA = uid(), bedB = uid();
  const t = nowISO();
  const mk = (variety, label, bedId, planted) => ({
    id: uid(), seasonId, bedId, variety, plantLabel: label, status: "active",
    plantedDate: planted, firstHarvestDate: null, removedDate: null, notes: "",
    createdAt: t, updatedAt: t, deletedAt: null, syncedAt: t
  });
  const plants = [
    mk("Cherokee Purple", "Cherokee Purple 1", bedA, "2026-04-12"),
    mk("Cherokee Purple", "Cherokee Purple 2", bedA, "2026-04-12"),
    mk("Sungold", "Sungold 1", bedA, "2026-04-15"),
    mk("Roma", "Roma 1", bedB, "2026-04-10"),
    mk("Roma", "Roma 2", bedB, "2026-04-10"),
    mk("Roma", "Roma 3", bedB, "2026-04-10"),
    mk("Brandywine", "Brandywine 1", bedB, "2026-04-18"),
  ];
  const sessions = [], harvests = [];
  const dayPlan = [
    ["2026-06-20", { 2: 6 }],
    ["2026-06-28", { 0: 3, 2: 9, 3: 5, 4: 4 }],
    ["2026-07-05", { 0: 5, 1: 4, 2: 12, 3: 8, 4: 7, 5: 6 }],
    ["2026-07-13", { 0: 7, 1: 6, 2: 14, 3: 11, 4: 9, 5: 10, 6: 4 }],
    ["2026-07-21", { 0: 9, 1: 8, 2: 16, 3: 13, 4: 12, 5: 11, 6: 6 }],
    ["2026-07-29", { 0: 6, 1: 7, 2: 10, 3: 10, 4: 9, 5: 9, 6: 5 }],
  ];
  dayPlan.forEach(([date, counts]) => {
    const sid = uid();
    sessions.push({ id: sid, seasonId, harvestDate: date, notes: "", createdAt: t, updatedAt: t, deletedAt: null, syncedAt: t });
    Object.entries(counts).forEach(([pi, c]) => {
      const p = plants[+pi];
      if (!p.firstHarvestDate || date < p.firstHarvestDate) p.firstHarvestDate = date;
      harvests.push({
        id: uid(), sessionId: sid, plantId: p.id, quantityCount: c,
        weightValue: null, weightUnit: "oz", harvestDate: date, notes: "",
        createdAt: t, updatedAt: t, deletedAt: null, syncedAt: t
      });
    });
  });
  return {
    profile: { username: "vine_boss", displayName: "Garden Boss", socialUrl: "" },
    settings: { weightUnit: "oz" },
    activeSeasonId: seasonId,
    seasons: [{ id: seasonId, year: 2026, name: "2026 Season", startDate: "2026-04-01", isActive: true, createdAt: t, updatedAt: t }],
    gardens: [{ id: gardenId, name: "Home Garden", locationLabel: "Backyard", notes: "", createdAt: t, updatedAt: t }],
    beds: [
      { id: bedA, gardenId, name: "South Trellis", notes: "", createdAt: t, updatedAt: t },
      { id: bedB, gardenId, name: "Back Fence Bed", notes: "", createdAt: t, updatedAt: t },
    ],
    plants, sessions, harvests, friendships: [],
  };
}
function emptyData() {
  const t = nowISO();
  const seasonId = uid();
  return {
    profile: { username: "", displayName: "", socialUrl: "" },
    settings: { weightUnit: "oz" },
    activeSeasonId: seasonId,
    seasons: [{ id: seasonId, year: new Date().getFullYear(), name: new Date().getFullYear() + " Season", startDate: todayKey(), isActive: true, createdAt: t, updatedAt: t }],
    gardens: [], beds: [], plants: [], sessions: [], harvests: [], friendships: [],
  };
}

/* ------------------------------------------------------------------ */
/* Small primitives                                                    */
/* ------------------------------------------------------------------ */
function Modal({ title, onClose, children }) {
  return (
    <div className="ts-scrim" onClick={onClose}>
      <div className="ts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ts-grab" />
        <div className="ts-modal__head">
          <h3>{title}</h3>
          <button className="ts-btn ts-btn--ghost ts-btn--icon" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <div className="ts-modal__body">{children}</div>
      </div>
    </div>
  );
}
function Field({ label, children }) {
  return <div className="ts-field"><label>{label}</label>{children}</div>;
}
function Empty({ icon: Ic, title, sub, action }) {
  return (
    <div className="ts-empty">
      <Ic className="e-ic" strokeWidth={1.5} />
      <h3>{title}</h3><p>{sub}</p>{action}
    </div>
  );
}
function StatusBadge({ s }) {
  const c = s === "active" ? "b-active" : s === "retired" ? "b-retired" : "b-removed";
  return <span className={"ts-badge " + c}>{s === "removed" ? "Removed" : STATUS_LABEL[s]}</span>;
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */
export default function TomatoSyndicate() {
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [session, setSession] = useState(undefined); // undefined = still checking
  const [localMode, setLocalMode] = useState(false);
  const [tab, setTab] = useState("harvest");
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [saveState, setSaveState] = useState("idle");
  const skipSave = useRef(true);
  const saveTimer = useRef(null);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  /* ---- auth ---- */
  useEffect(() => {
    supa.auth.getSession().then(({ data: { session: s } }) => {
      if (s) setLocalMode(false);
      setSession(s ?? null);
    });
    const { data: { subscription } } = supa.auth.onAuthStateChange((event, s) => {
      if (event === "SIGNED_OUT") setLoaded(true);
      if (s) setLocalMode(false);
      setSession(s ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  /* ---- load data ---- */
  useEffect(() => {
    if (session === undefined) return;
    let alive = true;
    const load = async () => {
      if (session) {
        try {
          const d = await loadFromSupabase(session.user);
          if (!alive) return;
          setData(d);
          localSave(withLocalOwner(d, session.user.id));
        } catch (e) {
          console.warn("Supabase load failed; using local backup:", e.message);
          const local = await localLoad();
          if (alive) {
            setData(local);
            setSaveState("error");
          }
        }
      } else {
        const local = await localLoad();
        if (alive) setData(local ?? null);
      }
      if (alive) setLoaded(true);
    };
    load();
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { alive = false; window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, [session]);

  /* ---- save locally (debounced) ---- */
  useEffect(() => {
    if (skipSave.current) { skipSave.current = false; return; }
    clearTimeout(saveTimer.current);
    if (!data) return;
    setSaveState("saving");
    saveTimer.current = setTimeout(async () => {
      await localSave(data);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1400);
    }, 350);
  }, [data]);

  const showToast = useCallback((msg, undo) => {
    clearTimeout(toastTimer.current);
    setToast({ msg, undo });
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  }, []);

  /* ---- fire-and-forget Supabase sync ---- */
  const supaSync = useCallback((table, op, payload, id) => {
    if (!session) return;
    (async () => {
      try {
        let result = { error: null };
        if (op === "upsert") result = await supa.from(table).upsert(payload);
        if (op === "update") result = await supa.from(table).update(payload).eq("id", id);
        if (op === "delete") result = await supa.from(table).delete().eq("id", id);
        if (result.error) throw result.error;
      } catch (e) {
        console.warn("supaSync failed:", table, op, e.message);
        setSaveState("error");
        showToast("Cloud sync failed. Your changes are saved locally.");
      }
    })();
  }, [session, showToast]);

  /* ---- mutation helpers ---- */
  const patch = (fn) => setData((d) => ({ ...fn(d) }));

  const upd = useCallback((key, id, changes) => {
    const withTs = { ...changes, updatedAt: nowISO() };
    patch((d) => ({ ...d, [key]: d[key].map((x) => x.id === id ? { ...x, ...withTs } : x) }));
    if (TABLE_MAP[key]) supaSync(TABLE_MAP[key], "update", toDb(withTs), id);
  }, [supaSync]);

  const add = useCallback((key, rec) => {
    patch((d) => ({ ...d, [key]: [...d[key], rec] }));
    if (TABLE_MAP[key] && session) {
      supaSync(TABLE_MAP[key], "upsert", toDb({ ...rec, userId: session.user.id }));
    }
  }, [supaSync, session]);

  const softDelete = useCallback((key, id) => upd(key, id, { deletedAt: nowISO() }), [upd]);

  const hardDelete = useCallback((key, id) => {
    patch((d) => ({ ...d, [key]: d[key].filter((x) => x.id !== id) }));
    if (TABLE_MAP[key]) supaSync(TABLE_MAP[key], "delete", null, id);
  }, [supaSync]);

  const setActiveSeason = useCallback((id) => {
    const t = nowISO();
    patch((d) => ({
      ...d,
      activeSeasonId: id,
      seasons: d.seasons.map((s) => ({ ...s, isActive: s.id === id, updatedAt: t })),
    }));
    if (session && data?.seasons?.length) {
      data.seasons.forEach((s) => {
        supaSync("seasons", "update", { is_active: s.id === id, updated_at: t }, s.id);
      });
    }
  }, [data, session, supaSync]);

  /* ---- profile sync (special: not an array) ---- */
  const patchProfile = useCallback((changes) => {
    patch((d) => ({ ...d, profile: { ...d.profile, ...changes } }));
    if (session) supaSync("profiles", "update", dbProfile(changes), session.user.id);
  }, [supaSync, session]);

  const startGarden = useCallback(async () => {
    const next = withLocalOwner(emptyData(), session?.user?.id);
    setData(next);
    setTab("garden");
    await localSave(next);
    if (session) {
      try {
        await syncAllToSupabase(next, session.user.id);
        setSaveState("saved");
      } catch (e) {
        console.warn("Initial garden sync failed:", e.message);
        setSaveState("error");
        showToast("Garden saved locally. Cloud sync needs attention.");
      }
    }
  }, [session, showToast]);

  /* ---- derived ---- */
  const activeSeason = useMemo(
    () => data && (data.seasons.find((s) => s.id === data.activeSeasonId) || data.seasons[0]),
    [data]
  );
  const seasonView = useMemo(
    () => data ? buildSeasonView(data, activeSeason) : buildSeasonView(null, null),
    [data, activeSeason]
  );
  const { seasonPlants, activePlants, activeBeds, seasonSessions, seasonHarvests, countByPlant } = seasonView;

  /* ---- auth checking ---- */
  if (session === undefined) {
    return (
      <div className="ts-root"><style>{CSS}</style>
        <div className="ts-app" style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: "var(--ink2)" }}>
            <Sprout size={40} style={{ color: "var(--vine)" }} />
            <div style={{ marginTop: 10, fontFamily: "'Fraunces',serif" }}>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  /* ---- sign-in gate ---- */
  if (!session && !localMode) {
    return <SignInView localData={data} onDemo={() => { setLocalMode(true); setData(data ?? seedData()); setLoaded(true); setTab("harvest"); }} />;
  }

  /* ---- data loading ---- */
  if (!loaded) {
    return (
      <div className="ts-root"><style>{CSS}</style>
        <div className="ts-app" style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: "var(--ink2)" }}>
            <Sprout size={40} style={{ color: "var(--vine)" }} />
            <div style={{ marginTop: 10, fontFamily: "'Fraunces',serif" }}>Loading the syndicate...</div>
          </div>
        </div>
      </div>
    );
  }

  /* ---- first run (signed in, no garden yet) ---- */
  if (!data || data.seasons.length === 0) {
    return (
      <div className="ts-root"><style>{CSS}</style>
        <div className="ts-app">
          <Header season={null} online={online} saveState="idle" onSeason={() => {}} />
          <div className="ts-content">
            <div className="ts-card ts-rule" style={{ marginTop: 20, textAlign: "center", padding: 22 }}>
              <Logo size={46} />
              <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: 24, margin: "12px 0 4px" }}>
                Welcome to the Syndicate
              </h2>
              <p style={{ color: "var(--ink2)", fontSize: 13.5, lineHeight: 1.55, margin: "0 0 18px" }}>
                Track every plant. Log every harvest. Find out what actually performs.
              </p>
              <button className="ts-btn ts-btn--vine ts-btn--block"
                onClick={startGarden}>
                <Sparkles size={17} /> Set up my garden
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ctx = {
    data, setData, patch, upd, add, softDelete, hardDelete, patchProfile, setActiveSeason,
    activeSeason, seasonView, seasonPlants, activePlants, activeBeds, seasonSessions, seasonHarvests, countByPlant,
    setModal, setTab, showToast, session, supaSync, setSaveState, setLocalMode,
  };

  return (
    <div className="ts-root"><style>{CSS}</style>
      <div className="ts-app">
        <Header season={activeSeason} online={online} saveState={saveState}
          onSeason={() => setModal({ type: "seasons" })} />

        <div className="ts-content" key={tab}>
          <div className="ts-view">
            {tab === "harvest"   && <HarvestView ctx={ctx} />}
            {tab === "garden"    && <GardenView ctx={ctx} />}
            {tab === "stats"     && <StatsView ctx={ctx} />}
            {tab === "syndicate" && <SyndicateViewLive ctx={ctx} />}
            {tab === "more"      && <MoreView ctx={ctx} />}
          </div>
        </div>

        <Nav tab={tab} setTab={setTab} />

        {toast && (
          <div className="ts-toast">
            <Check size={17} style={{ color: "var(--gold2)" }} />
            <b>{toast.msg}</b>
            {toast.undo && <button onClick={() => { toast.undo(); setToast(null); }}><Undo2 size={14} /> Undo</button>}
          </div>
        )}

        {modal && <ModalRouter ctx={ctx} modal={modal} close={() => setModal(null)} setTab={setTab} />}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sign-in screen                                                      */
/* ------------------------------------------------------------------ */
function SignInView({ localData, onDemo }) {
  const [loading, setLoading] = useState(null);
  const [email, setEmail] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [authError, setAuthError] = useState("");
  const signIn = async (provider) => {
    setLoading(provider);
    setAuthMessage("");
    setAuthError("");
    try {
      const { error } = await supa.auth.signInWithOAuth({
        provider,
        options: { redirectTo: AUTH_REDIRECT_URL },
      });
      if (error) throw error;
    } catch (e) {
      setAuthError(e.message || "Sign-in failed. Check the auth provider settings.");
      setLoading(null);
    }
  };
  const sendEmailLink = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setLoading("email");
    setAuthMessage("");
    setAuthError("");
    try {
      const { error } = await supa.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: AUTH_REDIRECT_URL,
          shouldCreateUser: true,
        },
      });
      if (error) throw error;
      setAuthMessage(`Check ${trimmed} for a sign-in link.`);
      setEmail("");
    } catch (err) {
      setAuthError(err.message || "Email sign-in failed. Check Supabase email auth settings.");
    } finally {
      setLoading(null);
    }
  };
  return (
    <div className="ts-root"><style>{CSS}</style>
      <div className="ts-app">
        <div className="ts-header">
          <div className="ts-headrow">
            <div className="ts-wordmark">
              <Logo />
              <div>
                <div className="ts-title">Tomato <em>Syndicate</em></div>
                <div className="ts-sub">Performance Tracker</div>
              </div>
            </div>
          </div>
        </div>
        <div className="ts-content">
          <div className="ts-card ts-rule" style={{ marginTop: 20, textAlign: "center", padding: 28 }}>
            <Logo size={52} />
            <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 900, fontSize: 24, margin: "14px 0 6px" }}>
              Welcome to the Syndicate
            </h2>
            <p style={{ color: "var(--ink2)", fontSize: 13.5, lineHeight: 1.6, margin: "0 0 22px" }}>
              Track every plant. Log every harvest.<br />Find out what actually performs.
            </p>
            <button className="ts-btn ts-btn--primary ts-btn--block" disabled={!!loading}
              onClick={() => signIn("google")} style={{ marginBottom: 10 }}>
              {loading === "google" ? "Redirecting..." : "Sign in with Google"}
            </button>
            <button className="ts-btn ts-btn--ghost ts-btn--block" disabled
              title="Apple sign-in is not configured yet" style={{ marginBottom: 18 }}>
              Sign in with Apple
            </button>
            <form onSubmit={sendEmailLink} style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
                <input className="ts-input" type="email" inputMode="email" autoComplete="email"
                  aria-label="Email address" placeholder="email@example.com" value={email}
                  disabled={!!loading} onChange={(e) => setEmail(e.target.value)} />
                <button className="ts-btn ts-btn--vine ts-btn--icon" type="submit"
                  title="Email sign-in link" disabled={!!loading || !email.trim()}>
                  <Mail size={17} />
                </button>
              </div>
              <button className="ts-btn ts-btn--ghost ts-btn--block" type="submit"
                disabled={!!loading || !email.trim()} style={{ marginTop: 8 }}>
                {loading === "email" ? "Sending..." : "Email me a sign-in link"}
              </button>
            </form>
            {authMessage && <div className="ts-note" style={{ marginBottom: 12, textAlign: "left" }}>{authMessage}</div>}
            {authError && <div className="ts-note" style={{ marginBottom: 12, textAlign: "left", borderColor: "var(--tomato)", color: "var(--tomato2)", background: "#fff0ec" }}>{authError}</div>}
            <div className="ts-divider" />
            <button className="ts-btn ts-btn--ghost ts-btn--block" style={{ marginTop: 10, fontSize: 13 }}
              onClick={onDemo}>
              <Sparkles size={15} /> {localData ? "Continue with local demo" : "Try the demo (no account needed)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chrome                                                              */
/* ------------------------------------------------------------------ */
function Logo({ size = 30 }) {
  return (
    <svg className="ts-mark" width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 7c-2.4 0-3.6-1.6-3.2-3.4 1.8.2 3 1.3 3.2 2 .2-.7 1.4-1.8 3.2-2 .4 1.8-.8 3.4-3.2 3.4Z" fill="#3aa84a" />
      <circle cx="16" cy="19" r="9.2" fill="#c5311f" />
      <circle cx="16" cy="19" r="9.2" fill="url(#g)" opacity=".35" />
      <ellipse cx="12.6" cy="15.6" rx="2.4" ry="1.6" fill="#fff" opacity=".35" />
      <defs><radialGradient id="g" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#ff7a5c" /><stop offset="1" stopColor="#9c2415" />
      </radialGradient></defs>
    </svg>
  );
}
function Header({ season, online, saveState, onSeason }) {
  return (
    <div className="ts-header">
      <div className="ts-headrow">
        <div className="ts-wordmark">
          <Logo />
          <div>
            <div className="ts-title">Tomato <em>Syndicate</em></div>
            <div className="ts-sub">Performance Tracker</div>
          </div>
        </div>
        {season && (
          <button className="ts-season-chip" onClick={onSeason}>
            <CalendarDays size={14} /> {season.name} <ChevronRight size={14} style={{ opacity: .6 }} />
          </button>
        )}
      </div>
      <div className="ts-syncpill">
        {online ? <Wifi size={12} /> : <WifiOff size={12} />}
        {online ? "Online" : "Offline - queued locally"}
        <span style={{ margin: "0 4px", opacity: .4 }}> / </span>
        {saveState === "error" ? <><CircleAlert size={12} /> Cloud sync needs attention</>
          : saveState === "saving" ? <><Save size={12} /> Saving...</>
          : saveState === "saved" ? <><Check size={12} /> <b>Saved</b></>
          : <>All changes saved</>}
      </div>
    </div>
  );
}
function Nav({ tab, setTab }) {
  const items = [
    ["harvest",   "Harvest",   ListPlus],
    ["garden",    "Garden",    Leaf],
    ["stats",     "Stats",     BarChart3],
    ["syndicate", "Syndicate", Trophy],
    ["more",      "More",      Settings],
  ];
  return (
    <div className="ts-nav">
      {items.map(([k, label, Ic]) => (
        <button key={k} className={"ts-navbtn" + (tab === k ? " on" : "")} onClick={() => setTab(k)}>
          <Ic size={21} strokeWidth={tab === k ? 2.4 : 1.8} />{label}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* HARVEST  (Muddy Hands UX)                                          */
/* ------------------------------------------------------------------ */
function HarvestView({ ctx }) {
  const { data, activeSeason, seasonView, activePlants, activeBeds, patch, showToast, setTab, session, supaSync, setSaveState } = ctx;
  const beds = activeBeds;

  const [bedId, setBedId] = useState(null);
  const [date, setDate] = useState(todayKey());
  const [draft, setDraft] = useState({});
  const [bump, setBump] = useState(null);

  useEffect(() => {
    if (!beds.length) return;
    if (!bedId || !beds.some((b) => b.id === bedId)) setBedId(beds[0].id);
  }, [beds, bedId]);

  const bedPlants = activePlants.filter((p) => p.bedId === bedId);
  const totalThis = Object.values(draft).reduce((a, d) => a + (d.count || 0), 0);
  const plantsTouched = Object.values(draft).filter((d) => (d.count || 0) > 0 || d.weight || d.note).length;

  const step = (pid, delta) => {
    setDraft((d) => {
      const cur = d[pid] || { count: 0 };
      const count = Math.max(0, (cur.count || 0) + delta);
      return { ...d, [pid]: { ...cur, count } };
    });
    if (delta > 0) { setBump(pid); setTimeout(() => setBump(null), 250); }
  };
  const setExtra = (pid, field, val) =>
    setDraft((d) => ({ ...d, [pid]: { ...(d[pid] || { count: 0 }), [field]: val } }));

  const save = async () => {
    const sid = uid(); const t = nowISO();
    const rows = [];
    Object.entries(draft).forEach(([pid, d]) => {
      const hasCount = (d.count || 0) > 0;
      const hasW = d.weight !== undefined && d.weight !== "" && !isNaN(parseFloat(d.weight));
      if (!hasCount && !hasW && !d.note) return;
      rows.push({
        id: uid(), sessionId: sid, plantId: pid,
        quantityCount: d.count || 0,
        weightValue: hasW ? parseFloat(d.weight) : null,
        weightUnit: data.settings.weightUnit,
        harvestDate: date, notes: d.note || "",
        createdAt: t, updatedAt: t, deletedAt: null, syncedAt: t,
      });
    });
    if (!rows.length) { showToast("Nothing to log yet"); return; }

    const sessionObj = {
      id: sid, seasonId: activeSeason.id, harvestDate: date, notes: "",
      createdAt: t, updatedAt: t, deletedAt: null, syncedAt: t,
    };

    // Atomic local update
    patch((dd) => ({
      ...dd,
      sessions: [...dd.sessions, sessionObj],
      harvests: [...dd.harvests, ...rows],
      plants: dd.plants.map((p) => {
        const r = rows.find((x) => x.plantId === p.id && x.quantityCount > 0);
        if (r && (!p.firstHarvestDate || date < p.firstHarvestDate))
          return { ...p, firstHarvestDate: date, updatedAt: t };
        return p;
      }),
    }));

    // Supabase sync as a batch so a harvest session does not outlive its rows.
    if (session) {
      const userId = session.user.id;
      try {
        const sessionResult = await supa.from("harvest_sessions").upsert(toDb({ ...sessionObj, userId }));
        if (sessionResult.error) throw sessionResult.error;
        const rowsResult = await supa.from("harvests").upsert(rows.map((r) => toDb({ ...r, userId })));
        if (rowsResult.error) throw rowsResult.error;
        for (const r of rows) {
          const p = data.plants.find((x) => x.id === r.plantId);
          if (r.quantityCount > 0 && p && (!p.firstHarvestDate || date < p.firstHarvestDate)) {
            const plantResult = await supa.from("plants").update({ first_harvest_date: date, updated_at: t }).eq("id", r.plantId);
            if (plantResult.error) throw plantResult.error;
          }
        }
      } catch (e) {
        console.warn("Harvest cloud sync failed:", e.message);
        setSaveState("error");
        showToast("Harvest saved locally. Cloud sync needs attention.");
      }
    }

    const total = rows.reduce((a, r) => a + r.quantityCount, 0);
    setDraft({});
    showToast(`Logged ${total} tomato${total === 1 ? "" : "s"}  /  ${rows.length} plant${rows.length === 1 ? "" : "s"}`, () => {
      patch((dd) => ({
        ...dd,
        sessions: dd.sessions.filter((s) => s.id !== sid),
        harvests: dd.harvests.filter((h) => h.sessionId !== sid),
      }));
      if (session) {
        supaSync("harvest_sessions", "delete", null, sid);
        rows.forEach((r) => supaSync("harvests", "delete", null, r.id));
      }
    });
  };

  if (!activePlants.length) {
    const hasGardens = seasonView.gardens.length > 0;
    const hasBeds = seasonView.beds.length > 0;
    const hasPlants = seasonView.seasonPlants.length > 0;
    const setupState = !hasGardens
      ? {
          title: "Set up your garden first",
          sub: "Create a garden in the Garden tab, then add beds and plants before logging harvests.",
        }
      : !hasBeds
        ? {
            title: "Add beds before logging harvests",
            sub: "Beds organize your plants. Open the Garden tab to add your beds.",
          }
        : !hasPlants
          ? {
              title: "Add plants before logging harvests",
              sub: "Open the Garden tab to add tomato plants, then come back here to log harvests.",
            }
          : {
              title: "No active plants available",
              sub: "Open the Garden tab to add or reactivate plants before logging harvests.",
            };
    return (
      <Empty icon={Sprout} title={setupState.title}
        sub={setupState.sub}
        action={<button className="ts-btn ts-btn--vine" onClick={() => setTab("garden")}><Leaf size={16} /> Open Garden</button>} />
    );
  }

  return (
    <>
      <div className="ts-bedbar">
        {beds.map((b) => {
          const n = activePlants.filter((p) => p.bedId === b.id).length;
          return (
            <button key={b.id} className={"ts-bedpill" + (b.id === bedId ? " on" : "")} onClick={() => setBedId(b.id)}>
              {b.name}<span className="n">{n}</span>
            </button>
          );
        })}
      </div>

      <div className="ts-card" style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
        <CalendarDays size={20} style={{ color: "var(--vine)", flex: "0 0 auto" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "var(--ink2)", fontWeight: 700 }}>Harvest date</div>
          <input type="date" className="ts-input" style={{ padding: "6px 8px", marginTop: 3, fontSize: 14 }}
            value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        {date === todayKey() && <span className="ts-badge b-active">Today</span>}
      </div>

      {bedPlants.map((p) => {
        const d = draft[p.id] || {};
        return (
          <div key={p.id} className="ts-plant">
            <div className="ts-plant__top">
              <div className="ts-plant__name">
                <b>{p.plantLabel}</b><span>{p.variety}</span>
              </div>
              <div className="ts-stepper">
                <button className="ts-step ts-step--minus" onClick={() => step(p.id, -1)} aria-label="minus"><Minus size={24} /></button>
                <div className={"ts-count" + (bump === p.id ? " bump" : "")}>{d.count || 0}</div>
                <button className="ts-step ts-step--plus" onClick={() => step(p.id, 1)} aria-label="plus"><Plus size={24} /></button>
              </div>
            </div>
            {d.open ? (
              <div className="ts-plant__extra">
                <div className="ts-mini">
                  <label>Weight ({data.settings.weightUnit})  /  optional</label>
                  <input inputMode="decimal" placeholder="-" value={d.weight || ""} onChange={(e) => setExtra(p.id, "weight", e.target.value)} />
                </div>
                <div className="ts-mini">
                  <label>Note  /  optional</label>
                  <input placeholder="cracked, ripe..." value={d.note || ""} onChange={(e) => setExtra(p.id, "note", e.target.value)} />
                </div>
              </div>
            ) : (
              <div className="ts-disclose" onClick={() => setExtra(p.id, "open", true)}><Plus size={13} /> Add weight or note</div>
            )}
          </div>
        );
      })}

      <div className="ts-savebar">
        <button className="ts-btn ts-btn--primary ts-btn--block" disabled={plantsTouched === 0} onClick={save}>
          <Save size={18} /> Save harvest&nbsp; / &nbsp;<small>{totalThis}</small>&nbsp;tomatoes
        </button>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* GARDEN  (setup: gardens, beds, plants)                             */
/* ------------------------------------------------------------------ */
function GardenView({ ctx }) {
  const { activeSeason, seasonView, seasonPlants, activePlants, activeBeds, countByPlant, setModal, softDelete, upd, showToast, add } = ctx;
  const { gardens, beds, diagnostics } = seasonView;
  const issueCount = diagnostics.orphanBeds.length + diagnostics.orphanPlants.length + diagnostics.emptySessions.length + diagnostics.orphanHarvests.length;

  const duplicatePlant = (p) => {
    const t = nowISO();
    let label = bumpLabel(p.plantLabel);
    const existing = new Set(seasonPlants.map((x) => x.plantLabel.toLowerCase()));
    while (existing.has(label.toLowerCase())) label = bumpLabel(label);
    add("plants", {
      id: uid(), seasonId: p.seasonId, bedId: p.bedId, variety: p.variety,
      plantLabel: label, status: "active", plantedDate: p.plantedDate,
      firstHarvestDate: null, removedDate: null, notes: "",
      createdAt: t, updatedAt: t, deletedAt: null, syncedAt: t,
    });
    showToast(`Duplicated -> ${label}`);
  };

  return (
    <>
      <div className="ts-sec">
        <div><h2>Gardens</h2><p>{gardens.length} configured  /  {activeBeds.length} harvestable bed{activeBeds.length === 1 ? "" : "s"}</p></div>
        <div className="ts-sec__act">
          <button className="ts-btn ts-btn--ghost ts-btn--sm" onClick={() => setModal({ type: "garden" })}><Plus size={14} /> Garden</button>
        </div>
      </div>

      {issueCount > 0 && (
        <div className="ts-note" style={{ marginBottom: 12 }}>
          <b>Data consistency check</b><br />
          {diagnostics.emptySessions.length > 0 && <span>{diagnostics.emptySessions.length} empty harvest session{diagnostics.emptySessions.length === 1 ? "" : "s"} hidden from logs. </span>}
          {diagnostics.orphanPlants.length > 0 && <span>{diagnostics.orphanPlants.length} plant{diagnostics.orphanPlants.length === 1 ? "" : "s"} assigned to missing beds. </span>}
          {diagnostics.orphanBeds.length > 0 && <span>{diagnostics.orphanBeds.length} bed{diagnostics.orphanBeds.length === 1 ? "" : "s"} assigned to missing gardens. </span>}
          {diagnostics.orphanHarvests.length > 0 && <span>{diagnostics.orphanHarvests.length} harvest row{diagnostics.orphanHarvests.length === 1 ? "" : "s"} linked to missing plants. </span>}
        </div>
      )}

      {gardens.length > 0 && (
        <div className="ts-card" style={{ marginBottom: 18 }}>
          {gardens.map((g) => {
            const gardenBeds = beds.filter((b) => b.gardenId === g.id);
            const bedIds = new Set(gardenBeds.map((b) => b.id));
            const plantCount = seasonPlants.filter((p) => bedIds.has(p.bedId)).length;
            return (
              <div key={g.id} className="ts-row">
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--espresso)", color: "var(--gold2)", display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>
                  <MapPin size={17} />
                </div>
                <div className="ts-row__main">
                  <div className="ts-row__t">{g.name}</div>
                  <div className="ts-row__s">{g.locationLabel || "No location label"}  /  {gardenBeds.length} bed{gardenBeds.length === 1 ? "" : "s"}  /  {plantCount} plant{plantCount === 1 ? "" : "s"} this season</div>
                </div>
                <div className="ts-row__actions">
                  <button className="ts-btn ts-btn--ghost ts-btn--icon" onClick={() => setModal({ type: "garden", payload: g })}><Pencil size={15} /></button>
                  <button className="ts-btn ts-btn--danger ts-btn--icon" onClick={() => setModal({ type: "confirm", payload: {
                    title: "Delete garden?",
                    body: `"${g.name}" and its ${gardenBeds.length} bed${gardenBeds.length === 1 ? "" : "s"} will be removed. Plants stay in the season but lose their bed assignment.`,
                    confirm: () => {
                      softDelete("gardens", g.id);
                      gardenBeds.forEach((b) => softDelete("beds", b.id));
                      seasonPlants.filter((p) => bedIds.has(p.bedId)).forEach((p) => upd("plants", p.id, { bedId: null }));
                    },
                  } })}><Trash2 size={15} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="ts-sec">
        <div><h2>Beds</h2><p>{beds.length} structural  /  {activeBeds.length} shown on Harvest</p></div>
        <div className="ts-sec__act">
          <button className="ts-btn ts-btn--sm" disabled={!gardens.length} onClick={() => setModal({ type: "bed" })}><Plus size={14} /> Bed</button>
        </div>
      </div>

      {beds.length === 0 ? (
        <div className="ts-card"><Empty icon={MapPin} title="No beds yet"
          sub={gardens.length
            ? 'Beds organize your plants. Add named beds like "South Trellis."'
            : 'Beds organize your plants. Create a garden in the Gardens section first.'}
          action={gardens.length ? <button className="ts-btn ts-btn--vine" onClick={() => setModal({ type: "bed" })}>
            <Plus size={15} /> Add a bed</button> : null} /></div>
      ) : (
        <div className="ts-card">
          {beds.map((b) => {
            const g = gardens.find((x) => x.id === b.gardenId);
            const n = seasonPlants.filter((p) => p.bedId === b.id).length;
            return (
              <div key={b.id} className="ts-row">
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--vine)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>
                  <Leaf size={17} />
                </div>
                <div className="ts-row__main">
                  <div className="ts-row__t">{b.name}</div>
                  <div className="ts-row__s">{g ? g.name : "-"}  /  {n} plant{n === 1 ? "" : "s"} this season</div>
                </div>
                <div className="ts-row__actions">
                  <button className="ts-btn ts-btn--ghost ts-btn--icon" onClick={() => setModal({ type: "bed", payload: b })}><Pencil size={15} /></button>
                  <button className="ts-btn ts-btn--danger ts-btn--icon" onClick={() => setModal({ type: "confirm", payload: {
                    title: "Delete bed?",
                    body: `"${b.name}" will be removed. Plants in it stay but lose their bed assignment.`,
                    confirm: () => {
                      softDelete("beds", b.id);
                      seasonPlants.filter((p) => p.bedId === b.id).forEach((p) => upd("plants", p.id, { bedId: null }));
                    },
                  } })}><Trash2 size={15} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="ts-sec" style={{ marginTop: 22 }}>
        <div><h2>Plants</h2><p>{seasonPlants.length} this season  /  {activePlants.length} active on Harvest</p></div>
        <div className="ts-sec__act">
          <button className="ts-btn ts-btn--sm" disabled={!beds.length} onClick={() => setModal({ type: "plant" })}><Plus size={14} /> Plant</button>
        </div>
      </div>

      {seasonPlants.length === 0 ? (
        <div className="ts-card"><Empty icon={Sprout} title="No plants yet"
          sub='Add your individual tomato plants - label them like "Cherokee Purple 1" so you can track each one.'
          action={<button className="ts-btn ts-btn--vine" disabled={!beds.length} onClick={() => setModal({ type: "plant" })}><Plus size={15} /> Add a plant</button>} /></div>
      ) : (
        <div className="ts-card">
          {seasonPlants.map((p) => {
            const bed = beds.find((b) => b.id === p.bedId);
            return (
              <div key={p.id} className="ts-row">
                <div className="ts-row__main">
                  <div className="ts-row__t">{p.plantLabel} <StatusBadge s={p.status} /></div>
                  <div className="ts-row__s">
                    {p.variety}  /  {bed ? bed.name : "no bed"}  /  <b style={{ fontFamily: "'Space Mono',monospace", color: "var(--tomato2)" }}>{countByPlant[p.id] || 0}</b> harvested
                  </div>
                </div>
                <div className="ts-row__actions">
                  <button className="ts-btn ts-btn--ghost ts-btn--icon" title="Duplicate" onClick={() => duplicatePlant(p)}><Copy size={15} /></button>
                  <button className="ts-btn ts-btn--ghost ts-btn--icon" title="Edit" onClick={() => setModal({ type: "plant", payload: p })}><Pencil size={15} /></button>
                  <button className="ts-btn ts-btn--ghost ts-btn--icon" title="Retire" onClick={() => { upd("plants", p.id, { status: "retired", removedDate: todayKey() }); showToast(`Retired ${p.plantLabel}`); }}><Archive size={15} /></button>
                </div>
              </div>
            );
          })}
          <div style={{ marginTop: 10, fontSize: 11.5, color: "var(--ink2)", display: "flex", alignItems: "center", gap: 6 }}>
            <CircleAlert size={13} /> Retiring keeps a plant's history. Full delete lives in the edit screen, for setup mistakes only.
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* STATS                                                               */
/* ------------------------------------------------------------------ */
function StatsView({ ctx }) {
  const { data, activeSeason, seasonPlants, seasonHarvests, countByPlant } = ctx;

  const totalCount = seasonHarvests.reduce((a, h) => a + (h.quantityCount || 0), 0);
  const totalWeight = seasonHarvests.reduce((a, h) => a + (h.weightValue || 0), 0);

  const byPlant = seasonPlants
    .map((p) => ({ name: p.plantLabel, variety: p.variety, count: countByPlant[p.id] || 0 }))
    .sort((a, b) => b.count - a.count);
  const topPlant = byPlant[0];

  const varMap = {};
  seasonPlants.forEach((p) => {
    if (!varMap[p.variety]) varMap[p.variety] = { variety: p.variety, plants: 0, count: 0, firsts: [] };
    varMap[p.variety].plants += 1;
    varMap[p.variety].count += countByPlant[p.id] || 0;
    if (p.firstHarvestDate) varMap[p.variety].firsts.push(p.firstHarvestDate);
  });
  const varieties = Object.values(varMap)
    .map((v) => ({ ...v, avg: v.plants ? v.count / v.plants : 0, first: v.firsts.sort()[0] || null }))
    .sort((a, b) => b.avg - a.avg);
  const topVariety = varieties[0];

  const firstRipe = seasonPlants
    .filter((p) => p.firstHarvestDate)
    .sort((a, b) => a.firstHarvestDate.localeCompare(b.firstHarvestDate))[0];

  const sCurve = useMemo(() => buildSCurve(data), [data]);
  const dailyAverage = useMemo(() => buildDailyAverageComparison(data, activeSeason), [data, activeSeason]);
  const seasonKeys = sCurve.keys;
  const maxByPlant = Math.max(1, ...byPlant.map((p) => p.count));

  return (
    <>
      <div className="ts-sec"><div><h2>{activeSeason.name}</h2><p>Season-to-date performance</p></div></div>

      <div className="ts-grid2 stagger" style={{ marginBottom: 10 }}>
        <div className="ts-stat">
          <BarChart3 size={54} className="ts-stat__ic" />
          <div className="ts-stat__num">{totalCount}</div>
          <div className="ts-stat__label">Tomatoes</div>
        </div>
        <div className="ts-stat">
          <Sprout size={54} className="ts-stat__ic" />
          <div className="ts-stat__num">{seasonPlants.filter((p) => p.status !== "removed").length}</div>
          <div className="ts-stat__label">Plants tracked</div>
        </div>
        <div className="ts-stat">
          <Crown size={54} className="ts-stat__ic" style={{ color: "var(--gold)" }} />
          <div className="ts-stat__num" style={{ fontSize: 18, fontFamily: "'Bricolage Grotesque'", lineHeight: 1.1 }}>
            {topPlant && topPlant.count ? topPlant.name : "-"}
          </div>
          <div className="ts-stat__label">Top plant / {topPlant ? topPlant.count : 0}</div>
        </div>
        <div className="ts-stat">
          <Sun size={54} className="ts-stat__ic" style={{ color: "var(--tomato)" }} />
          <div className="ts-stat__num" style={{ fontSize: 16, fontFamily: "'Bricolage Grotesque'", lineHeight: 1.1 }}>
            {firstRipe ? fmtShort(firstRipe.firstHarvestDate) : "-"}
          </div>
          <div className="ts-stat__label">First ripe{firstRipe ? " / " + firstRipe.plantLabel.split(" ")[0] : ""}</div>
        </div>
      </div>

      <div className="ts-card" style={{ marginBottom: 10 }}>
        <div className="ts-sec" style={{ margin: "0 0 8px" }}><div><h2 style={{ fontSize: 15 }}>Daily average vs. historical</h2><p>Current pace compared at day {dailyAverage.day + 1} of season</p></div></div>
        <div className="ts-grid2">
          <div className="ts-stat">
            <div className="ts-stat__num">{dailyAverage.currentAvg.toFixed(1)}</div>
            <div className="ts-stat__label">This season / day</div>
          </div>
          <div className="ts-stat">
            <div className="ts-stat__num">{dailyAverage.hasHistory ? dailyAverage.historicalAvg.toFixed(1) : "-"}</div>
            <div className="ts-stat__label">Historical / day</div>
          </div>
        </div>
        {dailyAverage.hasHistory ? (
          <div className="ts-muted" style={{ marginTop: 10 }}>
            {dailyAverage.delta >= 0 ? "Ahead by" : "Behind by"} <b>{Math.abs(dailyAverage.delta).toFixed(1)}</b> tomatoes per day across {dailyAverage.historyCount} prior season{dailyAverage.historyCount === 1 ? "" : "s"}.
          </div>
        ) : (
          <div className="ts-muted" style={{ marginTop: 10 }}>Create another season with harvests to compare this daily pace against history.</div>
        )}
      </div>

      {totalWeight > 0 && (
        <div className="ts-card" style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 13, color: "var(--ink2)" }}>Logged weight (optional metric)</div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 18 }}>{totalWeight.toFixed(1)} {data.settings.weightUnit}</div>
        </div>
      )}

      <div className="ts-card" style={{ marginBottom: 10 }}>
        <div className="ts-sec" style={{ margin: "0 0 6px" }}><div><h2 style={{ fontSize: 15 }}>Cumulative harvest</h2><p>Season-to-date totals / aligned by days since start</p></div></div>
        {sCurve.data.length ? (
          <div style={{ height: 240 }}>
            <ResponsiveContainer>
              <LineChart data={sCurve.data} margin={{ top: 8, right: 26, left: 8, bottom: 18 }}>
                <CartesianGrid stroke="#e2d4ba" strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6f5e4c" }} tickLine={false} tickMargin={8} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11, fill: "#6f5e4c" }} tickLine={false} axisLine={false} width={44} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1.5px solid #d9c7a6", fontSize: 12, background: "#fbf6ec" }}
                  labelFormatter={(d) => `Day ${d}`} />
                {seasonKeys.length > 1 && <Legend wrapperStyle={{ fontSize: 11 }} />}
                {seasonKeys.map((k) => (
                  <Line key={k.id} type="stepAfter" dataKey={k.name} stroke={k.color}
                    strokeWidth={k.active ? 3 : 2} dot={false} strokeDasharray={k.active ? "0" : "5 4"} connectNulls />
                ))}
              </LineChart>
            </ResponsiveContainer>
            <div style={{ textAlign: "center", fontSize: 11, color: "var(--ink2)", marginTop: -8 }}>Day of season</div>
          </div>
        ) : <div style={{ color: "var(--ink2)", fontSize: 13, padding: "16px 2px" }}>Log a few harvests to see your season curve build.</div>}
      </div>

      <div className="ts-card" style={{ marginBottom: 10 }}>
        <div className="ts-sec" style={{ margin: "0 0 8px" }}><div><h2 style={{ fontSize: 15 }}>By plant</h2><p>Which individual plant performed?</p></div></div>
        {byPlant.filter((p) => p.count).length ? byPlant.filter((p) => p.count).map((p, i) => (
          <div key={i} style={{ marginBottom: 11 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5 }}>
              <span style={{ fontWeight: 600 }}>{i === 0 && "#1 "}{p.name} <span style={{ color: "var(--ink2)", fontWeight: 400, fontSize: 12 }}> /  {p.variety}</span></span>
              <span style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>{p.count}</span>
            </div>
            <div className="ts-bar"><i style={{ width: (p.count / maxByPlant * 100) + "%", background: i === 0 ? "var(--gold)" : "var(--tomato)" }} /></div>
          </div>
        )) : <div style={{ color: "var(--ink2)", fontSize: 13 }}>No harvests logged yet.</div>}
      </div>

      <div className="ts-card">
        <div className="ts-sec" style={{ margin: "0 0 4px" }}><div><h2 style={{ fontSize: 15 }}>Variety averages</h2><p>Average tomatoes per plant - the number that earns next year's spot</p></div></div>
        {varieties.filter((v) => v.count).length ? (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "var(--ink2)", fontSize: 10.5, letterSpacing: ".5px", textTransform: "uppercase" }}>
                <th style={{ padding: "6px 4px" }}>Variety</th>
                <th style={{ padding: "6px 4px", textAlign: "center" }}>Plants</th>
                <th style={{ padding: "6px 4px", textAlign: "right" }}>Total</th>
                <th style={{ padding: "6px 4px", textAlign: "right" }}>Avg/plant</th>
              </tr>
            </thead>
            <tbody>
              {varieties.map((v, i) => (
                <tr key={i} style={{ borderTop: "1px solid var(--line)" }}>
                  <td style={{ padding: "9px 4px", fontWeight: 600 }}>{i === 0 && topVariety.avg ? "* " : ""}{v.variety}</td>
                  <td style={{ padding: "9px 4px", textAlign: "center", fontFamily: "'Space Mono',monospace" }}>{v.plants}</td>
                  <td style={{ padding: "9px 4px", textAlign: "right", fontFamily: "'Space Mono',monospace" }}>{v.count}</td>
                  <td style={{ padding: "9px 4px", textAlign: "right", fontFamily: "'Space Mono',monospace", fontWeight: 700, color: "var(--vine2)" }}>{v.avg.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <div style={{ color: "var(--ink2)", fontSize: 13 }}>No variety data yet.</div>}
      </div>
    </>
  );
}

function buildSCurve(data) {
  const palette = ["#c5311f", "#2f5d3c", "#b88322", "#3a6b7a", "#7a4ba8"];
  const seasons = live(data.seasons);
  const seriesKeys = [];
  const dayMap = {};
  let colorI = 0;
  seasons.forEach((s) => {
    const sids = new Set(live(data.sessions).filter((x) => x.seasonId === s.id).map((x) => x.id));
    const hs = live(data.harvests).filter((h) => sids.has(h.sessionId) && (h.quantityCount || 0) > 0);
    if (!hs.length) return;
    const start = s.startDate || hs.map((h) => h.harvestDate).sort()[0];
    const perDate = {};
    hs.forEach((h) => { perDate[h.harvestDate] = (perDate[h.harvestDate] || 0) + h.quantityCount; });
    const dates = Object.keys(perDate).sort();
    let cum = 0;
    const key = { id: s.id, name: s.name, color: palette[colorI % palette.length], active: s.id === data.activeSeasonId };
    seriesKeys.push(key);
    colorI++;
    dates.forEach((d) => {
      cum += perDate[d];
      const day = Math.max(0, daysBetween(start, d) || 0);
      if (!dayMap[day]) dayMap[day] = { day };
      dayMap[day][s.name] = cum;
    });
  });
  seriesKeys.sort((a, b) => (b.active ? 1 : 0) - (a.active ? 1 : 0));
  return { data: Object.values(dayMap).sort((a, b) => a.day - b.day), keys: seriesKeys };
}

function seasonHarvestRows(data, season) {
  if (!season) return [];
  const sids = new Set(live(data.sessions).filter((x) => x.seasonId === season.id).map((x) => x.id));
  return live(data.harvests).filter((h) => sids.has(h.sessionId) && (h.quantityCount || 0) > 0);
}

function buildDailyAverageComparison(data, activeSeason) {
  const currentRows = seasonHarvestRows(data, activeSeason);
  const start = activeSeason?.startDate || currentRows.map((h) => h.harvestDate).sort()[0] || todayKey();
  const todayDay = Math.max(0, daysBetween(start, todayKey()) || 0);
  const lastHarvestDay = Math.max(0, ...currentRows.map((h) => daysBetween(start, h.harvestDate) || 0));
  const day = Math.max(todayDay, lastHarvestDay);
  const currentTotal = currentRows
    .filter((h) => (daysBetween(start, h.harvestDate) || 0) <= day)
    .reduce((a, h) => a + (h.quantityCount || 0), 0);
  const currentAvg = currentTotal / Math.max(1, day + 1);

  const historical = live(data.seasons)
    .filter((s) => s.id !== activeSeason?.id)
    .map((s) => {
      const rows = seasonHarvestRows(data, s);
      if (!rows.length) return null;
      const histStart = s.startDate || rows.map((h) => h.harvestDate).sort()[0];
      const total = rows
        .filter((h) => (daysBetween(histStart, h.harvestDate) || 0) <= day)
        .reduce((a, h) => a + (h.quantityCount || 0), 0);
      return total / Math.max(1, day + 1);
    })
    .filter((v) => v !== null);
  const historicalAvg = historical.length ? historical.reduce((a, v) => a + v, 0) / historical.length : 0;
  return {
    day,
    currentAvg,
    historicalAvg,
    delta: currentAvg - historicalAvg,
    historyCount: historical.length,
    hasHistory: historical.length > 0,
  };
}

/* ------------------------------------------------------------------ */
/* SYNDICATE  (leaderboards + social)                                  */
/* ------------------------------------------------------------------ */
function SyndicateView({ ctx }) {
  const { data, seasonPlants, countByPlant, seasonHarvests } = ctx;
  const me = data.profile.displayName || data.profile.username || "You";

  const golden = seasonPlants
    .map((p) => ({ name: p.plantLabel, count: countByPlant[p.id] || 0 }))
    .sort((a, b) => b.count - a.count)[0];
  const grand = seasonHarvests.reduce((a, h) => a + (h.quantityCount || 0), 0);
  const firstRipe = seasonPlants.filter((p) => p.firstHarvestDate)
    .sort((a, b) => a.firstHarvestDate.localeCompare(b.firstHarvestDate))[0];

  const board = (icon, title, desc, you) => (
    <div className="ts-card" style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 8 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: "var(--espresso)", color: "var(--gold2)", display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>{icon}</div>
        <div><div style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: 16 }}>{title}</div><div style={{ fontSize: 11.5, color: "var(--ink2)" }}>{desc}</div></div>
      </div>
      <div className="ts-rank">
        <Crown size={16} style={{ color: "var(--gold)" }} />
        <div><b>{me}</b><div style={{ fontSize: 11, color: "var(--ink2)" }}>your standing</div></div>
        <div className="ts-rank__v">{you}</div>
      </div>
    </div>
  );

  return (
    <>
      <div className="ts-sec"><div><h2>The Syndicate</h2><p>Friend-only leaderboards  /  private by default</p></div></div>
      {board(<Sun size={19} />, "The First Ripe Tomato", "Earliest logged harvest of the season",
        firstRipe ? fmtShort(firstRipe.firstHarvestDate) : "-")}
      {board(<Crown size={19} />, "The Golden Root", "Highest count from a single plant",
        golden && golden.count ? golden.count : 0)}
      {board(<Trophy size={19} />, "The Grand Yield", "Highest cumulative count  /  non-cherry, honor system", grand)}
      <div className="ts-note" style={{ marginTop: 4 }}>
        <b>Garden Friends are coming next.</b> The Supabase backend is live - friend requests,
        leaderboard syncing, and head-to-head standings are the next phase.
      </div>
      <div className="ts-card" style={{ marginTop: 10 }}>
        <div className="ts-sec" style={{ margin: 0 }}><div><h2 style={{ fontSize: 15 }}>Find gardeners</h2><p>Search by unique username</p></div></div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: 11, top: 12, color: "var(--ink2)" }} />
            <input className="ts-input" style={{ paddingLeft: 32 }} placeholder="@username" disabled />
          </div>
          <button className="ts-btn" disabled>Request</button>
        </div>
      </div>
    </>
  );
}

function otherFriendId(f, userId) {
  return f.requesterId === userId ? f.recipientId : f.requesterId;
}

function relationWith(userId, targetId, friendships) {
  return live(friendships).find((f) =>
    (f.requesterId === userId && f.recipientId === targetId) ||
    (f.requesterId === targetId && f.recipientId === userId)
  );
}

function displayGardener(profile) {
  return profile?.displayName || profile?.username || "Gardener";
}

function competitorStats({ profile, seasons, plants, sessions, harvests }, activeSeason) {
  const season = seasons.find((s) => s.year === activeSeason?.year) ||
    seasons.find((s) => s.isActive) ||
    seasons.slice().sort((a, b) => (b.year || 0) - (a.year || 0))[0];
  const seasonPlants = season ? live(plants).filter((p) => p.seasonId === season.id) : [];
  const seasonSessionIds = new Set(season ? live(sessions).filter((s) => s.seasonId === season.id).map((s) => s.id) : []);
  const seasonHarvests = live(harvests).filter((h) => seasonSessionIds.has(h.sessionId));
  const counts = {};
  seasonHarvests.forEach((h) => { counts[h.plantId] = (counts[h.plantId] || 0) + (h.quantityCount || 0); });
  const goldenPlant = seasonPlants
    .map((p) => ({ plant: p, count: counts[p.id] || 0 }))
    .sort((a, b) => b.count - a.count)[0];
  const firstPlant = seasonPlants
    .filter((p) => p.firstHarvestDate)
    .sort((a, b) => a.firstHarvestDate.localeCompare(b.firstHarvestDate))[0];
  return {
    id: profile.id,
    name: displayGardener(profile),
    username: profile.username,
    season,
    firstRipeDate: firstPlant?.firstHarvestDate || null,
    firstRipePlant: firstPlant?.plantLabel || "",
    goldenCount: goldenPlant?.count || 0,
    goldenPlant: goldenPlant?.plant?.plantLabel || "",
    grandTotal: seasonHarvests.reduce((a, h) => a + (h.quantityCount || 0), 0),
  };
}

function rankRows(stats, metric) {
  const rows = stats.map((s) => {
    if (metric === "first") return { ...s, sort: s.firstRipeDate || "9999-12-31", value: s.firstRipeDate ? fmtShort(s.firstRipeDate) : "-", sub: s.firstRipePlant };
    if (metric === "golden") return { ...s, sort: -(s.goldenCount || 0), value: s.goldenCount || 0, sub: s.goldenPlant };
    return { ...s, sort: -(s.grandTotal || 0), value: s.grandTotal || 0, sub: "total tomatoes" };
  });
  return rows.sort((a, b) => a.sort < b.sort ? -1 : a.sort > b.sort ? 1 : a.name.localeCompare(b.name));
}

function SyndicateViewLive({ ctx }) {
  const { data, activeSeason, session, patch, showToast } = ctx;
  const userId = session?.user?.id;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searchState, setSearchState] = useState("idle");
  const [friendBundle, setFriendBundle] = useState(null);
  const [friendsState, setFriendsState] = useState("idle");

  const friendships = live(data.friendships);
  const accepted = friendships.filter((f) => f.status === "accepted");
  const incoming = friendships.filter((f) => f.status === "pending" && f.recipientId === userId);
  const outgoing = friendships.filter((f) => f.status === "pending" && f.requesterId === userId);
  const blocked = friendships.filter((f) => f.status === "blocked");
  const acceptedFriendIds = accepted.map((f) => otherFriendId(f, userId)).filter(Boolean);
  const relatedProfileIds = [...new Set(friendships.map((f) => otherFriendId(f, userId)).filter(Boolean))];

  const replaceFriendship = (rec) => patch((d) => ({
    ...d,
    friendships: d.friendships.some((f) => f.id === rec.id)
      ? d.friendships.map((f) => f.id === rec.id ? rec : f)
      : [...d.friendships, rec],
  }));

  const saveFriendship = async (rec) => {
    replaceFriendship(rec);
    const { error } = await supa.from("friendships").upsert(toDb(rec));
    if (error) showToast(error.message || "Friendship update failed");
  };

  const updateFriendship = async (f, status) => {
    const rec = { ...f, status, updatedAt: nowISO() };
    replaceFriendship(rec);
    const { error } = await supa.from("friendships").update(toDb({ status, updatedAt: rec.updatedAt })).eq("id", f.id);
    if (error) showToast(error.message || "Friendship update failed");
  };

  const sendRequest = async (profile) => {
    const existing = relationWith(userId, profile.id, data.friendships);
    const t = nowISO();
    const rec = existing
      ? { ...existing, requesterId: userId, recipientId: profile.id, status: "pending", updatedAt: t }
      : { id: uid(), requesterId: userId, recipientId: profile.id, status: "pending", createdAt: t, updatedAt: t };
    await saveFriendship(rec);
    showToast(`Request sent to ${displayGardener(profile)}`);
  };

  const blockUser = async (targetId) => {
    const existing = relationWith(userId, targetId, data.friendships);
    const t = nowISO();
    const rec = existing
      ? { ...existing, status: "blocked", updatedAt: t }
      : { id: uid(), requesterId: userId, recipientId: targetId, status: "blocked", createdAt: t, updatedAt: t };
    await saveFriendship(rec);
    showToast("Gardener blocked");
  };

  useEffect(() => {
    if (!userId || query.trim().replace(/^@/, "").length < 2) {
      setResults([]);
      setSearchState("idle");
      return;
    }
    let alive = true;
    const term = query.trim().replace(/^@/, "").toLowerCase();
    setSearchState("searching");
    const timer = setTimeout(async () => {
      const { data: rows, error } = await supa
        .from("profiles")
        .select("id,username,display_name,social_url")
        .ilike("username", `${term}%`)
        .neq("id", userId)
        .limit(8);
      if (!alive) return;
      if (error) {
        setSearchState("error");
        setResults([]);
      } else {
        setResults((rows || []).map((p) => normalizeProfile(fromDb(p))));
        setSearchState("done");
      }
    }, 250);
    return () => { alive = false; clearTimeout(timer); };
  }, [query, userId]);

  useEffect(() => {
    if (!relatedProfileIds.length) {
      setFriendBundle(null);
      setFriendsState("idle");
      return;
    }
    let alive = true;
    setFriendsState("loading");
    const profileIds = relatedProfileIds;
    const dataIds = [...new Set(acceptedFriendIds)];
    (async () => {
      const [profiles, seasons, plants, sessions, harvests] = await Promise.all([
        supa.from("profiles").select("*").in("id", profileIds),
        dataIds.length ? supa.from("seasons").select("*").in("user_id", dataIds) : Promise.resolve({ data: [] }),
        dataIds.length ? supa.from("plants").select("*").in("user_id", dataIds) : Promise.resolve({ data: [] }),
        dataIds.length ? supa.from("harvest_sessions").select("*").in("user_id", dataIds) : Promise.resolve({ data: [] }),
        dataIds.length ? supa.from("harvests").select("*").in("user_id", dataIds) : Promise.resolve({ data: [] }),
      ]);
      if (!alive) return;
      const firstError = [profiles, seasons, plants, sessions, harvests].find((r) => r.error)?.error;
      if (firstError) {
        setFriendsState("error");
        setFriendBundle(null);
        return;
      }
      setFriendBundle({
        profiles: (profiles.data || []).map((p) => normalizeProfile(fromDb(p))),
        seasons: (seasons.data || []).map(fromDb),
        plants: (plants.data || []).map(fromDb),
        sessions: (sessions.data || []).map(fromDb),
        harvests: (harvests.data || []).map(fromDb),
      });
      setFriendsState("ready");
    })();
    return () => { alive = false; };
  }, [relatedProfileIds.join(","), acceptedFriendIds.join(",")]);

  const friendProfiles = friendBundle?.profiles || [];
  const acceptedProfileIds = new Set(acceptedFriendIds);
  const selfStats = competitorStats({
    profile: { ...data.profile, id: userId },
    seasons: data.seasons,
    plants: data.plants,
    sessions: data.sessions,
    harvests: data.harvests,
  }, activeSeason);
  const friendStats = friendProfiles.filter((profile) => acceptedProfileIds.has(profile.id)).map((profile) => competitorStats({
    profile,
    seasons: (friendBundle?.seasons || []).filter((s) => s.userId === profile.id),
    plants: (friendBundle?.plants || []).filter((p) => p.userId === profile.id),
    sessions: (friendBundle?.sessions || []).filter((s) => s.userId === profile.id),
    harvests: (friendBundle?.harvests || []).filter((h) => h.userId === profile.id),
  }, activeSeason));
  const allStats = [selfStats, ...friendStats];

  const board = (icon, title, desc, metric) => {
    const rows = rankRows(allStats, metric);
    return (
      <div className="ts-card" style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 8 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: "var(--espresso)", color: "var(--gold2)", display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>{icon}</div>
          <div><div style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: 16 }}>{title}</div><div style={{ fontSize: 11.5, color: "var(--ink2)" }}>{desc}</div></div>
        </div>
        {rows.map((r, i) => (
          <div className="ts-rank" key={r.id + metric}>
            <Crown size={16} style={{ color: i === 0 ? "var(--gold)" : "var(--line2)" }} />
            <div><b>{r.name}{r.id === userId ? " (you)" : ""}</b><div style={{ fontSize: 11, color: "var(--ink2)" }}>{r.sub || "no qualifying harvest yet"}</div></div>
            <div className="ts-rank__v">{r.value}</div>
          </div>
        ))}
      </div>
    );
  };

  const profileById = (id) => friendProfiles.find((p) => p.id === id) || { id, displayName: "Gardener", username: "" };

  return (
    <>
      <div className="ts-sec"><div><h2>The Syndicate</h2><p>Friend-only leaderboards  /  private by default</p></div></div>
      {friendsState === "error" && (
        <div className="ts-note" style={{ marginBottom: 10 }}>
          <b>Friend data could not be read.</b> Check Supabase RLS policies for friend-visible profiles, seasons, plants, sessions, and harvests.
        </div>
      )}
      {board(<Sun size={19} />, "The First Ripe Tomato", "Earliest logged harvest of the season", "first")}
      {board(<Crown size={19} />, "The Golden Root", "Highest count from a single plant", "golden")}
      {board(<Trophy size={19} />, "The Grand Yield", "Highest cumulative count  /  non-cherry, honor system", "grand")}

      <div className="ts-card" style={{ marginTop: 10 }}>
        <div className="ts-sec" style={{ margin: 0 }}><div><h2 style={{ fontSize: 15 }}>Find gardeners</h2><p>Search by unique username</p></div></div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: 11, top: 12, color: "var(--ink2)" }} />
            <input className="ts-input" style={{ paddingLeft: 32 }} placeholder="@username" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>
        {searchState === "searching" && <div className="ts-muted" style={{ marginTop: 10 }}>Searching...</div>}
        {searchState === "error" && <div className="ts-muted" style={{ marginTop: 10 }}>Search failed. Check Supabase profile read policy.</div>}
        {searchState === "done" && results.length === 0 && <div className="ts-muted" style={{ marginTop: 10 }}>No gardener found for that username.</div>}
        {results.map((profile) => {
          const rel = relationWith(userId, profile.id, data.friendships);
          const incomingRel = rel?.status === "pending" && rel.recipientId === userId;
          const label = rel?.status === "accepted" ? "Friends"
            : rel?.status === "pending" ? (incomingRel ? "Accept" : "Pending")
            : rel?.status === "blocked" ? "Blocked"
            : "Request";
          return (
            <div key={profile.id} className="ts-row">
              <div className="ts-row__main">
                <div className="ts-row__t">{displayGardener(profile)}</div>
                <div className="ts-row__s">@{profile.username}</div>
              </div>
              <button className="ts-btn ts-btn--sm" disabled={rel?.status === "accepted" || rel?.status === "blocked" || (rel?.status === "pending" && !incomingRel)}
                onClick={() => incomingRel ? updateFriendship(rel, "accepted") : sendRequest(profile)}>
                {incomingRel ? <Check size={14} /> : <UserPlus size={14} />} {label}
              </button>
              {rel?.status !== "blocked" && (
                <button className="ts-btn ts-btn--danger ts-btn--icon" onClick={() => blockUser(profile.id)}><Ban size={14} /></button>
              )}
            </div>
          );
        })}
      </div>

      <div className="ts-card" style={{ marginTop: 10 }}>
        <div className="ts-sec" style={{ margin: 0 }}><div><h2 style={{ fontSize: 15 }}>Garden Friends</h2><p>{accepted.length} accepted  /  {incoming.length} incoming  /  {outgoing.length} outgoing</p></div></div>
        {incoming.map((f) => {
          const p = profileById(f.requesterId);
          return (
            <div className="ts-row" key={f.id}>
              <Clock size={16} style={{ color: "var(--gold)" }} />
              <div className="ts-row__main"><div className="ts-row__t">{displayGardener(p)}</div><div className="ts-row__s">wants to join your garden circle</div></div>
              <button className="ts-btn ts-btn--sm" onClick={() => updateFriendship(f, "accepted")}><Check size={14} /> Accept</button>
              <button className="ts-btn ts-btn--danger ts-btn--icon" onClick={() => updateFriendship(f, "declined")}><X size={14} /></button>
            </div>
          );
        })}
        {accepted.map((f) => {
          const id = otherFriendId(f, userId);
          const p = profileById(id);
          return (
            <div className="ts-row" key={f.id}>
              <Users size={16} style={{ color: "var(--vine)" }} />
              <div className="ts-row__main"><div className="ts-row__t">{displayGardener(p)}</div><div className="ts-row__s">@{p.username || "friend"}</div></div>
              <button className="ts-btn ts-btn--ghost ts-btn--icon" title="Remove friend" onClick={() => updateFriendship(f, "declined")}><UserMinus size={14} /></button>
              <button className="ts-btn ts-btn--danger ts-btn--icon" title="Block" onClick={() => blockUser(id)}><ShieldAlert size={14} /></button>
            </div>
          );
        })}
        {outgoing.map((f) => {
          const p = profileById(f.recipientId);
          return (
            <div className="ts-row" key={f.id}>
              <Clock size={16} style={{ color: "var(--ink2)" }} />
              <div className="ts-row__main"><div className="ts-row__t">{displayGardener(p)}</div><div className="ts-row__s">request pending</div></div>
              <button className="ts-btn ts-btn--ghost ts-btn--sm" onClick={() => updateFriendship(f, "declined")}><X size={14} /> Cancel</button>
            </div>
          );
        })}
        {!incoming.length && !accepted.length && !outgoing.length && (
          <div className="ts-muted" style={{ marginTop: 10 }}>Search for a username to send your first Garden Friend request.</div>
        )}
        {blocked.length > 0 && <div className="ts-muted" style={{ marginTop: 10 }}>{blocked.length} gardener{blocked.length === 1 ? "" : "s"} blocked.</div>}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* MORE  (profile, sessions, export, settings, account)               */
/* ------------------------------------------------------------------ */
function MoreView({ ctx }) {
  const {
    data, seasonSessions, seasonPlants, seasonHarvests, setModal, patch, setData,
    activeSeason, patchProfile, session, setLocalMode, setSaveState, showToast
  } = ctx;

  const exportPlants = () => {
    const rows = [["plant_label", "variety", "bed_name", "status", "planted_date", "first_harvest_date", "total_count", "notes"]];
    seasonPlants.forEach((p) => {
      const bed = data.beds.find((b) => b.id === p.bedId);
      const total = seasonHarvests.filter((h) => h.plantId === p.id).reduce((a, h) => a + (h.quantityCount || 0), 0);
      rows.push([p.plantLabel, p.variety, bed ? bed.name : "", p.status, p.plantedDate || "", p.firstHarvestDate || "", total, p.notes || ""]);
    });
    downloadCSV(`tomato-plants-${activeSeason.year}.csv`, rows);
  };
  const exportHarvests = () => {
    const rows = [["harvest_date", "plant_label", "variety", "bed_name", "quantity_count", "weight", "weight_unit", "notes", "season"]];
    seasonHarvests.slice().sort((a, b) => a.harvestDate.localeCompare(b.harvestDate)).forEach((h) => {
      const p = data.plants.find((x) => x.id === h.plantId) || {};
      const bed = data.beds.find((b) => b.id === p.bedId);
      rows.push([h.harvestDate, p.plantLabel || "", p.variety || "", bed ? bed.name : "", h.quantityCount, h.weightValue || "", h.weightUnit || "", h.notes || "", activeSeason.name]);
    });
    downloadCSV(`tomato-harvests-${activeSeason.year}.csv`, rows);
  };
  const exportSummary = () => {
    const total = seasonHarvests.reduce((a, h) => a + (h.quantityCount || 0), 0);
    const varMap = {};
    seasonPlants.forEach((p) => {
      const c = seasonHarvests.filter((h) => h.plantId === p.id).reduce((a, h) => a + (h.quantityCount || 0), 0);
      if (!varMap[p.variety]) varMap[p.variety] = { plants: 0, count: 0 };
      varMap[p.variety].plants++; varMap[p.variety].count += c;
    });
    const rows = [["metric", "value"], ["season", activeSeason.name], ["total_count", total],
      ["plants_tracked", seasonPlants.length], ["harvest_sessions", seasonSessions.length], ["", ""],
      ["variety", "plants / total / avg_per_plant"]];
    Object.entries(varMap).forEach(([v, o]) => rows.push([v, `${o.plants} / ${o.count} / ${(o.count / o.plants).toFixed(1)}`]));
    downloadCSV(`tomato-season-summary-${activeSeason.year}.csv`, rows);
  };

  const handleSignOut = async () => {
    setLocalMode(false);
    await supa.auth.signOut();
    setData(null);
  };

  return (
    <>
      <div className="ts-sec"><div><h2>Profile</h2><p>Shown to garden friends</p></div>
        <button className="ts-btn ts-btn--ghost ts-btn--sm" onClick={() => setModal({ type: "profile" })}><Pencil size={13} /> Edit</button></div>
      <div className="ts-card" style={{ display: "flex", alignItems: "center", gap: 13 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--vine)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 900, flex: "0 0 auto" }}>
          {(data.profile.displayName || data.profile.username || "G")[0].toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 16 }}>{data.profile.displayName || "Unnamed gardener"}</div>
          <div style={{ fontSize: 12.5, color: "var(--ink2)" }}>@{data.profile.username || "set-a-username"}</div>
          {data.profile.socialUrl && <a className="ts-link" style={{ fontSize: 12, marginTop: 3 }} href={data.profile.socialUrl} target="_blank" rel="noreferrer"><Link2 size={12} /> {data.profile.socialUrl.replace(/^https?:\/\//, "")}</a>}
        </div>
        {session && <div style={{ fontSize: 10, color: "var(--vine)", display: "flex", alignItems: "center", gap: 3 }}><Wifi size={11} /> Synced</div>}
      </div>

      <div className="ts-sec" style={{ marginTop: 22 }}><div><h2>Harvest log</h2><p>{seasonSessions.length} session{seasonSessions.length === 1 ? "" : "s"} this season</p></div></div>
      {seasonSessions.length === 0 ? (
        <div className="ts-card"><div style={{ color: "var(--ink2)", fontSize: 13, padding: "6px 2px" }}>No sessions yet - log one from the Harvest tab.</div></div>
      ) : (
        <div className="ts-card">
          {seasonSessions.slice().sort(newestSessionFirst).map((s) => {
            const hs = seasonHarvests.filter((h) => h.sessionId === s.id);
            const total = hs.reduce((a, h) => a + (h.quantityCount || 0), 0);
            return (
              <div key={s.id} className="ts-row" onClick={() => setModal({ type: "session", payload: s })} style={{ cursor: "pointer" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--paper2)", border: "1.5px solid var(--line2)", display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto", fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: 13 }}>{total}</div>
                <div className="ts-row__main">
                  <div className="ts-row__t">{fmtDate(s.harvestDate)}</div>
                  <div className="ts-row__s">{hs.length} plant{hs.length === 1 ? "" : "s"}  /  {total} tomatoes</div>
                </div>
                <ChevronRight size={17} style={{ color: "var(--ink2)" }} />
              </div>
            );
          })}
        </div>
      )}

      <div className="ts-sec" style={{ marginTop: 22 }}><div><h2>Export</h2><p>Your data, your spreadsheets</p></div></div>
      <div className="ts-card">
        <button className="ts-btn ts-btn--ghost ts-btn--block" onClick={exportPlants}><Download size={16} /> Plants CSV</button>
        <button className="ts-btn ts-btn--ghost ts-btn--block" style={{ marginTop: 8 }} onClick={exportHarvests}><Download size={16} /> Harvests CSV</button>
        <button className="ts-btn ts-btn--ghost ts-btn--block" style={{ marginTop: 8 }} onClick={exportSummary}><Download size={16} /> Season summary CSV</button>
      </div>

      <div className="ts-sec" style={{ marginTop: 22 }}><div><h2>Settings</h2></div></div>
      <div className="ts-card">
        <div style={{ marginBottom: 6, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "var(--ink2)", fontWeight: 700 }}>Preferred weight unit</div>
        <div className="ts-segs">
          {UNITS.map((u) => (
            <button key={u} className={"ts-seg" + (data.settings.weightUnit === u ? " on" : "")}
              onClick={() => patch((d) => ({ ...d, settings: { ...d.settings, weightUnit: u } }))}>{u}</button>
          ))}
        </div>
        <div className="ts-divider" />
        <button className="ts-btn ts-btn--danger ts-btn--block" onClick={() => setModal({ type: "confirm", payload: {
          title: "Reset garden data?",
          body: session
            ? "This permanently deletes every season, garden, bed, plant, and harvest from Supabase for this account and clears this device. There's no undo."
            : "This permanently clears every season, plant, and harvest on this device. There's no undo.",
          danger: true, confirmLabel: "Erase everything",
          confirm: async () => {
            const next = session
              ? withLocalOwner({ ...emptyData(), profile: data.profile, settings: data.settings, friendships: data.friendships || [] }, session.user.id)
              : null;
            setSaveState("saving");
            await localSave(null);
            if (session) {
              try {
                await resetGardenDataInSupabase(next, session.user.id);
                await localSave(next);
                setData(next);
                setSaveState("saved");
                showToast("Garden data reset in Supabase.");
              } catch (e) {
                console.warn("Cloud reset failed:", e.message);
                setData(next);
                await localSave(next);
                setSaveState("error");
                showToast("Cloud reset needs attention. Local data was reset.");
              }
            } else {
              setData(null);
              setLocalMode(false);
              setSaveState("idle");
              showToast("Local garden data reset.");
            }
          },
        } })}><Trash2 size={16} /> Reset garden data</button>
      </div>

      {session && (
        <>
          <div className="ts-sec" style={{ marginTop: 22 }}><div><h2>Account</h2><p>{session.user.email}</p></div></div>
          <div className="ts-card">
            <button className="ts-btn ts-btn--ghost ts-btn--block" onClick={handleSignOut}>
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </>
      )}

      <div style={{ textAlign: "center", color: "var(--ink2)", fontSize: 11, margin: "20px 0 8px", lineHeight: 1.6 }}>
        Tomato Syndicate  /  cloud sync active<br />Data syncs to Supabase. Friend leaderboards coming next.
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* MODALS                                                              */
/* ------------------------------------------------------------------ */
function ModalRouter({ ctx, modal, close, setTab }) {
  switch (modal.type) {
    case "confirm":  return <ConfirmModal payload={modal.payload} close={close} />;
    case "seasons":  return <SeasonsModal ctx={ctx} close={close} />;
    case "garden":   return <GardenModal ctx={ctx} payload={modal.payload} close={close} />;
    case "bed":      return <BedModal ctx={ctx} payload={modal.payload} close={close} />;
    case "plant":    return <PlantModal ctx={ctx} payload={modal.payload} close={close} />;
    case "profile":  return <ProfileModal ctx={ctx} close={close} />;
    case "session":  return <SessionModal ctx={ctx} payload={modal.payload} close={close} />;
    default: return null;
  }
}

function ConfirmModal({ payload, close }) {
  const [busy, setBusy] = useState(false);
  const run = async () => {
    if (busy) return;
    setBusy(true);
    await payload.confirm();
    close();
  };
  return (
    <Modal title={payload.title} onClose={close}>
      <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.55, marginTop: 2 }}>{payload.body}</p>
      <div className="ts-rowf" style={{ marginTop: 16 }}>
        <button className="ts-btn ts-btn--ghost" onClick={close} disabled={busy}>Cancel</button>
        <button className={"ts-btn " + (payload.danger ? "ts-btn--primary" : "ts-btn--danger")}
          onClick={run} disabled={busy}>{busy ? "Working..." : (payload.confirmLabel || "Delete")}</button>
      </div>
    </Modal>
  );
}

function SeasonsModal({ ctx, close }) {
  const { data, patch, add, upd, setActiveSeason } = ctx;
  const seasons = live(data.seasons).sort((a, b) => b.year - a.year);
  const [name, setName] = useState("");
  const [year, setYear] = useState(new Date().getFullYear() + 1);
  const [start, setStart] = useState(todayKey());
  const [editing, setEditing] = useState(null);

  const create = () => {
    const id = uid(), t = nowISO();
    add("seasons", { id, year: parseInt(year, 10) || new Date().getFullYear(), name: name.trim() || year + " Season", startDate: start, isActive: true, createdAt: t, updatedAt: t });
    seasons.forEach((s) => upd("seasons", s.id, { isActive: false }));
    patch((d) => ({ ...d, activeSeasonId: id }));
    setName("");
  };
  const startEdit = (s) => setEditing({
    id: s.id,
    name: s.name || "",
    year: s.year || new Date().getFullYear(),
    startDate: s.startDate || todayKey(),
  });
  const saveEdit = () => {
    if (!editing) return;
    upd("seasons", editing.id, {
      name: editing.name.trim() || editing.year + " Season",
      year: parseInt(editing.year, 10) || new Date().getFullYear(),
      startDate: editing.startDate || todayKey(),
    });
    setEditing(null);
  };
  return (
    <Modal title="Seasons" onClose={close}>
      <div className="ts-card" style={{ marginBottom: 14 }}>
        {seasons.map((s) => (
          <div key={s.id} className="ts-row">
            <div className="ts-row__main" onClick={() => setActiveSeason(s.id)} style={{ cursor: "pointer" }}>
              <div className="ts-row__t">{s.name} {s.id === data.activeSeasonId && <span className="ts-badge b-active">Active</span>}</div>
              <div className="ts-row__s">Year {s.year}  /  starts {fmtShort(s.startDate)}</div>
            </div>
            <button className="ts-btn ts-btn--ghost ts-btn--icon" onClick={() => startEdit(s)}><Pencil size={15} /></button>
            {seasons.length > 1 && s.id !== data.activeSeasonId && (
              <button className="ts-btn ts-btn--danger ts-btn--icon" onClick={() => ctx.softDelete("seasons", s.id)}><Trash2 size={15} /></button>
            )}
          </div>
        ))}
        {editing && (
          <div style={{ paddingTop: 12, borderTop: "1px solid var(--line)" }}>
            <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "var(--ink2)", fontWeight: 700, marginBottom: 8 }}>Edit season</div>
            <Field label="Name"><input className="ts-input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
            <div className="ts-rowf">
              <Field label="Year"><input className="ts-input" inputMode="numeric" value={editing.year} onChange={(e) => setEditing({ ...editing, year: e.target.value })} /></Field>
              <Field label="Start date"><input className="ts-input" type="date" value={editing.startDate} onChange={(e) => setEditing({ ...editing, startDate: e.target.value })} /></Field>
            </div>
            <div className="ts-rowf">
              <button className="ts-btn ts-btn--ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button className="ts-btn ts-btn--primary" onClick={saveEdit}><Check size={15} /> Save season</button>
            </div>
          </div>
        )}
      </div>
      <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "var(--ink2)", fontWeight: 700, marginBottom: 8 }}>New season</div>
      <div className="ts-rowf">
        <Field label="Year"><input className="ts-input" inputMode="numeric" value={year} onChange={(e) => setYear(e.target.value)} /></Field>
        <Field label="Start date"><input className="ts-input" type="date" value={start} onChange={(e) => setStart(e.target.value)} /></Field>
      </div>
      <Field label="Name"><input className="ts-input" placeholder={year + " Season"} value={name} onChange={(e) => setName(e.target.value)} /></Field>
      <button className="ts-btn ts-btn--vine ts-btn--block" onClick={create}><Plus size={16} /> Create &amp; switch</button>
    </Modal>
  );
}

function GardenModal({ ctx, payload, close }) {
  const { add, upd } = ctx;
  const editing = !!payload;
  const [name, setName] = useState(payload?.name || "");
  const [loc, setLoc] = useState(payload?.locationLabel || "");
  const [notes, setNotes] = useState(payload?.notes || "");
  const save = () => {
    if (!name.trim()) return;
    if (editing) upd("gardens", payload.id, { name: name.trim(), locationLabel: loc, notes });
    else { const t = nowISO(); add("gardens", { id: uid(), name: name.trim(), locationLabel: loc, notes, createdAt: t, updatedAt: t }); }
    close();
  };
  return (
    <Modal title={editing ? "Edit garden" : "New garden"} onClose={close}>
      <Field label="Name"><input className="ts-input" autoFocus placeholder="Home Garden" value={name} onChange={(e) => setName(e.target.value)} /></Field>
      <Field label="Location label  /  optional, non-specific"><input className="ts-input" placeholder="Backyard" value={loc} onChange={(e) => setLoc(e.target.value)} /></Field>
      <Field label="Notes  /  optional"><textarea className="ts-textarea" value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
      <button className="ts-btn ts-btn--primary ts-btn--block" disabled={!name.trim()} onClick={save}><Check size={16} /> {editing ? "Save" : "Create garden"}</button>
    </Modal>
  );
}

function BedModal({ ctx, payload, close }) {
  const { data, add, upd, setModal } = ctx;
  const gardens = live(data.gardens);
  const editing = !!payload;
  const [name, setName] = useState(payload?.name || "");
  const [gardenId, setGardenId] = useState(payload?.gardenId || gardens[0]?.id || "");
  const [notes, setNotes] = useState(payload?.notes || "");
  const save = () => {
    if (!name.trim() || !gardenId) return;
    if (editing) upd("beds", payload.id, { name: name.trim(), gardenId, notes });
    else { const t = nowISO(); add("beds", { id: uid(), gardenId, name: name.trim(), notes, createdAt: t, updatedAt: t }); }
    close();
  };
  if (!gardens.length) {
    return (
      <Modal title="Add a garden first" onClose={close}>
        <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.5 }}>Beds live inside a garden. Create a garden, then add beds to it.</p>
        <button className="ts-btn ts-btn--vine ts-btn--block" onClick={() => { close(); setModal({ type: "garden" }); }}><Plus size={16} /> New garden</button>
      </Modal>
    );
  }
  return (
    <Modal title={editing ? "Edit bed" : "New bed"} onClose={close}>
      <Field label="Bed name"><input className="ts-input" autoFocus placeholder="South Trellis" value={name} onChange={(e) => setName(e.target.value)} /></Field>
      <Field label="Garden">
        <select className="ts-select" value={gardenId} onChange={(e) => setGardenId(e.target.value)}>
          {gardens.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      </Field>
      <Field label="Notes  /  optional"><textarea className="ts-textarea" value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
      <button className="ts-btn ts-btn--primary ts-btn--block" disabled={!name.trim()} onClick={save}><Check size={16} /> {editing ? "Save" : "Create bed"}</button>
    </Modal>
  );
}

function PlantModal({ ctx, payload, close }) {
  const { data, activeSeason, add, upd, softDelete, seasonHarvests, setModal, showToast } = ctx;
  const beds = live(data.beds);
  const editing = !!payload;
  const [variety, setVariety] = useState(payload?.variety || "");
  const [label, setLabel] = useState(payload?.plantLabel || "");
  const [bedId, setBedId] = useState(payload?.bedId || beds[0]?.id || "");
  const [status, setStatus] = useState(payload?.status || "active");
  const [planted, setPlanted] = useState(payload?.plantedDate || todayKey());
  const [removed, setRemoved] = useState(payload?.removedDate || todayKey());
  const [notes, setNotes] = useState(payload?.notes || "");
  const harvestCount = editing ? seasonHarvests.filter((h) => h.plantId === payload.id).length : 0;

  const save = () => {
    if (!variety.trim() || !label.trim()) return;
    if (editing) upd("plants", payload.id, { variety: variety.trim(), plantLabel: label.trim(), bedId, status, plantedDate: planted, notes,
      removedDate: status !== "active" ? (removed || todayKey()) : null });
    else { const t = nowISO(); add("plants", { id: uid(), seasonId: activeSeason.id, bedId, variety: variety.trim(), plantLabel: label.trim(), status, plantedDate: planted, firstHarvestDate: null, removedDate: status !== "active" ? (removed || todayKey()) : null, notes, createdAt: t, updatedAt: t, deletedAt: null, syncedAt: t }); }
    close();
  };
  const del = () => {
    setModal({ type: "confirm", payload: {
      title: "Delete plant?",
      body: harvestCount
        ? `"${payload.plantLabel}" has ${harvestCount} harvest record${harvestCount === 1 ? "" : "s"}. Deleting removes them from analytics. Retiring is usually better - it keeps the history.`
        : `"${payload.plantLabel}" will be removed. Use this for setup mistakes or duplicates.`,
      confirmLabel: "Delete plant",
      confirm: () => { softDelete("plants", payload.id); showToast(`Deleted ${payload.plantLabel}`); },
    } });
  };

  return (
    <Modal title={editing ? "Edit plant" : "New plant"} onClose={close}>
      <Field label="Variety"><input className="ts-input" autoFocus placeholder="Cherokee Purple" value={variety} onChange={(e) => { setVariety(e.target.value); if (!editing && !label) setLabel(e.target.value + " 1"); }} /></Field>
      <Field label="Plant label  /  distinguishes plants of one variety"><input className="ts-input" placeholder="Cherokee Purple 1" value={label} onChange={(e) => setLabel(e.target.value)} /></Field>
      <div className="ts-rowf">
        <Field label="Bed">
          <select className="ts-select" value={bedId} onChange={(e) => setBedId(e.target.value)}>
            <option value="">- none -</option>
            {beds.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </Field>
        <Field label="Planted"><input className="ts-input" type="date" value={planted} onChange={(e) => setPlanted(e.target.value)} /></Field>
      </div>
      <Field label="Status">
        <div className="ts-segs">
          {STATUS.map((s) => <button key={s} className={"ts-seg" + (status === s ? " on" : "")} onClick={() => setStatus(s)}>{STATUS_LABEL[s]}</button>)}
        </div>
      </Field>
      {status !== "active" && (
        <Field label="Removed date">
          <input className="ts-input" type="date" value={removed} onChange={(e) => setRemoved(e.target.value)} />
        </Field>
      )}
      <Field label="Notes  /  optional"><textarea className="ts-textarea" value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
      <button className="ts-btn ts-btn--primary ts-btn--block" disabled={!variety.trim() || !label.trim()} onClick={save}><Check size={16} /> {editing ? "Save plant" : "Add plant"}</button>
      {editing && (
        <>
          <div className="ts-divider" />
          <button className="ts-btn ts-btn--danger ts-btn--block" onClick={del}><Trash2 size={15} /> Delete plant</button>
          <p style={{ fontSize: 11.5, color: "var(--ink2)", textAlign: "center", marginTop: 8, lineHeight: 1.5 }}>
            To keep history, set status to <b>Retired</b> instead of deleting.
          </p>
        </>
      )}
    </Modal>
  );
}

function ProfileModal({ ctx, close }) {
  const { data, patchProfile } = ctx;
  const [username, setUsername] = useState(data.profile.username);
  const [displayName, setDisplayName] = useState(data.profile.displayName);
  const [socialUrl, setSocialUrl] = useState(data.profile.socialUrl);
  const save = () => {
    patchProfile({
      username: username.trim().replace(/^@/, ""),
      displayName: displayName.trim(),
      socialUrl: socialUrl.trim(),
    });
    close();
  };
  return (
    <Modal title="Edit profile" onClose={close}>
      <Field label="Display name"><input className="ts-input" placeholder="Garden Boss" value={displayName} onChange={(e) => setDisplayName(e.target.value)} /></Field>
      <Field label="Username  /  unique, for friend requests"><input className="ts-input" placeholder="vine_boss" value={username} onChange={(e) => setUsername(e.target.value)} /></Field>
      <Field label="Social link  /  optional (Instagram, blog, etc.)"><input className="ts-input" placeholder="https://instagram.com/..." value={socialUrl} onChange={(e) => setSocialUrl(e.target.value)} /></Field>
      <button className="ts-btn ts-btn--primary ts-btn--block" onClick={save}><Check size={16} /> Save profile</button>
    </Modal>
  );
}

function SessionModal({ ctx, payload, close }) {
  const { data, upd, softDelete, setModal, showToast } = ctx;
  const session = data.sessions.find((s) => s.id === payload.id) || payload;
  const harvests = live(data.harvests).filter((h) => h.sessionId === session.id);
  const [date, setDate] = useState(session.harvestDate);

  const setCount = (hid, val) => upd("harvests", hid, { quantityCount: Math.max(0, val) });
  const delEntry = (h) => {
    const plant = data.plants.find((p) => p.id === h.plantId);
    softDelete("harvests", h.id);
    showToast(`Removed ${plant ? plant.plantLabel : "entry"}`, () => upd("harvests", h.id, { deletedAt: null }));
  };
  const delSession = () => {
    setModal({ type: "confirm", payload: {
      title: "Delete this session?",
      body: `All ${harvests.length} entries from ${fmtDate(session.harvestDate)} will be removed and analytics will recalculate.`,
      confirm: () => {
        softDelete("sessions", session.id);
        harvests.forEach((h) => softDelete("harvests", h.id));
        close();
      },
    } });
  };
  const saveDate = (v) => {
    setDate(v);
    upd("sessions", session.id, { harvestDate: v });
    harvests.forEach((h) => upd("harvests", h.id, { harvestDate: v }));
  };

  const total = harvests.reduce((a, h) => a + (h.quantityCount || 0), 0);
  return (
    <Modal title="Harvest session" onClose={close}>
      <Field label="Harvest date"><input className="ts-input" type="date" value={date} onChange={(e) => saveDate(e.target.value)} /></Field>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "4px 0 8px" }}>
        <span style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "var(--ink2)", fontWeight: 700 }}>Entries</span>
        <span style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>{total} total</span>
      </div>
      <div className="ts-card" style={{ padding: "4px 12px" }}>
        {harvests.length ? harvests.map((h) => {
          const p = data.plants.find((x) => x.id === h.plantId);
          return (
            <div key={h.id} className="ts-row">
              <div className="ts-row__main">
                <div className="ts-row__t" style={{ fontSize: 14 }}>{p ? p.plantLabel : "-"}</div>
                <div className="ts-row__s">{p ? p.variety : ""}{h.weightValue ? `  /  ${h.weightValue}${h.weightUnit}` : ""}{h.notes ? `  /  ${h.notes}` : ""}</div>
              </div>
              <div className="ts-stepper" style={{ transform: "scale(.78)", transformOrigin: "right center" }}>
                <button className="ts-step ts-step--minus" onClick={() => setCount(h.id, (h.quantityCount || 0) - 1)}><Minus size={20} /></button>
                <div className="ts-count" style={{ width: 48, fontSize: 24 }}>{h.quantityCount || 0}</div>
                <button className="ts-step ts-step--plus" onClick={() => setCount(h.id, (h.quantityCount || 0) + 1)}><Plus size={20} /></button>
              </div>
              <button className="ts-btn ts-btn--danger ts-btn--icon" style={{ marginLeft: 4 }} onClick={() => delEntry(h)}><Trash2 size={14} /></button>
            </div>
          );
        }) : <div style={{ color: "var(--ink2)", fontSize: 13, padding: "10px 0" }}>No entries left in this session.</div>}
      </div>
      <button className="ts-btn ts-btn--danger ts-btn--block" style={{ marginTop: 14 }} onClick={delSession}><Trash2 size={15} /> Delete whole session</button>
    </Modal>
  );
}
