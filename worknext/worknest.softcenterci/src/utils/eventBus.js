export const dataEvents = new EventTarget();

export function emitDataChange(entity) {
  dataEvents.dispatchEvent(
    new CustomEvent("data-changed", { detail: { entity } })
  );
}

export function subscribeDataChange(handler) {
  dataEvents.addEventListener("data-changed", handler);
  return () => dataEvents.removeEventListener("data-changed", handler);
}
