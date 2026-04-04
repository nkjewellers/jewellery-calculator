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

  const [history, setHistory] = useState<{price:number,wt:number,ct:number}[]>([]);

  // ✅ VOICE BACK
  const startVoice = (setValue:any) => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = "en-IN";

    rec.onresult = (e:any)=>{
      let t = e.results[0][0].transcript;
      t = t.replace("point",".").replace(/\s/g,"");
      const num = parseFloat(t);
      if(!isNaN(num)) setValue(num);
    };

    rec.start();
  };

  const purity: Record<number, number> = {
    24:1,22:0.93,20:0.86,18:0.78,14:0.62
  };

  const getRate = (ct:number)=>rate24*(purity[ct] || 0);
  const rate = getRate(carat)/10;

  const diamondGram = diamondCt*0.2;
  const net = Math.max(0, gross-stone-diamondGram);

  const polishValue = polishType==="percent" ? (net*polish)/100 : polish;
  const goldValue = (net+polishValue)*rate;

  let makingValue = 0;
  if(makingType==="perGram") makingValue = net*making;
  else if(makingType==="percent") makingValue = (goldValue*making)/100;
  else makingValue = making;

  const map: Record<string, number> = {
    k:1,g:2,c:3,h:4,o:5,i:6,t:7,r:8,a:9,m:0
  };

  let num="";
  for(let ch of diamondCode.toLowerCase()){
    if(map[ch]!=undefined) num+=map[ch];
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

  const saveHistory = ()=>{
    setHistory([{price: final, wt: gross, ct: carat}, ...history.slice(0,4)]);
  };
const handlePrint = async () => {

  const text = `
ROUGH ESTIMATE
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
NOT A BILL JUST ESTIMATE
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

  if (win) {
    win.document.write(`<pre>${text}</pre>`);
    win.document.close();
    win.print();
  }
};
  return (
    <div style={{padding:16,maxWidth:420,margin:"auto"}}>

      <Image src="/logo.png" alt="logo" width={200} height={120} style={{display:"block",margin:"auto"}}/>

      <h2 style={{textAlign:"center"}}>Jewellery Calculator</h2>

      {/* 24K RATE */}
      <p>24K Gold Rate</p>
      <div style={{display:"flex"}}>
        <input type="number" step="0.01"
          value={rate24||""}
          onChange={(e)=>setRate24(Number(e.target.value)||0)}
          style={{flex:1,padding:10}}
        />
        <button onClick={()=>startVoice(setRate24)}>🎤</button>
      </div>

      {/* PURITY */}
      <p>Select Gold Purity</p>
      <div style={{display:"flex",gap:5}}>
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

      {/* WEIGHTS */}
      <p>Gross Weight</p>
      <div style={{display:"flex"}}>
        <input type="number" step="0.001"
          value={gross||""}
          onChange={(e)=>setGross(Number(e.target.value)||0)}
          style={{flex:1,padding:10}}
        />
        <button onClick={()=>startVoice(setGross)}>🎤</button>
      </div>

      <p>Stone Weight</p>
      <div style={{display:"flex"}}>
        <input type="number" step="0.001"
          value={stone||""}
          onChange={(e)=>setStone(Number(e.target.value)||0)}
          style={{flex:1,padding:10}}
        />
        <button onClick={()=>startVoice(setStone)}>🎤</button>
      </div>

      <p>Diamond Weight (ct)</p>
      <div style={{display:"flex"}}>
        <input type="number" step="0.001"
          value={diamondCt||""}
          onChange={(e)=>setDiamondCt(Number(e.target.value)||0)}
          style={{flex:1,padding:10}}
        />
        <button onClick={()=>startVoice(setDiamondCt)}>🎤</button>
      </div>

      <p>Diamond Code</p>
      <input value={diamondCode}
        onChange={(e)=>setDiamondCode(e.target.value)}
        style={{width:"100%",padding:10}}
      />

      <p>Diamond Profit</p>
      <input type="number"
        value={diamondProfit||""}
        onChange={(e)=>setDiamondProfit(Number(e.target.value)||0)}
        style={{width:"100%",padding:10}}
      />

      <p>Polish</p>
      <div style={{display:"flex"}}>
        <input value={polish||""}
          onChange={(e)=>setPolish(Number(e.target.value)||0)}
          style={{flex:1,padding:10}}
        />
        <select onChange={(e)=>setPolishType(e.target.value)}>
          <option value="percent">%</option>
          <option value="flat">Flat</option>
        </select>
      </div>

      <p>Making</p>
      <div style={{display:"flex"}}>
        <input value={making||""}
          onChange={(e)=>setMaking(Number(e.target.value)||0)}
          style={{flex:1,padding:10}}
        />
        <select onChange={(e)=>setMakingType(e.target.value)}>
          <option value="perGram">/gm</option>
          <option value="percent">%</option>
          <option value="flat">Flat</option>
        </select>
      </div>

      <button onClick={saveHistory} style={{width:"100%",background:"green",color:"white",padding:12,marginTop:10}}>Save</button>

      <button onClick={resetAll} style={{width:"100%",background:"red",color:"white",padding:12}}>Reset</button>
<button
  onClick={handlePrint}
  style={{
    width: "100%",
    background: "black",
    color: "white",
    padding: 12,
    marginTop: 10
  }}
>
  Print / PDF / Share
</button>

      <div style={{background:"black",color:"white",padding:10,marginTop:10}}>
        <p>Without GST: ₹{total.toFixed(0)}</p>
        <h2>With GST: ₹{final.toFixed(0)}</h2>
      </div>

      <h3>Last 5 Transactions</h3>
      {history.map((h,i)=>(
        <p key={i}>{h.price} | {h.wt}gm | {h.ct}K</p>
      ))}

    </div>
  );
}