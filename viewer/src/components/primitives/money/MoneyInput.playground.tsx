import React from "react";

import { type PlaygroundComponent } from "@/components/ui-playground/UiPlayground";

import { Txt } from "../text/Text";
import { MoneyInput, type MoneyInputProps } from "./MoneyInput";
import { MoneyValue } from "./MoneyValue";

export const MoneyInputMeta: PlaygroundComponent<MoneyInputProps> = {
  name: "Money Input",

  defaultProps: {
    amount: 12345,
    onChange: () => 0,
  },
  Preview: RenderMoneyInputPreview,
  Component: RenderMoneyInput,
  variants: [
    {
      name: "Default",
      props: {},
    },
  ],
};

function RenderMoneyInputPreview(props: MoneyInputProps) {
  const [amount, setAmount] = React.useState(props.amount);

  return <MoneyInput {...props} amount={amount} onChange={setAmount} />;
}

function RenderMoneyInput(props: MoneyInputProps) {
  const [amount, setAmount] = React.useState(props.amount);

  return (
    <div className="flex gap-comfortable">
      <MoneyInput {...props} amount={amount} onChange={setAmount} />
      <Txt>Actual amount:</Txt> <MoneyValue amount={amount} />
    </div>
  );
}
