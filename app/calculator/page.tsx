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

  const purity:any = {24:1,22:0.93,20:0.86,18:0.78,14:0.62};

  const rate = rate24 * purity[carat];
  const ratePerGram = rate / 10;

  const diamondGram = diamondCt * 0.2;
  const net = Math.max(0, gross - stone - diamondGram);

  const goldValue = net * ratePerGram;

  const map:any = {
    k:1,g:2,c:3,h:4,o:5,i:6,t:7,r:8,a:9,m:0
  };

  let num="";
  for(let ch of diamondCode.toLowerCase()){
    if(map[ch]!==undefined) num+=map[ch];
  }

  const diamondRate = num ? parseInt(num+"00") : 0;
  const diamondTotal = diamondRate * diamondCt + diamondProfit;

  const total = goldValue + diamondTotal;
  const final = total + total*0.03;

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

      {/* CT SELECT */}
      <div>
        <p className="font-semibold text-lg">Select Gold Purity</p>
        <div className="flex gap-2 flex-wrap">
          {[24,22,20,18,14].map(c=>(
            <button
              key={c}
              onClick={()=>setCarat(c)}
              className={`px-4 py-2 rounded text-lg ${
                carat===c
                ? "bg-black text-white"
                : "bg-gray-200"
              }`}
            >
              {c}K
            </button>
          ))}
        </div>
      </div>

      {/* WEIGHTS */}
      <div>
        <p className="font-semibold text-lg">Gross Weight (gram)</p>
        <input
          value={gross}
          onChange={(e)=>setGross(+e.target.value)}
          className="w-full p-3 text-lg border rounded"
        />
      </div>

      <div>
        <p className="font-semibold text-lg">Stone Weight (gram)</p>
        <input
          value={stone}
          onChange={(e)=>setStone(+e.target.value)}
          className="w-full p-3 text-lg border rounded"
        />
      </div>

      <div>
        <p className="font-semibold text-lg">Diamond Weight (carat)</p>
        <input
          value={diamondCt}
          onChange={(e)=>setDiamondCt(+e.target.value)}
          className="w-full p-3 text-lg border rounded"
        />
      </div>

      <div>
        <p className="font-semibold text-lg">Diamond Code</p>
        <input
          value={diamondCode}
          onChange={(e)=>setDiamondCode(e.target.value)}
          className="w-full p-3 text-lg border rounded"
        />
      </div>

      <div>
        <p className="font-semibold text-lg">Diamond Profit (₹)</p>
        <input
          value={diamondProfit}
          onChange={(e)=>setDiamondProfit(+e.target.value)}
          className="w-full p-3 text-lg border rounded"
        />
      </div>

      {/* RESULT */}
      <div className="bg-black text-white p-4 rounded text-center">
        <p className="text-xl">Final Price</p>
        <p className="text-3xl font-bold">₹{final.toFixed(0)}</p>
      </div>

    </div>
  );
}