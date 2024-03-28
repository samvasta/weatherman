import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function wrapIf<Props extends React.PropsWithChildren<any>>(
  Wrapper: React.ComponentType<Props>,
  wrapperProps: Omit<Props, "children">,
  Content: React.ReactNode,
  shouldWrap: boolean
): React.ReactNode {
  if (shouldWrap) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <Wrapper {...wrapperProps}>{Content}</Wrapper>;
  }
  return Content;
}
