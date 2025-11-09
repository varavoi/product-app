import { createSlice,PayloadAction } from '@reduxjs/toolkit'

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
      // Сохраняем лайки при обновлении товаров с API
      const newProducts = action.payload
      
      // Создаем карту существующих товаров с их лайками
      const existingProductsMap = new Map()
      state.products.forEach(product => {
        existingProductsMap.set(product.id, product)
      })
      
      // Обновляем товары, сохраняя лайки
      state.products = newProducts.map((newProduct: Product) => {
        const existingProduct = existingProductsMap.get(newProduct.id)
        if (existingProduct) {
          // Если товар уже существует, сохраняем его лайк
          return {
            ...newProduct,
            liked: existingProduct.liked
          }
        }
        // Новый товар - лайк по умолчанию false
        return newProduct
      })
      
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
      
      state.products = state.products.filter(p => p.id !== productId)
      state.localProducts = state.localProducts.filter(p => p.id !== productId)
      
      saveToLocalStorage({ products: state })
    },
    addProduct(state, action:PayloadAction<Omit<Product,'id'|'liked'|'isLocal'>>) {
      const newProduct = {
        ...action.payload,
        id: Date.now(),
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