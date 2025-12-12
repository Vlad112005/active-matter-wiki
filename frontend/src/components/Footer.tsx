import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-cyan-400">Active Matter Wiki</h3>
            <p className="text-gray-400 text-sm">Энциклопедия активной материи для S.T.A.L.K.E.R.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gray-200">Быстрые ссылки</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/items" className="hover:text-cyan-400 transition">Предметы</Link></li>
              <li><Link to="/monolith" className="hover:text-cyan-400 transition">Монолит</Link></li>
              <li><Link to="/news" className="hover:text-cyan-400 transition">Новости</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gray-200">Политика</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/privacy" className="hover:text-cyan-400 transition">Приватность</Link></li>
              <li><Link to="/terms" className="hover:text-cyan-400 transition">Условия</Link></li>
              <li><Link to="/cookies" className="hover:text-cyan-400 transition">Куки</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gray-200">Контакты</h4>
            <p className="text-sm text-gray-400">Email: info@activematter.wiki</p>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; 2025 Active Matter Wiki. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
