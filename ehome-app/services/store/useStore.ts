import { createContext, useContext } from "react";
import { AppStateObserver } from "./AppStateObeserver";

const StoreContext = createContext<AppStateObserver>(null!);

export const StoreProvider = StoreContext.Provider;

const useStore = () => useContext(StoreContext);
export default useStore;