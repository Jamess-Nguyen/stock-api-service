import { Header } from "next/dist/lib/load-custom-routes";

// This thing is called a type Alias
type getResponseData = {
  message: string
}
// Initialization Object
type getInitObject = {
  status: number,
  statusText: string,
  header: Headers
}

// Anything after a param or object is called a type annotation
export async function GET(request: Request) {
  const url = new URL(request.url);
  const responseData = { message: "Hello World: " + url.toString()};
  const json = JSON.stringify(responseData);
  const headers = new Headers({ "Content-Type": "application/json" });
  const init = {
    status: 200,
    statusText: "Success!",
    headers,
  };
  return new Response(json, init);
}
