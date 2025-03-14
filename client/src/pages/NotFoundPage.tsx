import { useNavigate } from 'react-router';
import { Footer } from '../components/Footer';
import { Header } from '../components/header/Header';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <main className="container min-h-[75vh] mt-4">
        <h1 className="text-center text-3xl mb-10">404 - Page not found</h1>
        <section className="w-xl mx-auto">
          <div className="row">
            <div className="col-sm-12 ">
              <div className="col-sm-10 col-sm-offset-1 text-center">
                <div className="h-[400px] bg-[url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')] bg-center bg-no-repeat rounded-3xl"></div>

                <div className="contant_box_404 mt-6">
                  <p>The page you're looking for not found!</p>
                  <button
                    onClick={() => navigate(-1)}
                    type="button"
                    className="btn-generic mt-6"
                  >
                    Go back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};
