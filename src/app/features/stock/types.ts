export type DateRange = { 
  startDate: string
  endDate: string 
};

export type StooqStock = {
  symbol: string
  date: string  // "YYYY-MM-DD"
  open: number
  high: number
  low: number
  close: number
  volume: number
};

export type ResponseData = {
  content: string
  contentType: string
};
