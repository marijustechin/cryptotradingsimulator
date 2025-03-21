export const HowToTradeContent = () => {
  const faqs = [
    {
      question: "Which is the best cryptocurrency to trade?",
      answer:
        "Bitcoin may be the best-known cryptocurrency, but there are literally hundreds of others to choose from. And with new cryptos launching every week, choosing the best one to trade isn't an easy decision. Read our helpful guides and articles, then choose cryptocurrencies to trade using our simulated exchange. It's just like trading with real crypto, but with absolutely none of the risk!",
    },
    {
      question: "How much should I invest in cryptocurrency?",
      answer:
        "The amount to invest in cryptocurrency depends on your financial goals and risk tolerance. It's essential to do thorough research and consider diversifying your investments.",
    },
    {
      question: "Will I make a profit from cryptocurrency trading?",
      answer:
        "Although it's definitely possible to see some big returns from crypto trading, profits aren't guaranteed. Crypto markets are hugely volatile, so unwary traders can lose big sums of cash in a very short time if they don't read the signs.",
    },
    {
      question: "Is it safe to trade cryptocurrency?",
      answer:
        "Yes, it's safe to trade cryptocurrency. The only way to lose money is to gamble with crypto. Crypto trading is a risk-free way to make money.",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center mx-5 mb-10">
      {/* Steps for trading */}
      <h1 className="how-to-trade-title pt-[4rem] pb-[3rem] flex justify-center text-center">
        Steps For Trading on CryptoHill
      </h1>

      <section className="flex flex-col gap-3 items-center text-center text-base md:text-lg lg:text-xl pb-16">
        <p className="p-4 mx-2 border border-white/47 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
          Sign up for a cryptocurrency exchange
        </p>
        <span aria-hidden="true">↓</span>
        <p className="p-4 border border-white/47 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
          Have fake money to trade
        </p>
        <span aria-hidden="true">↓</span>
        <p className="p-4 border border-white/47 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
          Pick a crypto to invest in
        </p>
        <span aria-hidden="true">↓</span>
        <p className="p-4 border border-white/47 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
          Start trading
        </p>
        <span aria-hidden="true">↓</span>
        <p className="p-4 border border-white/47 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
          Store your cryptocurrency
        </p>
      </section>

      <div className="md:mx-10 lg:mx-50 container">
        {/* What is Crypto Trading */}
        <section className="pb-10">
          <h2 className="h2-title pb-5">What is Crypto Trading</h2>
          <p className="pb-5">
            Crypto trading is all about buying and selling digital currencies,
            such as Bitcoin(BTC) or Ethereum (ETH), to make a profit. Unlike
            traditional finance markets, the crypto market is open 24 hours. To
            get started, you need a wallet and an exchange to trade on.
          </p>
          <p>
            If you want to trade crypto, you will have to speculate on the price
            of a digital currency to make a profit. The goal is to buy low and
            sell high, or vice versa, by taking advantage of price movements in
            the cryptocurrency market. Understanding the market's dynamics can
            help minimize losses and maximize profits.
          </p>
        </section>

        {/* How Does Crypto Work? */}
        <section className="pb-10">
          <h2 className="h2-title pb-5">How Does Crypto Work?</h2>
          <p className="pb-5">
            Cryptocurrencies operate on blockchain networks. Think of a
            blockchain network as a series of blocks that contain transaction
            data. If person A sends crypto to person B, all of that information
            is secured on a block. If person B sends crypto to person C, that
            information is secured on another block and so on. All of these
            blocks are linked together.
          </p>
          <p className="pb-5">
            Just like you deposit money into your bank account and your bank
            keeps a record of it, all the crypto you deposit into your crypto
            account is recorded on the blockchain. And just like regular money
            can be broken down into smaller parts for example there can be a
            fiat paper currency for $1, $100, and so on, cryptocurrencies can
            also be broken down into smaller parts.
          </p>
          <article>
            <h3 className="h3-title pb-2">
              Steps in a Typical Crypto Transaction:
            </h3>
            <ol className="list-decimal pl-10">
              <li>
                <span className="font-bold">Initiate Transfer:</span> Sender
                enters recipient's wallet address and amount.
              </li>
              <li>
                <span className="font-bold">Verification:</span> Network nodes
                confirm the transaction's validity.
              </li>
              <li>
                <span className="font-bold">Confirmation:</span> Transaction is
                added to the blockchain.
              </li>
              <li>
                <span className="font-bold">Settlement:</span> Funds are
                available in the recipient's wallet.
              </li>
            </ol>
          </article>
        </section>

        {/* Long and short term trading */}
        <section className="pb-10">
          <h2 className="h2-title pb-5">Long-term or Short-term Trading</h2>
          <div className="flex flex-col md:flex-row lg:flex-row gap-10">
            <div className="border rounded-2xl">
              <article className="m-5">
                <div className="flex flex-col items-center pb-3">
                  <h3 className="h3-title text-center pb-2">
                    Long-term trading
                  </h3>
                  {/* svg */}
                  <figure>
                    <img
                      src="/textures/bitcoin-piggy-bank.svg"
                      alt="Bitcoin piggy bank svg"
                      className="w-20"
                    />
                  </figure>
                </div>
                <p className="pb-5">
                  Long-term traders buy and hold cryptocurrencies for weeks,
                  months or even years, with the intention of selling at a
                  profit or using it later.
                </p>
                <p>
                  If you believe the value of a cryptocurrency will grow in the
                  long run and don't want the stress of actively trading, then
                  this might be your style. A good first step is learning how to
                  safely buy and hold cryptocurrency.
                </p>
              </article>
            </div>
            <div className="border rounded-2xl">
              <article className="m-5">
                <div className="flex flex-col items-center pb-3">
                  <h3 className="h3-title text-center pb-2">
                    Short-term trading
                  </h3>
                  {/* svg */}
                  <figure>
                    <img
                      src="/textures/bitcoin-trading.svg"
                      alt="Bitcoin trading tag svg"
                      className="w-20"
                    />
                  </figure>
                </div>
                <p className="pb-5">
                  Short-term trading is about taking advantage of short-term
                  cryptocurrency price swings by creating and executing a
                  trading strategy.
                </p>
                <p>
                  It's more active, stressful and risky than long-term trading,
                  but it also offers faster and larger potential returns for
                  those who do it right. It also lets you profit from
                  cryptocurrency prices dropping as well as rising.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Common Mistakes Beginners Should Avoid */}
        <section className="pb-10">
          <h2 className="h2-title pb-6">
            Common Mistakes Beginners Should Avoid
          </h2>
          <article>
            <h4 className="pb-5 h4-title">Lack of Research:</h4>
            <p className="pb-3">
              The single greatest mistake that we have seen a lot of beginners
              make is blindly following someone in hopes of getting rich quick.
              You must acknowledge the fact that it's a marathon not a race. If
              you follow a random influencer or buy a random crypto coin just
              because someone is saying so, there is a huge chance that you will
              end up regretting it.
            </p>
            <p className="pb-5">
              Always do your own research, polish your trading skills and trust
              yourself more than anyone else if you want to consistently make
              money. Whenever you hear FUD (Fear, Uncertainty, Doubt) or read
              about it, make sure to double check it with reputable resources
              before believing it.
            </p>
          </article>
          <article>
            <h4 className="pb-5 h4-title">Emotional Trading:</h4>
            <p className="pb-3">
              When trading with your hard-earned money and seeing it wash away,
              a common mistake lots of traders make is trying to win it all back
              in one trade. While it sounds good and might sometimes work, it
              isn't a net positive strategy. Emotional or revenge trading is a
              bane of countless traders which is why you should keep your
              emotions in check.
            </p>
            <p className="pb-5">
              Never let a bad trade get to your head. Treat it as a learning
              curve and study what you did wrong in hopes of never repeating the
              same mistake again. Allowing emotions like fear and greed to drive
              your decisions can lead to impulsive buys or panic selling. Stick
              to your plan and avoid making trades based on short-term market
              movements.
            </p>
          </article>
          <article>
            <h4 className="pb-5 h4-title">Overtrading:</h4>
            <p className="pb-3">
              Lastly, you need to remember that taking breaks to recharge every
              once in a while is not only good for your mental health but will
              also help you become a better trader. Trying to capitalize on
              every price movement can be exhausting and costly. You need to
              give yourself enough time to recover so that you are in good shape
              to trade.
            </p>
            <p className="pb-10">
              It is also a good strategy to distance yourself from the market
              for a bit if you are on a losing streak in terms of your trades.
              Some time away from the market and reflecting on what you are
              doing wrong will help you freshen your mind and get back in your
              groove much faster.
            </p>
          </article>
          <article>
            <p>
              Remember, trading is a journey of constant learning, and every
              mistake is an opportunity to grow and improve.
            </p>
          </article>
        </section>

        {/* FAQ */}
        <section className="flex flex-row gap-10 md:gap-10 lg:gap-40 justify-between border border-white/47 bg-black/50 rounded-2xl p-5">
          <div className="flex flex-col justify-between">
            <h2 className="faq-title">Frequently Asked Questions</h2>
            <figure>
              <img
                src="/textures/bitcoin-tag.svg"
                alt="bitcoin tag svg"
                className="w-18"
              />
            </figure>
          </div>

          <ul className="flex flex-col text-sm md:text-xl lg:text-2xl w-full md:w-3/4 lg:w-1/2">
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
          </ul>
        </section>

        <section className="text-sm pt-5">
          <p>This page is for educational and informational purposes only.</p>
          <p>
            Our website provides a demo version of a crypto trading platform
            where you can simulate buying and selling cryptocurrencies without
            any actual risks or transactions.
          </p>
        </section>
      </div>
    </main>
  );
};
