export type Product = {
  id: number
  name: string
  sku: string
  price: number
  quantity: number
  category: string
}

export const products: Product[] = [
  { id: 1, name: 'Wireless Mouse', sku: 'WM-1001', price: 29.99, quantity: 150, category: 'Peripherals' },
  { id: 2, name: 'Mechanical Keyboard', sku: 'MK-2010', price: 89.99, quantity: 75, category: 'Peripherals' },
  { id: 3, name: 'USB-C Hub', sku: 'UH-3022', price: 49.99, quantity: 200, category: 'Accessories' },
  { id: 4, name: '27" Monitor', sku: 'MN-4005', price: 349.99, quantity: 30, category: 'Electronics' },
  { id: 5, name: 'Webcam HD', sku: 'WC-5011', price: 59.99, quantity: 120, category: 'Peripherals' },
  { id: 6, name: 'Laptop Stand', sku: 'LS-6003', price: 39.99, quantity: 90, category: 'Accessories' },
  { id: 7, name: 'Bluetooth Speaker', sku: 'BS-7019', price: 79.99, quantity: 60, category: 'Electronics' },
  { id: 8, name: 'Noise-Cancelling Headphones', sku: 'NC-8042', price: 199.99, quantity: 45, category: 'Electronics' },
]
