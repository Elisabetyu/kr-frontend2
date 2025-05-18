// [file name]: components/Product/ProductDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Product } from '../../models/product';
import stylesheet from './ProductDetail.module.css';

const ProductDetail = () => {
    const [cookies] = useCookies(['jwt']);
    const {productId} = useParams<{ productId: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cartAmount, setCartAmount] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [apiError, setApiError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await fetch(
                    `${import.meta.env.VITE_API_URL}/products/${productId}`,
                    {headers: {'Authorization': `Bearer ${cookies.jwt}`}}
                );
                if (!productResponse.ok) throw new Error('Ошибка загрузки товара');
                const productData = await productResponse.json();
                setProduct(productData);

                setLoading(false);

                const cartResponse = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
                    headers: {'Authorization': `Bearer ${cookies.jwt}`}
                });
                if (cartResponse.ok) {
                    const cartData = await cartResponse.json();
                    const item = cartData.find((i: any) => i.product_id === productData.id);
                    setCartAmount(item?.amount || 0);
                    setInputValue(item?.amount?.toString() || '0');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Ошибка');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [productId, cookies.jwt]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setInputValue(value);
    };

    const handleInputBlur = async () => {
        const newAmount = Math.max(0, parseInt(inputValue) || 0);
        await updateCart(newAmount);
    };

    const updateCart = async (newAmount: number) => {
        setIsUpdating(true);
        setApiError('');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/update_amount`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.jwt}`
                },
                body: JSON.stringify({
                    product_id: Number(productId),
                    amount: newAmount
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Ошибка сервера');
            }

            const result = await response.json();

            setCartAmount(result || 0);
            setInputValue(result?.toString() || '0');
        } catch (err) {
            setApiError(err instanceof Error ? err.message : 'Ошибка обновления');
            setInputValue(cartAmount.toString());
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return <div className={stylesheet.loading}>Загрузка...</div>;
    if (error) return <div className={stylesheet.error}>Ошибка: {error}</div>;
    if (!product) return <div className={stylesheet.error}>Товар не найден</div>;

    return (
        <div className={stylesheet.productContainer}>
            <button
                onClick={() => navigate(-1)}
                className={stylesheet.backLink}
            >
                &larr; Назад
            </button>

            <div className={stylesheet.productCard}>
                {product.icon && (
                    <img
                        src={`data:image/png;base64,${product.icon}`}
                        alt={product.name}
                        className={stylesheet.productImage}
                    />
                )}
                <div className={stylesheet.productInfo}>
                    <h1>{product.name}</h1>
                    <p className={stylesheet.description}>{product.description}</p>

                    <div className={stylesheet.priceRow}>
                        <p className={stylesheet.price}>{product.cost} ₽</p>
                        <div className={stylesheet.cartControls}>
                            {cartAmount === 0 ? (
                                <button
                                    className={stylesheet.addButton}
                                    onClick={() => updateCart(1)}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? '...' : 'Добавить в корзину'}
                                </button>
                            ) : (
                                <div className={stylesheet.amountWrapper}>
                                    <button
                                        className={stylesheet.amountButton}
                                        onClick={() => updateCart(cartAmount - 1)}
                                        disabled={isUpdating}
                                    >
                                        −
                                    </button>
                                    <input
                                        type="text"
                                        className={stylesheet.amountInput}
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        onBlur={handleInputBlur}
                                        disabled={isUpdating}
                                    />
                                    <button
                                        className={stylesheet.amountButton}
                                        onClick={() => updateCart(cartAmount + 1)}
                                        disabled={isUpdating}
                                    >
                                        +
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    {apiError && <div className={stylesheet.error}>{apiError}</div>}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;