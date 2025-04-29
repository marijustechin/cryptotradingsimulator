// components/ContributorCard.tsx
import React from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  return (
    <article className="bg-gradient-to-r from-black to-gray-800 rounded-2xl mx-10 mb-10 hover:bg-gradient-to-r hover:from-gray-950 hover:to-violet-950 transition duration-300 shadow-lg hover:shadow-[0_0_20px_10px_rgba(138,43,226,0.7)] max-w-xl grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr]">
      <figure className="p-4 flex justify-center">{contributor.profilepic}</figure>
      <div className="flex flex-col justify-between h-full py-5">
        <div>
        <h2 className="credits-card-name p-2">{contributor.name}</h2>
        <p className="credits-card-description p-2">{contributor.description}</p>
        </div>
          <button>
            <a
              href={contributor.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline flex items-center p-2 text-sm"
            >
              <img
                src="/textures/github.svg"
                alt="github logo"
                className="w-5 mr-2"
              />
              {t('contributor_github_link')}
            </a>
          </button>
        </div>
    </article>
  );
};

export default ContributorCard;
