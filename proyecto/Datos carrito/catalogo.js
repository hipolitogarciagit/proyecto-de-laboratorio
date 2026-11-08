import { productos } from "./datos.js";


// Busca el contenedor donde se mostraran las tarjetas del catalogo.
const productsContainer = document.querySelector("#products-container");

// Configura el formato de precios en pesos argentinos.
const formatoPrecioProductos = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
});

// Genera las tarjetas del catalogo a partir del arreglo de datos.js.
export function renderizarProductos(listaProductos) {
    productsContainer.innerHTML = listaProductos.map((producto) => `
        <article class="product-card">
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p class="product-price">${formatoPrecioProductos.format(producto.precio)}</p>
            <button type="button" data-action="add" data-product-id="${producto.id}">
                Agregar al carrito
            </button>
        </article>
    `).join("");
}
