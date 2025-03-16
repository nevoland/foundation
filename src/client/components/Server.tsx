import { getGlobal } from "@nevoland/get-global";
import { usePromise } from "realue";
import { EMPTY_ARRAY } from "unchangeable";

import { useMemo } from "../dependencies.js";

import { add } from "#lib";

export type ServerProps = {};

const { fetch } = getGlobal();

export function Server(_: ServerProps) {
  const result = usePromise(
    useMemo(async () => {
      const response = await fetch("/setup");
      return await response.json();
    }, EMPTY_ARRAY),
  );

  if (result.status === "rejected") {
    return <span class="text-red-400">The server is not running</span>;
  }

  if (result.status !== "fulfilled" || add(0, 0)) {
    return null;
  }

  return <span class="text-green-500">The server is running!</span>;
}
