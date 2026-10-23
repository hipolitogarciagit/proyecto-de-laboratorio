// Busca los elementos del HTML que muestran el estado del carrito.
const cartList = document.querySelector("#cart-list");
const cartTotal = document.querySelector("#cart-total");
const cartCount = document.querySelector("#cart-count");

// Nombre con el que se guarda el carrito en el almacenamiento del navegador.
const storageKey = "tienda-perfumes-carrito";

// Configura el formato de precios en pesos argentinos.
const formatoPrecioCarrito = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
});

// Recupera del navegador el carrito de una visita anterior.
function cargarCarrito() {
    try {
        const guardado = localStorage.getItem(storageKey);
        if (!guardado) {
            return [];
        }

        const carritoGuardado = JSON.parse(guardado);
        if (!Array.isArray(carritoGuardado)) {
            throw new TypeError("El formato del carrito guardado no es válido.");
        }

        // Conserva solo productos existentes con cantidades enteras mayores que cero.
        return carritoGuardado.filter((item) =>
            productos.some((producto) => producto.id === item.id) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0
        );
    } catch (error) {
        // Informa el error en la consola y comienza con un carrito vacio.
        console.error("No se pudo cargar el carrito guardado:", error);
        return [];
    }
}

// Carga el carrito apenas se inicia el programa.
let carrito = cargarCarrito();

// Guarda el estado actual del carrito para la proxima visita.
function guardarCarrito() {
    try {
        localStorage.setItem(storageKey, JSON.stringify(carrito));
    } catch (error) {
        console.error("No se pudo guardar el carrito:", error);
    }
}

// Actualiza el contenido, el contador y el total que se muestran en el carrito.
function renderizarCarrito() {
    const cantidadTotal = carrito.reduce((total, item) => total + item.quantity, 0);
    const precioTotal = carrito.reduce((total, item) => {
        const producto = productos.find((actual) => actual.id === item.id);
        return total + producto.precio * item.quantity;
    }, 0);

    cartCount.textContent = cantidadTotal;
    cartTotal.textContent = `Total: ${formatoPrecioCarrito.format(precioTotal)}`;

    if (carrito.length === 0) {
        cartList.innerHTML = "<li>Tu carrito está vacío.</li>";
        return;
    }

    // Genera una fila por producto con su subtotal y controles de cantidad.
    cartList.innerHTML = carrito.map((item) => {
        const producto = productos.find((actual) => actual.id === item.id);
        return `
            <li class="cart-item">
                <div class="cart-item-info">
                    <strong>${producto.nombre}</strong>
                    <span>${formatoPrecioCarrito.format(producto.precio)} c/u</span>
                    <span>Subtotal: ${formatoPrecioCarrito.format(producto.precio * item.quantity)}</span>
                </div>
                <div class="cart-item-controls" aria-label="Cantidad de ${producto.nombre}">
                    <button type="button" data-action="decrease" data-product-id="${producto.id}" aria-label="Disminuir ${producto.nombre}">−</button>
                    <span>${item.quantity}</span>
                    <button type="button" data-action="increase" data-product-id="${producto.id}" aria-label="Aumentar ${producto.nombre}">+</button>
                    <button type="button" data-action="remove" data-product-id="${producto.id}">Eliminar</button>
                </div>
            </li>
        `;
    }).join("");
}

// Guarda los cambios y vuelve a dibujar el carrito.
function actualizarCarrito() {
    guardarCarrito();
    renderizarCarrito();
}

// Agrega un producto o aumenta su cantidad si ya estaba en el carrito.
function agregarAlCarrito(idProducto) {
    const itemExistente = carrito.find((item) => item.id === idProducto);

    if (itemExistente) {
        itemExistente.quantity += 1;
    } else {
        carrito.push({ id: idProducto, quantity: 1 });
    }

    actualizarCarrito();
}

// Cambia la cantidad; si llega a cero, quita el producto del carrito.
function cambiarCantidad(idProducto, cambio) {
    const item = carrito.find((actual) => actual.id === idProducto);
    if (!item) {
        return;
    }

    item.quantity += cambio;
    if (item.quantity <= 0) {
        eliminarDelCarrito(idProducto);
        return;
    }

    actualizarCarrito();
}

// Elimina del carrito el producto que coincide con el id recibido.
function eliminarDelCarrito(idProducto) {
    carrito = carrito.filter((actual) => actual.id !== idProducto);
    actualizarCarrito();
}

// Vacia todo el carrito.
function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
}

// Confirma una compra y vacia el carrito si hay productos.
function finalizarCompra() {
    if (carrito.length === 0) {
        alert("Agrega productos al carrito antes de finalizar la compra.");
        return;
    }

    alert(`¡Gracias por tu compra! ${cartTotal.textContent} Apruebeme profee`);
    vaciarCarrito();
}

// Muestra el carrito al cargar la pagina.
renderizarCarrito();
