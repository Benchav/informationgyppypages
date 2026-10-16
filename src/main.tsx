// Legacy cleanup fallback for browsers that cached the old Lovable/Vite SPA index.html
if (typeof window !== "undefined") {
  (async () => {
    try {
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    } finally {
      // Reload so TanStack Start's SSR HTML is loaded directly from server
      window.location.reload();
    }
  })();
}

export {};
