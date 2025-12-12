import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import YandexMetrika from './components/YandexMetrika';

// Pages
import Home from './pages/Home';
import Items from './pages/Items';
import Monolith from './pages/Monolith';
import News from './pages/News';
import Guides from './pages/Guides';
import BuildCalculator from './pages/BuildCalculator';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminPanel from './pages/admin/AdminPanel';
import Privacy from './pages/legal/Privacy';
import Terms from './pages/legal/Terms';
import Cookies from './pages/legal/Cookies';
import DMCA from './pages/legal/DMCA';

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <SettingsProvider>
          <AuthProvider>
            <YandexMetrika />
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/items" element={<Items />} />
                <Route path="/monolith" element={<Monolith />} />
                <Route path="/news" element={<News />} />
                <Route path="/guides" element={<Guides />} />
                <Route path="/build-calculator" element={<BuildCalculator />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/dmca" element={<DMCA />} />
              </Routes>
            </Layout>
            <Toaster position="bottom-right" />
          </AuthProvider>
        </SettingsProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
