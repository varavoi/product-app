'use client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts, toggleLike, removeProduct, toggleShowOnlyLiked } from '@/store/productsSlice'

const ProductsPage =()=>{
    const dispatch = useDispatch()
    const products = useSelector((state:any)=>state.products.products)
    const showOnlyLiked = useSelector((state:any)=>state.products.showOnlyLiked)
    // Загружаем товары с API
    useEffect(()=>{
        fetch('https://fakestoreapi.com/products')
            .then(response => response.json())
            .then(data => {
                const productWithLikes = data.map((product:any)=>({
                    ...product,
                    liked:false
                }))
                dispatch(setProducts(productWithLikes))
            });
    },[dispatch])
    const handleLike = (id:number)=>{
        dispatch(toggleLike(id))
    }
    const handleRemove = (id:number)=>{
        dispatch(removeProduct(id))
    }
    // Фильтруем товары
    const visibleProducts = showOnlyLiked
        ? products.filter((product:any)=>product.liked)
        : products
        return (
            <div className='p-4'>
                <h1 className="text-2xl font-bold mb-4">Все товары</h1>
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
                        <div key={product.id} className="border p-4 rounded">
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
                                onClick={() => handleLike(product.id)}
                                className={`text-xl ${product.liked ? 'text-red-500' : 'text-gray-400'}`}
                            >
                                ♥
                            </button>
                            <button 
                                onClick={() => handleRemove(product.id)}
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