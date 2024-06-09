import React, {useState} from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../../AuthContext';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const {login} = useAuth(); // Использование функции login из контекста

// В начале компонента Register и Login
    const navigate = useNavigate();
    const {isAuthenticated} = useAuth();

    if (isAuthenticated) {
        navigate('/profile'); // Измените на актуальный путь к вашей странице профиля
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const {data} = await axios.post('https://rev.greenman.kz/api/auth/register', {username, email, password});
            console.log(data); // Добавьте эту строку для логирования ответа
            login(data.token, data.userId);
            console.log(data.userId)


        } catch (error) {
            setErrorMessage('Ошибка при регистрации. Возможно, пользователь с таким email уже существует.');
        }
    };

    return (
        <div className='login'>
            <h1 className="logo__title">Reviewer</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Имя пользователя</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Пароль</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {errorMessage && <div>{errorMessage}</div>}
                <button type="submit">Регистрация</button>
            </form>
            <Link className="auth__navigate" to={'/login'}>Уже зарегистрированы? Войти</Link>

        </div>
    );
};

export default Register;
