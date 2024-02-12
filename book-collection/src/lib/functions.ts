import { fetchData } from "./utils";

const makeQuery = async <T>(query: string, variables: Record<string, string>, token: string): Promise<T> => {
  const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
  };

  const body = {
      query,
      variables,
  };
  const options: RequestInit = {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
  };
  return await fetchData(
      import.meta.env.VITE_GRAPHQL_API as string,
      options,
  );
};

export { makeQuery };
