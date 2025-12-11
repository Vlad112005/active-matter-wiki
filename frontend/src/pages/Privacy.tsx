import { Shield } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="section-padding bg-[#0a0e1a]">
      <div className="container-max max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-xl shadow-cyan-500/25">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Политика конфиденциальности</h1>
            <p className="text-sm text-gray-500">Последнее обновление: 11 декабря 2025 г.</p>
          </div>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">1. Общие положения</h2>
            <p className="mb-4">
              Настоящая Политика конфиденциальности (далее — «Политика») действует в отношении всей информации, 
              которую сервис Active Matter Wiki (далее — «Сервис») может получить о Пользователе во время использования им сайта.
            </p>
            <p>
              Использование Сервиса означает безоговорочное согласие Пользователя с настоящей Политикой и указанными в ней 
              условиями обработки его персональной информации.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">2. Персональная информация пользователей</h2>
            <h3 className="text-lg font-medium mb-3 text-cyan-400">2.1. Какие данные мы собираем</h3>
            <ul className="list-disc list-inside space-y-2 mb-4 text-gray-400">
              <li>Email адрес (для регистрации и связи)</li>
              <li>Имя пользователя (username)</li>
              <li>Пароль в зашифрованном виде (bcrypt)</li>
              <li>IP-адрес (для безопасности)</li>
              <li>Данные о действиях на сайте (просмотры, лайки)</li>
              <li>Технические данные (браузер, устройство, ОС)</li>
            </ul>
            <h3 className="text-lg font-medium mb-3 text-cyan-400">2.2. Как мы используем данные</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>Для предоставления доступа к функциям Сервиса</li>
              <li>Для улучшения качества работы Сервиса</li>
              <li>Для отправки уведомлений об обновлениях</li>
              <li>Для обеспечения безопасности</li>
              <li>Для аналитики и статистики</li>
            </ul>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">3. Защита персональной информации</h2>
            <p className="mb-4">
              Сервис принимает необходимые организационные и технические меры для защиты персональной информации 
              Пользователя от неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования, 
              распространения, а также от иных неправомерных действий третьих лиц.
            </p>
            <h3 className="text-lg font-medium mb-3 text-cyan-400">Меры безопасности:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>Шифрование паролей (bcrypt с солью)</li>
              <li>HTTPS соединение (SSL/TLS)</li>
              <li>JWT токены для авторизации</li>
              <li>Защита от SQL-инъекций (Prisma ORM)</li>
              <li>Регулярное резервное копирование данных</li>
            </ul>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">4. Обработка персональных данных</h2>
            <p className="mb-4">
              Обработка персональных данных осуществляется в соответствии с требованиями Федерального закона 
              от 27.07.2006 № 152-ФЗ «О персональных данных» и Федерального закона от 13.03.2006 № 38-ФЗ 
              «О рекламе».
            </p>
            <h3 className="text-lg font-medium mb-3 text-cyan-400">Ваши права:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>Право на доступ к своим персональным данным</li>
              <li>Право на исправление неточных данных</li>
              <li>Право на удаление данных (право на забвение)</li>
              <li>Право на ограничение обработки данных</li>
              <li>Право на отзыв согласия на обработку</li>
            </ul>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">5. Cookies и технологии отслеживания</h2>
            <p className="mb-4">
              Сервис использует файлы cookies для сохранения сеансов авторизации и улучшения работы сайта. 
              Подробнее о cookies читайте в нашей <a href="/cookies" className="text-cyan-400 hover:text-cyan-300">Политике использования cookies</a>.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">6. Передача данных третьим лицам</h2>
            <p className="mb-4">
              Мы НЕ передаём ваши персональные данные третьим лицам, за исключением случаев:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>Когда это необходимо по требованию закона</li>
              <li>Для защиты наших прав и безопасности</li>
              <li>С вашего явного согласия</li>
            </ul>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">7. Изменение политики конфиденциальности</h2>
            <p>
              Сервис имеет право вносить изменения в настоящую Политику. При внесении изменений в актуальной редакции 
              указывается дата последнего обновления. Новая редакция Политики вступает в силу с момента её размещения.
            </p>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">8. Контакты</h2>
            <p className="mb-4">
              По всем вопросам, связанным с обработкой персональных данных, вы можете обратиться к нам:
            </p>
            <div className="space-y-2 text-gray-400">
              <p>Email: <a href="mailto:privacy@activematter.wiki" className="text-cyan-400">privacy@activematter.wiki</a></p>
              <p>Или через форму обратной связи на сайте</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
