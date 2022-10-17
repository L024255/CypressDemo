import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

export const useJwtInfo = () => {
  const [jwtInfo, setJwtInfo] = useState<AzureDetails | null>(null);
  const [username, setUsername] = useState<string>("");
  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    let isMounted = true;
    if (accessToken) {
      try {
        const info = jwt_decode<AzureDetails>(accessToken);
        if (isMounted) {
          setUsername(info?.name.replace(/ - Network/g, "") || "");
          setJwtInfo(info);
        }
      } catch (error) {
        console.warn(error);
      }
    }
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { jwtInfo, username };
};
