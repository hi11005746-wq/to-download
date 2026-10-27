export const config = {
  runtime: 'edge', // Runs on Vercel's global Edge network for low latency
};

export default async function handler(request) {
  // 1. Handle CORS Preflight (OPTIONS requests from browser health checks)
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // 2. Intercept and route WebSocket Connection requests
  if (request.headers.get("upgrade") === "websocket") {
    const targetWispServer = "https://mercurywork.shop";

    try {
      return await fetch(targetWispServer, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: "manual"
      });
    } catch (err) {
      return new Response(`Gateway Connection Error: ${err.message}`, { status: 502 });
    }
  }

  // 3. Fallback Status Check (Ensures the dashboard indicator turns green)
  return new Response("Wisp Gateway Online", {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*", // Allows frontend unblockers to verify status
      "Cache-Control": "no-store"
    }
  });
}
