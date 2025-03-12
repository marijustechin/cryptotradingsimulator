

export const Footer = () => {
  return (
    <>
      <footer className="flex relative z-10s mx-auto text-white text-center gap-3 h-[17vh] mb-30 pt-10 justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2  md:w-[50.45vw] mx-auto md:justify-between">

          <div className="flex flex-col gap-5 ">

            {/* Text */}
            <div className="">
              <p className="pb-3">CryptoHill, the world's leading bitcoin ATM operator, makes<br></br>it so flippin' easy to buy and sell bitcoin via cash, card<br></br> or bank transfer.</p>
              <p>Sign up to get the latest in CryptoHill news, discounts, <br></br> and more.</p>
            </div>

            { /* Input Email Address */}
            <div className="flex justify-center">
            <div className="relative w-[80%] md:w-[39vw] lg:w-[20vw] p-[1px] bg-gradient-to-r from-blue-500 to-purple-600 rounded-[5px]">
              <div className=" bg-[#222] text-white p-3 rounded-[5px] flex items-center">
                <input
                  type="text"
                  className="bg-transparent text-white placeholder-gray-400 focus:outline-none"
                  placeholder="Email address"
                />
              </div>
            </div>
            </div>

            {/* Copyright */ }

            <div className="">
                <div>
                  <p>&#169; Crypto Wallet (Community) From Figma.com <br></br> By cupid20103 </p>
                </div>
            </div>
          </div>

          {/* Second row */}

          <div className="flex items-center justify-center">
            <div className="text-center p-3">
              <p>• Seven Duck Alliance </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
