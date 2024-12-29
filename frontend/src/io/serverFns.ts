import { nanoid } from "nanoid";
import PocketBase from "pocketbase";

import { type Model, type ModelFileInfo } from "@/types/model";
import { type SimulationResult } from "@/types/results";

const pb = new PocketBase(import.meta.env.VITE_API_URL);

export async function ListRecentModels(): Promise<ModelFileInfo[]> {
  const result = await pb.collection<ModelFileInfo>("models").getList(1, 10, {
    sort: "-updated",
    fields: "id,name,created,updated,owner",
  });
  return result.items;
}
export async function ListAllModels(): Promise<ModelFileInfo[]> {
  const results = await pb.collection<ModelFileInfo>("models").getFullList({
    sort: "+name",
    fields: "id,name,created,updated,owner",
  });
  return results;
}

export async function LoadModel(modelId: string): Promise<Model> {
  return await pb.collection<Model>("models").getOne(modelId);
}

export async function SaveModelAs(name: string, model: Model): Promise<Model> {
  if (!pb.authStore.model) {
    return model;
  }

  return await pb
    .collection<Model>("models")
    .create({ ...model, id: nanoid(15), name, owner: pb.authStore.model.id });
}

export async function SaveModel(modelId: string, model: Model): Promise<Model> {
  if (!pb.authStore.model) {
    return model;
  }

  return await pb.collection<Model>("models").update(modelId, model);
}

export async function Simulate(modelId: string): Promise<SimulationResult> {
  return await pb.send("/simulate", {
    method: "POST",
    body: {
      modelId,
    },
  });
}

export async function Login(email: string, password: string) {
  return await pb.collection("users").authWithPassword(email, password);
}

export function getAuthModel() {
  if (!pb.authStore.isValid) {
    return null;
  }
  return pb.authStore.model;
}

export function Logout() {
  pb.authStore.clear();
}
