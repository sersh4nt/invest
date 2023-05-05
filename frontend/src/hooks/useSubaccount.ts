import { useState } from "react";

const useSubaccount = () => {
  const [subaccount, rawSetSubaccount] = useState<string | null>(
    localStorage.getItem("subaccount")
  );

  const setSubaccount = (subaccount: string) => {
    rawSetSubaccount(subaccount);
    localStorage.setItem("subaccount", subaccount);
  };

  return { subaccount, setSubaccount };
};

export default useSubaccount;
