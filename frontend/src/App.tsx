import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Items from './pages/Items';
import Login from './pages/Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="items" element={<Items />} />
        <Route path="locations" element={<div className="container-max section-padding"><h1 className="text-4xl font-bold">Локации</h1><p className="text-gray-400 mt-4">Скоро здесь появятся детальные карты всех локаций</p></div>} />
        <Route path="guides" element={<div className="container-max section-padding"><h1 className="text-4xl font-bold">Гайды</h1><p className="text-gray-400 mt-4">Скоро здесь появятся экспертные гайды</p></div>} />
        <Route path="patches" element={<div className="container-max section-padding"><h1 className="text-4xl font-bold">Патчи</h1><p className="text-gray-400 mt-4">Скоро здесь появятся все обновления игры</p></div>} />
        <Route path="admin" element={<div className="container-max section-padding"><h1 className="text-4xl font-bold">Админ панель</h1><p className="text-gray-400 mt-4">Панель управления контентом</p></div>} />
      </Route>
      <Route path="login" element={<Login />} />
    </Routes>
  );
}

export default App;
