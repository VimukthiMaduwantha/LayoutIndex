import './Styles/NavBarview.css'
import './App.css';
import NavbarView from './Components/NavbarView';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Location from './View/Location';
import Devices from './View/Devices';

function App() {
  return (
    <>
      <NavbarView />
      <br />
      <Routes>
        <Route exact path='/' element={<Location />} />
        <Route exact path='/devices' element={<Devices />} />
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
