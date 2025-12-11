import { Routes, Route } from 'react-router-dom';
import { useSettings } from './context/SettingsContext';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import Home from './pages/Home';
import Items from './pages/Items';
import ItemDetail from './pages/ItemDetail';
import News from './pages/News';
import BuildCalculator from './pages/BuildCalculator';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import Maintenance from './pages/Maintenance';

function App() {
  const { settings, loading } = useSettings();
  const { user } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  const isAdmin = user?.role?.name && ['admin', 'founder'].includes(user.role.name);
  if (settings.maintenance_mode && !isAdmin) {
    return <Maintenance message={settings.maintenance_message} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="items" element={<Items />} />
        <Route path="items/:id" element={<ItemDetail />} />
        <Route path="news" element={<News />} />
        <Route path="build-calculator" element={<BuildCalculator />} />
        <Route path="locations" element={<div className="container-max section-padding"><h1 className="text-4xl font-bold">Локации</h1><p className="text-gray-400 mt-4">Скоро...</p></div>} />
        <Route path="guides" element={<div className="container-max section-padding"><h1 className="text-4xl font-bold">Гайды</h1><p className="text-gray-400 mt-4">Скоро...</p></div>} />
        <Route path="patches" element={<News />} />
        <Route path="admin" element={<Admin />} />
        <Route path="profile/:id" element={<Profile />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="cookies" element={<Cookies />} />
      </Route>
      <Route path="login" element={<Login />} />
    </Routes>
  );
}

export default App;
