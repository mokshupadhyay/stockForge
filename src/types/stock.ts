export interface Stock {
  ticker: string;
  price: string;
  change_amount: string;
  change_percentage: string;
  volume: string;
}

export interface StockData {
  metadata: string;
  last_updated: string;
  top_gainers: Stock[];
  top_losers: Stock[];
  most_actively_traded: Stock[];
}
