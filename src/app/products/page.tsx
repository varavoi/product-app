'use client'
import { useEffect,useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts, toggleLike, removeProduct, toggleShowOnlyLiked } from '@/store/productsSlice'

const ProductsPage =()=>{
    const dispatch = useDispatch()
    const products = useSelector((state:any)=>state.products.products)
    const showOnlyLiked = useSelector((state:any)=>state.products.showOnlyLiked)
     const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
    // Загружаем товары с API
    useEffect(()=>{
        fetch('https://fakestoreapi.com/products')
            .then(response => response.json())
            .then(data => {
                console.log(data)
                const productWithLikes = data.map((product:any)=>({
                    ...product,
                    liked:false
                }))
                dispatch(setProducts(productWithLikes))
                setLoading(false)
            });
    },[dispatch])
    const handleLike = (id:number)=>{
        dispatch(toggleLike(id))
    }
    const handleRemove = (id:number)=>{
        dispatch(removeProduct(id))
    }
    // Фильтруем товары
    let visibleProducts = showOnlyLiked
        ? products.filter((product:any)=>product.liked)
        : products

       // Применяем поиск
  if (search) {
    visibleProducts = visibleProducts.filter((product: any) =>
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase())
    )
  } 
  if (loading) {
    return (
      <div className="p-4">
        <p>Загрузка товаров...</p>
      </div>
    )
  }

        return (
            <div className='p-4'>
                <h1 className="text-2xl font-bold mb-4">Все товары</h1>
                {/* Поиск */}
                <div className="mb-4">
                    <input
                    type="text"
                    placeholder="Поиск товаров..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-2 border rounded"
                    />
                </div>
                {/* Фильтр избранного */}
                <button 
                    onClick={() => dispatch(toggleShowOnlyLiked())}
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                >
                    {showOnlyLiked ? 'Показать все' : 'Показать избранные'}
                </button>
                {visibleProducts.length === 0 ? (
                <p>Товаров нет.</p>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {visibleProducts.map((product: any) => (
                        <div 
                            key={product.id} 
                            className="border p-4 rounded"
                            onClick={() => window.location.href = `/products/${product.id}`}
                            >
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
                )}
            </div>
        )
}
export default ProductsPage