export const Footer = () => {
  return (
    <>
      <footer className="flex mx-5 gap-15 text-white mb-10 pt-10 justify-center">
          <div className="flex flex-col gap-5">
            {/* Introduction */}
            <div>
              <p className="pb-3">CryptoHill, the world's leading bitcoin ATM operator, makes it so flippin' easy to buy and sell bitcoin via cash, card or bank transfer.</p>
            </div>

            {/* Copyright */ }
                <div>
                  <p>&#169; Crypto Wallet (Community) From Figma.com </p>
                  <p>By cupid20103</p>
                </div>
          </div>

          {/* Brand */}
          <div className="flex flex-col text-right">
           <p className="text-3xl">By Seven Duck Alliance</p>
           <p className="text-zinc-400">Project 2025</p>
              </div>

      </footer>
    </>
  );
};