export const Card = ({ title, value }: { title: string; value?: number | string }) => (
    <div className='bg-gray-800 p-6 shadow-lg backdrop-blur-md flex flex-col justify-center items-center rounded-2xl w-full'>
      <h3>
        {title}
      </h3>
      <span className='text-emerald-500 font-semibold'>
      {value ?? 0}
      </span>
    </div>
  );