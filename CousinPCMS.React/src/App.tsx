import { Button, ConfigProvider, Space } from "antd";
import theme from "./theme";

const App = () => {
  return (
    <>
      <ConfigProvider theme={theme}>
        <Space>
          <Button type="primary">Primary</Button>
          <Button>Default</Button>

          <h1>{import.meta.env.VITE_BASE_URL}</h1>
        </Space>
      </ConfigProvider>
    </>
  );
};

export default App;
