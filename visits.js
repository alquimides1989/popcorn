(function () {
  const widgets = document.querySelectorAll("[data-visit-widget]");
  if (!widgets.length) return;

  const formatCount = (value) =>
    new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 }).format(Number(value || 0));

  const paint = (count, label = "visitas registradas") => {
    widgets.forEach((widget) => {
      const countNode = widget.querySelector("[data-visit-count]");
      const labelNode = widget.querySelector("[data-visit-label]");
      if (countNode) countNode.textContent = formatCount(count);
      if (labelNode) labelNode.textContent = label;
    });
  };

  const fallback = () => {
    const key = "bluepoint-local-visits";
    const count = Number(localStorage.getItem(key) || 0) + 1;
    localStorage.setItem(key, String(count));
    paint(count, "visitas en este navegador");
  };

  fetch("/api/visit-counter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: window.location.pathname }),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Counter unavailable");
      return response.json();
    })
    .then((data) => paint(data.count))
    .catch(fallback);
})();
