import { useState } from "react";
import { toast as displayToast } from "sonner";
import { useAuth } from "./useAuth";

const baseUrl = "http://localhost:3001";
// const baseUrl = "http://localhost:8000";

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
  formData?: boolean;
};

type CallFunction<T> = (config?: CallConfig<T>) => Promise<T | null>;

export const useApi = <T>({
  endpointPath,
  method = "GET",
  throwError = false,
}: UseApiConfig) => {
  const { auth } = useAuth();
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
      formData,
    } = config || {};
    try {
      setLoading(true);
      const headers: HeadersInit = {};
      if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
      if (auth?.token) headers["Authorization"] = `Bearer ${auth.token}`;
      if (method !== "GET") headers["Content-Type"] = "application/json";
      if (formData) delete headers["Content-Type"]; //the browser will set the correct content type for us

      const options = {
        method,
        headers,
      } as RequestInit;

      if (method !== "GET" && body && !formData)
        options.body = JSON.stringify(body);
      if (method !== "GET" && body && formData) options.body = body;

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
      console.log({ error });
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
