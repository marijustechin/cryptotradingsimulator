

export const HomePageTextures = () => {
    return (
        <div className="relative h-screen w-full">
            <div
                className="absolute w-full h-full z-10"
                style={{
                    backgroundImage: `
                        url('/textures/sphere.svg'),
                        url('/textures/Monero.svg'),
                        url('textures/star-img.svg'),
                        url('/textures/star-img2.svg'),
                        url('/textures/Etherium-2.svg'),
                        url('/textures/star-img3.svg'),
                        url('/textures/LiteCoin-1.svg'),
                        url('/textures/sphere-y.svg'),
                        url('/textures/star-img3.svg'),
                        url('/textures/Bitcoin-1.svg')
                        `,
                    backgroundSize: '7%, 10%, 3%, 2%, 8%, 2%, 8%, 7%, 3%, 8%',
                    backgroundRepeat: 'no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat',
                    backgroundPosition: `
                        right 0px top 450px,
                        right 130px top 220px,
                        right 300px top 110px,
                        right 200px top 200px,
                        right 400px top 650px,
                        right 350px top 800px,
                        left 350px top 750px,
                        left 250px top 500px,
                        left 350px top 350px,
                        left 130px top 130px
                        `
                }}
            ></div>
            <div className="texture-green"></div>
            <div className="texture-orange"></div>
            <div className="texture-purple"></div>
        </div>
    );
};
