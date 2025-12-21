// Production-Grade Service Worker
// strictly adheres to rules: no API interception, no external interception

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // ❌ NEVER intercept these
  if (
    url.startsWith("chrome-extension://") ||
    url.includes("googlesyndication.com") ||
    url.includes("doubleclick.net") ||
    url.includes("googleads.g.doubleclick.net") ||
    url.includes("supabase.co") ||
    url.includes(":5000") ||
    url.includes(":5001") ||
    url.includes(":5003") ||
    url.includes("/api/")
  ) {
    return;
  }

  // Only allow same-origin static assets
  if (!url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      // IMPORTANT: swallow all fetch errors
      return new Response("", { status: 204 });
    })
  );
});
