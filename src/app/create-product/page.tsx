'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { addProduct } from '@/store/productsSlice'
import { createProduct } from '@/services/productApi'

export default function CreateProductPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    category: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Простая валидация
    if (!title || !description || !price || !image || !category) {
      alert('Заполните все поля')
      return
    }
    setLoading(true)
    try{
        const newProductData  = {
            title,
            description,
            price: parseFloat(price),
            image,
            category,
        }
    const createdProduct = await createProduct(newProductData)
     dispatch(addProduct(createdProduct))
        router.push('/products')
    }
    catch(error){
        console.error('Failed to create product:', error)
        alert('Ошибка при создании товара')
    }
    finally{
        setLoading(false)
    }
  }

  const {title, description, price, image, category}=formData
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
        ...prev,
        [name]: value
        }))
    }
  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Добавить товар</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Название</label>
          <input
            type="text"
            name='title'
            value={title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Описание</label>
          <textarea
            value={description}
            name='description'
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Цена</label>
          <input
            type="number"
            step="0.01"
            name='price'
            value={price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Ссылка на изображение</label>
          <input
            type="url"
            value={image}
            name='image'
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Категория</label>
          <input
            type="text"
            value={category}
            name='category'
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        
        <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded"
        
        >
          {loading ? 'Добавление...' : 'Добавить товар'}
        </button>
      </form>
    </div>
  )
}