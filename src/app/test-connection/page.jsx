const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Purpose: verify that the Next.js app can reach the backend health endpoint.
export default async function TestConnectionPage() {
  try {
    const response = await fetch(`${apiUrl}/health`, { cache: "no-store" });
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error("Backend health check failed");
    }

    return <p>Backend Connected</p>;
  } catch {
    return <p>Connection Failed</p>;
  }
}
