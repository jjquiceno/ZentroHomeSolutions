/*
  Zentro Home Solutions - Lead Form Email Sender (Client-side only)

  Este script envía los datos del formulario de index.html (form[name="zentro-lead"]) vía EmailJS
  sin necesidad de backend. Carga dinámicamente el SDK de EmailJS y envía el email.

  Si deseas cambiar los campos, ajusta "templateParams" para que coincida con tu template de EmailJS.
*/

const EMAILJS_CONFIG = {
  serviceId: "service_deb9zh8",
  templateId: "template_g55wgkb",
  publicKey: "U4OcDJQSM5_HsD6eB"
  // serviceId: "service_zyq801i",
  // templateId: "template_q31gd29",
  // publicKey: "Q1fJt97yn-vKX5PFZ"
};

(function initLeadFormEmail() {
  const form = document.forms["zentro-lead"]; // <form name="zentro-lead">
  if (!form) return;

  // Contenedor de estado (mensajes de carga/éxito/error)
  const statusEl = document.createElement("div");
  statusEl.setAttribute("role", "status");
  statusEl.style.marginTop = "0.5rem";
  statusEl.style.fontSize = "0.9rem";
  statusEl.style.minHeight = "1.2rem";
  form.parentElement.appendChild(statusEl);

  // Carga dinámica del SDK de EmailJS si no existe
  function loadEmailJSSDK() {
    return new Promise((resolve, reject) => {
      if (window.emailjs) return resolve();
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js";
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("No se pudo cargar el SDK de EmailJS"));
      document.head.appendChild(s);
    });
  }

  function setStatus(message, type = "info") {
    statusEl.textContent = message || "";
    statusEl.style.color =
      type === "error" ? "#c0392b" :
      type === "success" ? "#1e874b" : "#555";
  }

  function isConfigured() {
    return EMAILJS_CONFIG.serviceId && EMAILJS_CONFIG.templateId && EMAILJS_CONFIG.publicKey;
  }

  // Estado para evitar envíos duplicados
  let isSending = false;

  // Helpers de UI para el disparador (div o botón)
  const triggerEl = () => document.getElementById("lead-submit");
  function setTriggerLoading(loading) {
    const el = triggerEl();
    if (!el) return;
    if (loading) {
      if (!el.dataset.originalText) el.dataset.originalText = el.textContent;
      el.classList.add("is-loading");
      el.setAttribute("aria-busy", "true");
      el.setAttribute("aria-disabled", "true");
      el.style.pointerEvents = "none";
      el.textContent = "Sending...";
    } else {
      el.classList.remove("is-loading");
      el.removeAttribute("aria-busy");
      el.removeAttribute("aria-disabled");
      el.style.pointerEvents = "";
      if (el.dataset.originalText) el.textContent = el.dataset.originalText;
    }
  }

  async function handleSubmit(e) {
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    // Validación nativa del navegador (evita enviar si faltan campos requeridos)
    if (typeof form.checkValidity === "function" && !form.checkValidity()) {
      if (typeof form.reportValidity === "function") form.reportValidity();
      return;
    }

    if (isSending) return; // evitar doble click
    isSending = true;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.textContent : "";

    try {
      if (!isConfigured()) {
        console.error("EmailJS no está configurado. Completa EMAILJS_CONFIG en js/form.js");
        setStatus("Configuración pendiente: completa los IDs de EmailJS en js/form.js", "error");
        return;
      }

      // UI: loading
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }
      setTriggerLoading(true);
      setStatus("Enviando...", "info");

      // Cargar SDK e inicializar
      await loadEmailJSSDK();
      if (!window.emailjs) throw new Error("EmailJS SDK no disponible");
      if (!window.emailjs.__inited) {
        window.emailjs.init(EMAILJS_CONFIG.publicKey);
        window.emailjs.__inited = true;
      }

      // Recolectar datos del formulario
      const formData = new FormData(form);
      const name = formData.get("name") || "";
      const phone = formData.get("phone") || "";
      const email = formData.get("email") || "";
      const address = formData.get("address") || "";
      const timeline = formData.get("timeline") || "";
      const situation = formData.get("situation") || "";

      // Mapear a variables del template de EmailJS
      const templateParams = {
        name,
        phone,
        email,
        address,
        timeline,
        situation,
        submitted_at: new Date().toISOString()
      };

      // Enviar email
      await window.emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams);

      // UI: éxito
      setStatus("¡Gracias! Tu solicitud fue enviada correctamente. Te contactaremos en 24–48 horas.", "success");
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus("Ocurrió un error enviando el formulario. Intenta nuevamente en unos minutos.", "error");
    } finally {
      isSending = false;
      const submitBtn2 = form.querySelector('button[type="submit"]');
      if (submitBtn2) submitBtn2.disabled = false;
      if (submitBtn) submitBtn.textContent = originalBtnText;
      setTriggerLoading(false);
    }
  }

  // Escucha envío por submit (por si en algún contexto se usa submit programático)
  form.addEventListener("submit", handleSubmit);

  // Evitar interceptación de Netlify: usar click del botón tipo button
  const submitBtnEl = document.getElementById("lead-submit");
  if (submitBtnEl) {
    submitBtnEl.addEventListener("click", handleSubmit);
    // Accesibilidad: activar con Enter o Space
    submitBtnEl.addEventListener("keydown", (ev) => {
      const key = ev.key || ev.code;
      if (key === "Enter" || key === " " || key === "Spacebar") {
        handleSubmit(ev);
      }
    });
  }
})();