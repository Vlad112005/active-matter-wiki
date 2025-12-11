import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Items from './pages/Items';
import Login from './pages/Login';
import Admin from './pages/Admin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="items" element={<Items />} />
        <Route path="locations" element={<div className="container-max section-padding"><h1 className="text-4xl font-bold">Локации</h1><p className="text-gray-400 mt-4">Скоро здесь появятся детальные карты всех локаций</p></div>} />
        <Route path="guides" element={<div className="container-max section-padding"><h1 className="text-4xl font-bold">Гайды</h1><p className="text-gray-400 mt-4">Скоро здесь появятся экспертные гайды</p></div>} />
        <Route path="patches" element={<div className="container-max section-padding"><h1 className="text-4xl font-bold">Патчи</h1><p className="text-gray-400 mt-4">Скоро здесь появятся все обновления игры</p></div>} />
        <Route path="admin" element={<Admin />} />
        <Route path="privacy" element={<div className="container-max section-padding max-w-4xl"><h1 className="text-3xl font-bold mb-6">Политика конфиденциальности</h1><div className="space-y-4 text-gray-400 text-sm leading-relaxed"><p>Последнее обновление: 11.12.2025</p><p>Active Matter Wiki уважает вашу конфиденциальность. Мы собираем только необходимую информацию для работы сервиса.</p></div></div>} />
        <Route path="terms" element={<div className="container-max section-padding max-w-4xl"><h1 className="text-3xl font-bold mb-6">Пользовательское соглашение</h1><div className="space-y-4 text-gray-400 text-sm leading-relaxed"><p>Последнее обновление: 11.12.2025</p><p>Используя Active Matter Wiki, вы соглашаетесь с условиями данного соглашения.</p></div></div>} />
        <Route path="cookies" element={<div className="container-max section-padding max-w-4xl"><h1 className="text-3xl font-bold mb-6">Политика использования cookies</h1><div className="space-y-4 text-gray-400 text-sm leading-relaxed"><p>Последнее обновление: 11.12.2025</p><p>Мы используем cookies для улучшения работы сайта и анализа трафика.</p></div></div>} />
      </Route>
      <Route path="login" element={<Login />} />
    </Routes>
  );
}

export default App;
