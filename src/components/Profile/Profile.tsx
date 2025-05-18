import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import stylesheet from './Profile.module.css';

interface UserProfile {
    username: string;
    email: string;
    phone: string;
    orders_count: number;
    membership: string;
}

const Profile = () => {
    const [cookies] = useCookies(['jwt', 'login']);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
                    headers: {
                        'Authorization': `Bearer ${cookies.jwt}`
                    }
                });

                const data = await response.json();
                setProfile(data);
            } catch (err) {
                setError('Ошибка загрузки профиля');
            } finally {
                setLoading(false);
            }
        };

        if (cookies.jwt) fetchProfile();
    }, [cookies.jwt]);

    if (loading) return <div className={stylesheet.loading}>Загрузка...</div>;

    return (
        <div className={stylesheet.profileContainer}>
            <button
                onClick={() => navigate(-1)}
                className={stylesheet.backLink}
            >
                &larr; Назад
            </button>

            <h1>Профиль пользователя</h1>

            {profile ? (
                <div className={stylesheet.profileInfo}>
                    <div className={stylesheet.infoItem}>
                        <span>Статус:</span>
                        <span>{profile.membership}</span>
                    </div>
                    <div className={stylesheet.infoItem}>
                        <span>Никнейм:</span>
                        <span>{profile.username}</span>
                    </div>
                    <div className={stylesheet.infoItem}>
                        <span>Email:</span>
                        <span>{profile.email}</span>
                    </div>
                    <div className={stylesheet.infoItem}>
                        <span>Телефон:</span>
                        <span>{profile.phone}</span>
                    </div>
                    <div className={stylesheet.infoItem}>
                        <span>Заказов:</span>
                        <span>{profile.orders_count}</span>
                    </div>
                </div>
            ) : (
                <div className={stylesheet.error}>{error || "Данные профиля недоступны"}</div>
            )}
        </div>
    );
};

export default Profile;