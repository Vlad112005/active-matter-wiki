import { FileText } from 'lucide-react';

const Terms = () => {
  return (
    <div className="section-padding bg-[#0a0e1a]">
      <div className="container-max max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-xl shadow-cyan-500/25">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Пользовательское соглашение</h1>
            <p className="text-sm text-gray-500">Последнее обновление: 11 декабря 2025 г.</p>
          </div>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">1. Общие положения</h2>
            <p className="mb-4">
              Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между администрацией 
              сервиса Active Matter Wiki (далее — «Сервис») и пользователями сервиса (далее — «Пользователь»).
            </p>
            <p className="mb-4">
              Регистрируясь на Сервисе, Пользователь подтверждает, что:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>Ознакомился с условиями настоящего Соглашения</li>
              <li>Принимает все условия Соглашения в полном объёме</li>
              <li>Достиг возраста 18 лет (или имеет согласие родителей/опекунов)</li>
            </ul>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">2. Предмет соглашения</h2>
            <p className="mb-4">
              Сервис предоставляет Пользователю доступ к информационному порталу, содержащему:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>Каталог предметов из игры Active Matter</li>
              <li>Описания локаций и карты</li>
              <li>Обучающие гайды и руководства</li>
              <li>Новости и информацию об обновлениях игры</li>
              <li>Инструменты для планирования игрового процесса</li>
            </ul>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">3. Регистрация и учётные записи</h2>
            <h3 className="text-lg font-medium mb-3 text-cyan-400">3.1. Требования к регистрации</h3>
            <p className="mb-4">
              При регистрации Пользователь обязуется:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 mb-4">
              <li>Предоставлять достоверную информацию</li>
              <li>Обновлять регистрационные данные при их изменении</li>
              <li>Не использовать чужие данные</li>
              <li>Не создавать несколько учётных записей без разрешения</li>
            </ul>
            <h3 className="text-lg font-medium mb-3 text-cyan-400">3.2. Безопасность учётной записи</h3>
            <p className="mb-4">
              Пользователь несёт ответственность за:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>Сохранность своего пароля</li>
              <li>Все действия, совершённые под его учётной записью</li>
              <li>Немедленное уведомление администрации о несанкционированном доступе</li>
            </ul>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">4. Права и обязанности пользователя</h2>
            <h3 className="text-lg font-medium mb-3 text-cyan-400">4.1. Пользователь имеет право:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-400 mb-4">
              <li>Получать доступ ко всем публичным материалам Сервиса</li>
              <li>Использовать инструменты и сервисы, доступные на платформе</li>
              <li>Обращаться в службу поддержки</li>
              <li>Удалить свою учётную запись в любое время</li>
            </ul>
            <h3 className="text-lg font-medium mb-3 text-cyan-400">4.2. Пользователь обязуется НЕ:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>Использовать Сервис в противоправных целях</li>
              <li>Публиковать оскорбительный, дискриминационный контент</li>
              <li>Распространять вредоносное ПО или спам</li>
              <li>Взламывать или перегружать систему</li>
              <li>Копировать контент без разрешения</li>
              <li>Выдавать себя за других лиц</li>
            </ul>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">5. Интеллектуальная собственность</h2>
            <p className="mb-4">
              Всё содержимое Сервиса (тексты, изображения, дизайн, код) защищено авторским правом и принадлежит 
              соответствующим правообладателям.
            </p>
            <p className="mb-4">
              Active Matter и все связанные материалы являются собственностью их разработчиков. Сервис не претендует 
              на права на игру и использует материалы в информационных целях.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">6. Ответственность и ограничения</h2>
            <h3 className="text-lg font-medium mb-3 text-cyan-400">6.1. Сервис не несёт ответственности за:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-400 mb-4">
              <li>Временную недоступность или сбои в работе</li>
              <li>Потерю данных из-за технических проблем</li>
              <li>Действия третьих лиц</li>
              <li>Актуальность информации (игра может обновляться)</li>
            </ul>
            <h3 className="text-lg font-medium mb-3 text-cyan-400">6.2. Отказ от гарантий</h3>
            <p className="text-gray-400">
              Сервис предоставляется «как есть», без каких-либо гарантий. Мы стараемся поддерживать актуальность информации, 
              но не гарантируем её полноту или точность.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">7. Блокировка и удаление учётной записи</h2>
            <p className="mb-4">
              Администрация оставляет за собой право заблокировать или удалить учётную запись при:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>Нарушении условий Соглашения</li>
              <li>Подозрении в мошеннических действиях</li>
              <li>По требованию правоохранительных органов</li>
              <li>По запросу самого Пользователя</li>
            </ul>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">8. Изменение условий</h2>
            <p>
              Администрация имеет право изменять условия настоящего Соглашения в одностороннем порядке. 
              Новая редакция вступает в силу с момента размещения на сайте. Продолжение использования Сервиса 
              после внесения изменений означает согласие с новыми условиями.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">9. Разрешение споров</h2>
            <p className="mb-4">
              Все споры решаются путём переговоров. При невозможности достижения согласия споры рассматриваются 
              в соответствии с действующим законодательством Российской Федерации.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">10. Контакты</h2>
            <div className="space-y-2 text-gray-400">
              <p>Email: <a href="mailto:support@activematter.wiki" className="text-cyan-400">support@activematter.wiki</a></p>
              <p>Юридические вопросы: <a href="mailto:legal@activematter.wiki" className="text-cyan-400">legal@activematter.wiki</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
