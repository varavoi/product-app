import { createSlice } from '@reduxjs/toolkit'

// Функции для работы с localStorage
const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('reduxState')
    if (serializedState === null) return undefined
    return JSON.parse(serializedState)
  } catch (e) {
    return undefined
  }
}

const saveToLocalStorage = (state: any) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('reduxState', serializedState)
  } catch (e) {
    console.log(e)
  }
}

export interface Product {
  id: number
  title: string
  description: string
  price: number
  image: string
  category: string
  liked: boolean
  isLocal?: boolean // Флаг для локальных товаров
}

interface ProductsState {
  products: Product[]
  showOnlyLiked: boolean
  localProducts: Product[] // Отдельный массив для локальных товаров
}

const persistedState = loadFromLocalStorage()

const initialState: ProductsState = persistedState?.products || {
  products: [],
  showOnlyLiked: false,
  localProducts: []
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, action) {
      state.products = action.payload
      saveToLocalStorage({ products: state })
    },
    setLocalProducts(state, action) {
      state.localProducts = action.payload
      saveToLocalStorage({ products: state })
    },
    toggleLike(state, action) {
      const productId = action.payload
      
      // Ищем в основных товарах
      let product = state.products.find(p => p.id === productId)
      if (product) {
        product.liked = !product.liked
      }
      
      // Ищем в локальных товарах
      product = state.localProducts.find(p => p.id === productId)
      if (product) {
        product.liked = !product.liked
      }
      
      saveToLocalStorage({ products: state })
    },
    removeProduct(state, action) {
      const productId = action.payload
      
      // Удаляем из основных товаров
      state.products = state.products.filter(p => p.id !== productId)
      // Удаляем из локальных товаров
      state.localProducts = state.localProducts.filter(p => p.id !== productId)
      
      saveToLocalStorage({ products: state })
    },
    addProduct(state, action) {
      const newProduct = {
        ...action.payload,
        id: Date.now(), // Используем timestamp для уникального ID
        liked: false,
        isLocal: true
      }
      state.localProducts.push(newProduct)
      saveToLocalStorage({ products: state })
    },
    toggleShowOnlyLiked(state) {
      state.showOnlyLiked = !state.showOnlyLiked
      saveToLocalStorage({ products: state })
    }
  },
})

export const { 
  setProducts, 
  setLocalProducts,
  toggleLike, 
  removeProduct, 
  addProduct, 
  toggleShowOnlyLiked 
} = productsSlice.actions
export default productsSlice.reducer