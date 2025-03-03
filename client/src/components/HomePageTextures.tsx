import { WelcomeMessageHome } from "./WelcomeMessageHome";

export const HomePageTextures = () => {
    return (
        <div className="relative h-screen w-full flex items-center justify-center">
            <div
                className="absolute w-full h-full z-10"
                style={{
                    backgroundImage: `
                        url('../../public/textures/sphere.svg'),
                        url('/textures/Monero.svg'),
                        url('/textures/star-img.svg'),
                        url('/textures/star-img2.svg'),
                        url('/textures/star-img3.svg'),
                        url('/textures/Etherium-2.svg'),
                        url('/textures/LiteCoin-1.svg'),
                        url('/textures/sphere-y.svg'),
                        url('/textures/Bitcoin-1.svg'),
                        url('/textures/star-img3.svg')
                    `,
                    backgroundSize: '7%, 10%, 3%, 2%, 2%, 8%, 7%, 5%, 7%, 2%',
                    backgroundRepeat: 'no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat',
                    backgroundPosition: `
                        right 0px top 450px,
                        right 130px top 220px,
                        right 300px top 110px,
                        right 200px top 200px,
                        right 250px top 900px,
                        right 430px top 650px,
                        left 300px top 550px,
                        left 180px top 350px,
                        left 270px top 100px,
                        left 350px top 290px
                    `
                }}
            ></div>

            <WelcomeMessageHome />

            <div className="texture-green"></div>
            <div className="texture-orange"></div>
            <div className="texture-purple"></div>
        </div>
    );
};