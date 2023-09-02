export const useFetch = (url: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(url, { method: 'GET', next: { revalidate: 10 } });
      const data = await response.text();
      resolve(data);
    } catch (error: any) {
      reject(error);
    }
  });
};
