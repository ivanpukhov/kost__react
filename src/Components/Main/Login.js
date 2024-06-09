import React, {useState} from 'react';
import axios from 'axios';
import {useAuth} from '../../AuthContext';
import {Link, useNavigate} from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const {login} = useAuth();

    const navigate = useNavigate();
    const {isAuthenticated} = useAuth();

    if (isAuthenticated) {
        navigate('/profile'); // Измените на актуальный путь к вашей странице профиля
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const {data} = await axios.post('https://rev.greenman.kz/api/auth/login', {email, password});
            login(data.token, data.userId);
            console.log(data.userId)
        } catch (error) {
            setErrorMessage('Ошибка при входе в систему. Пожалуйста, проверьте свои данные и попробуйте снова.');
        }
    };

    return (
        <div className="login">
            <h1 className="logo__title">Reviewer</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Введите почту</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Email"
                    />
                </div>
                <div>
                    <label>Введите пароль</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Пароль"

                    />
                </div>
                {errorMessage && <div>{errorMessage}</div>}
                <button type="submit">Войти</button>
                <Link className="auth__navigate" to={'/register'}>Еще не зарегистрированы?</Link>
            </form>
        </div>
    );
};

export default Login;
