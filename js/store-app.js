import { PRODUCTS, CATEGORIES, formatPrice } from "./store-data.js";
import { addToCart, getCart, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal } from "./store-cart.js";
import { currentRoute, navigate } from "./store-router.js";

const view = document.querySelector("#store-view");
const cartCountNode = document.querySelector("#cart-count");
const announcement = document.querySelector("#store-announcement");
let activeCategory = "All";
let searchTerm = "";
let sortOrder = "featured";

function announce(message) {
  announcement.textContent = "";
  window.setTimeout(() => { announcement.textContent = message; }, 20);
}

function updateCartCount() {
  cartCountNode.textContent = String(cartCount());
}

function productCard(product) {
  return `<article class="product-card">
    <a class="product-art" style="--product-bg:${product.color}" href="#/product/${product.id}" aria-label="View ${product.name}">
      <span class="product-emoji" aria-hidden="true">${product.emoji}</span>
      ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
    </a>
    <div class="product-info"><p class="product-category">${product.category}</p>
      <h3 class="product-title"><a href="#/product/${product.id}">${product.name}</a></h3>
      <div class="product-bottom"><span class="product-price">${formatPrice(product.price)}</span>
        <button class="add-button" type="button" data-add="${product.id}">Add to bag</button>
      </div>
    </div>
  </article>`;
}

function renderProducts() {
  let products = PRODUCTS.filter(product =>
    (activeCategory === "All" || product.category === activeCategory) &&
    (product.name + " " + product.category + " " + product.description).toLowerCase().includes(searchTerm)
  );
  if (sortOrder === "price-low") products = [...products].sort((a, b) => a.price - b.price);
  if (sortOrder === "price-high") products = [...products].sort((a, b) => b.price - a.price);
  if (sortOrder === "name") products = [...products].sort((a, b) => a.name.localeCompare(b.name));

  view.innerHTML = `
    <section aria-labelledby="collection-title">
      <div class="store-section-heading"><div><p class="eyebrow">THE COLLECTION</p><h2 id="collection-title">Find your everyday favourite.</h2><p>Useful objects, considered details.</p></div><span class="todo-count">${products.length} items</span></div>
      <div class="store-controls">
        <label class="sr-only" for="product-search">Search products</label>
        <input class="store-search" id="product-search" type="search" placeholder="Search the collection…" value="${searchTerm.replace(/"/g, "&quot;")}">
        <label class="sr-only" for="product-sort">Sort products</label>
        <select class="store-sort" id="product-sort">
          <option value="featured" ${sortOrder === "featured" ? "selected" : ""}>Featured</option>
          <option value="price-low" ${sortOrder === "price-low" ? "selected" : ""}>Price: low to high</option>
          <option value="price-high" ${sortOrder === "price-high" ? "selected" : ""}>Price: high to low</option>
          <option value="name" ${sortOrder === "name" ? "selected" : ""}>Name: A to Z</option>
        </select>
      </div>
      <div class="store-categories" aria-label="Filter by category">
        ${CATEGORIES.map(category => `<button class="category-chip" type="button" data-category="${category}" aria-pressed="${activeCategory === category}">${category}</button>`).join("")}
      </div>
      <div class="product-grid" aria-live="polite">
        ${products.length ? products.map(productCard).join("") : '<p class="store-empty">No products match your search. Try another term or category.</p>'}
      </div>
    </section>`;
}

function renderProduct(id) {
  const product = PRODUCTS.find(item => item.id === id);
  if (!product) return renderNotFound();
  view.innerHTML = `
    <p class="store-breadcrumb"><a href="#/products">Collection</a> / ${product.name}</p>
    <article class="product-detail">
      <div class="product-detail-art" style="--product-bg:${product.color}" role="img" aria-label="Illustration of ${product.name}">${product.emoji}</div>
      <div class="product-detail-copy"><p class="eyebrow">${product.category.toUpperCase()}</p>
        <h1>${product.name}</h1><p>${product.description}</p>
        <p class="detail-price">${formatPrice(product.price)}</p>
        <div class="detail-actions"><label class="sr-only" for="detail-quantity">Quantity</label>
          <input class="quantity-input" id="detail-quantity" type="number" min="1" max="20" value="1">
          <button class="store-button" type="button" data-add="${product.id}" data-quantity-input="detail-quantity">Add to bag</button>
        </div>
        <a class="store-back-link" href="#/products">← Back to the collection</a>
      </div>
    </article>`;
}

function renderCart() {
  const lines = getCart();
  if (!lines.length) {
    view.innerHTML = `<section class="store-section-heading"><div><p class="eyebrow">YOUR BAG</p><h2>Your bag is taking a breather.</h2><p>There is nothing here just yet.</p></div></section><p><a class="store-button" href="#/products">Explore the collection</a></p>`;
    return;
  }
  view.innerHTML = `
    <div class="store-section-heading"><div><p class="eyebrow">YOUR BAG</p><h2>Good choices.</h2><p>Review your items before checkout.</p></div></div>
    <div class="cart-layout">
      <section class="cart-items" aria-label="Shopping cart items">
        ${lines.map(({ product, quantity }) => `<article class="cart-row">
          <div class="cart-thumb" style="--product-bg:${product.color}" aria-hidden="true">${product.emoji}</div>
          <div><h3>${product.name}</h3><p>${formatPrice(product.price)} each</p>
            <div class="cart-row-actions"><label class="sr-only" for="quantity-${product.id}">Quantity for ${product.name}</label>
              <input id="quantity-${product.id}" type="number" min="1" max="20" value="${quantity}" data-quantity="${product.id}">
              <button class="remove-button" type="button" data-remove="${product.id}">Remove</button>
            </div>
          </div>
          <span class="cart-line-total">${formatPrice(product.price * quantity)}</span>
        </article>`).join("")}
      </section>
      <aside class="cart-summary" aria-label="Order summary"><h2>Order summary</h2>
        <p class="summary-line"><span>Subtotal</span><strong>${formatPrice(cartTotal())}</strong></p>
        <p class="summary-line"><span>Shipping</span><strong>Free</strong></p>
        <p class="summary-line summary-total"><span>Total</span><strong>${formatPrice(cartTotal())}</strong></p>
        <button class="store-button" type="button" data-checkout>Continue to checkout</button>
        <p class="checkout-note">Demo checkout only. No payment details are collected and no order is placed.</p>
        <button class="remove-button" type="button" data-clear-cart>Clear bag</button>
      </aside>
    </div>`;
}

function renderCheckout() {
  if (!cartCount()) return renderCart();
  view.innerHTML = `
    <section class="store-section-heading"><div><p class="eyebrow">DEMO CHECKOUT</p><h2>You're nearly there.</h2><p>This educational storefront does not process payments.</p></div></section>
    <div class="cart-summary" style="max-width:560px"><h2>Order preview</h2>
      ${getCart().map(({product,quantity}) => `<p class="summary-line"><span>${product.name} × ${quantity}</span><strong>${formatPrice(product.price * quantity)}</strong></p>`).join("")}
      <p class="summary-line summary-total"><span>Demo total</span><strong>${formatPrice(cartTotal())}</strong></p>
      <p class="checkout-note">This is a front-end demonstration. It has no backend, payment gateway or order fulfilment.</p>
      <button class="store-button" type="button" data-demo-order>Place demo order</button>
      <a class="store-back-link" href="#/cart">← Return to bag</a>
    </div>`;
}

function renderNotFound() {
  view.innerHTML = '<div class="store-empty"><h2>We could not find that page.</h2><a class="store-back-link" href="#/products">Return to the collection</a></div>';
}

function render() {
  updateCartCount();
  const route = currentRoute();
  if (route.name === "home" || route.name === "products") renderProducts();
  else if (route.name === "product") renderProduct(route.id);
  else if (route.name === "cart") renderCart();
  else if (route.name === "checkout") renderCheckout();
  else renderNotFound();
  view.focus({ preventScroll: true });
}

view.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    const quantityInput = addButton.dataset.quantityInput ? document.getElementById(addButton.dataset.quantityInput) : null;
    const quantity = quantityInput ? Number(quantityInput.value) : 1;
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      announce("Choose a quantity between 1 and 20.");
      return;
    }
    addToCart(addButton.dataset.add, quantity);
    updateCartCount();
    announce("Added to your bag.");
    addButton.textContent = "Added ✓";
    window.setTimeout(() => { if (addButton.isConnected) addButton.textContent = "Add to bag"; }, 1000);
    return;
  }
  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    removeFromCart(removeButton.dataset.remove);
    renderCart();
    updateCartCount();
    announce("Item removed from your bag.");
    return;
  }
  if (event.target.closest("[data-checkout]")) {
    navigate("checkout");
    return;
  }
  if (event.target.closest("[data-clear-cart]")) {
    clearCart();
    renderCart();
    updateCartCount();
    announce("Your bag has been cleared.");
    return;
  }
  if (event.target.closest("[data-demo-order]")) {
    clearCart();
    updateCartCount();
    view.innerHTML = '<div class="store-empty"><p class="eyebrow">DEMO ORDER COMPLETE</p><h2>Thanks for exploring Studio Market.</h2><p>Your demonstration order is complete. No payment was taken and no real order was submitted.</p><a class="store-button" href="#/products">Continue exploring</a></div>';
    announce("Demo order completed. No payment was processed.");
  }
});

view.addEventListener("input", event => {
  if (event.target.id === "product-search") {
    searchTerm = event.target.value.trim().toLowerCase();
    const cursor = event.target.selectionStart;
    renderProducts();
    const next = document.getElementById("product-search");
    next.focus();
    next.setSelectionRange(cursor, cursor);
  }
});

view.addEventListener("change", event => {
  if (event.target.id === "product-sort") {
    sortOrder = event.target.value;
    renderProducts();
  }
  if (event.target.matches("[data-quantity]")) {
    const id = event.target.dataset.quantity;
    const value = Number(event.target.value);
    if (Number.isInteger(value) && value >= 1 && value <= 20) {
      updateQuantity(id, value);
      renderCart();
      updateCartCount();
      announce("Cart quantity updated.");
    }
  }
});

view.addEventListener("click", event => {
  const category = event.target.closest("[data-category]");
  if (!category) return;
  activeCategory = category.dataset.category;
  renderProducts();
});

window.addEventListener("hashchange", render);
if (!window.location.hash) window.history.replaceState(null, "", window.location.pathname + "#/products");
render();
