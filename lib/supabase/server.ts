
// Mock implementation for demo environment - in real Next.js this uses @supabase/ssr
export const createServerClient = async () => {
  console.warn("Supabase Server Client initialized (Mock)");
  return {
    auth: {
      getUser: async () => ({ data: { user: { id: 'mock-id' } }, error: null })
    }
  };
};
