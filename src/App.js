import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Header from "./Components/Header/Header";
import Auth from './Components/Auth/Auth';
import Main from './Components/Main/Main';
import Login from './Components/Main/Login';
import Register from './Components/Main/Register';
import './App.scss';
import {useAuth} from "./AuthContext";
import Catalog from "./Components/Catalog/Catalog";
import Profile from "./Components/Profile";
import Admin from "./Components/Admin";
import BottomBar from "./Components/Bottombar";
import AllCategories from "./Components/Main/AllCategories";
import Category from "./Components/Main/Category";
import CategoryReview from "./Components/Main/CategoryReview";
import ProtectedRoute from './Components/ProtectedRoute';
import AllReviews from "./Components/Main/AllReviews";

function App() {
    const {isAuthenticated} = useAuth();

    return (<div className="App">
        <Router>
            <Header/>
            <div className="container">
                <Routes>
                    <Route path="/" element={<Main/>}/>
                    <Route path="/category/" element={<AllCategories/>}/>
                    <Route path="/catalog" element={<Catalog/>}/>
                    <Route path="/auth" element={<Auth/>}/>
                    <Route path="/admin" element={<Admin/>}/>
                    <Route path="/reviews" element={<AllReviews/>}/>
                    <Route path="/review/category/:categoryId/" element={<CategoryReview/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route element={<ProtectedRoute/>}> {/* Используйте ProtectedRoute */}
                        <Route path="/profile" element={<Profile/>}/>
                    </Route>
                    <Route path="/category/:categoryId" element={<Category/>}/>
                </Routes>
            </div>
            <BottomBar/>
        </Router>
    </div>);
}

export default App;
