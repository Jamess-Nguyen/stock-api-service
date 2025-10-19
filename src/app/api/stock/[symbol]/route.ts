import { headers } from "next/headers";

type symbolData = {
  "stock": string
  "url": string
}

async function fetchStooqEod(symbol: string){
  const url = `https://stooq.com/q/d/l/?s=${symbol}&i=d&d1=20250901&d2=20250930`;
  const stockResponse = await fetch(url, { cache: 'no-store' });
  const stockCsv = await stockResponse.text();
  const [header, ...lines] = stockCsv.split(/\r?\n/);
  console.log("i'm here")
  console.log(stockResponse)
  lines.forEach((line) => {
    console.log(line)
  });
}

export async function GET(request: Request){
  const url = new URL(request.url);
  const urlArray = url.pathname.split("/").filter((val)=> {return val.length>0});
  const symbol =urlArray[urlArray.length-1];
  const symbolData: symbolData = {
    "stock": symbol,
    "url": url.pathname
  }
  const jsonData = JSON.stringify(symbolData)
  const headers = new Headers({
    "Content-Type": "application/json"
  })
  const init = {
    status: 200,
    statusText: "OK",
    headers: headers
  }
  const response = new Response(jsonData, init)
  fetchStooqEod(symbol)
  return response
}