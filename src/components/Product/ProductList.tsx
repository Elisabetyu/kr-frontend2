import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Product } from '../../models/product';
import stylesheet from './ProductList.module.css';
import {Link} from "react-router-dom";

const ProductList = () => {
    const [cookies] = useCookies(['jwt']);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
                    headers: {
                        'Authorization': `Bearer ${cookies.jwt}`
                    }
                });

                console.log('Response status:', response.status); // Добавьте логирование

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Ошибка загрузки товаров');
                }

                const data = await response.json();
                console.log('Received data:', data); // Логируем полученные данные
                setProducts(data);
            } catch (err) {
                console.error('Full error:', err);
                setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [cookies.jwt]);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div className={stylesheet.productGrid}>
            {products.map(product => (
                <Link to={`/product/${product.id}`} className={stylesheet.hrefProductCard}>
                <div key={product.id} className={stylesheet.productCard}>
                    <h3>{product.name}</h3>
                    <div className={stylesheet.contentProductCard}>
                        <div className={stylesheet.textBlockProductCard}>
                            <p>Цена: {product.cost} ₽</p>
                        </div>
                        {product.icon && (
                            <img
                                src={`data:image/png;base64,${product.icon}`}
                                alt={product.name}
                                className={stylesheet.productImage}
                            />
                        )}
                    </div>
                </div>
                </Link>
            ))}
        </div>
    );
};

export default ProductList;