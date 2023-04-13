export const useFetchBackend = (url: string) =>
  useFetch(url, {
    baseURL: "http://localhost:5000",
  });
