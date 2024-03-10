import React from "react";

import type { PlaygroundComponent } from "@/components/ui-playground/UiPlayground";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";

const transactions = [
  {
    id: "1",
    totalAmount: "$1250.00",
    payee: "Rent",
    date: new Date(2023, 7, 1),
  },
  {
    id: "2",
    totalAmount: "$350.00",
    payee: "Food",
    date: new Date(2023, 7, 13),
  },
  {
    id: "3",
    totalAmount: "$250.00",
    payee: "Utilities",
    date: new Date(2023, 7, 9),
  },
  {
    id: "4",
    totalAmount: "$450.00",
    payee: "Furniture",
    date: new Date(2023, 7, 24),
  },
  {
    id: "5",
    totalAmount: "$550.00",
    payee: "Car",
    date: new Date(2023, 7, 18),
  },
  {
    id: "6",
    totalAmount: "$200.00",
    payee: "Gifts",
    date: new Date(2023, 7, 22),
  },
  {
    id: "7",
    totalAmount: "$300.00",
    payee: "Shopping",
    date: new Date(2023, 7, 3),
  },
];

export const TableMeta: PlaygroundComponent<{}> = {
  name: "Table",
  defaultProps: {},
  Preview: () => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payee</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.slice(0, 2).map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="font-medium">{tx.payee}</TableCell>
              <TableCell className="text-right">{tx.totalAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
  variants: [
    {
      name: "Default",
      props: {},
    },
  ],
  Component: () => {
    return (
      <Table>
        <TableCaption>A list of your recent transactions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Payee</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="font-medium">{tx.payee}</TableCell>
              <TableCell>{tx.date.toDateString()}</TableCell>
              <TableCell className="text-right">{tx.totalAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};
