'use client'

import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <Link href="/" className="text-xl font-bold">
          Магазин
        </Link>
        <div className="space-x-4">
          <Link href="/products" className="hover:underline">
            Товары
          </Link>
          <Link href="/create-product" className="hover:underline">
            Добавить товар
          </Link>
        </div>
      </div>
    </nav>
  )
}