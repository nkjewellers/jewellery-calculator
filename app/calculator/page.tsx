"use client";

import { useState } from "react";

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

  // POLISH
  let polishValue = polishType === "percent"
    ? (net * polish) / 100
    : polish;

  const totalGoldWeight = net + polishValue;
  const goldValue = totalGoldWeight * ratePerGram;

  // MAKING
  let makingValue = 0;
  if (makingType === "perGram") {
    makingValue = net * making;
  } else if (makingType === "percent") {
    makingValue = (goldValue * making) / 100;
  } else {
    makingValue = making;
  }

  // DIAMOND
  const map:any = {
    k:1,g:2,c:3,h:4,o:5,i:6,t:7,r:8,a:9,m:0
  };

  let num="";
  for(let ch of diamondCode.toLowerCase()){
    if(map[ch]!==undefined) num+=map[ch];
  }

  const diamondRate = num ? parseInt(num+"00") : 0;
  const diamondTotal = diamondRate * diamondCt + diamondProfit;

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

  return (
    <div className="p-4 max-w-md mx-auto space-y-4 text-black">

      <h1 className="text-2xl font-bold text-center">
        💎 Jewellery Calculator
      </h1>

      {/* GOLD RATE */}
      <div>
        <p className="font-semibold text-lg">24K Gold Rate (per 10g)</p>
        <input
          value={rate24}
          onChange={(e)=>setRate24(+e.target.value)}
          className="w-full p-3 text-lg border rounded"
        />
      </div>

      {/* CT SELECT + INLINE PRICE */}
      <div>
        <p className="font-semibold text-lg">Select Gold Purity</p>

        {/* CT BUTTONS */}
        <div className="flex justify-between">
          {[24,22,20,18,14].map(c=>(
            <button
              key={c}
              onClick={()=>setCarat(c)}
              className={`flex-1 mx-1 py-2 rounded text-lg border ${
                carat===c
                ? "bg-black text-white"
                : "bg-gray-200"
              }`}
            >
              {c}K
            </button>
          ))}
        </div>

        {/* PRICE LINE */}
        <div className="flex justify-between mt-1 text-sm text-center">
          {[24,22,20,18,14].map(c=>(
            <div key={c} className="flex-1">
              ₹{getRate(c).toFixed(0)}
            </div>
          ))}
        </div>

        <p className="mt-2 text-sm">
          Selected: <b>{carat}K</b>
        </p>
      </div>

      {/* WEIGHTS */}
      <div>
        <p className="font-semibold text-lg">Gross Weight (gm)</p>
        <input value={gross}
          onChange={(e)=>setGross(+e.target.value)}
          className="w-full p-3 text-lg border rounded"/>
      </div>

      <div>
        <p className="font-semibold text-lg">Stone Weight (gm)</p>
        <input value={stone}
          onChange={(e)=>setStone(+e.target.value)}
          className="w-full p-3 text-lg border rounded"/>
      </div>

      <div>
        <p className="font-semibold text-lg">Diamond Weight (ct)</p>
        <input value={diamondCt}
          onChange={(e)=>setDiamondCt(+e.target.value)}
          className="w-full p-3 text-lg border rounded"/>
      </div>

      <div>
        <p className="font-semibold text-lg">Diamond Code</p>
        <input value={diamondCode}
          onChange={(e)=>setDiamondCode(e.target.value)}
          className="w-full p-3 text-lg border rounded"/>
      </div>

      <div>
        <p className="font-semibold text-lg">Diamond Profit (₹)</p>
        <input value={diamondProfit}
          onChange={(e)=>setDiamondProfit(+e.target.value)}
          className="w-full p-3 text-lg border rounded"/>
      </div>

      {/* POLISH */}
      <div>
        <p className="font-semibold text-lg">Polish</p>
        <div className="flex gap-2">
          <input value={polish}
            onChange={(e)=>setPolish(+e.target.value)}
            className="w-full p-3 text-lg border rounded"/>
          <select onChange={(e)=>setPolishType(e.target.value)}>
            <option value="percent">%</option>
            <option value="flat">₹</option>
          </select>
        </div>
      </div>

      {/* MAKING */}
      <div>
        <p className="font-semibold text-lg">Making</p>
        <div className="flex gap-2">
          <input value={making}
            onChange={(e)=>setMaking(+e.target.value)}
            className="w-full p-3 text-lg border rounded"/>
          <select onChange={(e)=>setMakingType(e.target.value)}>
            <option value="perGram">/gm</option>
            <option value="percent">%</option>
            <option value="flat">₹</option>
          </select>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-2">
        <button onClick={saveHistory}
          className="w-full bg-green-600 text-white p-3 rounded">
          Save
        </button>

        <button onClick={resetAll}
          className="w-full bg-red-600 text-white p-3 rounded">
          Reset
        </button>
      </div>

      {/* RESULT */}
      <div className="bg-black text-white p-4 rounded text-center">
        <p className="text-xl">Final Price</p>
        <p className="text-3xl font-bold">₹{final.toFixed(0)}</p>
      </div>

      {/* HISTORY */}
      <div>
        <p className="font-semibold">Last 5 Transactions</p>
        {history.map((h,i)=>(
          <p key={i}>
            ₹{h.price} | {h.wt}gm | {h.ct}K
          </p>
        ))}
      </div>

    </div>
  );
}