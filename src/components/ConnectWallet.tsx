import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Loading } from "./ui/loading";

export const ConnectWallet = () => {
  const { sdkHasLoaded } = useDynamicContext();
  return <>{sdkHasLoaded ? <DynamicWidget /> : <Loading />}</>;
};
