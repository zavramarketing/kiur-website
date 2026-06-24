import { Helmet } from 'react-helmet-async';

export default function Terms() {
  return (
    <div className="bg-background min-h-[calc(100vh-4rem)] py-12 md:py-20">
      <Helmet>
        <title>Условия участия — KIUR</title>
        <meta name="description" content="Условия участия в турах KIUR: бронирование, оплата, отмена, ответственность сторон." />
        <link rel="canonical" href="https://kiurtours.eu/terms" />
      </Helmet>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-2">
          Условия участия в турах
        </h1>
        <p className="text-primary/50 text-sm mb-10">Последнее обновление: 24 июня 2026 г.</p>

        <div className="space-y-8 text-primary/80 text-sm leading-relaxed">

          <section>
            <h2 className="font-heading text-lg font-bold text-primary mb-3">1. Общие положения</h2>
            <p>
              Настоящие условия регулируют отношения между KIUR (организатором туров, далее —
              «Организатор») и участником тура (далее — «Участник»). Отправив заявку на
              бронирование или оплатив тур, Участник подтверждает, что ознакомился с настоящими
              условиями и согласен с ними.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary mb-3">2. Бронирование и оплата</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Бронирование считается подтверждённым после получения Организатором заявки и оплаты депозита (обычно 30% от стоимости тура, если иное не указано в описании конкретного тура).</li>
              <li>Оставшаяся сумма вносится не позднее чем за 30 дней до начала тура, если иное не согласовано письменно.</li>
              <li>Местo в группе резервируется исключительно после получения депозита.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary mb-3">3. Состав группы и изменение программы</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Минимальная численность группы указана в описании тура. Если набрать минимальную группу не удаётся, Организатор вправе отменить тур не позднее чем за 14 дней до его начала с полным возвратом оплаченных средств.</li>
              <li>Организатор оставляет за собой право изменять маршрут, даты и программу тура в случае форс-мажора, неблагоприятных погодных условий, предписаний властей или соображений безопасности. В таких случаях Участнику предлагается альтернативная программа или возврат средств.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary mb-3">4. Отмена со стороны Участника</h2>
            <p>Условия отмены и возврата средств:</p>
            <div className="mt-3 border border-primary/10 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-primary/5">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-semibold text-primary">Срок до начала тура</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-primary">Удержание</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/10">
                  <tr>
                    <td className="px-4 py-2.5">Более 60 дней</td>
                    <td className="px-4 py-2.5">Только комиссия за обработку платежа (до 50 €)</td>
                  </tr>
                  <tr className="bg-primary/[0.02]">
                    <td className="px-4 py-2.5">30–60 дней</td>
                    <td className="px-4 py-2.5">30% от стоимости тура</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5">14–29 дней</td>
                    <td className="px-4 py-2.5">50% от стоимости тура</td>
                  </tr>
                  <tr className="bg-primary/[0.02]">
                    <td className="px-4 py-2.5">Менее 14 дней</td>
                    <td className="px-4 py-2.5">100% от стоимости тура</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              Мы рекомендуем оформить страховку с покрытием отмены поездки. Замена Участника другим
              человеком возможна по согласованию с Организатором и при отсутствии технических
              ограничений (визы, авиабилеты и т. д.).
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary mb-3">5. Физическая подготовка и здоровье</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Участник обязан реально оценивать уровень своей физической подготовки и соответствие требованиям, указанным в описании тура.</li>
              <li>О хронических заболеваниях, травмах и принимаемых лекарствах, которые могут влиять на участие в туре, необходимо сообщить Организатору до бронирования.</li>
              <li>Организатор вправе отстранить от участия человека, чьё состояние здоровья создаёт угрозу для него самого или других членов группы. В таком случае возврат средств за неиспользованную часть программы производится по фактическим расходам.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary mb-3">6. Страхование</h2>
            <p>
              Медицинская страховка, покрывающая горный трекинг и эвакуацию с гор, является
              обязательным условием участия во всех турах KIUR. Участник обязан предоставить
              реквизиты страхового полиса до начала тура. Организатор не несёт ответственности за
              медицинские расходы, возникшие в ходе тура.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary mb-3">7. Ответственность сторон</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Организатор несёт ответственность за надлежащую организацию тура, обеспечение квалифицированных гидов и соответствие описанию тура.</li>
              <li>Организатор не несёт ответственности за травмы, потерю имущества или иной ущерб, возникший вследствие несоблюдения инструкций гида, индивидуальных действий Участника или обстоятельств непреодолимой силы.</li>
              <li>Ответственность Организатора ограничена стоимостью тура, за исключением случаев умысла или грубой небрежности.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary mb-3">8. Поведение в туре</h2>
            <p>
              Участник соглашается следовать указаниям гида и правилам безопасности в течение всего
              тура. Гид вправе принимать окончательные решения по всем вопросам, связанным с
              безопасностью маршрута. Участник, нарушающий правила безопасности или создающий угрозу
              для группы, может быть отстранён от участия без компенсации.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary mb-3">9. Использование фотоматериалов</h2>
            <p>
              В ходе туров могут производиться фото- и видеосъёмка для публикации в социальных сетях
              и маркетинговых материалах KIUR. Если вы против публикации своих изображений,
              сообщите об этом гиду в начале тура — мы уважаем ваше решение.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary mb-3">10. Применимое право и споры</h2>
            <p>
              Настоящие условия регулируются законодательством Европейского Союза. Стороны стремятся
              разрешать споры путём переговоров. При невозможности достичь согласия спор передаётся
              в компетентный суд. Потребители из ЕС также вправе воспользоваться платформой
              онлайн-урегулирования споров:{' '}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:no-underline"
              >
                ec.europa.eu/consumers/odr
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-primary mb-3">11. Контакты</h2>
            <p>
              По всем вопросам, связанным с условиями участия, обращайтесь:{' '}
              <a href="mailto:hello@kiur.travel" className="text-primary underline hover:no-underline">hello@kiur.travel</a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
