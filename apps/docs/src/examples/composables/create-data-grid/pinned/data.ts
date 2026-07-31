export type Stock = {
  id: number
  ticker: string
  company: string
  price: number
  change: number
  volume: number
  cap: number
  pe: number
  eps: number
  dividend: number
  sector: string
}

export const stocks: Stock[] = [
  { id: 1, ticker: 'AAPL', company: 'Apple Inc.', price: 198.11, change: 1.24, volume: 54_300_000, cap: 3_080_000, pe: 32.4, eps: 6.11, dividend: 0.55, sector: 'Tech' },
  { id: 2, ticker: 'MSFT', company: 'Microsoft Corp.', price: 452.37, change: -0.38, volume: 22_100_000, cap: 3_360_000, pe: 37.1, eps: 12.2, dividend: 0.72, sector: 'Tech' },
  { id: 3, ticker: 'GOOGL', company: 'Alphabet Inc.', price: 176.89, change: 2.15, volume: 28_700_000, cap: 2_180_000, pe: 25.6, eps: 6.91, dividend: 0, sector: 'Tech' },
  { id: 4, ticker: 'JNJ', company: 'Johnson & Johnson', price: 155.42, change: -0.72, volume: 8_400_000, cap: 374_000, pe: 15.8, eps: 9.84, dividend: 2.96, sector: 'Healthcare' },
  { id: 5, ticker: 'UNH', company: 'UnitedHealth Group', price: 527.63, change: 0.89, volume: 3_200_000, cap: 486_000, pe: 21.3, eps: 24.77, dividend: 1.42, sector: 'Healthcare' },
  { id: 6, ticker: 'PFE', company: 'Pfizer Inc.', price: 27.14, change: -1.53, volume: 41_600_000, cap: 153_000, pe: 45.2, eps: 0.6, dividend: 5.88, sector: 'Healthcare' },
  { id: 7, ticker: 'JPM', company: 'JPMorgan Chase', price: 205.88, change: 0.67, volume: 9_800_000, cap: 592_000, pe: 12.1, eps: 17.02, dividend: 2.34, sector: 'Finance' },
  { id: 8, ticker: 'GS', company: 'Goldman Sachs', price: 478.21, change: -0.14, volume: 2_100_000, cap: 158_000, pe: 16.7, eps: 28.63, dividend: 2.1, sector: 'Finance' },
  { id: 9, ticker: 'XOM', company: 'Exxon Mobil Corp.', price: 104.56, change: 1.87, volume: 15_900_000, cap: 438_000, pe: 13.4, eps: 7.8, dividend: 3.45, sector: 'Energy' },
  { id: 10, ticker: 'CVX', company: 'Chevron Corp.', price: 152.73, change: -0.91, volume: 7_300_000, cap: 284_000, pe: 14.9, eps: 10.25, dividend: 4.12, sector: 'Energy' },
  { id: 11, ticker: 'PG', company: 'Procter & Gamble', price: 165.3, change: 0.33, volume: 6_500_000, cap: 389_000, pe: 27.5, eps: 6.01, dividend: 2.38, sector: 'Consumer' },
  { id: 12, ticker: 'KO', company: 'Coca-Cola Co.', price: 62.17, change: -0.22, volume: 12_800_000, cap: 268_000, pe: 24.1, eps: 2.58, dividend: 3.07, sector: 'Consumer' },
]
