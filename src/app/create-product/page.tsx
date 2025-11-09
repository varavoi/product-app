'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { addProduct } from '@/store/productsSlice'

export default function CreateProductPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  const [category, setCategory] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Простая валидация
    if (!title || !description || !price || !image || !category) {
      alert('Заполните все поля')
      return
    }

    const newProduct = {
      title,
      description,
      price: parseFloat(price),
      image,
      category,
    }

    dispatch(addProduct(newProduct))
    router.push('/products')
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Добавить товар</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Название</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Цена</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Ссылка на изображение</label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Категория</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Добавить товар
        </button>
      </form>
    </div>
  )
}