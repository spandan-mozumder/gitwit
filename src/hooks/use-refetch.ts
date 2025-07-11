"use client";

import { useQueryClient } from "@tanstack/react-query";

const useRefetch = (): (() => Promise<void>) => {
  const queryClient = useQueryClient();

  const refetchAllActiveQueries = async () => {
    if (process.env.NODE_ENV === "development") {
      console.log("🔄 Refetching all active queries...");
    }

    await queryClient.refetchQueries({ type: "active" });
  };

  return refetchAllActiveQueries;
};

export default useRefetch;
