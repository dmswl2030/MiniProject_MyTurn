import { useEffect, useState } from "react";
import { getUserInfo } from "../lib/api/userApi";

const useAnnualCount = () => {
  const [myAnnual, setMyAnnual] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const { data } = await getUserInfo();
      setMyAnnual(data.annualCount);
    })();
  }, []);
  return myAnnual;
};

export default useAnnualCount;
