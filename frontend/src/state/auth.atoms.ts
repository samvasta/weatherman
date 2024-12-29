import { atom } from "jotai";
import { selectAtom } from "jotai/utils";
import { type AuthModel } from "pocketbase";

import { getAuthModel } from "@/io/serverFns";

export const authAtom = atom<AuthModel>(getAuthModel());

export const isLoggedInAtom = selectAtom(authAtom, (auth) => auth !== null);
