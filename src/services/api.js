const API_BASE_URL = "http://127.0.0.1:8000";

export async function analyzeGuava(formData) {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    body: formData, // multipart/form-data
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to analyze guava plant");
  }

  return await response.json();
}
