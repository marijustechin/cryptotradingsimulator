

export const HomePageTextures = () => {
    return (
        <div className="relative h-screen w-full">
            <div
                className="absolute w-full h-full z-10"
                style={{
                    backgroundImage: `
                        url('../../public/textures/sphere.svg'),
                        url('../../public/textures/Monero.svg'),
                        url('../../public/textures/star-img.svg'),
                        url('../../public/textures/star-img2.svg')`,
                    backgroundSize: '7%, 10%, 3%, 2%',
                    backgroundRepeat: 'no-repeat, no-repeat, no-repeat, no-repeat',
                    backgroundPosition: `
                        right 0px top 450px,
                        right 130px top 220px,
                        right 300px top 110px,
                        right 200px top 200px,
                        left 0 top 5px`
                }}
            ></div>
            <div className="texture-green"></div>
            <div className="texture-orange"></div>
            <div className="texture-purple"></div>
        </div>
    );
};
