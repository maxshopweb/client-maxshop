import { ICartItem } from "../types/cart.type";
import { CartItem } from "./checkout/useCheckoutStore";

interface UseNormalizeProductProps {
    product: ICartItem | CartItem;
}

export const useNormalizeProduct = ({ product }: UseNormalizeProductProps) => {
    // Determinar si es ICartItem (tiene producto) o CartItem (tiene nombre, img_principal)
    const isICartItem = 'producto' in product;
    
    // Extraer id
    const id_prod = isICartItem ? (product as ICartItem).id_prod : (product as CartItem).id;
    
    // Extraer datos según el tipo
    const nombre = isICartItem 
        ? (product as ICartItem).producto?.nombre || "Producto sin nombre" 
        : (product as CartItem).nombre;
    
    const img_principal = isICartItem 
        ? (product as ICartItem).producto?.img_principal || "" 
        : (product as CartItem).img_principal;
    
    const codi_arti = isICartItem 
        ? (product as ICartItem).producto?.codi_arti 
        : undefined;
    
    const marca = isICartItem 
        ? (product as ICartItem).producto?.marca 
        : undefined;
    
    const cantidad = product.cantidad;
    const precio_unitario = isICartItem 
        ? (product as ICartItem).precio_unitario 
        : (product as CartItem).precio;
    
    const subtotal = product.subtotal;
    const descuento = isICartItem 
        ? (product as ICartItem).descuento || 0 
        : 0;

    const tieneDescuento = descuento > 0;
    const porcentajeDescuento = tieneDescuento && precio_unitario
        ? Math.round((descuento / (precio_unitario * cantidad + descuento)) * 100)
        : 0;

    return {
        id_prod,
        nombre,
        img_principal,
        codi_arti,
        marca,
        cantidad,
        precio_unitario,
        subtotal,
        descuento,
        porcentajeDescuento,
        tieneDescuento
    };
}