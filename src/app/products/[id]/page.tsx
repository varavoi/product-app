'use client'

import { useParams, useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { setProducts } from '@/store/productsSlice'
import { getProducts } from '@/services/productApi'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch()
  const products = useSelector((state: any) => state.products.products)
  const localProducts = useSelector((state: any) => state.products.localProducts)
  const [loading, setLoading] = useState(false)
  
  const productId = Number(params.id)

  // Объединяем товары из API и локальные
  const allProducts = [...products, ...localProducts]

  // Загружаем товары, если их нет в store
  useEffect(() => {
    if (products.length === 0) {
      setLoading(true)
      const loadProducts = async () => {
        try {
          const productsData = await getProducts()
          dispatch(setProducts(productsData))
        } catch (error) {
          console.error('Failed to load products:', error)
        } finally {
          setLoading(false)
        }
      }
      loadProducts()
    }
  }, [dispatch, products.length])

  const product = allProducts.find((p: any) => p.id === productId)

  if (loading) {
    return (
      <div className="p-4">
        <p>Загрузка товара...</p>
      </div>
    )
  }

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
      
      {/* Пометка для локальных товаров */}
      {product.isLocal && (
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded mb-4 inline-block">
          Ваш товар
        </div>
      )}
      
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