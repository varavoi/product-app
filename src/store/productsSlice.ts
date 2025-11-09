import { createSlice, WritableDraft } from "@reduxjs/toolkit";

export interface IProduct {
  id: number
  title: string
  description: string
  price: number
  image: string
  category: string
  liked: boolean
}
interface IProductState{
    products:IProduct[]
    showOnlyLiked:boolean
}


const initialState:IProductState = {
    products:[],
    showOnlyLiked:false,
}

const productsSlice =createSlice({
    name:'products',
    initialState,
    reducers:{
        setProducts(state, action){
            state.products = action.payload
        },
        toggleLike(state,action){
            const productId = action.payload
            const product = state.products.find(p=>p.id===productId)
            if(product){
                product.liked =!product.liked
            }
        },
        removeProduct(state,action){
            const productId = action.payload
            state.products = state.products.filter(p => p.id !== productId)
        },
        addProduct(state,action){
            const newProduct = {
              ...action.payload,
              id:state.products.length+1,
              liked:false
            }
            state.products.push(newProduct)
        },
        toggleShowOnlyLiked(state){
            state.showOnlyLiked = !state.showOnlyLiked
        }
    }
})
export const {setProducts,toggleLike,removeProduct,addProduct,toggleShowOnlyLiked} = productsSlice.actions
export default productsSlice.reducer