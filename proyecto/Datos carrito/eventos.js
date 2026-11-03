
import { productos } from "./datos.js";

export function inicializarEventos({
    agregarAlCarrito,
    cambiarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    finalizarCompra
}) {
    // Busca los contenedores donde se manejaran los eventos delegados.
    const productsEventContainer = document.querySelector("#products-container");
    const cartEventContainer = document.querySelector("#cart-list");
    const cartActionsContainer = document.querySelector(".cart-actions");
    const themeToggleButton = document.querySelector("#theme-toggle");
    const notification = document.querySelector("#notification");
    const themeStorageKey = "tienda-perfumes-tema";
    let notificationTimeout;

    // Aplica el tema y actualiza el texto y estado accesible del boton.
    function aplicarTema(esOscuro) {
        document.body.dataset.theme = esOscuro ? "dark" : "light";
        themeToggleButton.textContent = esOscuro ? "Modo claro" : "Modo oscuro";
        themeToggleButton.setAttribute("aria-pressed", String(esOscuro));
    }

    // Recupera el tema elegido anteriormente.
    try {
        aplicarTema(localStorage.getItem(themeStorageKey) === "dark");
    } catch (error) {
        console.error("No se pudo cargar el tema guardado:", error);
        aplicarTema(false);
    }

    // Cambia entre tema claro y oscuro y guarda la preferencia.
    themeToggleButton.addEventListener("click", () => {
        const esOscuro = document.body.dataset.theme !== "dark";
        aplicarTema(esOscuro);

        try {
            localStorage.setItem(themeStorageKey, esOscuro ? "dark" : "light");
        } catch (error) {
            console.error("No se pudo guardar el tema:", error);
        }
    });
    // Un solo listener gestiona los botones de todas las tarjetas del catalogo.
    productsEventContainer.addEventListener("click", (event) => {
        const boton = event.target.closest("button[data-action='add']");
        if (!boton || !productsEventContainer.contains(boton)) {
            return;
        }

        const idProducto = Number(boton.dataset.productId);
        const producto = productos.find((actual) => actual.id === idProducto);

        agregarAlCarrito(idProducto);
        notification.textContent = `${producto.nombre} se agregó al carrito.`;
        notification.classList.add("is-visible");

        clearTimeout(notificationTimeout);
        notificationTimeout = setTimeout(() => {
            notification.classList.remove("is-visible");
        }, 2500);
    });

    // Un solo listener gestiona los botones de cantidad y eliminacion del carrito.
    cartEventContainer.addEventListener("click", (event) => {
        const boton = event.target.closest("button[data-action]");
        if (!boton || !cartEventContainer.contains(boton)) {
            return;
        }

        const idProducto = Number(boton.dataset.productId);
        if (boton.dataset.action === "increase") {
            cambiarCantidad(idProducto, 1);
        } else if (boton.dataset.action === "decrease") {
            cambiarCantidad(idProducto, -1);
        } else if (boton.dataset.action === "remove") {
            eliminarDelCarrito(idProducto);
        }
    });

    // Un listener gestiona las acciones generales del carrito.
    cartActionsContainer.addEventListener("click", (event) => {
        const boton = event.target.closest("button[data-action]");
        if (!boton || !cartActionsContainer.contains(boton)) {
            return;
        }

        if (boton.dataset.action === "clear-cart") {
            vaciarCarrito();
        } else if (boton.dataset.action === "checkout") {
            finalizarCompra();
        }
    });
}
