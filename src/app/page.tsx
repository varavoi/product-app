import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Добро пожаловать в наш магазин!</h1>
      <p className="mb-8">Здесь вы можете просматривать товары и добавлять новые.</p>
      
      <div className="space-x-4">
        <Link href="/products" className="bg-blue-500 text-white px-4 py-2 rounded">
          Смотреть товары
        </Link>
        <Link href="/create-product" className="bg-green-500 text-white px-4 py-2 rounded">
          Добавить товар
        </Link>
      </div>
    </div>
  )
}