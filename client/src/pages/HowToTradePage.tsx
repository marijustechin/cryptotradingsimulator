// import { Background } from "./Background";

export const HowToTradePage = () => {
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
    <div className="min-h-screen flex flex-col items-center ml-5 mr-5">
      {/* <Background /> */}

      <div className="z-10">
        <div className="text-4xl md:text-4xl lg:text-6xl pt-[8rem] pb-[4rem] flex justify-center">
          Steps For Trading on CryptoHill
        </div>

        <div className="flex flex-col gap-3 items-center text-md md:text-lg lg:text-xl pb-16">
          <p className="p-4 border border-white/47 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
            Sign up for a cryptocurrency exchange
          </p>
          <span>↓</span>
          <p className="p-4 border border-white/47 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
            Fund your account
          </p>
          <span>↓</span>
          <p className="p-4 border border-white/47 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
            Pick a crypto to invest in
          </p>
          <span>↓</span>
          <p className="p-4 border border-white/47 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
            Start trading
          </p>
          <span>↓</span>
          <p className="p-4 border border-white/47 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
            Store your cryptocurrency
          </p>
        </div>

        {/* <div>
          How Crypto Trade Works
        </div> */}

        <div className="flex flex-row gap-10 md:gap-10 lg:gap-40">
          <div className="text-lg md:text-4xl lg:text-4xl">
            Frequently Asked Questions
          </div>

          <div className="flex flex-col text-sm md:text-xl lg:text-2xl">
            {faqs.map((faq, index) => (
              <div key={index} className="pb-4">
                <div className="dropdown">
                  <div
                    tabIndex={0}
                    role="button"
                    className="cursor-pointer p-1 hover:shadow-md hover:shadow-purple-500/90 duration-300"
                  >
                    {faq.question}
                  </div>
                  <div
                    tabIndex={0}
                    className="menu dropdown-content border border-white/47 bg-base-100 bg-gradient-to-r from-blue-500 to-purple-600 rounded-box z-1 w-50 md:w-70 lg:w-90 p-2 shadow-lg shadow-black"
                  >
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
