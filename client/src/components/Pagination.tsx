// universalus komponentas
// priima currentPage, totalPages
// grazina currentPage

import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (current: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onChange,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      // Jei maziau nei 7 puslapiai rodom vsus
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Visada rodom 3 pirmus puslapius
      pages.push(1, 2, 3);

      // Rodom "..." jei aktyvus puslapis daugiau nei pirmi 5
      if (currentPage > 5) {
        pages.push('...');
      }

      // Rodom aktyvu puslapi ir kaimynus (jeigu)
      if (currentPage > 3 && currentPage < totalPages - 2) {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
      }

      // Rodom "..." jei aktyvus puslapis gerokai didesnis nei 3
      if (currentPage < totalPages - 4) {
        pages.push('...');
      }

      // visada rodom paskutinius 3 puslapius
      pages.push(totalPages - 2, totalPages - 1, totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="border-t border-violet-900 py-3">
      <p className="text-center py-2">
        Page:{' '}
        <span className="text-violet-200">
          {' '}
          {currentPage}/{totalPages}{' '}
        </span>
      </p>
      <div className="flex items-center justify-center">
        {currentPage > 1 && (
          <button
            onClick={() => onChange(currentPage - 1)}
            className="cursor-pointer flex items-center justify-center p-2 text-violet-400 hover:text-violet-200"
          >
            <FaLongArrowAltLeft size={24} />
          </button>
        )}

        {pageNumbers.map((page, i) => (
          <button
            key={i}
            onClick={() => typeof page === 'number' && onChange(page)}
            disabled={page === currentPage || page === '...'}
            className={`${
              page === currentPage || page === '...'
                ? 'border-violet-400 cursor-default'
                : 'text-slate-600 bg-violet-950 cursor-pointer hover:bg-violet-700 hover:text-white'
            } w-10 p-2 border rounded-lg mx-1`}
          >
            {page}
          </button>
        ))}
        {currentPage < totalPages && (
          <button
            onClick={() => onChange(currentPage + 1)}
            className="cursor-pointer flex items-center justify-center p-2 text-violet-400 hover:text-violet-200"
          >
            <FaLongArrowAltRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
};
