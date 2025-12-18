// encuesta.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("encuesta-form");
    const sliderPuntuacion = document.getElementById("puntuacion");
    const valorPuntuacion = document.getElementById("valor-puntuacion");
    const btnOmitir = document.getElementById("btn-omitir");
    const modalGracias = document.getElementById("modal-gracias");
    const url = "http://localhost:3000";

    // Actualizar valor del slider
    sliderPuntuacion.addEventListener("input", (e) => {
        valorPuntuacion.textContent = e.target.value;
    });

    // Botón omitir
    btnOmitir.addEventListener("click", () => {
        if (confirm("¿Deseas omitir la encuesta?")) {
            window.location.href = "index.html";
        }
    });

    // Validación en tiempo real
    document.getElementById("cliente").addEventListener("blur", validarCliente);
    document.getElementById("opinion").addEventListener("blur", validarOpinion);
    document.getElementById("email").addEventListener("blur", validarEmail);
    document.getElementById("aceptar-terminos").addEventListener("change", validarTerminos);
    document.getElementById("imagen").addEventListener("change", validarImagen);

    function validarOpinion() {
        const opinion = document.getElementById("opinion").value.trim();
        const error = document.getElementById("error-opinion");
        if (opinion.length < 10) {
            error.textContent = "La opinión debe tener al menos 10 caracteres";
            return false;
        }
        error.textContent = "";
        return true;
    }

    function validarCliente() {
        const cliente = document.getElementById("cliente").value.trim();
        const error = document.getElementById("error-cliente");
        if (cliente.length < 2) {
            error.textContent = "Ingresa tu nombre";
            return false;
        }
        error.textContent = "";
        return true;
    }

    function validarEmail() {
        const email = document.getElementById("email").value.trim();
        const error = document.getElementById("error-email");
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            error.textContent = "Ingresa un email válido";
            return false;
        }
        error.textContent = "";
        return true;
    }

    function validarTerminos() {
        const checked = document.getElementById("aceptar-terminos").checked;
        const error = document.getElementById("error-terminos");
        if (!checked) {
            error.textContent = "Debes aceptar los términos";
            return false;
        }
        error.textContent = "";
        return true;
    }

    function validarImagen() {
        const archivo = document.getElementById("imagen").files[0];
        const error = document.getElementById("error-imagen");
        error.textContent = "";

        if (!archivo) return true; // Opcional

        const maxSize = 5 * 1024 * 1024; // 5MB
        const tiposValidos = ["image/jpeg", "image/png", "image/gif"];

        if (archivo.size > maxSize) {
            error.textContent = "La imagen debe pesar menos de 5MB";
            return false;
        }
        if (!tiposValidos.includes(archivo.type)) {
            error.textContent = "Formatos permitidos: JPG, PNG, GIF";
            return false;
        }
        return true;
    }

    // Envío del formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Validar todos los campos
        const opinionValida = validarOpinion();
        const emailValida = validarEmail();
        const terminosValidos = validarTerminos();
        const imagenValida = validarImagen();

        if (!opinionValida || !emailValida || !terminosValidos || !imagenValida) {
            alert("Por favor, corrige los errores antes de enviar");
            return;
        }

        // Preparar datos
        const formData = new FormData();
        formData.append("cliente", document.getElementById("cliente").value);
        formData.append("opinion", document.getElementById("opinion").value);
        formData.append("email", document.getElementById("email").value);
        formData.append("puntuacion", document.getElementById("puntuacion").value);
        formData.append("aceptar_terminos", document.getElementById("aceptar-terminos").checked ? 1 : 0);

        if (document.getElementById("imagen").files[0]) {
            formData.append("imagen", document.getElementById("imagen").files[0]);
        }

        try {
            const response = await fetch(`${url}/api/encuestas`, {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                // Mostrar modal
                form.style.display = "none";
                modalGracias.style.display = "flex";
                // Descargar Excel automáticamente tras 1 segundo
                setTimeout(() => {
                    window.location.href = `${url}/api/encuestas/excel`;
                }, 1000);
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error("Error enviando encuesta:", error);
            alert("Error al enviar la encuesta. Intenta de nuevo.");
        }
    });
});
