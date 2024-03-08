import { Dispatch, SetStateAction, createContext, useState } from "react";

type UpdareContextType = {
  update: boolean;
  setUpdate: Dispatch<SetStateAction<boolean>>;
};


const UpdateContext = createContext<UpdareContextType | null>(null!);

const UpdateProvider = ({children}:{children: React.ReactNode}) => {
  const [update, setUpdate] = useState<boolean>(false);

  return (
    <UpdateContext.Provider value={{update, setUpdate}}>
      {children}
    </UpdateContext.Provider>
  );
};

export {UpdateContext, UpdateProvider};
