import { createContext } from "react";

export const UserContext = createContext({ data: null, updateData: (user: any) => { } });