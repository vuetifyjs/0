export type Holding = {
  id: number
  account: string
  assetClass: string
  ticker: string
  name: string
  value: number
  change: number
}

export const holdings: Holding[] = [
  { id: 1, account: 'Wealth Account', assetClass: 'Equities', ticker: 'AAPL', name: 'Apple Inc.', value: 180_000, change: 2.4 },
  { id: 2, account: 'Wealth Account', assetClass: 'Equities', ticker: 'MSFT', name: 'Microsoft Corp.', value: 245_000, change: 1.8 },
  { id: 3, account: 'Wealth Account', assetClass: 'Equities', ticker: 'NVDA', name: 'NVIDIA Corp.', value: 295_000, change: 5.2 },
  { id: 4, account: 'Wealth Account', assetClass: 'Bonds', ticker: 'US-10Y', name: 'Treasury Note 10Y', value: 150_000, change: -0.3 },
  { id: 5, account: 'Wealth Account', assetClass: 'Bonds', ticker: 'GS-AAA', name: 'Goldman Corp. AAA', value: 150_000, change: 0.1 },
  { id: 6, account: 'Wealth Account', assetClass: 'Real Estate', ticker: 'VNQ', name: 'Vanguard REIT', value: 180_000, change: 0.9 },
  { id: 7, account: 'Retirement', assetClass: 'Equities', ticker: 'VOO', name: 'S&P 500 ETF', value: 230_000, change: 1.4 },
  { id: 8, account: 'Retirement', assetClass: 'Equities', ticker: 'VTI', name: 'Total Market ETF', value: 170_000, change: 1.6 },
  { id: 9, account: 'Retirement', assetClass: 'Cash', ticker: 'MMF', name: 'Money Market Fund', value: 180_000, change: 0 },
  { id: 10, account: 'Trust', assetClass: 'Equities', ticker: 'GOOGL', name: 'Alphabet Class A', value: 250_000, change: 3.1 },
  { id: 11, account: 'Trust', assetClass: 'Bonds', ticker: 'CA-MUNI', name: 'California Muni AAA', value: 200_000, change: 0.4 },
]
