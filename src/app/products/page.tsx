'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts, toggleLike, removeProduct, toggleShowOnlyLiked } from '@/store/productsSlice'
import { getProducts } from '@/services/productApi'

export default function ProductsPage() {
  const dispatch = useDispatch()
  const products = useSelector((state: any) => state.products.products)
  const localProducts = useSelector((state: any) => state.products.localProducts)
  const showOnlyLiked = useSelector((state: any) => state.products.showOnlyLiked)
  
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 6

  // Объединяем товары из API и локальные товары
  const allProducts = [...products, ...localProducts]

  // Загружаем товары с API
  useEffect(() => {
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
  }, [dispatch])

  const handleLike = (id: number) => {
    dispatch(toggleLike(id))
  }

  const handleRemove = (id: number) => {
    dispatch(removeProduct(id))
  }

  // Фильтруем товары по избранному и поиску
  let visibleProducts = showOnlyLiked 
    ? allProducts.filter((product: any) => product.liked)
    : allProducts

  // Применяем поиск
  if (search) {
    visibleProducts = visibleProducts.filter((product: any) =>
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase())
    )
  }

  // Пагинация
  const totalPages = Math.ceil(visibleProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const currentProducts = visibleProducts.slice(startIndex, startIndex + productsPerPage)

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  if (loading && products.length === 0) {
    return (
      <div className="p-4">
        <p>Загрузка товаров...</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Все товары</h1>
      
      {/* Информация о товарах */}
      <div className="mb-4 text-sm text-gray-600">
        {localProducts.length > 0 && (
          <p>Показано {allProducts.length} товаров ({products.length} с API + {localProducts.length} ваших)</p>
        )}
      </div>
      
      {/* Поиск */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Поиск товаров..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setCurrentPage(1)
          }}
          className="w-full p-2 border rounded"
        />
      </div>
      
      {/* Фильтр избранного */}
      <button 
        onClick={() => {
          dispatch(toggleShowOnlyLiked())
          setCurrentPage(1)
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {showOnlyLiked ? 'Показать все' : 'Показать избранные'}
      </button>

      {currentProducts.length === 0 ? (
        <p>Товаров не найдено.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {currentProducts.map((product: any) => (
              <div 
                key={product.id} 
                className={`border p-4 rounded cursor-pointer hover:shadow-md ${
                  product.isLocal ? 'bg-blue-50 border-blue-200' : ''
                }`}
                onClick={() => window.location.href = `/products/${product.id}`}
              >
                {/* Пометка для локальных товаров */}
                {product.isLocal && (
                  <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2 inline-block">
                    Ваш товар
                  </div>
                )}
                
                <img src={product.image} alt={product.title} className="w-full h-48 object-contain mb-2" />
                <h3 className="font-semibold">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-2">
                  {product.description.length > 100 
                    ? product.description.slice(0, 100) + '...' 
                    : product.description
                  }
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-bold">${product.price}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLike(product.id)
                      }}
                      className={`text-xl ${product.liked ? 'text-red-500' : 'text-gray-400'}`}
                    >
                      ♥
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemove(product.id)
                      }}
                      className="text-xl text-gray-400"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <button 
                onClick={prevPage}
                disabled={currentPage === 1}
                className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
              >
                Назад
              </button>
              <span>
                Страница {currentPage} из {totalPages}
              </span>
              <button 
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
              >
                Вперед
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}