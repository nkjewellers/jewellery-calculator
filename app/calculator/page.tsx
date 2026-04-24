"use client";

import { useState } from "react";
import Image from "next/image";

export default function Calculator() {

  const [rate24, setRate24] = useState(0);
  const [carat, setCarat] = useState(22);

  const [gross, setGross] = useState(0);
  const [stone, setStone] = useState(0);

  const [diamondCt, setDiamondCt] = useState(0);
  const [diamondCode, setDiamondCode] = useState("");
  const [diamondProfit, setDiamondProfit] = useState(0);

  const [polish, setPolish] = useState(0);
  const [polishType, setPolishType] = useState("percent");

  const [making, setMaking] = useState(0);
  const [makingType, setMakingType] = useState("perGram");

  const [history, setHistory] = useState<{ price: number, wt: number, ct: number }[]>([]);

  // ✅ TERA % SYSTEM
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

  // 💎 DIAMOND CALC
  const map: Record<string, number> = {
    k: 1, g: 2, c: 3, h: 4, o: 5, i: 6, t: 7, r: 8, a: 9, m: 0,
  };

  let num = "";
  for (let ch of diamondCode.toLowerCase()) {
    if (map[ch] != undefined) num += map[ch];
  }

  const diamondRate = num ? parseInt(num + "00") : 0;
  const diamondTotal = diamondRate * diamondCt + diamondProfit;

  // 🧽 POLISH
  const polishValue =
    polishType === "percent"
      ? (net * polish) / 100
      : polishType === "perGram"
      ? polish * net
      : polish;

  // 🪙 GOLD
  const goldValue = (net + polishValue) * getRate(carat);

  // ⚒️ MAKING
  let makingValue = 0;
  if (makingType === "perGram") makingValue = net * making;
  else if (makingType === "percent") makingValue = (goldValue * making) / 100;
  else makingValue = making;

  const total = goldValue + makingValue + diamondTotal;
  const gst = total * 0.03;
  const final = total + gst;

  const resetAll = () => {
    setGross(0);
    setStone(0);
    setDiamondCt(0);
    setDiamondCode("");
    setDiamondProfit(0);
    setPolish(0);
    setMaking(0);
  };

  const saveHistory = () => {
    setHistory([{ price: final, wt: gross, ct: carat }, ...history.slice(0, 4)]);
  };

  // 🖨️ PRINT / SHARE
  const handlePrint = async () => {
    const text = `
NK JEWELLERS
------------------------
Wt: ${gross}g
Gold: ₹${goldValue.toFixed(0)}
Diamond: ₹${diamondTotal.toFixed(0)}
Making: ₹${makingValue.toFixed(0)}
------------------------
TOTAL: ₹${total.toFixed(0)}
GST: ₹${gst.toFixed(0)}
FINAL: ₹${final.toFixed(0)}
`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Bill", text });
        return;
      } catch {}
    }

    const win = window.open("", "", "width=300,height=600");
    if (win) {
      win.document.write(`<pre>${text}</pre>`);
      win.document.close();
      win.print();
    }
  };

  const handlePDF = () => {
    alert("PDF coming soon");
  };

  return (
    <div style={{ padding: 16, maxWidth: 420, margin: "auto" }}>

      <Image src="/logo.png" alt="logo" width={200} height={120} style={{ display: "block", margin: "auto" }} />

      <h2 style={{ textAlign: "center" }}>Jewellery Calculator</h2>

      <p>24K Gold Rate</p>
      <input type="number" value={rate24 || ""} onChange={(e) => setRate24(Number(e.target.value) || 0)} />

      <p>Select Gold Purity</p>
      <div style={{ display: "flex", gap: 5 }}>
        {[24,22,20,18,14].map(c=>(
          <button key={c}
            onClick={()=>setCarat(c)}
            style={{
              flex:1,
              padding:10,
              background:carat===c?"black":"#ddd",
              color:carat===c?"white":"black"
            }}>
            {c}K
          </button>
        ))}
      </div>

      {/* ✅ CT PRICES */}
      <div style={{ display:"flex", marginTop:5 }}>
        {[24,22,20,18,14].map(c=>(
          <div key={c} style={{ flex:1, textAlign:"center" }}>
            ₹{purityRates[c as keyof typeof purityRates]}
          </div>
        ))}
      </div>

      <p>Gross</p>
      <input value={gross||""} onChange={(e)=>setGross(Number(e.target.value)||0)} />

      <p>Stone</p>
      <input value={stone||""} onChange={(e)=>setStone(Number(e.target.value)||0)} />

      <p>Diamond Ct</p>
      <input value={diamondCt||""} onChange={(e)=>setDiamondCt(Number(e.target.value)||0)} />

      <p>Diamond Code</p>
      <input value={diamondCode} onChange={(e)=>setDiamondCode(e.target.value)} />

      <p>Diamond Profit</p>
      <input value={diamondProfit||""} onChange={(e)=>setDiamondProfit(Number(e.target.value)||0)} />

      <p>Polish</p>
      <input value={polish||""} onChange={(e)=>setPolish(Number(e.target.value)||0)} />
      <select value={polishType} onChange={(e)=>setPolishType(e.target.value)}>
        <option value="percent">%</option>
        <option value="perGram">Per Gram</option>
        <option value="flat">Flat</option>
      </select>

      <p>Making</p>
      <input value={making||""} onChange={(e)=>setMaking(Number(e.target.value)||0)} />
      <select value={makingType} onChange={(e)=>setMakingType(e.target.value)}>
        <option value="percent">%</option>
        <option value="perGram">Per Gram</option>
        <option value="flat">Flat</option>
      </select>

      {/* ✅ PRICE PREVIEW */}
      <div style={{ background:"black", color:"white", padding:10, marginTop:10 }}>
        <p>Without GST: ₹{total.toFixed(0)}</p>
        <h2>With GST: ₹{final.toFixed(0)}</h2>
      </div>

      <button onClick={saveHistory}>Save</button>
      <button onClick={resetAll}>Reset</button>
      <button onClick={handlePrint}>Print</button>
      <button onClick={handlePDF}>PDF</button>

      <h3>Last 5 Transactions</h3>
      {history.map((h,i)=>(
        <p key={i}>{h.price} | {h.wt}gm | {h.ct}K</p>
      ))}

    </div>
  );
}