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
    const pages: (number | string)[] = [];

    // Always show first page
    pages.push(1);

    // Show left "..." if needed
    if (currentPage > 4) {
      pages.push('...');
    }

    // Show neighbors (up to 2 before and after)
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    // Show right "..." if needed
    if (currentPage < totalPages - 3) {
      pages.push('...');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return totalPages > 0 ? (
    <div className='py-3'>
      <p className='text-center py-2'>
        Page:{' '}
        <span className='text-white'>
          {currentPage}/{totalPages}{' '}
        </span>
      </p>
      <div className='flex items-center justify-center'>
        {currentPage > 1 && (
          <button
            onClick={() => onChange(currentPage - 1)}
            className='cursor-pointer flex items-center justify-center p-2 text-violet-400 hover:text-violet-200'
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
            className='cursor-pointer flex items-center justify-center p-2 text-violet-400 hover:text-violet-200'
          >
            <FaLongArrowAltRight size={24} />
          </button>
        )}
      </div>
    </div>
  ) : (
    <p className='text-center pt-5'>No content to display</p>
  );
};
