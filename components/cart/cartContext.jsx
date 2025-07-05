import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const getCart = () => {
        return cart;
    };

    const addToCart = (item) => {
        setCart([...cart, item]);
    };

    const removeFromCart = (element) => {
        setCart(
            cart.filter(
                (item) => JSON.stringify(item) !== JSON.stringify(element)
            )
        );
    };

    const cleanCart = () => {
        setCart([]);
    };

    const getNumItems = () => {
        let numItems = 0;
        cart.forEach((itemSandwich) => {
            itemSandwich.kids.forEach((itemKid) => {
                numItems += itemKid.quantity;
            });
        });
        return numItems;
    };

    return (
        <CartContext.Provider
            value={{
                getCart,
                addToCart,
                removeFromCart,
                getNumItems,
                cleanCart,
            }}>
            {children}
        </CartContext.Provider>
    );
};
