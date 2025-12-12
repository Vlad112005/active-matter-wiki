import { Link } from 'react-router-dom';
import { Github, MessageCircle, Send } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 mt-20">
      <div className="container-max px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">О Active Matter Wiki</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Официальная энциклопедия по игре Active Matter. Полная база предметов, гайды, стратегии и советы от опытных игроков.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Быстрые ссылки</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/items" className="text-gray-400 hover:text-cyan-400 transition">📦 Предметы</Link></li>
              <li><Link to="/monolith" className="text-gray-400 hover:text-cyan-400 transition">⚡ Монолит</Link></li>
              <li><Link to="/guides" className="text-gray-400 hover:text-cyan-400 transition">📖 Гайды</Link></li>
              <li><Link to="/build-calculator" className="text-gray-400 hover:text-cyan-400 transition">⚙️ Калькулятор</Link></li>
              <li><Link to="/news" className="text-gray-400 hover:text-cyan-400 transition">📰 Новости</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Юридическая информация</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="text-gray-400 hover:text-cyan-400 transition">Политика конфиденциальности</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-cyan-400 transition">Пользовательское соглашение</Link></li>
              <li><Link to="/cookies" className="text-gray-400 hover:text-cyan-400 transition">Политика cookies</Link></li>
              <li><Link to="/dmca" className="text-gray-400 hover:text-cyan-400 transition">DMCA / Авторские права</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Социальные сети</h3>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-cyan-600 rounded-lg flex items-center justify-center transition">
                <Github size={20} className="text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-cyan-600 rounded-lg flex items-center justify-center transition">
                <MessageCircle size={20} className="text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-cyan-600 rounded-lg flex items-center justify-center transition">
                <Send size={20} className="text-white" />
              </a>
            </div>
            <p className="text-gray-400 text-xs mt-4">
              Присоединяйся к нашему сообществу в Discord, Telegram и VK!
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} Active Matter Wiki. Все права защищены.
          </p>
          <p className="text-gray-500 text-xs">
            Используя этот сайт, вы соглашаетесь с{' '}
            <Link to="/terms" className="text-cyan-400 hover:underline">пользовательским соглашением</Link>{' '}и{' '}
            <Link to="/privacy" className="text-cyan-400 hover:underline">политикой конфиденциальности</Link>.
          </p>
        </div>

        {/* Legal Notice */}
        <div className="mt-6 p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <p className="text-gray-400 text-xs leading-relaxed">
            🛡️ <strong>Важно:</strong> Обработка персональных данных осуществляется в соответствии с Федеральным законом № 152-ФЗ "О персональных данных". Регистрируясь на сайте, вы даете согласие на обработку ваших данных. Подробнее в{' '}
            <Link to="/privacy" className="text-cyan-400 hover:underline">Политике конфиденциальности</Link>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
