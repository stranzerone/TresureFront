import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdDeleteSweep, MdFilterList } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { CiCreditCard1 } from "react-icons/ci";
import { FaFilterCircleDollar } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { CiCalendarDate } from "react-icons/ci";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TransactionCard() {
  const [cardData, setCardData] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterRemark, setFilterRemark] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterDeleted, setFilterDeleted] = useState(false); // State for filter by deleted transactions
  const [filteredData, setFilteredData] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(false); // State to track password validation
  const backendUrl = 'https://tresurebackend.onrender.com';

  // Function to validate password
  const validatePassword = () => {
    if (password === '2165') {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
      alert('Incorrect password. Please try again.');
    }
  };

  // Fetch all transactions on component mount
  const getAllTransactions = async () => {
    try {
   
      const response = await axios.get(`${backendUrl}/allTransactions`);
      setCardData(response.data.reverse());
      setFilteredData(response.data.filter(data => data.Active === true)); // Filter initially to show only active transactions
    } catch (error) {
      console.error(error);
    }
  };

  // Function to delete a transaction
// Function to delete a transaction
const deleteTransaction = async (TransactionId) => {
  try {
  
      const password = prompt("Enter Password")

      if(password === '2165')
      {
        await axios.post(`${backendUrl}/deleteTransaction/${TransactionId}`);
        getAllTransactions(); // Refresh the data after deletion
      }else{
        alert("Transaction cancelled")
      }
     
    
  } catch (error) {
    console.error(error);
  }
};

  // Function to apply filters
  const filterTransactions = () => {
    let filtered = cardData;

    if (filterType !== '') {
      filtered = filtered.filter(data => data.Type === filterType);
    }
    
    if (filterRemark !== '') {
      filtered = filtered.filter(data => data.Name.toLowerCase().includes(filterRemark.toLowerCase()));
    }

    if (filterDate !== '') {
      filtered = filtered.filter(data => data.CardDate === filterDate);
    }

    if (filterDeleted) {
      filtered = filtered.filter(data => data.Active === false); // Filter for deleted transactions
    }

    setFilteredData(filtered);
  };

  // Effect to fetch transactions on component mount
  useEffect(() => {
    getAllTransactions();
  }, []);

  // Effect to filter transactions whenever filter state changes
  useEffect(() => {
    filterTransactions();
  }, [filterType, filterRemark, filterDate, filterDeleted]); // Include filterDeleted in dependencies

  // Count transaction types for Pie chart
  const transactionTypeCount = filteredData.reduce((acc, curr) => {
    if (curr.Type === 'DEBIT') acc.debit += 1;
    if (curr.Type === 'CREDIT') acc.credit += 1;
    return acc;
  }, { debit: 0, credit: 0 });

  // Data for Pie chart
  const data = {
    labels: ['Paid', 'Received'],
    datasets: [
      {
        label: '# of Transactions',
        data: [transactionTypeCount.debit, transactionTypeCount.credit],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Unique dates for filter dropdown
  const uniqueDates = [...new Set(cardData.map(data => data.CardDate))];

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-4">
      {/* Pie chart */}
      <div className="w-full md:w-[90vw] mb-8">
        <Pie data={data} />
      </div>
      
      {/* Filter button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="bg-white hover:bg-blue-700 text-black font-bold py-2 px-4 rounded-full shadow-lg focus:outline-none focus:shadow-outline absolute top-5 left-5 transition-transform transform hover:scale-105"
      >
        <FaFilterCircleDollar size={20} />
      </button>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8 w-full">
          {/* Search by Remark */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <FaSearch size={20} />
            <input
              type="text"
              placeholder="Search by Remark"
              value={filterRemark}
              onChange={(e) => setFilterRemark(e.target.value)}
              className="shadow-lg appearance-none rounded-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full md:w-auto"
            />
          </div>

          {/* Filter by Transaction Type */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <MdFilterList size={20} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="shadow-lg appearance-none rounded-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full md:w-auto"
            >
              <option value="">All Types</option>
              <option value="DEBIT">Paid</option>
              <option value="CREDIT">Received</option>
            </select>
          </div>

          {/* Filter by Date */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="shadow-lg appearance-none rounded-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full md:w-auto"
            >
              <option value="">All Dates</option>
              {uniqueDates.map(date => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
          </div>

          {/* Show Deleted Transactions */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <label htmlFor="filterDeleted" className="text-gray-700">Show Deleted</label>
            <input
              id="filterDeleted"
              type="checkbox"
              checked={filterDeleted}
              onChange={() => setFilterDeleted(!filterDeleted)}
              className="form-checkbox h-5 w-5 text-purple-600 ml-2"
            />
          </div>

          {/* Password Input for Transactions */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-lg appearance-none rounded-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full md:w-auto"
            />
            <button
              onClick={validatePassword}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Transaction Cards */}
      {filteredData.map((data) => (
        <div key={data.TransactionId} className={`w-full md:w-[90vw] border-2 shadow-lg flex rounded-3xl bg-white h-[25vh] md:flex-row mb-4 transition-transform transform hover:scale-105`}>
          {/* Transaction Details */}
          <div className="w-full md:w-2/3 flex flex-col justify-around items-start p-4">
            <div className="h-auto md:h-1/3 flex items-center text-sm font-bold">
              <CiCreditCard1 size={20} /> <span className={`font-extrabold text-md ml-2 ${data.Type === 'DEBIT' ? 'text-red-700' : 'text-green-700'}`}>{data.Type}</span>
            </div>
            <div className="h-auto md:h-1/3 flex items-center text-sm font-bold">
              <CgProfile size={20} /> <span className="font-extrabold text-md text-blue-700 ml-2">{data.Name}</span>
            </div>
            <div className="h-auto md:h-1/3 flex items-center text-sm font-bold text-purple-600">
              <CiCalendarDate size={20} /> <span className="ml-2">{data.CardDate}</span>
            </div>
          </div>

          {/* Transaction Action (Delete) */}
          <div className={`w-full md:w-1/3 h-full flex flex-col items-center justify-center ${data.Type === "DEBIT" ? "bg-gradient-to-r from-red-500 to-red-700" : "bg-gradient-to-r from-green-500 to-green-700"} text-white rounded-3xl`}>
            <h1 className="text-4xl h-2/3 flex items-center justify-center font-extrabold">{data.Amount}</h1>
      
              <button
                onClick={() => deleteTransaction(data.TransactionId)}
                className="h-1/3 flex items-center justify-center w-full text-2xl bg-purple-500 hover:bg-purple-700 p-2 rounded-full cursor-pointer transition-transform transform hover:scale-105"
              >
                <MdDeleteSweep />
              </button>
            
          </div>
        </div>
      ))}
    </div>
  );
}
