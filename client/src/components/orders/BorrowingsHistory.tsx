import { Pagination } from "../Pagination";
import { useState } from "react";

export default function BorrowingsHistory() {
  // Dummy data
  const data = [
    {
      id: 1,
      date: "2023-01-09 19:22",
      amount: 10000,
    },
    {
      id: 2,
      date: "2024-01-09 13:00",
      amount: 10000,
    },
    {
      id: 3,
      date: "2024-03-09 13:00",
      amount: 10000,
    },
    {
      id: 4,
      date: "2024-05-09 13:00",
      amount: 10000,
    },
    {
      id: 5,
      date: "2024-01-09 13:00",
      amount: 10000,
    },
    {
      id: 6,
      date: "2024-01-09 13:00",
      amount: 10000,
    },
  ];
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the total number of pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    // Table
    <div>
      <table className="border-separate border-spacing-y-2 w-full table">
        <thead>
          <tr className="text-white bg-gray-800">
            <th>ID</th>
            <th>Borrowing amount</th>
            <th>Date borrowed</th>
          </tr>
        </thead>
        {currentData.map((item, index) => (
          <tbody>
            <tr
              key={item.id}
              className={index % 2 ? "bg-gray-800" : "bg-gray-700"}
            >
              <td>{item.id}</td>
              <td>{item.amount}</td>

              <td>{item.date}</td>
            </tr>
          </tbody>
        ))}
      </table>
      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={handlePageChange}
      />
      {/* Total count */}
      <p className="mt-6 p-2 rounded-lg bg-gray-900 text-gray-300 w-full">
        Total Borrowings: {data.reduce((acc, item) => acc + item.amount, 0)}
      </p>
    </div>
  );
}
