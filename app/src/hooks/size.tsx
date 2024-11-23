import { useEffect, useState } from "react";

export function useSize(ref = window) {
  const [size, setSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    if (!ref) return;
    function handleResize() {
      setSize({
        width: (ref as unknown as Element).clientWidth,
        height: (ref as unknown as Element).clientHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [ref]);
  return size;
}
