'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts, toggleLike, removeProduct, toggleShowOnlyLiked } from '@/store/productsSlice'
import { getProducts } from '@/services/productApi'
import ProductCard from '@/components/ProductCard'
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

 // Загружаем товары с API только если их нет в localStorage
  useEffect(() => {
    // Если товаров нет, загружаем их
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
        {/* Кнопка для отладки - очистка localStorage */}
  <button 
    onClick={() => {
      localStorage.removeItem('reduxState')
      window.location.reload()
    }}
    className="bg-red-500 text-white px-4 py-2 rounded text-sm"
  >
    Очистить данные
  </button>
      {currentProducts.length === 0 ? (
        <p>Товаров не найдено.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {currentProducts.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                onLike={handleLike}
                onRemove={handleRemove}
              />
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