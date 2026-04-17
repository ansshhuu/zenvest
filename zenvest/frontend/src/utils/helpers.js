export function formatDate(isoStr) {
  if (!isoStr) return "—";
  return new Date(isoStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function getNextSunday() {
  const d = new Date();
  d.setDate(d.getDate() + (7 - d.getDay()));
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatPhone(phone) {
  if (!phone) return "";
  return phone.replace(/(\d{5})(\d{5})/, "$1 $2");
}

export function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

export function getPasswordStrength(pwd) {
  if (!pwd) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const colors = ["var(--error)", "var(--warning)", "#84CC16", "var(--success)"];
  const labels = ["Weak", "Fair", "Strong", "Very Strong"];
  return { score, label: labels[score - 1] || "", color: colors[score - 1] || "" };
}
