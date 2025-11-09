'use client'

import { Product } from '@/store/productsSlice'
import { useRouter } from 'next/navigation'

interface Props {
  product: Product
  onLike: (id: number) => void
  onRemove: (id: number) => void
}

export default function ProductCard({ product, onLike, onRemove }: Props) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/products/${product.id}`)
  }

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    onLike(product.id)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRemove(product.id)
  }

  const shortDescription = product.description.length > 100 
    ? product.description.slice(0, 100) + '...' 
    : product.description

  return (
    <div 
      className={`border p-4 rounded cursor-pointer hover:shadow-md transition-all ${
        product.isLocal ? 'bg-blue-50 border-blue-200' : 'bg-white'
      }`}
      onClick={handleClick}
    >
      {/* Пометка для локальных товаров */}
      {product.isLocal && (
        <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2 inline-block">
          Ваш товар
        </div>
      )}
      
      <div className="flex justify-center mb-4">
        <img 
          src={product.image} 
          alt={product.title} 
          className="h-40 object-contain"
        />
      </div>
      
      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{shortDescription}</p>
      
      <div className="flex justify-between items-center">
        <span className="font-bold text-blue-600">${product.price}</span>
        <div className="flex gap-2">
          <button 
            onClick={handleLike}
            className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${
              product.liked ? 'text-red-500' : 'text-gray-400'
            }`}
            title={product.liked ? 'Убрать из избранного' : 'Добавить в избранное'}
          >
            <span className="text-xl">♥</span>
          </button>
          <button 
            onClick={handleRemove}
            className="p-1 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors"
            title="Удалить товар"
          >
            <span className="text-xl">×</span>
          </button>
        </div>
      </div>
    </div>
  )
}