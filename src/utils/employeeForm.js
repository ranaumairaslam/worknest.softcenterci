export function validateEmployeeForm(form) {
  const trimmedName = (form?.name || "").trim();
  const trimmedEmail = (form?.email || "").trim();
  const trimmedRole = (form?.role || "").trim();

  if (!trimmedName || !trimmedEmail || !trimmedRole) {
    return "Please fill in the employee name, email, and role.";
  }

  return null;
}
