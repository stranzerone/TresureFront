import React, { useEffect, useState } from 'react';
import axios from "axios";
import { GiTakeMyMoney } from "react-icons/gi";
import { IoAddCircle } from "react-icons/io5";
import { ImCross } from "react-icons/im";

export const TransactionForm = () => {
  const [amount, setAmount] = useState('');
  const [amountType, setAmountType] = useState('');
  const [remark, setRemark] = useState('');
  const [formView, setFormView] = useState(false);
  const [balance, setBalance] = useState(null);
  const backendUrl = 'https://tresurebackend.onrender.com';

  const getBalance = async () => {
    try {
      const response = await axios.get(backendUrl + "/start");
      setBalance(response.data.balance);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {

      const password = prompt('enter Password')

      if(password === '2165'){
        await axios.post(backendUrl + "/addTransaction", { amount, amountType, remark });
        setFormView(false);
        getBalance();
      }
    
    } catch (error) {
      console.error(error);
    }

  };

  const hideForm = () => {
    setFormView(false);
  };

  useEffect(() => {
    getBalance();
  }, []);

  if (formView) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-[80vw] h-[40vh] relative">
          <div onClick={hideForm} className="absolute right-3 top-2 p-3 text-gray-600 hover:text-red-500 cursor-pointer">
            <ImCross size={20} />
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between">
            <div className="mb-4 flex flex-col gap-4">
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter amount"
              />
              <select
                id="amountType"
                value={amountType}
                onChange={(e) => setAmountType(e.target.value)}
                className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Select type</option>
                <option value="DEBIT">Paid</option>
                <option value="CREDIT">Received</option>
              </select>
              <input
                id="remark"
                type="text"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter remark"
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="fixed bottom-20 left-4 z-10">
          <IoAddCircle size={40} className="text-red-400 bg-white p-1 rounded-full shadow-lg cursor-pointer" onClick={() => setFormView(true)} />
        </div>
        <div className="fixed bottom-20 right-4 z-10">
          <h1 className="text-3xl flex items-center gap-2 text-red-400 font-extrabold bg-white p-4 rounded-full shadow-lg cursor-pointer">
            <GiTakeMyMoney className="text-green-600" />
            {balance}$
          </h1>
        </div>
      </div>
    );
  }
};
