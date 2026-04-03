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

  // ✅ FIX (NO ANY[])
  const [history, setHistory] = useState([]);

  const purity = {24:1,22:0.93,20:0.86,18:0.78,14:0.62};
  const getRate = (ct:number)=>rate24*(purity as any)[ct];

  const rate = getRate(carat)/10;

  const diamondGram = diamondCt*0.2;
  const net = Math.max(0, gross-stone-diamondGram);

  const polishValue = polishType==="percent" ? (net*polish)/100 : polish;
  const goldValue = (net+polishValue)*rate;

  let makingValue = 0;
  if(makingType==="perGram") makingValue = net*making;
  else if(makingType==="percent") makingValue = (goldValue*making)/100;
  else makingValue = making;

  const map = {k:1,g:2,c:3,h:4,o:5,i:6,t:7,r:8,a:9,m:0};
  let num="";
  for(let ch of diamondCode.toLowerCase()){
    if((map as any)[ch]!=undefined) num+=(map as any)[ch];
  }

  const diamondRate = num ? parseInt(num+"00") : 0;
  const diamondTotal = (diamondRate*diamondCt)+diamondProfit;

  const total = goldValue+makingValue+diamondTotal;
  const final = total + total*0.03;

  const resetAll = ()=>{
    setGross(0);
    setStone(0);
    setDiamondCt(0);
    setDiamondCode("");
    setDiamondProfit(0);
    setPolish(0);
    setMaking(0);
  };

  const handlePrint = async () => {

    const text = `
NK JEWELLERS
-------------------
Wt: ${gross}g  ${carat}K
Gold: ₹${goldValue.toFixed(0)}
Dia: ₹${diamondTotal.toFixed(0)}
Making: ₹${makingValue.toFixed(0)}
-------------------
TOTAL: ₹${total.toFixed(0)}
GST: ₹${(total*0.03).toFixed(0)}
FINAL: ₹${final.toFixed(0)}
-------------------
Thank You 🙏
`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Jewellery Bill",
          text: text,
        });
        return;
      } catch {}
    }

    const win = window.open("", "", "width=300,height=600");

    win.document.write(`
      <pre style="font-size:14px;font-family:monospace">
${text}
      </pre>
    `);

    win.document.close();
    win.print();
  };

  return (
    <div style={{padding:16,maxWidth:400,margin:"auto"}}>

      <Image src="/logo.png" alt="logo" width={180} height={100} style={{display:"block",margin:"auto"}}/>

      <h2 style={{textAlign:"center"}}>Jewellery Calculator</h2>

      <input type="number" value={rate24||""}
        onChange={(e)=>setRate24(parseFloat(e.target.value)||0)}
        placeholder="24K Rate"
        style={{width:"100%",padding:10,marginBottom:10}}
      />

      <div style={{display:"flex",marginBottom:10}}>
        {[24,22,20,18,14].map(c=>(
          <button key={c}
            onClick={()=>setCarat(c)}
            style={{
              flex:1,
              margin:2,
              padding:10,
              background: carat===c ? "black" : "#ddd",
              color: carat===c ? "white" : "black"
            }}>
            {c}K
          </button>
        ))}
      </div>

      <input type="number" step="0.001" value={gross||""}
        onChange={(e)=>setGross(parseFloat(e.target.value)||0)}
        placeholder="Gross"
        style={{width:"100%",padding:10,marginBottom:10}}
      />

      <input type="number" step="0.001" value={stone||""}
        onChange={(e)=>setStone(parseFloat(e.target.value)||0)}
        placeholder="Stone"
        style={{width:"100%",padding:10,marginBottom:10}}
      />

      <input type="number" step="0.001" value={diamondCt||""}
        onChange={(e)=>setDiamondCt(parseFloat(e.target.value)||0)}
        placeholder="Diamond Ct"
        style={{width:"100%",padding:10,marginBottom:10}}
      />

      <input value={diamondCode}
        onChange={(e)=>setDiamondCode(e.target.value)}
        placeholder="Diamond Code"
        style={{width:"100%",padding:10,marginBottom:10}}
      />

      <input type="number" value={diamondProfit||""}
        onChange={(e)=>setDiamondProfit(parseFloat(e.target.value)||0)}
        placeholder="Diamond Profit"
        style={{width:"100%",padding:10,marginBottom:10}}
      />

      <button onClick={resetAll}
        style={{width:"100%",background:"red",color:"white",padding:14,fontSize:16,marginBottom:10}}>
        Reset
      </button>

      <button onClick={handlePrint}
        style={{width:"100%",background:"black",color:"white",padding:14,fontSize:16}}>
        Print / PDF / Share
      </button>

    </div>
  );
}