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

  const getBalance = async () => {
    try {
      const response = await axios.get("https://tresurebackend.onrender.com/start");
      setBalance(response.data.balance);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post("https://tresurebackend.onrender.com/addTransaction", { amount, amountType, remark });
      setFormView(false);
      getBalance();
    } catch (error) {
      console.error(error);
    }

    alert(`Amount: ${amount}, Type: ${amountType}, Remark: ${remark}`);
  };

  const hideForm = () => {
    setFormView(false);
  };

  useEffect(() => {
    getBalance();
  }, []);

  if (formView) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
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
        <div onClick={() => setFormView(true)} className="fixed bottom-20 left-4 bg-white p-4 rounded-full shadow-lg cursor-pointer">
          <IoAddCircle size={40} className="text-red-400" />
        </div>
        <div className="fixed bottom-20 right-4 bg-white p-4 rounded-full shadow-lg cursor-pointer">
          <h1 className="text-3xl flex items-center gap-2 text-red-400 font-extrabold">
            <GiTakeMyMoney className="text-green-600" />
            {balance}$
          </h1>
        </div>
      </div>
    );
  }
};
