import { FaSearch } from 'react-icons/fa';

interface SearchProps {
  onSearch: (searchString: string) => void;
  onClear: () => void;
  placeHolderText: string;
}

export const Search = ({ onSearch, placeHolderText }: SearchProps) => {
  const handleOnSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cleanText = (e.target as HTMLInputElement).value.replace(
        /[^a-zA-Z0-9À-ž\s]/gi,
        ''
      );

      onSearch(cleanText.toLocaleLowerCase());
    }
  };

  const handleOnClear = () => {};

  return (
    <div className="max-w-xs flex gap-1 items-center border border-violet-700 p-2 rounded-md">
      <FaSearch />
      <input
        onKeyUp={handleOnSearch}
        id="search"
        className="w-full border-none focus:outline-none"
        type="text"
        placeholder={placeHolderText}
      />
      <span onClick={handleOnClear} className="cursor-pointer">
        ❌
      </span>
    </div>
  );
};
