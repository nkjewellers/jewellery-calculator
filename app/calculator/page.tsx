"use client";

import { useState } from "react";
import Image from "next/image";

export default function Calculator() {

  const [rate24, setRate24] = useState(0);
  const [carat, setCarat] = useState(22);

  const [gross, setGross] = useState(0);
  const [stone, setStone] = useState(0);
  const [making, setMaking] = useState(0);

  const [history, setHistory] = useState<{ price: number, wt: number, ct: number }[]>([]);

  // 🔥 ONLY THIS PART CHANGED (92 / 84 / 76 / 60)
  const purityRates = {
    24: rate24,
    22: Math.round(rate24 * 0.92),
    20: Math.round(rate24 * 0.84),
    18: Math.round(rate24 * 0.76),
    14: Math.round(rate24 * 0.60),
  };

  const getRate = (ct: number) =>
    purityRates[ct as keyof typeof purityRates] || 0;

  const net = Math.max(0, gross - stone);

  const goldValue = net * getRate(carat);
  const makingValue = making * net;

  const total = goldValue + makingValue;
  const gst = total * 0.03;
  const final = total + gst;

  const resetAll = () => {
    setGross(0);
    setStone(0);
    setMaking(0);
  };

  const saveHistory = () => {
    setHistory([{ price: final, wt: gross, ct: carat }, ...history.slice(0, 4)]);
  };

  return (
    <div style={{ padding: 16, maxWidth: 420, margin: "auto" }}>

      <Image src="/logo.png" alt="logo" width={200} height={120} style={{ display: "block", margin: "auto" }} />

      <h2 style={{ textAlign: "center" }}>Jewellery Calculator</h2>

      <p>24K Gold Rate</p>
      <input
        type="number"
        value={rate24 || ""}
        onChange={(e) => setRate24(Number(e.target.value) || 0)}
        style={{ width: "100%", padding: 10 }}
      />

      <p>Select Gold Purity</p>
      <div style={{ display: "flex", gap: 5 }}>
        {[24, 22, 20, 18, 14].map((c) => (
          <button key={c}
            onClick={() => setCarat(c)}
            style={{
              flex: 1,
              padding: 10,
              background: carat === c ? "black" : "#ddd",
              color: carat === c ? "white" : "black"
            }}>
            {c}K
          </button>
        ))}
      </div>

      {/* ✅ CT PRICE ROW */}
      <div style={{ display: "flex", marginTop: 5 }}>
        {[24, 22, 20, 18, 14].map((c) => (
          <div key={c} style={{ flex: 1, textAlign: "center", fontSize: 12 }}>
            ₹{purityRates[c as keyof typeof purityRates] || 0}
          </div>
        ))}
      </div>

      <p>Gross Weight (gm)</p>
      <input
        value={gross || ""}
        onChange={(e) => setGross(Number(e.target.value) || 0)}
        style={{ width: "100%", padding: 10 }}
      />

      <p>Stone Weight (gm)</p>
      <input
        value={stone || ""}
        onChange={(e) => setStone(Number(e.target.value) || 0)}
        style={{ width: "100%", padding: 10 }}
      />

      <p>Making (per gm)</p>
      <input
        value={making || ""}
        onChange={(e) => setMaking(Number(e.target.value) || 0)}
        style={{ width: "100%", padding: 10 }}
      />

      {/* ✅ PRICE PREVIEW */}
      <div style={{ marginTop: 20, padding: 12, background: "#111", color: "#fff" }}>
        <p>Gold Value: ₹{goldValue.toFixed(0)}</p>
        <p>Making: ₹{makingValue.toFixed(0)}</p>
        <hr />
        <p>Without GST: ₹{total.toFixed(0)}</p>
        <h2>With GST: ₹{final.toFixed(0)}</h2>
      </div>

      <button onClick={saveHistory}
        style={{ width: "100%", background: "green", color: "white", padding: 12, marginTop: 10 }}>
        Save
      </button>

      <button onClick={resetAll}
        style={{ width: "100%", background: "red", color: "white", padding: 12 }}>
        Reset
      </button>

      <h3>Last 5 Transactions</h3>
      {history.map((h, i) => (
        <p key={i}>{h.price} | {h.wt}gm | {h.ct}K</p>
      ))}

    </div>
  );
}