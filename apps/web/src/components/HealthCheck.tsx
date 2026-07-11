import { useEffect } from "react";
import { useHealthStore } from "../stores/health";

export function HealthCheck() {
  const { status, data, error, fetch } = useHealthStore();

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <section className="mt-8 p-4 bg-paper-card border border-paper-border rounded-sm text-center">
      {status === "loading" && <p className="text-text-faint">Checking connection...</p>}
      {status === "error" && <p className="text-hard">Connection failed: {error}</p>}
      {status === "success" && data && (
        <>
          <p className="text-easy font-semibold">API: {data.status}</p>
          <p className="text-text-secondary text-sm">DB: {data.db}</p>
          <p className="text-text-faint text-xs">Uptime: {Math.round(data.uptime)}s</p>
        </>
      )}
    </section>
  );
}
