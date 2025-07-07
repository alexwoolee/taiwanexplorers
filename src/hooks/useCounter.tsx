import { useState } from 'react';

// custom hook that mimics a counter 
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  function increment() {
    setCount(count + 1);
  }
  return (
    // return current value of current and increment function by reference s.t. it can be called later
    { count, increment } 
  )
}