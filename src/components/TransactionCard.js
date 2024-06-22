import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdDeleteSweep } from "react-icons/md";

export default function TransactionCard() {
  const [cardData, setCardData] = useState([]);

  const getAllTransactions = async () => {
    try {
      const response = await axios.get('https://tresurebackend.onrender.com/allTransactions');
      setCardData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const DeleteTransaction = async (TransactionId) => {
    try {
      if (window.confirm("Are you sure you want to delete this transaction?")) {
        await axios.delete(`https://tresurebackend.onrender.com/deleteTransaction/${TransactionId}`);
        getAllTransactions();  // Refresh the data after deletion
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllTransactions();
  }, []);

  return (
    <div className='flex flex-col items-center justify-center gap-8'>
      {cardData.map((data) => (
        <div key={data.TransactionId} className={`w-[90vw] border-2 shadow-lg flex rounded-xl bg-gradient-to-r from-green-300 via-blue-200 to-blue-300 h-[20vh]`}>
          <div className='w-2/3 flex flex-col justify-center items-start'>
            <div className='h-1/3 flex justify-start items-center text-sm ps-6 font-bold'>
              <h1>Transaction Type: <span className='font-extrabold text-md text-red-700'>{data.Type}</span></h1>
            </div>
            <div className='h-1/3 flex justify-start items-center text-sm ps-6 font-bold'>
              <h1>Remark: <span className='font-extrabold text-md text-red-700'>{data.Remark}</span></h1>
            </div>
            <div className='h-1/3 flex justify-start items-center text-sm ps-6 font-bold'>
              <h1 className='text-purple-600'>Date: {new Date(data.Date).toLocaleDateString()}</h1>
            </div>
          </div>
          <div className={`w-1/3 h-full flex flex-col items-center justify-center ${data.Type === "DEBIT" ? "bg-red-400" : "bg-green-400"}`}>
            <h1 className='text-2xl h-2/3 flex items-center justify-center font-extrabold text-white'>{data.Amount}</h1>
            <h1 onClick={() => DeleteTransaction(data.TransactionId)} className='h-1/3 flex items-center justify-center w-full text-2xl bg-purple-400 p-1 rounded text-white'>
              <MdDeleteSweep />
            </h1>
          </div>
        </div>
      ))}
    </div>
  );
}
