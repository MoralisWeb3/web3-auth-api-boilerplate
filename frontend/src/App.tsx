import { useEffect } from 'react';
import { useMoralis } from 'react-moralis';
import { Route, Routes } from 'react-router-dom';
import Private from './pages/private/private';
import Public from './pages/public/public';
import { useAuthStore } from './stores/authStore';

function App() {
  const { token } = useAuthStore();
  const { web3, enableWeb3 } = useMoralis();

  useEffect(() => {
    if (!web3) {
      enableWeb3();
    }
  }, [web3]);

  return (
    <Routes>
      {
        token ?
          <Route path='*' element={<Private />} /> :
          <Route path='*' element={<Public />} />
      }
    </Routes>
  );
}

export default App;
