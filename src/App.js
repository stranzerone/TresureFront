import { useEffect, useState } from 'react';
import './App.css';
import Home from './components/Home';
import TransactionCard from './components/TransactionCard';
import axios from 'axios';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const backendUrl = 'https://tresurebackend.onrender.com'

  useEffect(() => {
    const pageLoad = async () => {
      try {
        const response = await axios.get(backendUrl+"/start");
        console.log(response.status);

        if (response.status === 201) {
          setIsLoading(false);
          setIsError(false);
        } else {
          setIsLoading(false);
          setIsError(true);
        }
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        setIsError(true);
      }
    };

    pageLoad();
  }, []);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen bg-white'>
        <div className='h-8 w-8 bg-black rounded-full animate-bounce mr-2'></div>
        <div className='h-8 w-8 bg-black rounded-full animate-bounce mr-2'></div>
        <div className='h-8 w-8 bg-black rounded-full animate-bounce'></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex justify-center items-center h-screen bg-white'>
        <p className='text-red-500'>Error loading data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className='App min-h-screen bg-blue-100 font-serif'>
      <Home />
      <TransactionCard />
    </div>
  );
}

export default App;
