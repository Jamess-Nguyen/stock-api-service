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

function parseStooqCsv(csv: string, symbol: string): Map<string, StooqStock> {
  const [header, ...rows] = csv.split(/\r?\n/);
  const stockRows: Map<string, StooqStock> = rows
    .filter((cell: string) => {
      return cell.length > 0;
    })
    .map((row: string) => {
      const [date, open, high, low, close, volume] = row.split(",");
      const rowVal: StooqStock = {
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
    .reduce((acc: Map<string, StooqStock>, row: StooqStock) => {
      acc.set(row.date, row);
      return acc;
    }, new Map<string, StooqStock>());

  return stockRows;
}

async function fetchStooqEod(symbol: string): Promise<string> {
  // Curl & Process the Data
  const dayRange = 5; // Range is exclusive
  const { startDate, endDate } = getStartEndDates(dayRange);
  const url = `https://stooq.com/q/d/l/?s=${symbol}&i=d&d1=${startDate}&d2=${endDate}`;
  const stockResponse = await fetch(url, { cache: 'no-store' });
  const stockCsv = await stockResponse.text();
  const stockRows = parseStooqCsv(stockCsv, symbol);
  
  // Prep for Json
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
  
  const headers = {
    "Content-Type": "application/json"
  };
  const init = {
    status: 200,
    statusText: "OK",
    headers: headers
  };

  const response = new Response(jsonData, init)
  return response
}