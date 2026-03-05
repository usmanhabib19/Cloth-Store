import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const exists = state.items.find(
                (i) => i._id === action.payload._id && i.selectedSize === action.payload.selectedSize
            );
            if (exists) {
                return {
                    ...state,
                    items: state.items.map((i) =>
                        i._id === action.payload._id && i.selectedSize === action.payload.selectedSize
                            ? { ...i, qty: i.qty + (action.payload.qty || 1) }
                            : i
                    ),
                };
            }
            return { ...state, items: [...state.items, { ...action.payload, qty: action.payload.qty || 1 }] };
        }
        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter(
                    (i) => !(i._id === action.payload._id && i.selectedSize === action.payload.selectedSize)
                ),
            };
        case 'UPDATE_QTY':
            return {
                ...state,
                items: state.items.map((i) =>
                    i._id === action.payload._id && i.selectedSize === action.payload.selectedSize
                        ? { ...i, qty: action.payload.qty }
                        : i
                ),
            };
        case 'CLEAR_CART':
            return { ...state, items: [] };
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, { items: [] }, () => {
        try {
            const saved = localStorage.getItem('cart');
            if (saved) {
                const parsed = JSON.parse(saved);
                return (parsed && Array.isArray(parsed.items)) ? parsed : { items: [] };
            }
            return { items: [] };
        } catch {
            return { items: [] };
        }
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(state));
    }, [state]);

    const addToCart = (product) => dispatch({ type: 'ADD_ITEM', payload: product });
    const removeFromCart = (id, size) => dispatch({ type: 'REMOVE_ITEM', payload: { _id: id, selectedSize: size } });
    const updateQty = (id, size, qty) => dispatch({ type: 'UPDATE_QTY', payload: { _id: id, selectedSize: size, qty } });
    const clearCart = () => dispatch({ type: 'CLEAR_CART' });

    const cartCount = state.items.reduce((acc, i) => acc + i.qty, 0);
    const cartTotal = state.items.reduce((acc, i) => acc + i.price * i.qty, 0);

    return (
        <CartContext.Provider value={{ cart: state.items, cartCount, cartTotal, addToCart, removeFromCart, updateQty, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
