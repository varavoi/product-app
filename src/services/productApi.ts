// services/productApi.ts

export interface Product {
  id: number
  title: string
  description: string
  price: number
  image: string
  category: string
  liked: boolean
  isLocal?: boolean
}

// Базовый URL для API
const API_BASE_URL = 'https://fakestoreapi.com'

// Обработка ошибок
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

// GET - получить все товары
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`)
    const data = await handleResponse(response)
    
    // Добавляем поле liked к каждому товару
    return data.map((product: any) => ({
      ...product,
      liked: false
    }))
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

// GET - получить товар по ID
export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`)
    const data = await handleResponse(response)
    
    return {
      ...data,
      liked: false
    }
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error)
    throw error
  }
}

// POST - создать новый товар
export const createProduct = async (product: Omit<Product, 'id' | 'liked' | 'isLocal'>): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    })
    
    const data = await handleResponse(response)
    return {
      ...data,
      liked: false,
    isLocal:true
    }
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

// PUT - обновить товар
export const updateProduct = async (id: number, product: Partial<Product>): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    })
    
    const data = await handleResponse(response)
    return data
  } catch (error) {
    console.error(`Error updating product ${id}:`, error)
    throw error
  }
}

// DELETE - удалить товар
export const deleteProduct = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    })
    
    await handleResponse(response)
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error)
    throw error
  }
}