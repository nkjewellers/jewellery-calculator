"use client";

import { useState } from "react";
import Image from "next/image"; // ✅ sirf ye add kiya hai

export default function Calculator() {

  const [rate24, setRate24] = useState(0);
  const [carat, setCarat] = useState(22);

  const [gross, setGross] = useState(0);
  const [stone, setStone] = useState(0);
  const [diamondCt, setDiamondCt] = useState(0);
  const [diamondCode, setDiamondCode] = useState("");

  const [polish, setPolish] = useState(0);
  const [polishType, setPolishType] = useState("percent");

  const [making, setMaking] = useState(0);
  const [makingType, setMakingType] = useState("perGram");

  const [history, setHistory] = useState<any[]>([]);

  const purity:any = {
    24:1,
    22:0.93,
    20:0.86,
    18:0.78,
    14:0.62
  };

  const getRate = (ct:number) => rate24 * purity[ct];

  const rate = getRate(carat);
  const ratePerGram = rate / 10;

  const diamondGram = diamondCt * 0.2;
  const net = Math.max(0, gross - stone - diamondGram);

  let polishValue = polishType === "percent"
    ? (net * polish) / 100
    : polish;

  const totalGoldWeight = net + polishValue;
  const goldValue = totalGoldWeight * ratePerGram;

  let makingValue = 0;
  if (makingType === "perGram") {
    makingValue = net * making;
  } else if (makingType === "percent") {
    makingValue = (goldValue * making) / 100;
  } else {
    makingValue = making;
  }

  const map:any = {
    k:1,g:2,c:3,h:4,o:5,i:6,t:7,r:8,a:9,m:0
  };

  let num="";
  for(let ch of diamondCode.toLowerCase()){
    if(map[ch]!==undefined) num+=map[ch];
  }

  const diamondRate = num ? parseInt(num+"00") : 0;
  const diamondTotal = diamondRate * diamondCt;

  const total = goldValue + makingValue + diamondTotal;
  const final = total + total*0.03;

  const saveHistory = () => {
    const entry = {
      price: final.toFixed(0),
      wt: gross,
      ct: carat
    };
    setHistory([entry, ...history.slice(0,4)]);
  };

  const resetAll = () => {
    setRate24(0);
    setGross(0);
    setStone(0);
    setDiamondCt(0);
    setDiamondCode("");
    setPolish(0);
    setMaking(0);
  };

  return (
    <div style={{padding:16, maxWidth:400, margin:"auto"}}>

      {/* ✅ LOGO FIXED */}
      <Image 
        src="/logo.png" 
        alt="logo"
        width={180} 
        height={100}
        style={{display:"block", margin:"auto"}}
      />

      <h1 style={{fontSize:22, fontWeight:"bold", textAlign:"center"}}>
        Jewellery Calculator
      </h1>

      <p>24K Gold Rate (per 10g)</p>
      <input value={rate24} onChange={(e)=>setRate24(+e.target.value)} style={{width:"100%",padding:10}}/>

      <p>Select Gold Purity</p>

      <div style={{display:"flex"}}>
        {[24,22,20,18,14].map(c=>(
          <button key={c}
            onClick={()=>setCarat(c)}
            style={{
              flex:1,
              margin:2,
              padding:8,
              background: carat===c ? "black" : "#ddd",
              color: carat===c ? "white" : "black"
            }}>
            {c}K
          </button>
        ))}
      </div>

      <div style={{display:"flex", marginTop:5}}>
        {[24,22,20,18,14].map(c=>(
          <div key={c} style={{flex:1, textAlign:"center"}}>
            ₹{getRate(c).toFixed(0)}
          </div>
        ))}
      </div>

      <p>Selected: {carat}K</p>

      <p>Gross Weight (gm)</p>
      <input value={gross} onChange={(e)=>setGross(+e.target.value)} style={{width:"100%",padding:10}}/>

      <p>Stone Weight (gm)</p>
      <input value={stone} onChange={(e)=>setStone(+e.target.value)} style={{width:"100%",padding:10}}/>

      <p>Diamond Weight (ct)</p>
      <input value={diamondCt} onChange={(e)=>setDiamondCt(+e.target.value)} style={{width:"100%",padding:10}}/>

      <p>Diamond Code</p>
      <input value={diamondCode} onChange={(e)=>setDiamondCode(e.target.value)} style={{width:"100%",padding:10}}/>

      <p>Polish</p>
      <div style={{display:"flex"}}>
        <input value={polish} onChange={(e)=>setPolish(+e.target.value)} style={{flex:1,padding:10}}/>
        <select onChange={(e)=>setPolishType(e.target.value)}>
          <option value="percent">%</option>
          <option value="flat">₹</option>
        </select>
      </div>

      <p>Making</p>
      <div style={{display:"flex"}}>
        <input value={making} onChange={(e)=>setMaking(+e.target.value)} style={{flex:1,padding:10}}/>
        <select onChange={(e)=>setMakingType(e.target.value)}>
          <option value="perGram">/gm</option>
          <option value="percent">%</option>
          <option value="flat">₹</option>
        </select>
      </div>

      <button onClick={saveHistory} style={{width:"100%",marginTop:10,background:"green",color:"white",padding:10}}>
        Save
      </button>

      <button onClick={resetAll} style={{width:"100%",marginTop:5,background:"red",color:"white",padding:10}}>
        Reset
      </button>

      <h2 style={{background:"black",color:"white",padding:10,textAlign:"center"}}>
        ₹{final.toFixed(0)}
      </h2>

      <p>Last 5 Transactions</p>
      {history.map((h,i)=>(
        <p key={i}>{h.price} | {h.wt}gm | {h.ct}K</p>
      ))}

    </div>
  );
}