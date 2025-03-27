
import { Footer } from "../components/Footer";
import { Header } from "../components/header/Header";
import { NotFoundTextures } from "../components/NotFound/NotFoundTextures";

const NotFoundPage = () => {
  return (
    <div className="grid grid-rows-[auto_1fr_auto]">
      <Header />
      <NotFoundTextures />
      <div className="border-t border-[#636363]">
        <Footer />
      </div>
    </div>
  );
};
export default NotFoundPage;
