'use client'
import { IProduct } from "@/store/productsSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
interface IProps {
    product:IProduct
    onLike:(id:number)=>void
    onRemove:(id:number)=>void
}
const ProductCard = ({product,onLike,onRemove}:IProps) => {
    const router = useRouter()
    const handleClick =()=>{
        router.push(`/products/${product.id}`)
    }
    const handleLike =(e:React.MouseEvent)=>{
        e.stopPropagation()
        onLike(product.id)
    }
    const handleRemove=(e:React.MouseEvent)=>{
        e.stopPropagation()
        onRemove(product.id)
    }
    const shortText = product.description.length>100
                        ? product.description.slice(0,100)+'...'
                        :product.description
    return (
        <div className="border p-4 rounded shadow-sm cursor-pointer" onClick={handleClick}>
        <Image src={product.image} alt={product.title} className="w-full h-48 object-contain mb-2" />
        <h3 className="font-semibold">{product.title}</h3>
        <p className="text-gray-600 text-sm">{shortText}</p>
        <div className="flex justify-between items-center mt-2">
            <span className="font-bold">${product.price}</span>
            <div className="flex gap-2">
            <button 
                onClick={handleLike}
                className={`text-xl ${product.liked ? 'text-red-500' : 'text-gray-400'}`}
            >
                ♥
            </button>
            <button 
                onClick={handleRemove}
                className="text-xl text-gray-400"
            >
                ×
            </button>
            </div>
      </div>
    </div>
    );
};

export default ProductCard;