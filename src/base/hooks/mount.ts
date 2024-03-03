import { useEffect, useRef } from "react"

export const useMount = (action: () => (void | (() => void))) => {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    return action();
  }, []);

  return mounted.current;
}
