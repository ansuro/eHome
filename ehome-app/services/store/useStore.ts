import { createContext, useContext } from "react";
import { AppRootStore } from "./AppRootStore";

const StoreContext = createContext<AppRootStore>(null!);

export const StoreProvider = StoreContext.Provider;

const useStore = () => useContext(StoreContext);
export default useStore;