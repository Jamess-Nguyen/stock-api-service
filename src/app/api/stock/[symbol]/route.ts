import { CONTENT_TYPES, HTTP } from "@/lib/https";
import * as stooq from "@/app/features/stock/stook"

export async function GET(request: Request){
  // Path Stuff
  const url = new URL(request.url);
  const urlArray = url.pathname.split("/").filter((val)=> {return val.length>0});
  const symbol =urlArray[urlArray.length-1];
  
  // Reponse Payload + Options Object (Init)
  const responseData = await stooq.fetchStooqEod(symbol);
  const headers = {
    "Content-Type": responseData.contentType
  };
  const init = {
    status: HTTP.OK,
    headers: headers
  };

  const response = new Response(responseData.content, init)
  return response
}