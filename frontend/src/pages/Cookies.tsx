import { Cookie } from 'lucide-react';

const Cookies = () => {
  return (
    <div className="section-padding bg-[#0a0e1a]">
      <div className="container-max max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-xl shadow-cyan-500/25">
            <Cookie className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Политика использования cookies</h1>
            <p className="text-sm text-gray-500">Последнее обновление: 11 декабря 2025 г.</p>
          </div>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">1. Что такое cookies</h2>
            <p>
              Cookies (куки) — это небольшие текстовые файлы, которые сохраняются на вашем устройстве (компьютере, планшете, смартфоне) 
              при посещении веб-сайтов. Они помогают сайтам запоминать информацию о вас и улучшать ваш опыт использования.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">2. Какие cookies мы используем</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3 text-cyan-400">2.1. Необходимые cookies</h3>
                <p className="mb-3 text-gray-400">
                  Эти файлы необходимы для работы сайта и не могут быть отключены:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-400">
                  <li><code className="bg-gray-800 px-2 py-1 rounded text-cyan-400">auth-store</code> — сохранение сессии авторизации</li>
                  <li><code className="bg-gray-800 px-2 py-1 rounded text-cyan-400">token</code> — JWT токен для доступа к защищённым разделам</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3 text-cyan-400">2.2. Функциональные cookies</h3>
                <p className="mb-3 text-gray-400">
                  Помогают запоминать ваши предпочтения:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-400">
                  <li>Язык интерфейса</li>
                  <li>Настройки отображения</li>
                  <li>Фильтры поиска</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3 text-cyan-400">2.3. Аналитические cookies</h3>
                <p className="mb-3 text-gray-400">
                  Используются для сбора статистики посещений (в будущем):
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-400">
                  <li>Количество посещений</li>
                  <li>Популярные страницы</li>
                  <li>Время нахождения на сайте</li>
                  <li>Источники трафика</li>
                </ul>
                <p className="mt-3 text-sm text-gray-500">
                  Примечание: На данный момент аналитика не подключена
                </p>
              </div>
            </div>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">3. Срок действия cookies</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-gray-400">Сессионные cookies</span>
                <span className="text-cyan-400 font-medium">До закрытия браузера</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-gray-400">Постоянные cookies (авторизация)</span>
                <span className="text-cyan-400 font-medium">7 дней</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-gray-400">Настройки интерфейса</span>
                <span className="text-cyan-400 font-medium">1 год</span>
              </div>
            </div>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">4. Управление cookies</h2>
            <p className="mb-4">
              Вы можете управлять cookies через настройки вашего браузера:
            </p>
            
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <h3 className="font-medium text-white mb-2">Google Chrome</h3>
                <p className="text-sm text-gray-400">Настройки → Конфиденциальность и безопасность → Файлы cookie и другие данные сайтов</p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg">
                <h3 className="font-medium text-white mb-2">Mozilla Firefox</h3>
                <p className="text-sm text-gray-400">Настройки → Приватность и защита → Куки и данные сайтов</p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg">
                <h3 className="font-medium text-white mb-2">Safari</h3>
                <p className="text-sm text-gray-400">Настройки → Конфиденциальность → Управление данными веб-сайта</p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg">
                <h3 className="font-medium text-white mb-2">Microsoft Edge</h3>
                <p className="text-sm text-gray-400">Настройки → Конфиденциальность, поиск и службы → Файлы cookie и разрешения сайтов</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-amber-400 text-sm">
                ⚠️ <strong>Внимание:</strong> Отключение необходимых cookies может привести к нарушению работы сайта 
                (например, вы не сможете войти в аккаунт).
              </p>
            </div>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">5. Cookies третьих сторон</h2>
            <p className="mb-4">
              На данный момент мы НЕ используем cookies от сторонних сервисов (Google Analytics, рекламные сети и т.д.).
            </p>
            <p className="text-gray-400">
              В будущем могут быть добавлены:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 mt-3">
              <li>Google Analytics (аналитика посещений)</li>
              <li>Discord интеграция (OAuth авторизация)</li>
            </ul>
            <p className="mt-4 text-sm text-gray-500">
              О любых изменениях мы будем уведомлять пользователей.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">6. Ваши права</h2>
            <p className="mb-4">В соответствии с законодательством РФ вы имеете право:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>Узнать, какие cookies используются</li>
              <li>Отказаться от использования необязательных cookies</li>
              <li>Удалить сохранённые cookies</li>
              <li>Настроить параметры cookies в браузере</li>
            </ul>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">7. Изменения в политике</h2>
            <p>
              Мы можем обновлять данную Политику при изменении используемых технологий или требований законодательства. 
              Дата последнего обновления всегда указывается вверху страницы.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">8. Контакты</h2>
            <p className="mb-4">
              По вопросам использования cookies обращайтесь:
            </p>
            <div className="space-y-2 text-gray-400">
              <p>Email: <a href="mailto:privacy@activematter.wiki" className="text-cyan-400">privacy@activematter.wiki</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
