const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const INDEXNOW_HOST = "www.auraluxuryproperties.com";

export async function submitToIndexNow(
  urls: string[]
): Promise<{ success: boolean; message?: string; error?: string }> {
  if (!INDEXNOW_KEY) {
    return { success: false, error: "IndexNow key missing on server" };
  }

  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return { success: false, error: "Invalid URLs payload" };
  }

  // Convert relative paths into absolute URLs
  const absoluteUrls = urls.map(
    (url) => `https://${INDEXNOW_HOST}${url.startsWith("/") ? "" : "/"}${url}`
  );

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: INDEXNOW_HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
        urlList: absoluteUrls
      })
    });

    if (response.status === 200 || response.status === 202) {
      return {
        success: true,
        message:
          response.status === 202
            ? "URLs accepted. Awaiting initial API key verification by search engines."
            : "URLs pushed and indexed successfully."
      };
    } else {
      return {
        success: false,
        error: `IndexNow API responded with unhandled code ${response.status}`
      };
    }
  } catch (error) {
    console.error("IndexNow submission error:", error);
    return { success: false, error: "Internal server error" };
  }
}
