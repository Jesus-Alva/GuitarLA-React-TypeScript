import { useState, useEffect, useMemo } from 'react';
import {db} from "../data/db";
import type { Guitar, CartItem } from '../types';


export const useCart = () => {
    
    const initialCart = () : CartItem[] =>{
        const localStorageCart = localStorage.getItem('cart');
        return localStorageCart ? JSON.parse(localStorageCart) : [];
    };

    const [data] = useState(db);
    const [cart, setCart] = useState(initialCart);

    const MAX_ITEMS = 5;
    const MIN_ITEMS = 1;

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    function addToCart(item : Guitar){

        const itemExist = cart.findIndex(guitar => guitar.id === item.id);

        if(itemExist >= 0){
            if(cart[itemExist].quantity >= MAX_ITEMS) return
            const updateCart = [...cart];
            updateCart[itemExist].quantity++;
            setCart(updateCart);
        }else{
            const newItem : CartItem = {...item, quantity : 1}
            setCart([...cart, newItem]);
        }
        
    }

    function removeFromCart(id : Guitar['id']){
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }

    function increaseQuantity(id : Guitar['id']){
        const updatedCart = cart.map(items => {
            if(items.id === id && items.quantity < MAX_ITEMS){
                return {
                    ...items,
                    quantity: items.quantity + 1
                }
            }
            return items;
        })
        setCart(updatedCart);
    }
    function decreaseQuantity(id : Guitar['id']){
        const updatedCart = cart.map(items => {
            if(items.id === id && items.quantity > MIN_ITEMS){
                return {
                    ...items,
                    quantity: items.quantity - 1
                }
            }
            return items;
        })
        setCart(updatedCart);
    }
    function clearCart(){
        setCart([]);
    }

    //State derivado
    const isEmpty = useMemo(() => cart.length === 0, [cart]);
    const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart]);

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }

}