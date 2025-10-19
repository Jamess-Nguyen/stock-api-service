import { headers } from "next/headers";

type symbolData = {
  "stock": string
  "url": string
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

  return response
}