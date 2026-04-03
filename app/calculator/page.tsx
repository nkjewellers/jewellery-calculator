"use client";

import { useState } from "react";
import Image from "next/image";

export default function Calculator() {

  const [rate24, setRate24] = useState<number>(0);
  const [carat, setCarat] = useState<number>(22);

  const [gross, setGross] = useState<number>(0);
  const [stone, setStone] = useState<number>(0);
  const [diamondCt, setDiamondCt] = useState<number>(0);
  const [diamondCode, setDiamondCode] = useState<string>("");
  const [diamondProfit, setDiamondProfit] = useState<number>(0);

  const [polish, setPolish] = useState<number>(0);
  const [polishType, setPolishType] = useState<string>("percent");

  const [making, setMaking] = useState<number>(0);
  const [makingType, setMakingType] = useState<string>("perGram");

  const [history, setHistory] = useState<any[]>([]);

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
      await navigator.share({ title: "Bill", text });
      return;
    }

    const win = window.open("", "", "width=300,height=600");
    win?.document.write(`<pre>${text}</pre>`);
    win?.print();
  };

  return (
    <div style={{padding:16,maxWidth:400,margin:"auto"}}>

      <Image src="/logo.png" alt="logo" width={180} height={100}/>

      <h2>Jewellery Calculator</h2>

      <input type="number" placeholder="24K Rate"
        value={rate24||""}
        onChange={(e)=>setRate24(Number(e.target.value)||0)}
      />

      <div>
        {[24,22,20,18,14].map(c=>(
          <button key={c}
            onClick={()=>setCarat(c)}
            style={{background:carat===c?"black":"#ddd",color:carat===c?"white":"black"}}>
            {c}K
          </button>
        ))}
      </div>

      <input placeholder="Gross"
        value={gross||""}
        onChange={(e)=>setGross(Number(e.target.value)||0)}
      />

      <input placeholder="Stone"
        value={stone||""}
        onChange={(e)=>setStone(Number(e.target.value)||0)}
      />

      <input placeholder="Diamond Ct"
        value={diamondCt||""}
        onChange={(e)=>setDiamondCt(Number(e.target.value)||0)}
      />

      <input placeholder="Diamond Code"
        value={diamondCode}
        onChange={(e)=>setDiamondCode(e.target.value)}
      />

      <input placeholder="Diamond Profit"
        value={diamondProfit||""}
        onChange={(e)=>setDiamondProfit(Number(e.target.value)||0)}
      />

      {/* 🔥 POLISH */}
      <input placeholder="Polish"
        value={polish||""}
        onChange={(e)=>setPolish(Number(e.target.value)||0)}
      />
      <select onChange={(e)=>setPolishType(e.target.value)}>
        <option value="percent">%</option>
        <option value="flat">Flat</option>
      </select>

      {/* 🔥 MAKING */}
      <input placeholder="Making"
        value={making||""}
        onChange={(e)=>setMaking(Number(e.target.value)||0)}
      />
      <select onChange={(e)=>setMakingType(e.target.value)}>
        <option value="perGram">/gm</option>
        <option value="percent">%</option>
        <option value="flat">Flat</option>
      </select>

      {/* 🔥 BUTTONS BACK */}
      <button onClick={saveHistory} style={{background:"green",color:"white"}}>Save</button>

      <button onClick={resetAll} style={{background:"red",color:"white"}}>Reset</button>

      <button onClick={handlePrint} style={{background:"black",color:"white"}}>
        Print / PDF / Share
      </button>

      <h3>Last 5 Transactions</h3>
      {history.map((h,i)=>(
        <p key={i}>{h.price} | {h.wt}gm | {h.ct}K</p>
      ))}

    </div>
  );
}