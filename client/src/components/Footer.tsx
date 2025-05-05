import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <>
      <footer className="flex mx-5 gap-10 text-white mb-10 pt-10 justify-between flex-col md:flex-row lg:flex-row">
        <div className="flex flex-col gap-4">
          {/* Introduction */}
          <div>
            <p className="pb-3">
            {t('footer_about_cryptohill')}
            </p>
          </div>
 
          {/* Brand */}
          <div>
          <p className="text-3xl">By Seven Duck Alliance</p>
          <p className="text-zinc-400">Project 2025</p>
          </div>
        </div>
 
        {/* Copyright */}
        <div className="flex flex-col text-right text-zinc-400">
          <p>&#169; Crypto Wallet (Community) From Figma.com </p>
            <p>By cupid20103</p>
        </div>
      </footer>
    </>
  );
};