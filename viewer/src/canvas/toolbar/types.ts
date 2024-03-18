import { type AnyVariableData } from "@/types/variables";

export type OnUpdateVariable = (nextData: Partial<AnyVariableData>) => void;
