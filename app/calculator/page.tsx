"use client";

import { useState, useEffect } from "react";
import jsPDF from "jspdf";
export default function Calculator() {

  const [rate24, setRate24] = useState(1000);
  const [carat, setCarat] = useState(14);

  const [gross, setGross] = useState(0);
  const [stone, setStone] = useState(0);
  const [customerName, setCustomerName] = useState("");
const [mobile, setMobile] = useState("");

  const [diamondCt, setDiamondCt] = useState(0);
  const [diamondCode, setDiamondCode] = useState("");
  const [diamondProfit, setDiamondProfit] = useState(0);

  const [making, setMaking] = useState(0);
  const [polish, setPolish] = useState(0);
  const [makingType, setMakingType] = useState("pergram");
  const [polishType, setPolishType] = useState("pergram");

  const [history, setHistory] = useState<any[]>([]);
  const [estimates, setEstimates] = useState<any[]>([]);
  const [selectedEstimate, setSelectedEstimate] = useState<any>(null);
  const [itemImage, setItemImage] = useState<string | null>(null);
  useEffect(() => {
  const data = JSON.parse(localStorage.getItem("estimates") || "[]");
  setEstimates(data);
}, []);

  // GOLD RATE
const getRate = (ct: number) => {
  const perGram24 = rate24 / 10; // ⭐ MAIN FIX

  const map: any = {
    24: 1,
    22: 0.92,
    20: 0.84,
    18: 0.76,
    14: 0.60
  };

  return perGram24 * map[ct];
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

let makingValue = 0;
let polishValue = 0;

// MAKING
if (makingType === "pergram") {
  makingValue = making * gross;
} else if (makingType === "percent") {
  makingValue = (goldValue * making) / 100;
} else {
  makingValue = making;
}

// POLISH
if (polishType === "pergram") {
  polishValue = polish * gross;
} else if (polishType === "percent") {
  polishValue = (goldValue * polish) / 100;
} else {
  polishValue = polish;
}

const makingPolish = makingValue + polishValue;

  const total = goldValue + diamondTotal + makingPolish;
  const gst = total * 0.03;
  const final = total + gst;
  // ⭐ STEP 1: FINAL DATA OBJECT (DO NOT TOUCH LOGIC)
const finalData = {
  goldValue,
  diamondValue: diamondTotal,
  makingCharges: makingValue,
  polishCharges: polishValue,
  total,
  gst,
  final
};

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
const handleImage = (e: any) => {
  const file = e.target.files[0];
  if (file) {
    setItemImage(URL.createObjectURL(file));
  }
};
  // PRINT
const handlePrint = () => {
  const text = `
ROUGH ESTIMATE
----------------------------

Wt: ${gross}g ${carat}K @ Rs ${getRate(carat)}
Net: ${net.toFixed(3)}g

Gold:
${net.toFixed(3)} x ${getRate(carat)} = Rs ${goldValue.toFixed(0)}

----------------------------
FINAL: Rs ${final.toFixed(0)}

THIS IS NOT A BILL
`;

  const win = window.open("", "", "width=300,height=600");

  if (win) {
    win.document.write(`<pre style="font-size:12px">${text}</pre>`);
    win.document.close();
    win.print();
  }
};
      
const generatePDF = () => {
  const doc = new jsPDF();

  const img = new Image();
  img.src = "/logo.png";

  img.onload = () => {
    // LOGO
    doc.addImage(img, "PNG", 140, 10, 50, 25);

    // TITLE
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("JEWELLERY ESTIMATE", 20, 20);

    doc.setDrawColor(200, 170, 100);
    doc.setLineWidth(1);
    doc.line(20, 25, 190, 25);

    // CUSTOMER BOX
    doc.rect(20, 35, 170, 25);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    doc.text(`Customer: ${customerName || "-"}`, 25, 45);
    doc.text(`Mobile: ${mobile || "-"}`, 25, 55);

    // DETAILS BOX
    doc.rect(20, 70, 170, 50);

    doc.text(`Gross Weight: ${gross}g`, 25, 80);
    doc.text(`Net Weight: ${net.toFixed(3)}g`, 25, 90);

    doc.text(`Gold Value: Rs ${goldValue.toFixed(0)}`, 25, 100);
    doc.text(`Making: Rs ${making.toFixed(0)}`, 25, 110);

    // TOTAL BOX
    doc.setFillColor(245, 235, 200);
    doc.rect(20, 130, 170, 25, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`FINAL: Rs ${final.toFixed(0)}`, 25, 145);

    // FOOTER
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");

    doc.text("This is not a bill", 20, 170);
    doc.text("Thank you 🙏", 140, 170);

    // BORDER
    doc.setDrawColor(200, 170, 100);
    doc.rect(10, 10, 190, 180);

    doc.save("estimate.pdf");
  };
};

  // ⭐ STEP 2: SAVE ESTIMATE FUNCTION
const handleSaveEstimate = () => {
  const estimate = {
    customerName,
    mobile,
    calculation: finalData,
    createdAt: new Date().toISOString()
  };

  console.log("ESTIMATE DATA 👉", estimate);
  const old = JSON.parse(localStorage.getItem("estimates") || "[]");
old.push(estimate);
localStorage.setItem("estimates", JSON.stringify(old));

setEstimates(old);

};
const handleDeleteEstimate = (index: number) => {
  const updated = [...estimates];
  updated.splice(index, 1);

  setEstimates(updated);
  localStorage.setItem("estimates", JSON.stringify(updated));
};
return (
  <div style={{ padding: 20, maxWidth: 500, margin: "auto", fontFamily: "sans-serif" }}>

    {/* LOGO */}
    <img src="/logo.png" alt="logo" style={{ width: 180, display: "block", margin: "auto" }} />

    <h2 style={{ textAlign: "center", marginBottom: 20 }}>
      Jewellery Calculator
    </h2>

    {/* GOLD RATE */}
    <p>24K Gold Rate</p>
    <input
      type="number"
      value={rate24}
      onChange={(e) => setRate24(Number(e.target.value))}
      style={{ width: "100%", padding: 10, marginBottom: 15 }}
    />
    <p style={{marginTop:10}}>Article Image</p>

<input 
  type="file" 
  accept="image/*" 
  onChange={handleImage}
  style={{
    marginBottom: 10
  }}
/>

    {/* PURITY */}
    <p>Select Gold Purity</p>
    <div style={{ display: "flex", gap: 8, marginBottom: 5 }}>
      {[24, 22, 20, 18, 14].map((c) => (
        <button
          key={c}
          onClick={() => setCarat(c)}
          style={{
            flex: 1,
            padding: 10,
            background: carat === c ? "black" : "#eee",
            color: carat === c ? "white" : "black",
            border: "1px solid #999"
          }}
        >
          {c}K
        </button>
      ))}
    </div>

    {/* PER CT PRICE */}
    <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
      {[24, 22, 20, 18, 14].map((c) => (
        <div key={c} style={{ flex: 1, textAlign: "center", fontSize: 14 }}>
          ₹{getRate(c).toFixed(0)}
        </div>
      ))}
    </div>

    {/* INPUTS */}
    <p>Gross Weight</p>
    <input type="number" step="0.001" value={gross || ""} onChange={(e) => setGross(parseFloat(e.target.value) || 0)} style={{ width: "100%", padding: 10 }} />

    <p>Stone</p>
    <input type="number" step="0.001" value={stone || ""} onChange={(e) => setStone(parseFloat(e.target.value) || 0)} style={{ width: "100%", padding: 10 }} />

    <p>Diamond Ct</p>
    <input type="number" value={diamondCt || ""} onChange={(e) => setDiamondCt(Number(e.target.value) || 0)} style={{ width: "100%", padding: 10 }} />

    <p>Diamond Code</p>
    <input value={diamondCode} onChange={(e) => setDiamondCode(e.target.value)} style={{ width: "100%", padding: 10 }} />

    <p>Diamond Profit</p>
    <input type="number" value={diamondProfit || ""} onChange={(e) => setDiamondProfit(Number(e.target.value) || 0)} style={{ width: "100%", padding: 10 }} />

<p>Customer Name</p>
<input
  value={customerName}
  onChange={(e) => setCustomerName(e.target.value)}
  style={{ width: "100%", padding: 10 }}
/>

<p>Mobile</p>
<input
  value={mobile}
  onChange={(e) => setMobile(e.target.value)}
  style={{ width: "100%", padding: 10 }}
/>
   <p>Making</p>
<div style={{ display: "flex", gap: 5 }}>
  <select value={makingType} onChange={(e)=>setMakingType(e.target.value)}>
    <option value="pergram">Per Gram</option>
    <option value="percent">%</option>
    <option value="flat">Flat</option>
  </select>

  <input
    type="number"
    value={making || ""}
    onChange={(e)=>setMaking(Number(e.target.value)||0)}
    style={{ flex: 1, padding: 10 }}
  />
</div>

<p>Polish</p>
<div style={{ display: "flex", gap: 5 }}>
  <select value={polishType} onChange={(e)=>setPolishType(e.target.value)}>
    <option value="pergram">Per Gram</option>
    <option value="percent">%</option>
    <option value="flat">Flat</option>
  </select>

  <input
    type="number"
    value={polish || ""}
    onChange={(e)=>setPolish(Number(e.target.value)||0)}
    style={{ flex: 1, padding: 10 }}
  />
</div>
    <hr />

    {/* RESULT */}
    <p>Gross: {gross}g</p>
    <p>Net: {net.toFixed(3)}g</p>

    <p>Without GST: ₹{total.toFixed(0)}</p>
    <h2>With GST: ₹{final.toFixed(0)}</h2>
    {selectedEstimate && (
  <div style={{ border: "2px solid black", padding: 15, marginTop: 20 }}>
    <h3>Estimate Detail</h3>

    <p><b>Name:</b> {selectedEstimate.customerName}</p>
    <p><b>Mobile:</b> {selectedEstimate.mobile}</p>

    <p><b>Gold:</b> ₹{selectedEstimate.calculation.goldValue}</p>
    <p><b>Diamond:</b> ₹{selectedEstimate.calculation.diamondValue}</p>
    <p><b>Making:</b> ₹{selectedEstimate.calculation.makingCharges}</p>
    <p><b>Polish:</b> ₹{selectedEstimate.calculation.polishCharges}</p>
    {itemImage && (
  <div style={{ textAlign: "center", marginTop: 10 }}>
    <img
      src={itemImage}
      alt="item"
      style={{
        width: 120,
        borderRadius: 10,
        marginBottom: 10
      }}
    />
  </div>
)}

    <h2>Final: ₹{selectedEstimate.calculation.final}</h2>
  </div>
)}

    {/* BUTTONS */}
    <button onClick={saveHistory} style={{ width: "100%", padding: 12, background: "green", color: "white", marginTop: 10 }}>
      Save
    </button>

    <button onClick={resetAll} style={{ width: "100%", padding: 12, background: "red", color: "white", marginTop: 10 }}>
      Reset
    </button>

    <button onClick={handlePrint} style={{ width: "100%", padding: 12, marginTop: 10 }}>
      Print
    </button>
    <button
  onClick={generatePDF}
  style={{ width: "100%", padding: 12, marginTop: 10 }}
>
  PDF Download
</button>
    <button
  onClick={handleSaveEstimate}
  style={{ width: "100%", padding: 12, background: "blue", color: "white", marginTop: 10 }}
>
  Save Estimate
</button>

    {/* 🔥 SHARE PDF */}
    <button
      onClick={() => {
        const blob = new Blob(
          [
            `ROUGH ESTIMATE\n\nGross: ${gross}g\nNet: ${net.toFixed(3)}g\n\nGold: ₹${goldValue.toFixed(0)}\nDiamond: ₹${diamondTotal.toFixed(0)}\n\nTOTAL: ₹${total.toFixed(0)}\nGST: ₹${gst.toFixed(0)}\nFINAL: ₹${final.toFixed(0)}\n\nTHIS IS NOT A BILL`
          ],
          { type: "text/plain" }
        );

        const file = new File([blob], "bill.txt", { type: "text/plain" });

        if (navigator.share) {
          navigator.share({

          });            
        } else {
          const url = URL.createObjectURL(blob);
          window.open(url);
        }
      }}
      style={{ width: "100%", padding: 12, marginTop: 10 }}
    >
      Share
    </button>

    {/* HISTORY */}
    <h3>Last 10 Transactions</h3>
    {history.map((h, i) => (
      <p key={i}>₹{h.price} | {h.wt}g | {h.ct}K</p>
    ))}
    <h3>Estimates</h3>

{estimates.map((e, i) => (
<div
  key={i}
  onClick={() => setSelectedEstimate(e)}
  style={{ border: "1px solid #ccc", padding: 10, marginTop: 5, cursor: "pointer" }}
>    <p>{e.customerName} | {e.mobile}</p>
    <p>₹{e.calculation.final}</p>
    <button
  onClick={(ev) => {
    ev.stopPropagation();
    handleDeleteEstimate(i);
  }}
  style={{ background: "red", color: "white", padding: 5, marginTop: 5 }}
>
  Delete
</button>
  </div>
))}

  </div>
);

}