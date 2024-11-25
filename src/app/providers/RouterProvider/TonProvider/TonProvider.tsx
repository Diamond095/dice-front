import { TonConnectUIProvider } from "@tonconnect/ui-react";
import manifest from '../../../assets/manifest.json'
type TonProviderProps = {
  children: React.ReactNode;
};

const TonProvider: React.FC<TonProviderProps> = ({ children }) => {
  return <TonConnectUIProvider manifestUrl="https://diceton.xyz/assets/manifest.json">{children}</TonConnectUIProvider>;
};

export default TonProvider;
