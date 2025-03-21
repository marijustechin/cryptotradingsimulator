export const CreditsContent = () => {
  const contributors = [
    {
      name: "Marijus Šmiginas",
      profilepic: (
        <img src="ProfilePictures/marijus.jpg" alt="Marijus profile picture" />
      ),
      description: "Full Stack Developer",
      github: "https://github.com/marijustechin",
    },
    {
      name: "Deividas Didiul",
      profilepic: (
        <img
          src="ProfilePictures/deividas.jpg"
          alt="Deividas profile picture"
        />
      ),
      description: "Full Stack Developer",
      github: "https://github.com/Deiv237",
    },
    {
      name: "Airida Grašytė",
      profilepic: (
        <img src="ProfilePictures\airida.jpg" alt="Airida profile picture" />
      ),
      description: "QA tester",
      github: "https://github.com/airidaG",
    },
    {
      name: "Jonas Kuneckis",
      profilepic: (
        <img src="ProfilePictures\jonas.webp" alt="Jonas profile picture" />
      ),
      description: "Full Stack Developer",
      github: "https://github.com/Marerro",
    },
    {
      name: "Aleksandra Pigusova",
      profilepic: (
        <img
          src="ProfilePictures/aleksandra.jpg"
          alt="Aleksandra profile picture"
        />
      ),
      description: "Full Stack Developer",
      github: "https://github.com/Sashabae",
    },
    {
      name: "Gytė Maslinskienė",
      profilepic: (
        <img src="ProfilePictures/gyte.jpg" alt="Gytė profile picture" />
      ),
      description: "Full Stack Developer",
      github: "https://github.com/GyteMas",
    },
    {
      name: "Laima Kulbytė",
      profilepic: (
        <img src="ProfilePictures/laima.webp" alt="Laima profile picture" />
      ),
      description: "Full Stack Developer",
      github: "https://github.com/mutemutemute",
    },
    {
      name: "Martyn Konstantinov",
      profilepic: (
        <img src="ProfilePictures/martyn.jpg" alt="Martyn profile picture" />
      ),
      description: "Full Stack Developer",
      github: "https://github.com/nineteee",
    },
  ];

  return (
    <main className="min-h-screen container mb-10">
      {/* page title */}
      <section className="flex flex-col items-center text-3xl md:text-5xl lg:text-6xl pt-120 lg:pt-100 pb-126">
        <span aria-hidden="true">(っ◔◡◔)っ</span>
        <h1 className="text-center credits-title">♥ Meet The Team ♥</h1>
        <span className="animate-bounce pt-4" aria-hidden="true">
          ↓
        </span>
      </section>

      {/* card */}
      <section>
        {contributors.map((contributor, index) => (
          <article
            key={index}
            className="card card-side bg-gradient-to-r from-black to-gray-800 rounded-2xl mx-10 mb-10 hover:bg-gradient-to-r hover:from-gray-950 hover:to-violet-950 transition duration-300 shadow-lg hover:shadow-[0_0_20px_10px_rgba(138,43,226,0.7)]"
          >
            <figure className="md:w-[200px] md:h-[300px] lg:w-[200px] lg:h-[300px]">
              {contributor.profilepic}
            </figure>
            <div className="card-body">
              <h2 className="card-title credits-card-name">
                {contributor.name}
              </h2>
              <p className="credits-card-description">
                {contributor.description}
              </p>
              <div className="card-actions justify-start credits-card-description">
                <button>
                  <a
                    href={contributor.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center"
                  >
                    <img
                      src="/textures/github.svg"
                      alt="bitcoin trading svg"
                      className="w-5 mr-2"
                    />
                    Github profile
                  </a>
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mx-10 mb-10">
        <p>
          This website is the result of collaboration, creativity, and
          determination. It serves as a reminder that great things happen when
          people come together.
        </p>
        <p>
          Built with love, coffee, and countless lines of code. Thank you for
          visiting ♡
        </p>
      </section>
    </main>
  );
};
