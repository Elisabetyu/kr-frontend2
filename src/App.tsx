import {BrowserRouter, Routes, Route, Navigate, useLocation} from 'react-router-dom';
import {CookiesProvider} from 'react-cookie';
import LoginForm from './components/AuthForm/LoginForm.tsx';
import SignUpForm from './components/AuthForm/SignUpForm.tsx';
import Logout from "./components/AuthForm/Logout.tsx";
import ProductList from "./components/Product/ProductList.tsx";
import Header from "./components/Header/Header.tsx";
import Home from "./components/Home/Home.tsx";
import {useEffect} from "react";
import ProductDetail from "./components/Product/ProductDetail.tsx";
import Cart from "./components/Cart/Cart.tsx";
import Profile from './components/Profile/Profile';

const App = () => {
    return (
        <CookiesProvider>
            <BrowserRouter>
                <AppContent/>
            </BrowserRouter>
        </CookiesProvider>
    );
};

const AppContent = () => {
    const {pathname} = useLocation();
    const hideHeader = pathname === '/auth/login' || pathname === '/auth/sign_up';

    return (
        <>
            {!hideHeader && <Header/>}
            <RouteChangeListener />
            <Routes>
                <Route path="/" element={<Navigate to="/auth/login" replace/>}/>
                <Route path="/auth/login" element={<LoginForm/>}/>
                <Route path="/auth/sign_up" element={<SignUpForm/>}/>
                <Route path="/auth/logout" element={<Logout/>}/>
                <Route path="/products" element={<ProductList />} />
                <Route path="/home/:username" element={<Home />} />
                <Route path="/product/:productId" element={<ProductDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<Cart />} />
            </Routes>
        </>
    );
};

function RouteChangeListener() {
    const {pathname} = useLocation();

    useEffect(() => {
        console.log('Переход на:', pathname);
    }, [pathname]);

    return null;
}

export default App;