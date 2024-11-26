import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import NotFound from './components/NotFound';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Profile from './components/Profile';
import CreateWish from './components/CreateWish';
import SearchWishlist from './components/SearchWishlist';
import EditWish from './components/EditWish';
import ViewWishlist from './components/ViewWishlist';
import ChangePassword from './components/ChangePassword';

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/create-wish" element={<CreateWish />} />
      <Route path="/search-wishlist" element={<SearchWishlist />} />
      <Route path="/edit-wish/:wishId" element={<EditWish />} />
      <Route path="/view-wishlist/:user_id" element={<ViewWishlist />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);
export default Router;
