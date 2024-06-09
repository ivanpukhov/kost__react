import {Link, useNavigate} from "react-router-dom";
import mail from '../../img/mail.webp'
import {useAuth} from "../../AuthContext";

const Auth = () => {
    const navigate = useNavigate();
    const {isAuthenticated} = useAuth();

    if (isAuthenticated) {
        navigate('/profile'); // Измените на актуальный путь к вашей странице профиля
    }
    return (
        <div className="auth">
            <h1 className="logo__title">Reviewer</h1>
            <Link to={'/login'} className="auth__link">

                <div className="auth__text">
                    Вход
                </div>
            </Link>
            <Link to={'/register'} className="auth__link">

                <div className="auth__text">
                    Регистрация
                </div>
            </Link>

            <div className="auth__subtitle">Регистрируясь, вы соглашаетесь с Условиями предоставления услуг
                и Политикой конфиденциальности.
            </div>
        </div>


    )
}

export default Auth
