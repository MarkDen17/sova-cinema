import { useState } from "react";

export function useFetching<T extends (...args: any[]) => Promise<void>>(
  callback: T
): [(...args: Parameters<T>) => Promise<void>, boolean, string] {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetching(...args: Parameters<T>): Promise<void> {
    try {
      setIsLoading(true);
      await callback(...args);
      setError("");
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          console.error("fetch aborted due to useEffect cleanup");
        } else {
          setError(error.message);
        }
      } else {
        setError("An unknown error occurred");
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return [fetching, isLoading, error];
}
