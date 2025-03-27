// components/ContributorCard.tsx
import React from "react";

interface Contributor {
  name: string;
  description: string;
  profilepic: React.ReactNode;
  github: string;
}

interface Props {
  contributor: Contributor;
}

const ContributorCard: React.FC<Props> = ({ contributor }) => {
  return (
    <article className="bg-gradient-to-r from-black to-gray-800 rounded-2xl mx-10 mb-10 hover:bg-gradient-to-r hover:from-gray-950 hover:to-violet-950 transition duration-300 shadow-lg hover:shadow-[0_0_20px_10px_rgba(138,43,226,0.7)] max-w-xl grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr]">
      <figure className="p-4 flex justify-center">{contributor.profilepic}</figure>
      <div className="card-body">
        <h2 className="card-title credits-card-name">{contributor.name}</h2>
        <p className="credits-card-description">{contributor.description}</p>
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
                alt="github logo"
                className="w-5 mr-2"
              />
              Github profile
            </a>
          </button>
        </div>
      </div>
    </article>
  );
};

export default ContributorCard;
