import { type AnyVariableData } from "@/types/variables/allVariables";

export type OnUpdateVariable = (nextData: Partial<AnyVariableData>) => void;
