type ResponseObject = {
  "URL": string
  "pathParam": string
  "status": number
}

async function GET(request: Request){
  const url: URL = new URL(request.url);
  const urlPath = url.pathname.split("/");
  const pathParam = urlPath[urlPath.length - 1];
  const success: number = 200;

  const responseData: ResponseObject = {
    "URL": url.toString(),
    "pathParam": pathParam,
    "status": success
  };
  const responseJson = JSON.stringify(responseData)
  const headers = new Headers({"content-type" : "application/json"})
  const init = {
    status: success,
    statusText: "OK",
    headers: headers
  }

  const response = new Response(responseJson, init)

  return response
}

export { GET };