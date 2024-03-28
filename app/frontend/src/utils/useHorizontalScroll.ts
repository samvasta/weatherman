import { useEffect, useRef } from "react";

export function useHorizontalScroll(scrollRatio: number = 0.5) {
  const elRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = elRef.current;
    if (el) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY == 0) {
          return;
        }
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY * scrollRatio,
          behavior: "auto",
        });
      };
      el.addEventListener("wheel", onWheel);
      return () => el.removeEventListener("wheel", onWheel);
    }
  }, [scrollRatio]);
  return elRef;
}
