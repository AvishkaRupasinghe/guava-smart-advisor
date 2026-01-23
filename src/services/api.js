export async function analyzeGuava(formData) {
  const response = await fetch("/analyze", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to analyse guava plant");
  }

  return await response.json();
}
