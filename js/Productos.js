// Productos.js
let contenedorProductos = document.getElementById("contenedor-productos");
let url = "http://localhost:3000";
let productosActivos = [];

// Traigo los productos de la API
async function obtenerProductos() {
    try {
        const response = await fetch(`${url}/api/productos`);
        const data = await response.json();
        const productos = data.payload;
        productosActivos = productos.filter(p => p.activo == 1);
        mostrarProductos(productosActivos);
    } catch (error) {
        console.error("Error obteniendo productos:", error);
    }
}


// Armo las cards y se le agrega el botón de carrito
function mostrarProductos(array) {
    let html = "";

    array.forEach(prod => {
        html += `
        <article class="card-producto">
            <a href="detalle.html?id=${prod.id}" class="producto-link">
                <img src="${prod.img}" alt="${prod.nombre}">
                <h3>${prod.nombre}</h3>
                <p>Id: ${prod.id}</p>
                <p>Categoría: ${prod.categoria}</p>
                <p>Precio: $${prod.precio}</p>
            </a>
            <div class="card-footer">
                <input type="number" min="1" value="1" class="input-cantidad">
                <button
                    class="btn-agregar"
                    data-id="${prod.id}"
                    data-nombre="${prod.nombre}"
                    data-precio="${prod.precio}"
                >
                    Agregar al carrito
                </button>
            </div>
        </article>
        `;
    });

    contenedorProductos.innerHTML = html;

    // Despues de pintar las cards, activo los botones
    BotonesAgregar();
}

// Funcion que maneja el localStorage del carrito
function BotonesAgregar() {
    const botones = document.querySelectorAll(".btn-agregar");

    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            const id = boton.dataset.id;
            const nombre = boton.dataset.nombre;
            const precio = Number(boton.dataset.precio);

            // Busco el input de cantidad en la misma card
            const input = boton.parentElement.querySelector(".input-cantidad");
            const cantidad = Number(input.value) || 1;

            // Leo el carrito actual (si no existe, uso array vacio)
            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

            // Busco si el producto ya estaba en el carrito
            const existente = carrito.find(item => item.id == id);

            if (existente) {
                existente.cantidad += cantidad;
            } else {
                carrito.push({ id, nombre, precio, cantidad });
            }

            // Guardo de nuevo el carrito
            localStorage.setItem("carrito", JSON.stringify(carrito));

        });
    });
}

obtenerProductos();

// Filtro por nombre
document.getElementById("btnBuscar").addEventListener("click", () => {
    const texto = document.getElementById("buscarNombre").value.toLowerCase();

    const filtrados = productosActivos.filter(prod =>
        prod.nombre.toLowerCase().includes(texto)
    );

    mostrarProductos(filtrados);
});

// Filtro por categoria
document.getElementById("filtroCategoria").addEventListener("change", () => {
    const categoria = document.getElementById("filtroCategoria").value;

    let filtrados = productosActivos;

    if (categoria !== "todos") {
        filtrados = productosActivos.filter(prod => prod.categoria == categoria);
    }

    mostrarProductos(filtrados);
});