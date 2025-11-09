'use client'

import { useParams, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const products = useSelector((state: any) => state.products.products)
  
  const productId = Number(params.id)
  const product = products.find((p: any) => p.id === productId)

  if (!product) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Товар не найден</h1>
        <button 
          onClick={() => router.push('/products')}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Назад к товарам
        </button>
      </div>
    )
  }

  return (
    <div className="p-4">
      <button 
        onClick={() => router.push('/products')}
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded"
      >
        Назад
      </button>
      
      <div className="border p-4 rounded max-w-2xl mx-auto">
        <img src={product.image} alt={product.title} className="w-full h-64 object-contain mb-4" />
        <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
        <p className="text-gray-700 mb-4">{product.description}</p>
        <p className="text-2xl font-bold text-blue-600">${product.price}</p>
        <p className="text-sm text-gray-500">Категория: {product.category}</p>
        <div className="mt-4">
          <span className={`text-lg ${product.liked ? 'text-red-500' : 'text-gray-400'}`}>♥</span>
          <span className="ml-2">{product.liked ? 'В избранном' : 'Не в избранном'}</span>
        </div>
      </div>
    </div>
  )
}