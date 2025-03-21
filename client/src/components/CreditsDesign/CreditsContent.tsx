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
      profilepic: <img src="" alt="Airida profile picture" />,
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
    {
      name: "Kernius Pauliukėnas",
      profilepic: <img src="" alt="Kernius profile picture" />,
      description: "QA tester",
      github: "idk",
    },
  ];
  return (
    <div className="min-h-screen mx-5 mb-10">
      {/* page title */}
      <div className="flex flex-col items-center text-3xl md:text-5xl lg:text-6xl pt-120 lg:pt-100 pb-130">
        <span>(っ◔◡◔)っ</span>
        <span>♥ 𝑴𝒆𝒆𝒕 𝑻𝒉𝒆 𝑻𝒆𝒂𝒎 ♥</span>
        <span>↓</span>
      </div>

      {/* card */}
      <div>
        {contributors.map((contributor, index) => (
          <div
            key={index}
            className="card card-side bg-gradient-to-r from-black to-gray-800 rounded-2xl mx-10 mb-10 hover:bg-gradient-to-r hover:from-gray-950 hover:to-violet-950 transition duration-300 shadow-lg hover:shadow-[0_0_20px_10px_rgba(138,43,226,0.7)]"
          >
            <figure className=" md:w-[200px] md:h-[300px] lg:w-[200px] lg:h-[300px]">
              {contributor.profilepic}
            </figure>
            <div className="card-body">
              <h3 className="card-title">{contributor.name}</h3>
              <p>{contributor.description}</p>
              <div className="card-actions justify-start">
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
                    <span>Github profile</span>
                  </a>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-10">
        <p>
          This website is the result of collaboration, creativity, and
          determination. It serves as a reminder that great things happen when
          people come together.
        </p>
        <p>
          Built with love, coffee, and countless lines of code. Thank you for
          visiting ♡
        </p>
      </div>
    </div>
  );
};
