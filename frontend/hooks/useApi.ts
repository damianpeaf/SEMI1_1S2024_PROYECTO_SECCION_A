import { useState } from "react";
import { toast as displayToast } from "sonner";

const baseUrl = "http://localhost:3001";

interface UseApiConfig {
  endpointPath: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  throwError?: boolean;
}

type ToastMessage<T> =
  | string
  | (({ data, error }: { data?: T; error?: any }) => string);

type CallConfig<T> = {
  body?: any;
  params?: any;
  successMessage?: ToastMessage<T>;
  errorMessage?: ToastMessage<T>;
  authToken?: string;
  resourceId?: string;
};

type CallFunction<T> = (config?: CallConfig<T>) => Promise<T | null>;

export const useApi = <T>({
  endpointPath,
  method = "GET",
  throwError = false,
}: UseApiConfig) => {
  const auth = { token: "123" };
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  const call: CallFunction<T> = async (config) => {
    const {
      body,
      successMessage,
      errorMessage,
      params,
      authToken,
      resourceId,
    } = config || {};
    try {
      setLoading(true);
      const headers: HeadersInit = {};
      if (authToken) headers["auth-token"] = authToken;
      if (auth?.token) headers["auth-token"] = auth.token;
      if (method !== "GET") headers["Content-Type"] = "application/json";

      const options = {
        method,
        headers,
      } as RequestInit;

      if (method !== "GET" && body) options.body = JSON.stringify(body);

      let url = `${baseUrl}/${endpointPath}`;
      if (resourceId) url = `${url}/${resourceId}`;
      if (method === "GET" && params)
        url = `${url}?${new URLSearchParams(params).toString()}`;

      const response = await fetch(url, options);

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      const data = await response.json();
      setData(data);
      if (!!successMessage) {
        if (typeof successMessage === "string")
          displayToast.success(successMessage);
        else displayToast.success(successMessage({ data }));
      }
      return data;
    } catch (error) {
      if (!!errorMessage) {
        if (typeof errorMessage === "string") displayToast.error(errorMessage);
        else displayToast.error(errorMessage({ error }));
      }
      if (throwError) throw error;
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    call,
    loading,
  };
};
