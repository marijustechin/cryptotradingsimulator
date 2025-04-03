export const Card = ({ title, value }: { title: string; value: string }) => (
    <div className='bg-gray-700 p-6 shadow-lg backdrop-blur-md flex flex-col justify-center items-center rounded-2xl w-full'>
      <h3 className='text-lg font-semibold text-gray-200'>
        {title}
      </h3>
      <p className='text-2xl font-bold text-gray-100'>
        {value}
      </p>
    </div>
  );