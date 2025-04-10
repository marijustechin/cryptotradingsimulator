import { useState } from 'react';
import { FaRegFileExcel, FaRegFilePdf } from 'react-icons/fa';

interface DataExportProps {
  type: string;
}

export const DataExport = ({ type }: DataExportProps) => {
  const [msg, setMsg] = useState<string>();
  const exportToPdf = () => {
    // export to pdf
    setMsg('funkcionalumas kuriamas...');
  };

  const exportToXls = () => {
    // export to xls
    setMsg('funkcionalumas kuriamas... ');
  };

  return (
    <div className='flex items-center gap-3'>
      <p>Export data to:</p>
      <button onClick={exportToXls} className='cursor-pointer' aria-label='Export to XLS'>
        <FaRegFileExcel
          className='text-emerald-500 hover:text-emerald-400'
          size={24}
        />
      </button>
      <button onClick={exportToPdf} className='cursor-pointer' aria-label='Export to PDF'>
        <FaRegFilePdf className='text-rose-600 hover:text-rose-500' size={24} />
      </button>
      <p>{msg}</p>
    </div>
  );
};
