import test from "node:test";
import assert from "node:assert/strict";

import { validateEmployeeForm } from "../utils/employeeForm.js";

test("allows submission when a team has not been selected", () => {
  const error = validateEmployeeForm(
    {
      name: "Asha Perera",
      email: "asha@example.com",
      role: "Team Member",
      team: "",
    },
    [],
  );

  assert.equal(error, null);
});

test("requires name, email, and role", () => {
  const error = validateEmployeeForm(
    {
      name: "",
      email: "",
      role: "",
      team: "",
    },
    [],
  );

  assert.equal(error, "Please fill in the employee name, email, and role.");
});
