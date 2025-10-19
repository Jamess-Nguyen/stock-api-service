import { Header } from "next/dist/lib/load-custom-routes";

// This thing is called a type Alias
type GetResponseData = {
  message: string
}
// Initialization Object
type GetInitObject = {
  status: number,
  statusText: string,
  headers: Headers
}

// Anything after a param or object is called a type annotation
export async function GET(request: Request) {
  const url = new URL(request.url);
  const responseData: GetResponseData = { message: "Simple Getter: " + url.toString()};
  const json = JSON.stringify(responseData);
  const headers = new Headers({ "Content-Type": "application/json" });
  const init: GetInitObject = {
    status: 200,
    statusText: "Success!",
    headers: headers,
  };
  return new Response(json, init);
}
