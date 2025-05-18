import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Eye, EyeOff } from 'react-feather';
import stylesheet from "./Auth.module.css";

const LoginForm = () => {
    const navigate = useNavigate();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [, setCookie] = useCookies(['jwt', 'login']);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: login, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Ошибка входа');
                return;
            }

            const data = await response.json();
            const token = data.token;
            setCookie('jwt', token, { path: '/' });
            setCookie('login', login, { path: '/' });

            navigate('/products');
        } catch (err) {
            setError('Сервер недоступен. Попробуйте позже');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={stylesheet.authForm}>
            <div className={stylesheet.authFormHeader}>
                <h1>Вход в BetonCute</h1>
            </div>

            <div className={stylesheet.authFormBody}>
                <form onSubmit={handleSubmit}>
                    <div className={stylesheet.authFormText}>
                        <label htmlFor="login_field">Логин или email</label>
                    </div>

                    <input
                        type="text"
                        name="login"
                        id="login_field"
                        className={stylesheet.authFormCredentialsInput}
                        autoCapitalize="off"
                        autoFocus
                        required
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        placeholder="Введите ваш логин"
                    />

                    <div className={stylesheet.authFormText}>
                        <label htmlFor="password">Пароль</label>
                    </div>

                    <div className={stylesheet.passwordInputContainer}>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            className={stylesheet.authFormCredentialsInput}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                        {showPassword ? (
                            <EyeOff
                                className={stylesheet.eyeIcon}
                                size={20}
                                onClick={() => setShowPassword(false)}
                                role="button"
                                aria-label="Скрыть пароль"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && setShowPassword(false)}
                            />
                        ) : (
                            <Eye
                                className={stylesheet.eyeIcon}
                                size={20}
                                onClick={() => setShowPassword(true)}
                                role="button"
                                aria-label="Показать пароль"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && setShowPassword(true)}
                            />
                        )}
                    </div>

                    <input
                        type="submit"
                        className={stylesheet.authSubmitInput}
                        value={loading ? 'Вход...' : 'Войти'}
                        disabled={loading}
                    />

                    {error && (
                        <div className={stylesheet.errorMessage}>
                            {error}
                        </div>
                    )}
                </form>
            </div>

            <div className={stylesheet.authFormFooter}>
                <p>
                    Впервые в BetonCute? {' '}
                    <a href="/auth/sign_up" className="nowrap">
                        Создать аккаунт
                    </a>
                </p>
            </div>
        </main>
    );
};

export default LoginForm;