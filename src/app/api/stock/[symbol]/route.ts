import { headers } from "next/headers";

type symbolData = {
  "stock": string
  "url": string
}

type DateRange = { 
  startDate: string
  endDate: string 
};

type StooqStock = {
  symbol: string
  date: string  // "YYYY-MM-DD"
  open: number
  high: number
  low: number
  close: number
  volume: number
};

function formatYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function getStartEndDates(dateOffset: number): DateRange {
  const startDate = new Date();
  startDate.setDate(startDate.getDate()-dateOffset);
  const endDate = new Date();
  endDate.setDate(endDate.getDate());
  return {
    startDate: formatYYYYMMDD(startDate),
    endDate: formatYYYYMMDD(endDate)
  };

}

async function fetchStooqEod(symbol: string) {
  const dayRange = 2;
  const { startDate, endDate } = getStartEndDates(dayRange);
  const url = `https://stooq.com/q/d/l/?s=${symbol}&i=d&d1=${startDate}&d2=${endDate}`;
  const stockResponse = await fetch(url, { cache: 'no-store' });
  const stockCsv = await stockResponse.text();

  const [header, ...rows] = stockCsv.split(/\r?\n/);
  const stockRows: StooqStock[] = rows
    .filter((cell) => {
      return cell.length > 0;
    })
    .map((line) => {
      const [date, open, high, low, close, volume] = line.split(",");
      const rowVal = {
        symbol: symbol,
        date: date,
        open: Number(open),
        high: Number(high),
        low: Number(low),
        close: Number(close),
        volume: Number(volume),
      };
      return rowVal;
    });

  stockRows.forEach((row) => {
    console.log(row);
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