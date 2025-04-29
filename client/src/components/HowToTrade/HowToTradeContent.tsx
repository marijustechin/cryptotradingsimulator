import { Player } from "@lottiefiles/react-lottie-player";
import StepsComponent from "../Steps";
import { useTranslation } from "react-i18next";

export const HowToTradeContent = () => {
  const { t } = useTranslation();
  const faqs = [
    {
      question: t('faq_q1'),
      answer: t('faq_a1'),
    },
    {
      question: t('faq_q2'),
      answer: t('faq_a2'),
    },
    {
      question: t('faq_q3'),
      answer: t('faq_a3'),
    },
    {
      question: t('faq_q4'),
      answer: t('faq_a4'),
    },
  ];

  return (
    <main className="min-h-screen w-full overflow-x-hidden flex flex-col items-center justify-start mb-10 z-10">
      <div className="text-white text-center md:my-32 my-12">
        <h1 className="title-first">{t('howto_title')}</h1>
      </div>
      <StepsComponent />
      <div className="w-full max-w-[1440px] px-4 sm:px-6 md:px-10 my-10 flex flex-col">
        {/* What is Crypto Trading */}
        <section className="pb-10 grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] items-center gap-6">
          <div className="flex justify-center order-last md:order-first">
            <Player src="/Coin_City.json" loop autoplay className="max-w-50 md:max-w-100" />
          </div>
          <article className="grid place-content-center">
            <h3 className="text-lg md:text-4xl pb-5">{t('howto_what_is')}</h3>
            <p className="pb-5">
            {t('howto_what_is_p1')}
            </p>
            <p>
            {t('howto_what_is_p2')}
            </p>
          </article>
        </section>

        {/* How Does Crypto Work? */}
        <section className="pb-10">
          <article className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] items-center gap-6">
            <div>
              <h3 className="text-lg md:text-4xl pb-5">{t('howto_how_works')}</h3>
              <p className="pb-5">
              {t('howto_how_works_p1')}
              </p>
              <p className="pb-5">
              {t('howto_how_works_p2')}
              </p>
            </div>
            <div className="flex justify-center">
              <Player src="/Server-Coins.json" loop autoplay className="max-w-50 md:max-w-100" />
            </div>
          </article>

          <article className="grid grid-cols-1 md:grid-cols-[1fr_1fr] items-center gap-6">
            <div className="flex justify-center order-last md:order-first">
              <Player src="/Server2.json" loop autoplay className="max-w-50 md:max-w-100" />
            </div>
            <div>
              <h3 className="text-base md:text-2xl pb-2">{t('howto_steps')}</h3>
              <ol className="list-decimal pl-6 text-start">
                <li><strong>{t('howto_steps_1_1')}</strong> {t('howto_steps_1_2')}</li>
                <li><strong>{t('howto_steps_2_1')}</strong> {t('howto_steps_2_2')}</li>
                <li><strong>{t('howto_steps_3_1')}</strong> {t('howto_steps_3_2')}</li>
                <li><strong>{t('howto_steps_4_1')}</strong> {t('howto_steps_4_2')}</li>
              </ol>
            </div>
          </article>
        </section>

        {/* Long and short term trading */}
        <section className="pb-10">
          <h3 className="text-lg md:text-4xl pb-5 text-center">{t('howto_strategy_title')}</h3>
          <div className="flex flex-col md:flex-row gap-10">
            <div className="border rounded-2xl w-full">
              <div className="p-5">
                <div className="flex flex-col items-center pb-3">
                  <h6 className="text-lg md:text-2xl text-center pb-2">{t('howto_strategy_long')}</h6>
                  <figure>
                    <img
                      src="/textures/bitcoin-piggy-bank.svg"
                      alt="Bitcoin piggy bank svg"
                      className="w-20"
                    />
                  </figure>
                </div>
                <p className="pb-5">
                {t('howto_strategy_long_1')}
                </p>
                <p>
                {t('howto_strategy_long_2')}
                </p>
              </div>
            </div>

            <div className="border rounded-2xl w-full">
              <div className="p-5">
                <div className="flex flex-col items-center pb-3">
                  <h6 className="text-lg md:text-2xl text-center pb-2">{t('howto_strategy_short')}</h6>
                  <figure>
                    <img
                      src="/textures/bitcoin-trading.svg"
                      alt="Bitcoin trading tag svg"
                      className="w-20"
                    />
                  </figure>
                </div>
                <p className="pb-5">
                {t('howto_strategy_short_1')}
                </p>
                <p>
                {t('howto_strategy_short_2')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Common Mistakes Beginners Should Avoid */}
        <section className="pb-10">
          <h3 className="text-lg md:text-4xl py-6 text-center">{t('howto_mistakes_title')}</h3>

          <article className="grid grid-cols-1 md:grid-cols-[1.4fr_0.6fr] items-center gap-6">
            <div>
              <h4 className="font-bold pb-5 text-base md:text-lg">{t('howto_mistake_1')}</h4>
              <p className="pb-3">
              {t('howto_mistake_1_desc_1')}
            </p>
            <p className="pb-5">
            {t('howto_mistake_1_desc_2')}
            </p>
            </div>
            <div className="flex justify-center">
              <img src="/analytics.png" alt="analytics" className="max-w-80 object-cover" />
            </div>
          </article>

          <article className="grid grid-cols-1 md:grid-cols-[0.6fr_1.4fr] items-center gap-6">
            <div className="flex justify-center order-last md:order-first">
              <img src="/emotions.png" alt="emotions" className="max-w-80 object-cover" />
            </div>
            <div>
              <h4 className="font-bold pb-5 text-base md:text-lg">{t('howto_mistake_2')}</h4>
              <p className="pb-3">
              {t('howto_mistake_2_desc_1')}
            </p>
            <p className="pb-5">
            {t('howto_mistake_2_desc_2')}
            </p>
            </div>
          </article>

          <article className="grid grid-cols-1 md:grid-cols-[1.4fr_0.6fr] items-center gap-6">
            <div>
              <h4 className="font-bold pb-5 text-base md:text-lg">{t('howto_mistake_3')}</h4>
              <p className="pb-3">
              {t('howto_mistake_3_desc_1')}
            </p>
            <p className="pb-5">
            {t('howto_mistake_3_desc_2')}
            </p>
            </div>
            <div className="flex justify-center">
              <img src="/Cryptocurrencies.png" alt="Cryptocurrencies" className="max-w-80 object-cover" />
            </div>
          </article>
          <article>
            <p>
            {t('howto_reminder')}
            </p>
          </article>
        </section>

        {/* FAQ */}
        <section className="flex flex-col md:flex-row gap-10 justify-between border border-white/47 bg-black/50 rounded-2xl p-5">
          <div className="flex flex-col justify-between">
          <h2 className="faq-title">{t('howto_faq_title')}</h2>
            <figure>
              <img
                src="/textures/bitcoin-tag.svg"
                alt="bitcoin tag svg"
                className="w-18"
              />
            </figure>
          </div>

          <div className="flex flex-col text-sm md:text-xl w-full md:w-3/4 lg:w-1/2">
            {faqs.map((faq, index) => (
              <div key={index} className="pb-4">
                <details className="collapse">
                  <summary className="collapse-title p-1 rounded-2xl hover:underline">
                    {faq.question}
                  </summary>
                  <div className="collapse-content border border-white/47 bg-gradient-to-r from-blue-500 to-purple-600 text-sm rounded-box z-1 p-2 shadow-lg shadow-black">
                    {faq.answer}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="text-sm pt-5">
          <p>{t('howto_disclaimer_1')}</p>
          <p>
          {t('howto_disclaimer_2')}
          </p>
        </section>
      </div>
    </main>
  );
};