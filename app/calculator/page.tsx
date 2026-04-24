"use client";

import { useState } from "react";

export default function Calculator() {

  const [rate24, setRate24] = useState(1000);
  const [carat, setCarat] = useState(14);

  const [gross, setGross] = useState(0);
  const [stone, setStone] = useState(0);

  const [diamondCt, setDiamondCt] = useState(0);
  const [diamondCode, setDiamondCode] = useState("");
  const [diamondProfit, setDiamondProfit] = useState(0);

  const [making, setMaking] = useState(0);
  const [polish, setPolish] = useState(0);

  const [history, setHistory] = useState<any[]>([]);

  // GOLD RATE
  const getRate = (ct: number) => {
    const map: any = {
      24: 1,
      22: 0.92,
      20: 0.84,
      18: 0.76,
      14: 0.60
    };
    return rate24 * map[ct];
  };

  // KGCHOITRAM
  const map: any = {
    k:1,g:2,c:3,h:4,o:5,i:6,t:7,r:8,a:9,m:0
  };

  const getDiamondRate = (code: string) => {
    if (!code) return 0;
    const num = code.toLowerCase().split("").map(c => map[c] ?? "").join("");
    return Number(num) * 100;
  };

  const diamondRate = getDiamondRate(diamondCode);

  // WEIGHTS
  const diamondWt = diamondCt * 0.2;
  const net = gross - stone - diamondWt;

  // VALUES
  const goldValue = net * getRate(carat);
  const diamondTotal = diamondCt * diamondRate + diamondProfit;

  const makingPolish = making + polish;

  const total = goldValue + diamondTotal + makingPolish;
  const gst = total * 0.03;
  const final = total + gst;

  // SAVE HISTORY
  const saveHistory = () => {
    const newEntry = {
      price: final,
      wt: gross,
      ct: carat
    };
    setHistory([newEntry, ...history.slice(0,9)]);
  };

  // 🔴 RESET FUNCTION (IMPORTANT)
  const resetAll = () => {
    setGross(0);
    setStone(0);
    setDiamondCt(0);
    setDiamondCode("");
    setDiamondProfit(0);
    setMaking(0);
    setPolish(0);
    // ❗ rate24 & price untouched
  };

  // PRINT
  const handlePrint = () => {
    const text = `
ROUGH ESTIMATE
----------------------------
GWT: ${gross}g
NWT: ${net.toFixed(3)}g

Gold:
${net.toFixed(3)} × ${getRate(carat).toFixed(0)} = ₹${goldValue.toFixed(0)}

Diamond:
${diamondCt} × ${diamondRate} = ₹${diamondTotal.toFixed(0)}

Making+Polish: ₹${makingPolish}

----------------------------
TOTAL: ₹${total.toFixed(0)}
GST: ₹${gst.toFixed(0)}
FINAL: ₹${final.toFixed(0)}

THIS IS NOT A BILL
`;

    const win = window.open("", "", "width=300,height=600");
    if (win) {
      win.document.write(`<pre>${text}</pre>`);
      win.document.close();
      win.print();
    }
  };

  return (
    <div style={{ padding: 16, maxWidth: 420, margin: "auto" }}>

      <h2>Jewellery Calculator</h2>

      <p>24K Gold Rate</p>
      <input type="number" value={rate24} onChange={(e)=>setRate24(Number(e.target.value))} />

      <p>Select Gold Purity</p>
      <div style={{display:"flex"}}>
        {[24,22,20,18,14].map(c=>(
          <button key={c} onClick={()=>setCarat(c)}>
            {c}K
          </button>
        ))}
      </div>

      <p>Gross Weight</p>
      <input type="number" step="0.001" value={gross||""} onChange={(e)=>setGross(parseFloat(e.target.value)||0)} />

      <p>Stone</p>
      <input type="number" step="0.001" value={stone||""} onChange={(e)=>setStone(parseFloat(e.target.value)||0)} />

      <p>Diamond Ct</p>
      <input type="number" value={diamondCt||""} onChange={(e)=>setDiamondCt(Number(e.target.value)||0)} />

      <p>Diamond Code</p>
      <input value={diamondCode} onChange={(e)=>setDiamondCode(e.target.value)} />

      <p>Diamond Profit</p>
      <input type="number" value={diamondProfit||""} onChange={(e)=>setDiamondProfit(Number(e.target.value)||0)} />

      <p>Making</p>
      <input type="number" value={making||""} onChange={(e)=>setMaking(Number(e.target.value)||0)} />

      <p>Polish</p>
      <input type="number" value={polish||""} onChange={(e)=>setPolish(Number(e.target.value)||0)} />

      <hr />

      <p>Gross: {gross}g</p>
      <p>Net: {net.toFixed(3)}g</p>

      <p>Without GST: ₹{total.toFixed(0)}</p>
      <h2>With GST: ₹{final.toFixed(0)}</h2>

      {/* 🔥 BUTTONS */}
      <button onClick={saveHistory} style={{background:"green",color:"white",width:"100%",marginTop:10}}>
        Save
      </button>

      <button onClick={resetAll} style={{background:"red",color:"white",width:"100%",marginTop:10}}>
        Reset
      </button>

      <button onClick={handlePrint} style={{width:"100%",marginTop:10}}>
        Print
      </button>

      <h3>Last 10 Transactions</h3>
      {history.map((h,i)=>(
        <p key={i}>₹{h.price} | {h.wt}g | {h.ct}K</p>
      ))}

    </div>
  );
}