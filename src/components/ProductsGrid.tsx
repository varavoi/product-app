'use client'

import { Product } from '@/store/productsSlice'
import ProductCard from './ProductCard'

interface ProductsGridProps {
  products: Product[]
  onLike: (id: number) => void
  onRemove: (id: number) => void
  loading?: boolean
}

export default function ProductsGrid({ 
  products, 
  onLike, 
  onRemove, 
  loading = false 
}: ProductsGridProps) {
  if (loading) {
    return (
      <div className="p-4">
        <p>Загрузка товаров...</p>
      </div>
    )
  }

  if (products.length === 0) {
    return <p>Товаров не найдено.</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onLike={onLike}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}