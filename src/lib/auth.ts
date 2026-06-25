// Dummy auth - always returns a valid session
export const auth = async () => {
  return { 
    user: { 
      id: "1", 
      name: "Admin", 
      email: "admin@nasimsafi.com", 
      role: "admin" 
    } 
  }
}

export const signIn = async () => ({ ok: true })
export const signOut = async () => {}
export const handlers = {
  GET: async () => new Response(JSON.stringify({})),
  POST: async () => new Response(JSON.stringify({}))
}