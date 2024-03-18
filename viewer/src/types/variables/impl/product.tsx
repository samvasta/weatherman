import { X } from "lucide-react";
import { z } from "zod";

import { Heading } from "@/components/primitives/text/Heading";

import { CommonVariableInfo } from "@/canvas/shared/SharedNodeInfo";
import { WithCommonProperties } from "@/canvas/shared/WithCommonProperties";
import {
  WithLeftNodeIcon,
  WithLeftNodeIconPreview,
} from "@/canvas/shared/WithLeftNodeIcon";

import {
  type CommonVariableInfoData,
  CommonVariableInfoSchema,
  DEFAULT_COMMON_DATA,
  type VariableInfo,
  type VariablePropertiesProps,
  VariableType,
} from "../common";

const ProductSchema = CommonVariableInfoSchema.extend({
  type: z.literal(VariableType.Product).default(VariableType.Product),

  inputs: z.array(z.string().min(1)),
});

export type ProductData = z.TypeOf<typeof ProductSchema>;

export function ProductNode({ data }: { data: ProductData }) {
  return (
    <WithLeftNodeIcon IconComponent={X}>
      <CommonVariableInfo info={data} />
    </WithLeftNodeIcon>
  );
}

export function ProductNodePreview({ data }: { data: ProductData }) {
  return (
    <WithLeftNodeIconPreview IconComponent={X}>
      <Heading size="md">Product</Heading>
    </WithLeftNodeIconPreview>
  );
}

export function ProductProperties({
  data,
  onChange,
}: VariablePropertiesProps<ProductData>) {
  return (
    <WithCommonProperties data={data} onChange={onChange}>
      <Heading size="sm">Product</Heading>
    </WithCommonProperties>
  );
}

export const ProductInfo: VariableInfo<ProductData> = {
  checkType: (v: CommonVariableInfoData): v is ProductData => {
    return v.type === VariableType.Product;
  },
  schema: ProductSchema as z.ZodSchema<ProductData>,
  defaultConfig: {
    ...DEFAULT_COMMON_DATA,
    name: "product",
    type: VariableType.Product,
    inputs: [],
  },
  hasOutput: true,
  getInputs: (product) =>
    product.inputs.reduce(
      (map, input) => {
        map["input"].push(input);
        return map;
      },
      { input: [] as string[] }
    ),
  getPorts: (product) => [
    {
      name: "input",
      connectionStrategy: "append",
    },
  ],
  VariableContent: ProductNode,
  VariablePreviewContent: ProductNodePreview,
  VariableProperties: ProductProperties,
};
