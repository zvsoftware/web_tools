import { useState } from 'react';

function Home() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Web Utilities</h1>
      <p>Greatness is destined.</p>
      <a href="/image-converter">Image Converter</a>
    </>
  );
}

export default Home
