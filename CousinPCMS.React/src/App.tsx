import {Outlet} from 'react-router';
import Header from './components/shared/Header';

const App = () => {
  return (
    <>
      <Header />
      <div className="overflow-y-auto overflow-x-hidden w-full absolute top-10 h-[calc(100vh-56px)]">
        <Outlet />
      </div>
    </>
  );
};

export default App;
