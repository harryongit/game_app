"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Bomb, Gem, RefreshCw, Zap, TrendingUp, DollarSign, History, ChevronRight, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// ── Constants ──────────────────────────────────────────────────────────────────
const API_BASE = "/api-proxy";
const TOTAL_TILES = 25;
const PRESET_MINES = [1, 3, 5, 10, 24];
const QUICK_BETS = [10, 50, 100, 500];

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || localStorage.getItem("userToken");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  if (token) {
    return { "Content-Type": "application/json", "Authorization": `Bearer ${token}` };
  }
  return { "Content-Type": "application/json" };
}

// ── Multiplier formula (mirrors backend) ───────────────────────────────────────
function calcMultiplier(mineCount: number, gemsRevealed: number): number {
  const HOUSE_EDGE = 0.97;
  if (gemsRevealed <= 0) return 1.0;
  let mult = 1.0;
  for (let k = 0; k < gemsRevealed; k++) {
    const safe = TOTAL_TILES - mineCount - k;
    const total = TOTAL_TILES - k;
    if (safe <= 0 || total <= 0) break;
    mult *= total / safe;
  }
  return Math.round(mult * HOUSE_EDGE * 10000) / 10000;
}

// ── Types ──────────────────────────────────────────────────────────────────────
type TileState = "hidden" | "gem" | "mine" | "revealed_mine";
type GameStatus = "idle" | "active" | "won" | "lost" | "cashed_out";

interface HistoryItem {
  id: number;
  bet_amount: number;
  mine_count: number;
  gems_found: number;
  status: string;
  multiplier: number;
  payout: number;
  profit: number;
  created_at: string;
}

// ── MineTile component ─────────────────────────────────────────────────────────
function MineTile({
  index,
  state,
  onClick,
  disabled,
  isJustRevealed,
}: {
  index: number;
  state: TileState;
  onClick: () => void;
  disabled: boolean;
  isJustRevealed: boolean;
}) {
  const base =
    "relative w-full aspect-square rounded-xl cursor-pointer select-none transition-all duration-200 flex items-center justify-center overflow-hidden group";

  if (state === "hidden") {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${base} bg-white/5 border border-white/10 hover:bg-white/10 hover:border-neon-blue/40 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white/5`}
        style={{ boxShadow: disabled ? "none" : undefined }}
      >
        <span className="text-gray-500 text-xl font-bold group-hover:text-gray-300 transition-colors">?</span>
        {/* Hover glow */}
        {!disabled && (
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-neon-blue/5 to-transparent pointer-events-none" />
        )}
      </button>
    );
  }

  if (state === "gem") {
    return (
      <div
        className={`${base} bg-neon-emerald/10 border border-neon-emerald/40 cursor-default ${
          isJustRevealed ? "animate-[gemReveal_0.4s_ease-out]" : ""
        }`}
        style={{ boxShadow: "0 0 20px rgba(16, 185, 129, 0.3), inset 0 0 20px rgba(16, 185, 129, 0.05)" }}
      >
        <Gem className="w-7 h-7 text-neon-emerald drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        {isJustRevealed && (
          <div className="absolute inset-0 bg-neon-emerald/20 rounded-xl animate-ping" />
        )}
      </div>
    );
  }

  if (state === "mine") {
    return (
      <div
        className={`${base} bg-red-500/10 border border-red-500/40 cursor-default animate-[mineReveal_0.5s_ease-out]`}
        style={{ boxShadow: "0 0 25px rgba(239, 68, 68, 0.4), inset 0 0 20px rgba(239, 68, 68, 0.1)" }}
      >
        <Bomb className="w-7 h-7 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
        <div className="absolute inset-0 rounded-xl bg-red-500/5 animate-pulse" />
      </div>
    );
  }

  // revealed_mine (others exposed on loss)
  return (
    <div
      className={`${base} bg-red-500/5 border border-red-500/20 cursor-default opacity-60`}
    >
      <Bomb className="w-6 h-6 text-red-400/60" />
    </div>
  );
}

// ── MineGrid component ─────────────────────────────────────────────────────────
function MineGrid({
  tiles,
  onReveal,
  disabled,
  lastRevealed,
}: {
  tiles: TileState[];
  onReveal: (index: number) => void;
  disabled: boolean;
  lastRevealed: number | null;
}) {
  return (
    <div className="grid grid-cols-5 gap-2 p-4">
      {tiles.map((state, i) => (
        <MineTile
          key={i}
          index={i}
          state={state}
          onClick={() => onReveal(i)}
          disabled={disabled || state !== "hidden"}
          isJustRevealed={i === lastRevealed}
        />
      ))}
    </div>
  );
}

// ── MultiplierTrack component ──────────────────────────────────────────────────
function MultiplierTrack({ mineCount, gemsRevealed }: { mineCount: number; gemsRevealed: number }) {
  const steps = Math.min(4, TOTAL_TILES - mineCount);
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
      {Array.from({ length: steps }, (_, i) => {
        const gems = i + 1;
        const mult = calcMultiplier(mineCount, gems);
        const isActive = gems <= gemsRevealed;
        const isCurrent = gems === gemsRevealed;
        return (
          <React.Fragment key={i}>
            <div
              className={`flex-shrink-0 text-center px-3 py-2 rounded-lg border transition-all ${
                isCurrent
                  ? "bg-neon-emerald/15 border-neon-emerald/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                  : isActive
                  ? "bg-white/5 border-white/10"
                  : "bg-white/[0.02] border-white/5 opacity-50"
              }`}
            >
              <div className="text-[10px] text-gray-400 mb-0.5">{gems} {gems === 1 ? "gem" : "gems"}</div>
              <div className={`text-sm font-bold ${isCurrent ? "text-neon-emerald" : isActive ? "text-white" : "text-gray-500"}`}>
                x{mult.toFixed(2)}
              </div>
            </div>
            {i < steps - 1 && (
              <ChevronRight className="w-3 h-3 text-gray-600 flex-shrink-0" />
            )}
          </React.Fragment>
        );
      })}
      {TOTAL_TILES - mineCount > 4 && (
        <div className="text-gray-600 text-xs flex-shrink-0 pl-1">…</div>
      )}
    </div>
  );
}

// ── Main BoomMine Page ─────────────────────────────────────────────────────────
export default function BoomMinePage() {
  // Game state
  const [gameStatus, setGameStatus] = useState<GameStatus>("idle");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [tiles, setTiles] = useState<TileState[]>(Array(25).fill("hidden"));
  const [revealedCount, setRevealedCount] = useState(0);
  const [lastRevealed, setLastRevealed] = useState<number | null>(null);
  const [multiplier, setMultiplier] = useState(1.0);
  const [nextMultiplier, setNextMultiplier] = useState(1.0);
  const [potentialPayout, setPotentialPayout] = useState(0);
  const [profit, setProfit] = useState(0);

  // Bet panel state
  const [betAmount, setBetAmount] = useState(100);
  const [mineCount, setMineCount] = useState(3);
  const [balance, setBalance] = useState(0);

  // History
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Loading states
  const [isStarting, setIsStarting] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isCashingOut, setIsCashingOut] = useState(false);

  const betInputRef = useRef<HTMLInputElement>(null);

  // ── Load balance & restore session on mount ─────────────────────────────────
  useEffect(() => {
    fetchBalance();
    restoreSession();
    fetchHistory();
  }, []);

  async function fetchBalance() {
    try {
      const res = await fetch(`${API_BASE}/balance`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setBalance(data.balance || 0);
      }
    } catch {}
  }

  async function restoreSession() {
    try {
      const res = await fetch(`${API_BASE}/boommine/session`, { headers: authHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      if (data.status === "active" && data.session_id) {
        setSessionId(data.session_id);
        setGameStatus("active");
        const newTiles = Array(25).fill("hidden") as TileState[];
        (data.revealed_tiles || []).forEach((idx: number) => {
          newTiles[idx] = "gem";
        });
        setTiles(newTiles);
        setRevealedCount((data.revealed_tiles || []).length);
        setMultiplier(data.multiplier || 1.0);
        setNextMultiplier(data.next_multiplier || 1.0);
        setPotentialPayout(data.potential_payout || 0);
        setMineCount(data.mine_count || 3);
        setBetAmount(data.bet_amount || 100);
      }
    } catch {}
  }

  async function fetchHistory() {
    try {
      const res = await fetch(`${API_BASE}/boommine/history?limit=15`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setHistory(data || []);
      }
    } catch {}
  }

  // ── Start game ──────────────────────────────────────────────────────────────
  async function startGame() {
    if (isStarting) return;
    if (betAmount <= 0) { toast.error("Enter a valid bet amount"); return; }
    if (betAmount > balance) { toast.error("Insufficient balance"); return; }

    setIsStarting(true);
    try {
      const res = await fetch(`${API_BASE}/boommine/start`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ bet_amount: betAmount, mine_count: mineCount }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed to start game"); return; }

      setSessionId(data.session_id);
      setGameStatus("active");
      setTiles(Array(25).fill("hidden"));
      setRevealedCount(0);
      setLastRevealed(null);
      setMultiplier(1.0);
      setNextMultiplier(data.next_multiplier || calcMultiplier(mineCount, 1));
      setPotentialPayout(0);
      setProfit(0);
      fetchBalance();
    } catch (e: any) {
      toast.error(e.message || "Network error");
    } finally {
      setIsStarting(false);
    }
  }

  // ── Reveal tile ─────────────────────────────────────────────────────────────
  const revealTile = useCallback(async (index: number) => {
    if (!sessionId || gameStatus !== "active" || isRevealing) return;

    setIsRevealing(true);
    setLastRevealed(index);
    try {
      const res = await fetch(`${API_BASE}/boommine/reveal`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ session_id: sessionId, tile_index: index }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Error"); return; }

      if (data.is_mine) {
        // BOOM! Reveal all mines
        const newTiles = [...tiles];
        newTiles[index] = "mine";
        (data.mine_positions || []).forEach((mIdx: number) => {
          if (mIdx !== index && newTiles[mIdx] !== "gem") {
            newTiles[mIdx] = "revealed_mine";
          }
        });
        setTiles(newTiles);
        setGameStatus("lost");
        toast.error("💥 BOOM! You hit a mine!", { duration: 3000 });
        fetchHistory();
        fetchBalance();
      } else {
        const newTiles = [...tiles];
        newTiles[index] = "gem";
        setTiles(newTiles);
        const newCount = revealedCount + 1;
        setRevealedCount(newCount);
        setMultiplier(data.multiplier);
        setNextMultiplier(data.next_multiplier || calcMultiplier(mineCount, newCount + 1));
        setPotentialPayout(data.potential_payout || 0);
        setProfit(data.potential_payout - betAmount);

        if (data.game_status === "won") {
          setGameStatus("won");
          // Reveal all mines
          if (data.mine_positions) {
            const finalTiles = [...newTiles];
            data.mine_positions.forEach((mIdx: number) => {
              finalTiles[mIdx] = "revealed_mine";
            });
            setTiles(finalTiles);
          }
          toast.success(`🏆 You cleared the board! x${data.multiplier.toFixed(2)}`, { duration: 4000 });
          fetchHistory();
          fetchBalance();
        }
      }
    } catch (e: any) {
      toast.error(e.message || "Network error");
    } finally {
      setIsRevealing(false);
    }
  }, [sessionId, gameStatus, isRevealing, tiles, revealedCount, mineCount, betAmount]);

  // ── Cash out ────────────────────────────────────────────────────────────────
  async function cashOut() {
    if (!sessionId || gameStatus !== "active" || isCashingOut) return;
    if (revealedCount === 0) { toast.error("Reveal at least one tile first!"); return; }

    setIsCashingOut(true);
    try {
      const res = await fetch(`${API_BASE}/boommine/cashout`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ session_id: sessionId }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Cash out failed"); return; }

      // Reveal mines on cash out
      if (data.mine_positions) {
        const newTiles = [...tiles];
        data.mine_positions.forEach((mIdx: number) => {
          if (newTiles[mIdx] !== "gem") newTiles[mIdx] = "revealed_mine";
        });
        setTiles(newTiles);
      }
      setMultiplier(data.multiplier);
      setProfit(data.profit);
      setGameStatus("cashed_out");
      toast.success(`💰 Cashed out ₹${data.payout.toLocaleString()} at x${data.multiplier.toFixed(2)}!`, { duration: 4000 });
      fetchHistory();
      fetchBalance();
    } catch (e: any) {
      toast.error(e.message || "Network error");
    } finally {
      setIsCashingOut(false);
    }
  }

  // ── New game ────────────────────────────────────────────────────────────────
  function resetGame() {
    setGameStatus("idle");
    setSessionId(null);
    setTiles(Array(25).fill("hidden"));
    setRevealedCount(0);
    setLastRevealed(null);
    setMultiplier(1.0);
    setNextMultiplier(calcMultiplier(mineCount, 1));
    setPotentialPayout(0);
    setProfit(0);
    fetchBalance();
  }

  // ── Preview next multiplier on hover ────────────────────────────────────────
  const previewMult = calcMultiplier(mineCount, 1);

  const isGameActive = gameStatus === "active";
  const isGameOver = gameStatus === "lost" || gameStatus === "won" || gameStatus === "cashed_out";

  return (
    <>
      <style>{`
        @keyframes gemReveal {
          0% { transform: scale(0.3) rotate(-10deg); opacity: 0; }
          60% { transform: scale(1.15) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes mineReveal {
          0% { transform: scale(0.5); opacity: 0; }
          40% { transform: scale(1.2); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes cashOutGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(16,185,129,0.4); }
          50% { box-shadow: 0 0 40px rgba(16,185,129,0.8); }
        }
      `}</style>

      <div className="space-y-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Bomb className="w-8 h-8 text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]" />
              BoomMine
            </h1>
            <p className="text-gray-400 text-sm mt-1">Pick gems, avoid the mines. Cash out anytime.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass-panel px-4 py-2 rounded-xl border border-white/10 text-sm">
              <span className="text-gray-400 mr-2">Balance</span>
              <span className="text-white font-bold">₹{balance.toLocaleString()}</span>
            </div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2.5 rounded-xl border transition-colors ${showHistory ? "border-neon-blue/40 bg-neon-blue/10 text-neon-blue" : "border-white/10 bg-white/5 text-gray-400 hover:text-white"}`}
            >
              <History className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* ── Bet Panel ──────────────────────────────────────────────────── */}
          <div className="w-full lg:w-72 flex-shrink-0 space-y-4">
            <div className="glass-panel rounded-2xl border border-white/10 p-5 space-y-5">
              {/* Bet Amount */}
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2 block">Bet Amount (₹)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    ref={betInputRef}
                    type="number"
                    min={1}
                    value={betAmount}
                    onChange={(e) => setBetAmount(Math.max(1, parseInt(e.target.value) || 0))}
                    disabled={isGameActive}
                    className="w-full pl-9 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white font-bold text-lg focus:outline-none focus:border-neon-blue/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="grid grid-cols-4 gap-1.5 mt-2">
                  <button onClick={() => setBetAmount(v => Math.max(1, Math.floor(v / 2)))} disabled={isGameActive}
                    className="py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors disabled:opacity-40">½</button>
                  <button onClick={() => setBetAmount(v => v * 2)} disabled={isGameActive}
                    className="py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors disabled:opacity-40">2×</button>
                  <button onClick={() => setBetAmount(Math.floor(balance / 2))} disabled={isGameActive}
                    className="py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors disabled:opacity-40">½ Bal</button>
                  <button onClick={() => setBetAmount(balance)} disabled={isGameActive}
                    className="py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors disabled:opacity-40">Max</button>
                </div>
                <div className="grid grid-cols-4 gap-1.5 mt-1.5">
                  {QUICK_BETS.map(v => (
                    <button key={v} onClick={() => setBetAmount(v)} disabled={isGameActive}
                      className="py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors disabled:opacity-40">₹{v}</button>
                  ))}
                </div>
              </div>

              {/* Mine Count */}
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2 block">
                  Mines — <span className="text-red-400">{mineCount}</span> / 24
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_MINES.map(v => (
                    <button
                      key={v}
                      onClick={() => { setMineCount(v); setNextMultiplier(calcMultiplier(v, 1)); }}
                      disabled={isGameActive}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all border disabled:opacity-40 ${
                        mineCount === v
                          ? "bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                          : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                  <input
                    type="number" min={1} max={24}
                    value={mineCount}
                    onChange={(e) => { const v = Math.max(1, Math.min(24, parseInt(e.target.value) || 1)); setMineCount(v); }}
                    disabled={isGameActive}
                    className="w-14 px-2 py-1.5 bg-black/50 border border-white/10 rounded-lg text-white text-sm text-center focus:outline-none focus:border-neon-blue/50 disabled:opacity-40"
                  />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Safe tiles: <span className="text-gray-300 font-bold">{TOTAL_TILES - mineCount}</span> · 1st gem: <span className="text-neon-emerald font-bold">x{calcMultiplier(mineCount, 1).toFixed(2)}</span>
                </div>
              </div>

              {/* Multiplier / Profit display when active */}
              {isGameActive && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-neon-emerald/5 border border-neon-emerald/20 rounded-xl p-3">
                    <div className="text-xs text-gray-400 mb-1">Multiplier</div>
                    <div className="text-xl font-black text-neon-emerald">x{multiplier.toFixed(2)}</div>
                  </div>
                  <div className={`border rounded-xl p-3 ${profit >= 0 ? "bg-neon-emerald/5 border-neon-emerald/20" : "bg-red-500/5 border-red-500/20"}`}>
                    <div className="text-xs text-gray-400 mb-1">Profit</div>
                    <div className={`text-xl font-black ${profit >= 0 ? "text-neon-emerald" : "text-red-400"}`}>
                      {profit >= 0 ? "+" : ""}₹{profit.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {/* Potential payout */}
              {isGameActive && revealedCount > 0 && (
                <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-400 mb-1">Cash Out Value</div>
                  <div className="text-2xl font-black text-white">₹{potentialPayout.toLocaleString()}</div>
                  <div className="text-xs text-neon-emerald mt-1">Next: x{nextMultiplier.toFixed(2)}</div>
                </div>
              )}

              {/* Game outcome panel */}
              {isGameOver && gameStatus === "cashed_out" && (
                <div className="bg-neon-emerald/10 border border-neon-emerald/30 rounded-xl p-4 text-center" style={{ animation: "cashOutGlow 1.5s ease-in-out 3" }}>
                  <Sparkles className="w-6 h-6 text-neon-emerald mx-auto mb-2" />
                  <div className="text-sm text-gray-300 mb-1">Cashed Out!</div>
                  <div className="text-3xl font-black text-neon-emerald">x{multiplier.toFixed(2)}</div>
                  <div className="text-sm text-gray-400 mt-1">+₹{profit.toLocaleString()}</div>
                </div>
              )}
              {isGameOver && gameStatus === "lost" && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
                  <Bomb className="w-6 h-6 text-red-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-300">You hit a mine!</div>
                  <div className="text-3xl font-black text-red-400 mt-1">-₹{betAmount.toLocaleString()}</div>
                </div>
              )}
              {isGameOver && gameStatus === "won" && (
                <div className="bg-neon-emerald/10 border border-neon-emerald/30 rounded-xl p-4 text-center">
                  <Sparkles className="w-6 h-6 text-neon-emerald mx-auto mb-2" />
                  <div className="text-sm text-gray-300">Board Cleared!</div>
                  <div className="text-3xl font-black text-neon-emerald mt-1">x{multiplier.toFixed(2)}</div>
                </div>
              )}

              {/* Action buttons */}
              {!isGameActive && !isGameOver && (
                <button
                  onClick={startGame}
                  disabled={isStarting || betAmount <= 0 || betAmount > balance}
                  className="w-full py-4 rounded-xl font-black text-black text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 0 20px rgba(16,185,129,0.4)" }}
                >
                  {isStarting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                  {isStarting ? "Starting…" : "PLAY"}
                </button>
              )}

              {isGameActive && revealedCount > 0 && (
                <button
                  onClick={cashOut}
                  disabled={isCashingOut}
                  className="w-full py-4 rounded-xl font-black text-black text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 0 20px rgba(16,185,129,0.4)" }}
                >
                  {isCashingOut ? <RefreshCw className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5" />}
                  {isCashingOut ? "Processing…" : `CASH OUT ₹${potentialPayout.toLocaleString()}`}
                </button>
              )}

              {isGameOver && (
                <button
                  onClick={resetGame}
                  className="w-full py-4 rounded-xl font-black text-white text-lg transition-all flex items-center justify-center gap-2 bg-white/10 border border-white/20 hover:bg-white/15"
                >
                  <RefreshCw className="w-5 h-5" /> NEW GAME
                </button>
              )}
            </div>
          </div>

          {/* ── Game Grid + History ─────────────────────────────────────────── */}
          <div className="flex-1 space-y-4">
            {/* Grid Panel */}
            <div className={`glass-panel rounded-2xl border overflow-hidden transition-all ${
              gameStatus === "lost" ? "border-red-500/30" : gameStatus === "cashed_out" || gameStatus === "won" ? "border-neon-emerald/30" : "border-white/10"
            }`}>
              {/* Status bar */}
              <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                <div className="text-sm font-bold text-gray-400">
                  {gameStatus === "idle" && "Select mines & click PLAY to start"}
                  {gameStatus === "active" && (revealedCount === 0 ? "Click any tile to reveal it" : `${revealedCount} gem${revealedCount > 1 ? "s" : ""} found — keep going or cash out!`)}
                  {gameStatus === "lost" && "💥 Mine hit — better luck next round!"}
                  {gameStatus === "won" && "🏆 Board cleared! Maximum winnings!"}
                  {gameStatus === "cashed_out" && "💰 Cashed out successfully!"}
                </div>
                {isGameActive && (
                  <div className="flex items-center gap-1.5 text-neon-emerald text-xs font-bold bg-neon-emerald/10 px-2 py-1 rounded-full border border-neon-emerald/20">
                    <div className="w-1.5 h-1.5 bg-neon-emerald rounded-full animate-pulse" />
                    LIVE
                  </div>
                )}
              </div>

              <MineGrid
                tiles={tiles}
                onReveal={revealTile}
                disabled={!isGameActive || isRevealing}
                lastRevealed={lastRevealed}
              />

              {/* Multiplier track */}
              {(isGameActive || isGameOver) && revealedCount > 0 && (
                <div className="px-4 pb-4">
                  <MultiplierTrack mineCount={mineCount} gemsRevealed={revealedCount} />
                </div>
              )}
            </div>

            {/* History Panel */}
            {showHistory && (
              <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <History className="w-4 h-4 text-neon-blue" /> Recent Games
                  </h3>
                  <button onClick={fetchHistory} className="text-gray-500 hover:text-white transition-colors">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                <div className="divide-y divide-white/5 max-h-64 overflow-y-auto custom-scrollbar">
                  {history.length === 0 ? (
                    <div className="py-8 text-center text-gray-500 text-sm">No games yet</div>
                  ) : (
                    history.map(item => (
                      <div key={item.id} className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm ${
                            item.status === "cashed_out" || item.status === "won" ? "bg-neon-emerald/15 text-neon-emerald" : "bg-red-500/15 text-red-400"
                          }`}>
                            {item.status === "cashed_out" || item.status === "won" ? <Gem className="w-4 h-4" /> : <Bomb className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="text-sm text-white font-medium">₹{item.bet_amount.toLocaleString()} · {item.mine_count} mines</div>
                            <div className="text-xs text-gray-500">{item.gems_found} gems · x{item.multiplier.toFixed(2)}</div>
                          </div>
                        </div>
                        <div className={`text-sm font-bold ${item.profit >= 0 ? "text-neon-emerald" : "text-red-400"}`}>
                          {item.profit >= 0 ? "+" : ""}₹{item.profit.toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Info card — how multipliers work */}
            {gameStatus === "idle" && (
              <div className="glass-panel rounded-2xl border border-white/5 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-neon-blue mt-0.5 shrink-0" />
                  <div className="text-xs text-gray-400 leading-relaxed">
                    <span className="text-white font-semibold">How to play: </span>
                    Set your bet and number of mines, then click Play. Reveal tiles — each gem increases your multiplier. Hit a mine and lose your bet. Cash Out before hitting a mine to collect your winnings.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
