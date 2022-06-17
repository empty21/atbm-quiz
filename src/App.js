import { useRoutes } from 'react-router-dom';
import { Home } from './components/Home';
import { Practice } from './components/Practice';

function App() {
  const element = useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/practice",
      element: <Practice />,
    },
  ]);
  return element;
}

export default App;
