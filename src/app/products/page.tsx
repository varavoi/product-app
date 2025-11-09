'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts, toggleLike, removeProduct, toggleShowOnlyLiked } from '@/store/productsSlice'
import { getProducts } from '@/services/productApi'
import SearchBar from '@/components/SearchBar'
import ProductsGrid from '@/components/ProductsGrid'
import Pagination from '@/components/Pagination'
import Loading from '@/components/Loading'

export default function ProductsPage() {
  const dispatch = useDispatch()
  const products = useSelector((state: any) => state.products.products)
  const localProducts = useSelector((state: any) => state.products.localProducts)
  const showOnlyLiked = useSelector((state: any) => state.products.showOnlyLiked)
  
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 6

  // Объединяем товары из API и локальные товары
  const allProducts = [...products, ...localProducts]

  // Загружаем товары с API только если их нет в localStorage
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

  const handleLike = (id: number) => {
    dispatch(toggleLike(id))
  }

  const handleRemove = (id: number) => {
    dispatch(removeProduct(id))
  }

  const handleToggleShowOnlyLiked = () => {
    dispatch(toggleShowOnlyLiked())
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
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
    return <Loading message="Загрузка товаров..." />
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Все товары</h1>
      
      <SearchBar
        search={search}
        onSearchChange={handleSearchChange}
        showOnlyLiked={showOnlyLiked}
        onToggleShowOnlyLiked={handleToggleShowOnlyLiked}
        productsCount={allProducts.length}
        apiProductsCount={products.length}
        localProductsCount={localProducts.length}
      />

      <ProductsGrid
        products={currentProducts}
        onLike={handleLike}
        onRemove={handleRemove}
        loading={loading && products.length === 0}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onNextPage={nextPage}
        onPrevPage={prevPage}
      />
    </div>
  )
}