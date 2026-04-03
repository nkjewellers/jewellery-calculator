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

  const [goldMaking, setGoldMaking] = useState(0);
  const [makingType, setMakingType] = useState("perGram");

  const purityMap:any = {
    24:1, 22:0.93, 20:0.86, 18:0.78, 14:0.62
  };

  const map:any = {
    k:1,g:2,c:3,h:4,o:5,
    i:6,t:7,r:8,a:9,m:0
  };

  const rate22 = rate24 * 0.93;
  const rate20 = rate24 * 0.86;
  const rate18 = rate24 * 0.78;
  const rate14 = rate24 * 0.62;

  const rate10 = rate24 * purityMap[carat];
  const ratePerGram = rate10 / 10;

  const diamondGram = diamondCt * 0.2;
  const net = Math.max(0, gross - stone - diamondGram);

  let polishValue = polishType === "percent"
    ? (net * polish) / 100
    : polish;

  const totalGoldWeight = net + polishValue;
  const goldValue = totalGoldWeight * ratePerGram;

  let goldMakingValue = 0;
  if (makingType === "perGram") {
    goldMakingValue = net * goldMaking;
  } else if (makingType === "percent") {
    goldMakingValue = (goldValue * goldMaking) / 100;
  } else {
    goldMakingValue = goldMaking;
  }

  const cleanCode = diamondCode.trim().toLowerCase();

  let num = "";
  for (let ch of cleanCode) {
    if (map[ch] !== undefined) num += map[ch];
  }

  const diamondRate = num ? parseInt(num + "00") : 0;
  const diamondCost = diamondRate * diamondCt;
  const diamondTotal = diamondCost + diamondProfit;

  const totalWithoutGST =
    goldValue + goldMakingValue + diamondTotal;

  const gst = totalWithoutGST * 0.03;
  const final = totalWithoutGST + gst;

  return (
    <div className="p-4 max-w-md mx-auto space-y-4 bg-black text-white min-h-screen">

      <h1 className="text-3xl font-bold text-center">
        💎 Jewellery Calculator
      </h1>

      <p>24K Gold Rate</p>
      <input value={rate24}
        onChange={(e)=>setRate24(+e.target.value)}
        className="w-full p-2 border"/>

      <p>22K: {rate22}</p>
      <p>20K: {rate20}</p>
      <p>18K: {rate18}</p>
      <p>14K: {rate14}</p>

      {/* CT BUTTON FIX */}
      <div>
        {[24,22,20,18,14].map(c => (
          <button
            key={c}
            onClick={() => setCarat(c)}
            className={`p-2 m-1 ${
              carat === c
                ? "bg-white text-black"
                : "bg-gray-700 text-white"
            }`}
          >
            {c}K
          </button>
        ))}
      </div>

      <input placeholder="Gross Weight"
        value={gross}
        onChange={(e)=>setGross(+e.target.value)}
        className="w-full p-2 border"/>

      <input placeholder="Stone Weight"
        value={stone}
        onChange={(e)=>setStone(+e.target.value)}
        className="w-full p-2 border"/>

      <input placeholder="Diamond Weight (ct)"
        value={diamondCt}
        onChange={(e)=>setDiamondCt(+e.target.value)}
        className="w-full p-2 border"/>

      <input placeholder="Diamond Code"
        value={diamondCode}
        onChange={(e)=>setDiamondCode(e.target.value)}
        className="w-full p-2 border"/>

      <input placeholder="Diamond Profit"
        value={diamondProfit}
        onChange={(e)=>setDiamondProfit(+e.target.value)}
        className="w-full p-2 border"/>

      <div className="flex gap-2">
        <input placeholder="Polish"
          value={polish}
          onChange={(e)=>setPolish(+e.target.value)}
          className="w-full p-2 border"/>
        <select onChange={(e)=>setPolishType(e.target.value)}>
          <option value="percent">%</option>
          <option value="flat">₹</option>
        </select>
      </div>

      <div className="flex gap-2">
        <input placeholder="Gold Making"
          value={goldMaking}
          onChange={(e)=>setGoldMaking(+e.target.value)}
          className="w-full p-2 border"/>
        <select onChange={(e)=>setMakingType(e.target.value)}>
          <option value="perGram">/gm</option>
          <option value="percent">%</option>
          <option value="flat">₹</option>
        </select>
      </div>

      <div className="text-2xl font-bold">
        ₹{final.toFixed(0)}
      </div>

    </div>
  );
}