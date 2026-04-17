// Exported for use outside React tree if needed
export function showToast(message, type = "info") {
  // This is handled by React state in App.jsx
  // This file exists as a placeholder for non-React contexts
  console.log(`[Toast][${type}] ${message}`);
}
