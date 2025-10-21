import { headers } from "next/headers";

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

async function fetchStooqEod(symbol: string): Promise<string> {
  const dayRange = 5; // Minimum dayRange must be 2 to get the most recent day
  const { startDate, endDate } = getStartEndDates(dayRange);
  const url = `https://stooq.com/q/d/l/?s=${symbol}&i=d&d1=${startDate}&d2=${endDate}`;
  const stockResponse = await fetch(url, { cache: 'no-store' });
  const stockCsv = await stockResponse.text();
  const [header, ...rows] = stockCsv.split(/\r?\n/);
  const stockRows: Map<string, StooqStock> = rows
    .filter((cell) => {
      return cell.length > 0;
    })
    .map((row) => {
      const [date, open, high, low, close, volume] = row.split(",");
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
    })
    .reduce((acc, row) => {
      acc.set(row.date, row);
      return acc;
    }, new Map<string, StooqStock>());


  stockRows.forEach((rec, date) => {
    console.log(date, rec);
  });

  const byDateObj = Object.fromEntries(stockRows) as Record<string, StooqStock>;
  const jsonData = JSON.stringify(byDateObj, null, 2);

  return jsonData;
}

export async function GET(request: Request){
  // Path Stuff
  const url = new URL(request.url);
  const urlArray = url.pathname.split("/").filter((val)=> {return val.length>0});
  const symbol =urlArray[urlArray.length-1];
  
  // Reponse Payload + Options Object (Init)
  const jsonData = await fetchStooqEod(symbol);
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