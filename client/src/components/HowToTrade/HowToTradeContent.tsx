import { Player } from "@lottiefiles/react-lottie-player";
import StepsComponent from "../Steps";
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
    <main className="min-h-screen flex flex-col items-center mx-5 mb-10 z-10">
      <div className="text-white text-center md:my-32 my-12">
        <h1 className="title-first"> Steps For Trading on CryptoHill</h1>
      </div>
      <StepsComponent />
      <div className="md:mx-10 lg:mx-50 container">
        {/* What is Crypto Trading */}
        <section className="pb-10 grid md:grid-cols-[0.8fr_1.2fr] items-center last:hidden gap-6">
        <div className="flex justify-center order-last md:order-first">
          <Player
            src="/Coin_City.json"
            loop
            autoplay
            className="max-w-50 md:max-w-100"
          />
          </div>
          <article className="grid place-content-center">
            <h3 className="text-lg md:text-4xl lg:text-4xl pb-5">
              What is Crypto Trading
            </h3>
            <p className="pb-5">
              Crypto trading is all about buying and selling digital currencies,
              such as Bitcoin(BTC) or Ethereum (ETH), to make a profit. Unlike
              traditional finance markets, the crypto market is open 24 hours.
              To get started, you need a wallet and an exchange to trade on.
            </p>
            <p>
              If you want to trade crypto, you will have to speculate on the
              price of a digital currency to make a profit. The goal is to buy
              low and sell high, or vice versa, by taking advantage of price
              movements in the cryptocurrency market. Understanding the market's
              dynamics can help minimize losses and maximize profits.
            </p>
          </article>
        </section>

        {/* How Does Crypto Work? */}
        <section className="pb-10">
          <article className="grid md:grid-cols-[1.2fr_0.8fr] items-center gap-6">
            <div>
              <h3 className="text-lg md:text-4xl lg:text-4xl pb-5">
                How Does Crypto Work?
              </h3>
              <p className="pb-5">
                Cryptocurrencies operate on blockchain networks. Think of a
                blockchain network as a series of blocks that contain
                transaction data. If person A sends crypto to person B, all of
                that information is secured on a block. If person B sends crypto
                to person C, that information is secured on another block and so
                on. All of these blocks are linked together.
              </p>
              <p className="pb-5">
                Just like you deposit money into your bank account and your bank
                keeps a record of it, all the crypto you deposit into your
                crypto account is recorded on the blockchain. And just like
                regular money can be broken down into smaller parts—for example,
                there can be a fiat paper currency for $1, $100, and so on—
                cryptocurrencies can also be broken down into smaller parts.
              </p>
            </div>
            <div className="flex justify-center">
              <Player src="/Server-Coins.json" loop autoplay className="max-w-50 md:max-w-100" />
            </div>
          </article>
          <article className="grid md:grid-cols-[1fr_1fr] items-center gap-6">
          <div className="flex justify-center order-last md:order-first">
            <Player src="/Server2.json" loop autoplay className="max-w-50 md:max-w-100" />
          </div>
          <div>
            <h3 className="text-base md:text-2xl lg:text-2xl pb-2">
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
          </div>
          </article>
        </section>

        {/* Long and short term trading */}
        <section className="pb-10">
          <h3 className="text-lg md:text-4xl lg:text-4xl pb-5 text-center">
            Long-term or Short-term Trading
          </h3>
          <div className="flex flex-col md:flex-row lg:flex-row gap-10">
            <div className="border rounded-2xl">
              <div className="m-5">
                <div className="flex flex-col items-center pb-3">
                  <p className="text-lg md:text-2xl lg:text-2xl text-center pb-2">
                    Long-term trading
                  </p>
                  {/* svg */}
                  <img
                    src="/textures/bitcoin-piggy-bank.svg"
                    alt="bitcoin trading svg"
                    className="w-20"
                  />
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
              </div>
            </div>
            <div className="border rounded-2xl">
              <div className="m-5">
                <div className="flex flex-col items-center pb-3">
                  <p className="text-lg md:text-2xl lg:text-2xl text-center pb-2">
                    Short-term trading
                  </p>
                  {/* svg */}
                  <img
                    src="/textures/bitcoin-trading.svg"
                    alt="bitcoin trading svg"
                    className="w-20"
                  />
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
              </div>
            </div>
          </div>
        </section>

        {/* Common Mistakes Beginners Should Avoid */}
        <section className="pb-10">
          <h3 className="text-lg md:text-4xl lg:text-4xl py-6 text-center ">
            Common Mistakes Beginners Should Avoid
          </h3>
          <article className="grid md:grid-cols-[1.4fr_0.6fr] items-center gap-6">
            <div>
            <h4 className="font-bold pb-5 text-base md:text-lg lg:text-lg">
              Lack of Research:
            </h4>
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
              money. Whenever you hear FUD or read about it, make sure to double
              check it with reputable resources before believing it.
            </p>
            </div>
            <div className="flex justify-center"><img src="/analytics.png" alt="analytics" className="max-w-80 object-cover"/></div>
          </article>
          <article className="grid md:grid-cols-[0.6fr_1.4fr] items-center gap-6">
          <div className="flex justify-center order-last md:order-first"><img src="/emotions.png" alt="analytics" className="max-w-80 object-cover"/></div>
            <div>
            <h4 className="font-bold pb-5 text-base md:text-lg lg:text-lg">
              Emotional Trading:
            </h4>
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
            </div>
          </article>
          <article className="grid md:grid-cols-[1.4fr_0.6fr] items-center gap-6">
          <div>
            <h4 className="font-bold pb-5 text-base md:text-lg lg:text-lg">
              Overtrading:
            </h4>
            <p className="pb-3">
              Lastly, you need to remember that touching some grass every once
              in a while is not only good for your mental health but will also
              help you become a better trader. Trying to capitalize on every
              price movement can be exhausting and costly. You need to give
              yourself enough time to recover so that you are in good shape to
              trade.
            </p>
            <p className="pb-5">
              It is also a good strategy to distance yourself from the market
              for a bit if you are on a losing streak in terms of your trades.
              Some time away from the market and reflecting on what you are
              doing wrong will help you freshen your mind and get back in your
              groove much faster.
            </p>
          </div>
          <div className="flex justify-center"><img src="/Cryptocurrencies.png" alt="Cryptocurrencies" className="max-w-80 object-cover"/></div>
          </article>
        </section>

        {/* FAQ */}
        <section className="flex flex-row gap-10 md:gap-10 lg:gap-40 justify-between border border-white/47 bg-black/50 rounded-2xl p-5">
          <div className="flex flex-col justify-between">
            <span className="text-lg md:text-4xl lg:text-4xl">
              Frequently Asked Questions
            </span>
            <img src="/textures/bitcoin-tag.svg" alt="star" className="w-18" />
          </div>

          <div className="flex flex-col text-sm md:text-xl lg:text-2xl w-full md:w-3/4 lg:w-1/2">
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
