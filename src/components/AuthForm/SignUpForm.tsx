import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Eye, EyeOff } from 'react-feather';
import stylesheet from "./Auth.module.css";

const SignUpForm = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [, setCookie] = useCookies(['jwt', 'login']);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (password !== confirmPassword) {
                setError('Пароли не совпадают');
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/registration`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    role: "user"
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Ошибка регистрации');
                return;
            }

            setCookie('jwt', data.token, { path: '/' });
            setCookie('login', username, { path: '/' });

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
                <h1>Регистрация в BetonCute</h1>
            </div>

            <div className={stylesheet.authFormBody}>
                <form onSubmit={handleSubmit}>
                    <div className={stylesheet.authFormText}>
                        <label htmlFor="username">Логин</label>
                    </div>

                    <input
                        type="text"
                        name="username"
                        id="username"
                        className={stylesheet.authFormCredentialsInput}
                        autoCapitalize="off"
                        autoFocus
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Придумайте логин"
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
                            placeholder="Не менее 8 символов"
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

                    <div className={stylesheet.authFormText}>
                        <label htmlFor="confirmPassword">Подтвердите пароль</label>
                    </div>

                    <div className={stylesheet.passwordInputContainer}>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            id="confirmPassword"
                            className={stylesheet.authFormCredentialsInput}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Повторите пароль"
                        />
                        {showConfirmPassword ? (
                            <EyeOff
                                className={stylesheet.eyeIcon}
                                size={20}
                                onClick={() => setShowConfirmPassword(false)}
                                role="button"
                                aria-label="Скрыть пароль"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && setShowConfirmPassword(false)}
                            />
                        ) : (
                            <Eye
                                className={stylesheet.eyeIcon}
                                size={20}
                                onClick={() => setShowConfirmPassword(true)}
                                role="button"
                                aria-label="Показать пароль"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && setShowConfirmPassword(true)}
                            />
                        )}
                    </div>

                    <input
                        type="submit"
                        className={stylesheet.authSubmitInput}
                        value={loading ? 'Регистрация...' : 'Зарегистрироваться'}
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
                    Уже есть аккаунт? {' '}
                    <a href="/auth/login" className="nowrap">
                        Войти в систему
                    </a>
                </p>
            </div>
        </main>
    );
};

export default SignUpForm;