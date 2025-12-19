document.addEventListener("DOMContentLoaded", () => {
    const btnDescargar = document.getElementById("btn-descargar");
    const spanCliente = document.getElementById("ticket-cliente");
    const spanFecha = document.getElementById("ticket-fecha");
    const contItems = document.getElementById("ticket-items");
    const spanTotal = document.getElementById("ticket-total");

    // Recuperamos el ticket del localStorage
    const ticket = JSON.parse(localStorage.getItem("ticket")) || null;

    if (!ticket) {
        contItems.innerHTML = "<p>No hay ticket generado.</p>";
        return;
    }

    // Mostrar datos del ticket
    spanCliente.textContent = ticket.cliente;
    spanFecha.textContent = ticket.fecha;
    spanTotal.textContent = `$${ticket.total}`;

    contItems.innerHTML = "";
    ticket.items.forEach(item => {
        const div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `
            <div><strong>${item.nombre}</strong></div>
            <div>Cantidad: ${item.cantidad}</div>
            <div>Subtotal: $${item.subtotal}</div>
        `;
        contItems.appendChild(div);
    });

    // 🔥 ENVIAR TICKET AL BACKEND (GUARDAR EN BD)
    fetch("http://localhost:3000/api/ticket", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre_usuario: ticket.cliente,
            total: ticket.total,
            productos: ticket.items.map(item => ({
                producto_id: item.id, // ⚠️ ESTE ID DEBE EXISTIR
                precio: item.subtotal / item.cantidad,
                cantidad: item.cantidad
            }))
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(" Ticket guardado en la base de datos:", data);
    })
    .catch(err => {
        console.error(" Error al guardar el ticket:", err);
    });

    // 📄 Descargar ticket en PDF
    if (btnDescargar) {
        btnDescargar.addEventListener("click", () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            doc.text("Ticket de compra", 10, 10);
            doc.text(`Cliente: ${ticket.cliente}`, 10, 20);
            doc.text(`Fecha: ${ticket.fecha}`, 10, 30);

            let y = 40;
            ticket.items.forEach(item => {
                doc.text(
                    `${item.nombre} - Cant: ${item.cantidad} - Subtotal: $${item.subtotal}`,
                    10,
                    y
                );
                y += 10;
            });

            doc.text(`Total: $${ticket.total}`, 10, y + 10);

            doc.save("ticket.pdf");
        });
    }
});
