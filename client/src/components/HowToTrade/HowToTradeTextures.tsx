import "../../textures.css";
import { useEffect, useState } from "react";
import { HowToTradeContent } from "./HowToTradeContent";

export const HowToTradeTextures = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
  }, []);

  return (
    <div className="sm:block relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden">
      {/* Desktop version textures */}
      {isDesktop && (
        <div className="absolute inset-0 z-20 hidden lg:block bg-home-textures-desktop"></div>
      )}

      {/* Mobile version textures */}
      {!isDesktop && (
        <div className="absolute inset-0 z-20 lg:hidden bg-home-textures-mobile"></div>
      )}

      {/* Main Content */}
      <div className="relative z-30 flex flex-col items-center">
        <HowToTradeContent />
      </div>
    </div>
  );
};