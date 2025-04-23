import {Button} from 'antd';
import {Outlet} from 'react-router';

const App = () => {
  return (
    <>
      <h1>Header</h1>
      <Outlet />
      <Button type="primary">Primary</Button>
      <h1>Footer</h1>
    </>
  );
};

export default App;
