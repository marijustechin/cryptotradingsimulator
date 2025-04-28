import { useState } from 'react';

interface ISearchProps {
  placeholderText: string;
  // grazina paieskos teksta
  onSearch: (searchString: string) => void;
}

export const Search = ({ placeholderText, onSearch }: ISearchProps) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cleanText = searchText.replace(/[^A-z0-9À-ž._\s]/gi, '');
      onSearch(cleanText.toLocaleLowerCase());
    }
  };

  const handleClearSearch = () => {
    setSearchText('');
    onSearch('');
  };

  return (
    <div className="border border-violet-800 rounded-lg md:w-1/2">
      <input
        className="p-2 focus:outline-none"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyUp={handleSearch}
        id={placeholderText}
        type="text"
        autoComplete="off"
        placeholder={placeholderText}
        aria-label={`Search for ${placeholderText}`}
      />
      <button
        onClick={handleClearSearch}
        className={`${
          searchText ? 'visible' : 'invisible'
        } mr-1 cursor-pointer`}
      >
        ❌
      </button>
    </div>
  );
};
