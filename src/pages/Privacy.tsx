import { Helmet } from 'react-helmet-async';

export default function Privacy() {
  return (
    <div className="bg-background min-h-[calc(100vh-4rem)] py-12 md:py-20">
      <Helmet>
        <title>Политика конфиденциальности — KIUR</title>
        <meta name="description" content="Политика конфиденциальности KIUR в соответствии с требованиями GDPR." />
        <link rel="canonical" href="https://kiurtours.eu/privacy" />
      </Helmet>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-2">
          Политика конфиденциальности
        </h1>
        <p className="text-primary/50 text-sm mb-10">Последнее обновление: 24 июня 2026 г.</p>

        <div className="space-y-8 text-primary/80 text-sm leading-relaxed">

          <section>
            <h2 className="font-heading text-lg font-bold text-primary mb-3">1. Кто мы</h2>
            <p>
              KIUR (далее — «мы», «нас») — организатор горных и трекинговых туров, работающий на
              территории Европейского Союза. Настоящая политика конфиденциальности объясняет, какие
              персональные данные мы собираем, как используем и защищаем их в соответствии с
              Регламентом ЕС 2016/679 (GDPR).
            </p>
            <p className="mt-2">
              Контактный адрес: <a href="mailto:hello@kiur.travel" className="text-primary underline hover:no-underline">hello@kiur.travel</a>
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary mb-3">2. Какие данные мы собираем</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Контактные данные</strong> — имя и адрес электронной почты при заполнении форм на сайте.</li>
              <li><strong>Данные интереса</strong> — выбранные туры, предпочтения и вопросы, которые вы нам направляете.</li>
              <li><strong>Технические данные</strong> — IP-адрес, тип браузера, страницы, которые вы посещаете, и время визита (собираются автоматически через файлы cookie и журналы сервера).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary mb-3">3. Для чего мы используем данные</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Ответ на ваши запросы и организация туров (законный интерес / исполнение договора).</li>
              <li>Отправка информации о турах, которую вы запросили (согласие).</li>
              <li>Улучшение работы сайта и анализ посещаемости (законный интерес).</li>
              <li>Соблюдение юридических обязательств.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary mb-3">4. Правовые основания обработки (GDPR ст. 6)</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Исполнение договора</strong> — обработка необходима для бронирования тура.</li>
              <li><strong>Законный интерес</strong> — безопасность сайта, аналитика, ответы на обращения.</li>
              <li><strong>Согласие</strong> — рассылки и маркетинговые сообщения (вы можете отозвать согласие в любой момент).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary mb-3">5. Файлы cookie</h2>
            <p>
              Мы используем только технически необходимые файлы cookie для обеспечения работы сайта.
              Аналитические cookie применяются исключительно в анонимном режиме. При первом посещении
              сайта вы можете управлять настройками cookie через баннер.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary mb-3">6. Передача данных третьим сторонам</h2>
            <p>
              Мы не продаём и не сдаём в аренду ваши данные. Данные могут передаваться только:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>Поставщикам технических услуг (хостинг, email-платформы), действующим как обработчики данных по нашему поручению.</li>
              <li>Государственным органам — когда это требуется по закону.</li>
            </ul>
            <p className="mt-2">
              Если данные передаются за пределы ЕЭЗ, мы обеспечиваем надлежащие гарантии защиты
              (например, Стандартные договорные условия ЕК).
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary mb-3">7. Хранение данных</h2>
            <p>
              Данные из форм обратной связи хранятся не более 2 лет после последнего контакта.
              Данные, связанные с договором, — 5 лет (в соответствии с требованиями бухгалтерского
              учёта). Технические логи — не более 12 месяцев.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary mb-3">8. Ваши права</h2>
            <p>В соответствии с GDPR вы имеете право:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li><strong>Доступ</strong> — получить копию ваших данных.</li>
              <li><strong>Исправление</strong> — потребовать корректировки неточных данных.</li>
              <li><strong>Удаление</strong> — «право быть забытым» (с учётом законных исключений).</li>
              <li><strong>Ограничение</strong> — ограничить обработку ваших данных.</li>
              <li><strong>Переносимость</strong> — получить данные в машиночитаемом формате.</li>
              <li><strong>Возражение</strong> — возразить против обработки на основании законного интереса.</li>
              <li><strong>Отзыв согласия</strong> — в любой момент, без объяснения причин.</li>
            </ul>
            <p className="mt-2">
              Для реализации любого из прав свяжитесь с нами по адресу{' '}
              <a href="mailto:hello@kiur.travel" className="text-primary underline hover:no-underline">hello@kiur.travel</a>.
              Мы ответим в течение 30 дней. Вы также вправе подать жалобу в надзорный орган
              по защите данных в вашей стране.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary mb-3">9. Безопасность</h2>
            <p>
              Мы применяем технические и организационные меры для защиты ваших данных: шифрование
              соединения (HTTPS), ограниченный доступ к данным и регулярный аудит безопасности.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary mb-3">10. Изменения политики</h2>
            <p>
              Мы можем обновлять эту политику. Актуальная версия всегда доступна на этой странице.
              При существенных изменениях мы уведомим вас по email (если вы предоставили его нам).
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
