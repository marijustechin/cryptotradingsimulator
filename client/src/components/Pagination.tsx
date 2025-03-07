// universalus komponentas
// priima currentPage, totalPages
// grazina currentPage

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
  return (
    <div className="border-t border-violet-900 py-3">
      <p className="text-center py-2">
        Page:{' '}
        <span className="text-violet-200">
          {currentPage}/{totalPages}{' '}
        </span>
      </p>
      <div className="flex items-center justify-center">
        {[...Array(totalPages)].map((x, i) => (
          <button
            disabled={i + 1 === currentPage}
            onClick={() => onChange(i + 1)}
            key={'pageNumber' + i + 1}
            className={`${
              i + 1 === currentPage
                ? 'border-violet-400 cursor-default'
                : 'text-slate-600 bg-violet-950 cursor-pointer hover:bg-violet-700 hover:text-white'
            } w-10 p-2 border  rounded-lg mx-1`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
