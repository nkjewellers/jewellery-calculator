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

  const [history, setHistory] = useState<any[]>([]);

  const purity:any = {
    24:1,22:0.93,20:0.86,18:0.78,14:0.62
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
  const diamondTotal = (diamondRate * diamondCt) + diamondProfit;

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
    setDiamondProfit(0);
    setPolish(0);
    setMaking(0);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{padding:16, maxWidth:400, margin:"auto"}}>

      <Image 
        src="/logo.png" 
        alt="logo"
        width={180} 
        height={100}
        style={{display:"block", margin:"auto"}}
      />

      <h1 style={{fontSize:22,fontWeight:"bold",textAlign:"center"}}>
        Jewellery Calculator
      </h1>

      <p>24K Gold Rate</p>
      <input type="number" step="0.001"
        value={rate24 === 0 ? "" : rate24}
        onChange={(e)=>setRate24(parseFloat(e.target.value) || 0)}
        style={{width:"100%",padding:10}}/>

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

      <p>Gross Weight</p>
      <input type="number" step="0.001"
        value={gross === 0 ? "" : gross}
        onChange={(e)=>setGross(parseFloat(e.target.value) || 0)}
        style={{width:"100%",padding:10}}/>

      <p>Stone Weight</p>
      <input type="number" step="0.001"
        value={stone === 0 ? "" : stone}
        onChange={(e)=>setStone(parseFloat(e.target.value) || 0)}
        style={{width:"100%",padding:10}}/>

      <p>Diamond Weight (ct)</p>
      <input type="number" step="0.001"
        value={diamondCt === 0 ? "" : diamondCt}
        onChange={(e)=>setDiamondCt(parseFloat(e.target.value) || 0)}
        style={{width:"100%",padding:10}}/>

      <p>Diamond Code</p>
      <input value={diamondCode}
        onChange={(e)=>setDiamondCode(e.target.value)}
        style={{width:"100%",padding:10}}/>

      <p>Diamond Profit</p>
      <input type="number" step="0.001"
        value={diamondProfit === 0 ? "" : diamondProfit}
        onChange={(e)=>setDiamondProfit(parseFloat(e.target.value) || 0)}
        style={{width:"100%",padding:10}}/>

      <p>Polish</p>
      <div style={{display:"flex"}}>
        <input type="number" step="0.001"
          value={polish === 0 ? "" : polish}
          onChange={(e)=>setPolish(parseFloat(e.target.value) || 0)}
          style={{flex:1,padding:10}}/>
        <select onChange={(e)=>setPolishType(e.target.value)}>
          <option value="percent">%</option>
          <option value="flat">₹</option>
        </select>
      </div>

      <p>Making</p>
      <div style={{display:"flex"}}>
        <input type="number" step="0.001"
          value={making === 0 ? "" : making}
          onChange={(e)=>setMaking(parseFloat(e.target.value) || 0)}
          style={{flex:1,padding:10}}/>
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

      <button onClick={handlePrint} style={{width:"100%",marginTop:5,background:"blue",color:"white",padding:10}}>
        Print / PDF
      </button>

      <div style={{background:"black",color:"white",padding:10,textAlign:"center"}}>
        <p>Without GST: ₹{total.toFixed(0)}</p>
        <h2>With GST: ₹{final.toFixed(0)}</h2>
      </div>

      <p>Last 5 Transactions</p>
      {history.map((h,i)=>(
        <p key={i}>{h.price} | {h.wt}gm | {h.ct}K</p>
      ))}

    </div>
  );
}