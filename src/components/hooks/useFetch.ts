/*import { useState, useEffect } from "react";

export default function useFetch<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(url, options);

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const json: T = await res.json();
        if (isMounted) setData(json);
      } catch (err: any) {
        if (isMounted) setError(err.message || "Unknown error occurred");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup
    };
  }, [url]);

  return { data, loading, error };
}

*/

import { useState, useEffect, useCallback } from "react";
import api from "../../api/axios";

export default function useFetch<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get<T>(endpoint); // ✅ Uses baseURL
      setData(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
