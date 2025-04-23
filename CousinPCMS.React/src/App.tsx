import {Button} from 'antd';
import {Outlet} from 'react-router';
import Header from './components/shared/Header';

const App = () => {
  return (
    <>
      
      <Header />
      <Outlet />
      <Button type="primary">Primary</Button>
      <h1>Footer</h1>
    </>
  );
};

export default App;
