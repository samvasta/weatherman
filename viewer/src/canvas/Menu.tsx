import { Button } from "@/components/primitives/button/Button";

import useLayoutNodes from "./useLayoutNodes";

export function Menu() {
  const autoLayoutNodes = useLayoutNodes();

  return (
    <div className="absolute left-0 top-0 z-30 flex w-screen justify-start gap-4 bg-primary-2 px-2 py-1 shadow-sm">
      <Button variant="link" colorScheme="primary" className="w-fit">
        Import
      </Button>
      <Button variant="link" colorScheme="primary" className="w-fit">
        Export
      </Button>
      <Button
        variant="link"
        colorScheme="primary"
        className="w-fit"
        onClick={() => autoLayoutNodes()}
      >
        Auto-layout
      </Button>
      <Button variant="link" colorScheme="primary" className="w-fit">
        Run
      </Button>
    </div>
  );
}
