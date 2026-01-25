export const api = {
  // simple wrapper that mimics axios.get returning { data }
  get: async (path: string) => {
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      return { data };
    } catch (err) {
      // rethrow to be handled by caller
      throw err;
    }
  },
};
