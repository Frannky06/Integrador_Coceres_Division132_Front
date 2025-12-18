document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("detalle-container");
    const btnCarrito = document.getElementById("btn-carrito");
    const btnVolver = document.getElementById("btn-volver");
    const breadcrumbNombre = document.getElementById("breadcrumb-nombre");

    // Obtener ID del producto de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get("id");

    if (!productoId) {
        container.innerHTML = '<div class="error">ID de producto no proporcionado</div>';
        return;
    }

    try {
        // Fetch del producto
        const response = await fetch(`http://localhost:3000/api/productos/${productoId}`);
        const data = await response.json();

        if (!response.ok || !data.payload) {
            container.innerHTML = '<div class="error">Producto no encontrado</div>';
            return;
        }

        const producto = data.payload;

        // Actualizar breadcrumb
        breadcrumbNombre.textContent = producto.nombre;

        // Renderizar detalle del producto
        container.innerHTML = `
            <div class="producto-imagen">
                <img src="http://localhost:3000/${producto.img}" alt="${producto.nombre}" onerror="this.src='img/icono/icono.jpg'">
            </div>
            <div class="producto-info">
                <h1>${producto.nombre}</h1>
                <span class="producto-categoria">${producto.categoria}</span>
                <div class="producto-precio">$${parseFloat(producto.precio).toFixed(2)}</div>
                <p class="producto-descripcion">
                    ${producto.descripcion || 'Producto de alta calidad disponible en nuestro autoservicio. Satisfacción garantizada.'}
                </p>
                <div class="producto-detalles">
                    <div class="detalle-item">
                        <span class="detalle-label">Categoría:</span>
                        <span class="detalle-valor">${producto.categoria}</span>
                    </div>
                    <div class="detalle-item">
                        <span class="detalle-label">Precio:</span>
                        <span class="detalle-valor">$${parseFloat(producto.precio).toFixed(2)}</span>
                    </div>
                    <div class="detalle-item">
                        <span class="detalle-label">Disponibilidad:</span>
                        <span class="detalle-valor">${producto.activo === 1 ? 'En stock' : 'Agotado'}</span>
                    </div>
                    <div class="detalle-item">
                        <span class="detalle-label">ID Producto:</span>
                        <span class="detalle-valor">#${producto.id}</span>
                    </div>
                </div>
            </div>
        `;

        // Botón añadir al carrito
        btnCarrito.addEventListener("click", () => {
            agregarAlCarrito(producto);
        });

        // Botón volver
        btnVolver.addEventListener("click", () => {
            window.location.href = "Productos.html";
        });

    } catch (error) {
        console.error("Error al cargar producto:", error);
        container.innerHTML = '<div class="error">Error al cargar el producto. Intenta nuevamente.</div>';
    }
});

function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Verificar si el producto ya está en el carrito
    const itemExistente = carrito.find(item => item.id === producto.id);

    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1,
            img: producto.img,
            categoria: producto.categoria
        });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(`${producto.nombre} añadido al carrito`);
}
