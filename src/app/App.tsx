import { RouterProvider } from "./providers/RouterProvider";
import "../shared/styles/main.scss";
import Initializer from "./initializer";
import { TonProvider } from "./providers/RouterProvider/TonProvider";

import './echo'
function App() {
  return (
    <TonProvider>
      <Initializer />
      <RouterProvider />
    </TonProvider>
  );
}

export default App;
