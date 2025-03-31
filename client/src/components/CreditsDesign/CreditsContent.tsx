import ContributorCard from "./ContributorCard";
export const CreditsContent = () => {
  const contributors = [
    {
      name: "Marijus Šmiginas",
      profilepic: <img src="ProfilePictures/marijus.jpg" alt="Marijus profile" className=" w-[100%] max-w-[200px] max-h-[200px] object-cover"/>,
      description: "Full Stack Developer",
      github: "https://github.com/marijustechin",
    },
    {
      name: "Deividas Didiul",
      profilepic: <img src="ProfilePictures/deividas.jpg" alt="Deividas profile" className="w-[100%] max-w-[200px] max-h-[200px] object-cover"/>,
      description: "Full Stack Developer",
      github: "https://github.com/Deiv237",
    },
    {
      name: "Airida Grašytė",
      profilepic: <img src="ProfilePictures/airida.jpg" alt="Airida profile" className="w-[100%] max-w-[200px] max-h-[200px] object-cover"/>,
      description: "QA tester",
      github: "https://github.com/airidaG",
    },
    {
      name: "Jonas Kuneckis",
      profilepic: <img src="ProfilePictures/jonas.webp" alt="Jonas profile" className="w-[100%] max-w-[200px] max-h-[200px] object-cover"/>,
      description: "Full Stack Developer",
      github: "https://github.com/Marerro",
    },
    {
      name: "Aleksandra Pigusova",
      profilepic: <img src="ProfilePictures/aleksandra.jpg" alt="Aleksandra profile" className="w-[100%] max-w-[200px] max-h-[200px] object-cover"/>,
      description: "Full Stack Developer",
      github: "https://github.com/Sashabae",
    },
    {
      name: "Gytė Maslinskienė",
      profilepic: <img src="ProfilePictures/gyte.jpg" alt="Gytė profile" className="w-[100%] max-w-[200px] max-h-[200px] object-cover"/>,
      description: "Full Stack Developer",
      github: "https://github.com/GyteMas",
    },
    {
      name: "Laima Kulbytė",
      profilepic: <img src="ProfilePictures/laima.webp" alt="Laima profile" className="w-[100%] max-w-[200px] max-h-[200px] object-cover"/>,
      description: "Full Stack Developer",
      github: "https://github.com/mutemutemute",
    },
    {
      name: "Martyn Konstantinov",
      profilepic: <img src="ProfilePictures/martyn.jpg" alt="Martyn profile" className="w-[100%] max-w-[200px] max-h-[200px] object-cover"/>,
      description: "Full Stack Developer",
      github: "https://github.com/nineteee",
    },
  ];

  return (
    <main className="min-h-screen container mb-10">
      <section className="flex flex-col items-center text-2xl md:text-3xl lg:text-4xl pt-10 pb-20">
        <h1 className="text-center title-first">The Team Simulating Success</h1>
      </section>

      {/* cards using component */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 place-self-center">
        {contributors.map((contributor, index) => (

          <ContributorCard key={index} contributor={contributor} />
        ))}
      </section>

      <section className="mx-10 mb-10">
        <p>
          This website is the result of collaboration, creativity, and determination. 
          It serves as a reminder that great things happen when people come together.
        </p>
        <p>
          Built with love, coffee, and countless lines of code. Thank you for visiting ♡
        </p>
      </section>
    </main>
  );
};
