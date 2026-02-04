"use server";

import { revalidateTag, revalidatePath } from "next/cache";

export const revalidateCache = async ({ key = "", path = "" }) => {
  try {
    key && revalidateTag(key, { expire: 0 });
    path && revalidatePath(path);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};
