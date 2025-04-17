import { useState } from "react";

export function useFetching(callback) {
  const [isLoading, setIsLoading] = useState(false);
  const [Error, setError] = useState('');

  async function fetching(...args) {

    try {
      setIsLoading(true);
      await callback(...args);

    } catch (error) {
      setError(error.message);

    } finally {
      setIsLoading(false);
    }

  }

  return [fetching, isLoading, Error]
}