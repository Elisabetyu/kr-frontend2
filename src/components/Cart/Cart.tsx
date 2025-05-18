// [file name]: components/Cart/Cart.tsx
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Link, useNavigate } from 'react-router-dom';
import stylesheet from './Cart.module.css';

interface CartItem {
    id: number;
    product_id: number;
    amount: number;
    user_id: number;
    name: string;
    cost: number;
    icon?: string;
}

const Cart = () => {
    const [cookies] = useCookies(['jwt', 'login']);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
                    headers: {
                        'Authorization': `Bearer ${cookies.jwt}`
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Ошибка загрузки корзины');
                }

                const data = await response.json();
                setCartItems(data);
            } catch (err) {
                console.error('Cart error:', err);
                setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [cookies.jwt]);

    const handleRemoveItem = async (e: React.MouseEvent, productId: number) => {
        e.stopPropagation();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.jwt}`
                },
                body: JSON.stringify({
                    product_id: productId,
                    amount: 0
                })
            });

            if (!response.ok) throw new Error('Ошибка удаления');

            setCartItems(prev => prev.filter(item => item.product_id !== productId));
        } catch (err) {
            console.error('Ошибка удаления:', err);
        }
    };

    // [file name]: components/Cart/Cart.tsx
    const handleCheckout = async () => {
        if (cartItems.length === 0) return;

        if (window.confirm('Подтвердить оформление заказа?')) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${cookies.jwt}`
                    }
                });

                if (!response.ok) throw new Error('Ошибка оформления заказа');

                alert('Спасибо за заказ, мы скоро свяжемся с Вами!');
                setCartItems([]);
            } catch (err) {
                console.error('Ошибка:', err);
                alert('Не удалось оформить заказ');
            }
        }
    };

    if (loading) return <div>Загрузка корзины...</div>;
    if (error) return <div className={stylesheet.error}>Ошибка: {error}</div>;

    return (
        <div className={stylesheet.cartContainer}>
            <h1>Корзина пользователя {cookies.login}</h1>
            {cartItems.length === 0 ? (
                <div className={stylesheet.emptyCart}>
                    <p>Ваша корзина пуста</p>
                    <Link to="/products" className={stylesheet.shopLink}>
                        Перейти к покупкам
                    </Link>
                </div>
            ) : (
                <>
                    {cartItems.map(item => (
                        <div
                            key={item.id}
                            className={stylesheet.cartItem}
                            onClick={() => navigate(`/product/${item.product_id}`)}
                        >
                            <button
                                className={stylesheet.removeButton}
                                onClick={(e) => handleRemoveItem(e, item.product_id)}
                            >
                                ×
                            </button>
                            {item.icon && (
                                <img
                                    src={`data:image/png;base64,${item.icon}`}
                                    alt={item.name}
                                    className={stylesheet.productImage}
                                />
                            )}
                            <div className={stylesheet.itemInfo}>
                                <h3>{item.name}</h3>
                                <p>Количество: {item.amount}</p>
                                <p>Цена за шт: {item.cost} ₽</p>
                                <p>Итого: {item.cost * item.amount} ₽</p>
                            </div>
                        </div>
                    ))}

                    <div className={stylesheet.footer}>
                        <button
                            className={stylesheet.checkoutButton}
                            onClick={handleCheckout}
                        >
                            Оформить заказ
                        </button>
                        <div className={stylesheet.total}>
                            Общая сумма: {cartItems.reduce((sum, item) => sum + item.cost * item.amount, 0)} ₽
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;