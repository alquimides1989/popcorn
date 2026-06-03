(function () {
  const forms = document.querySelectorAll("[data-newsletter-form]");

  const setStatus = (form, message, state) => {
    const status = form.querySelector("[data-newsletter-status]");
    if (!status) return;
    status.textContent = message;
    status.dataset.state = state;
  };

  const getSegments = (form) =>
    Array.from(form.querySelectorAll('input[name="segments"]:checked')).map((input) => input.value);

  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = form.email?.value?.trim();
      const consent = form.consent?.checked;
      const button = form.querySelector('button[type="submit"]');
      const endpoint = form.dataset.endpoint || "/api/brevo-subscribe";

      if (!email || !form.email.validity.valid) {
        setStatus(form, "Introduce un correo valido.", "error");
        form.email?.focus();
        return;
      }

      if (!consent) {
        setStatus(form, "Necesitamos tu consentimiento para activar la suscripcion.", "error");
        return;
      }

      button.disabled = true;
      setStatus(form, "Registrando tu correo en la newsletter...", "loading");

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            segments: getSegments(form),
            source: "bluepoint-home",
          }),
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result.message || "No se ha podido completar el alta.");
        }

        form.reset();
        setStatus(form, result.message || "Listo. Revisa tu correo por si Brevo solicita confirmacion.", "success");
      } catch (error) {
        setStatus(form, error.message || "No se ha podido conectar con Brevo ahora mismo.", "error");
      } finally {
        button.disabled = false;
      }
    });
  });
})();
