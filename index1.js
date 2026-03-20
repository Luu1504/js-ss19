const products = [
   { id: 1, name: "iPhone 15 Pro", price: 28000000, image: "https://via.placeholder.com/150" },
   { id: 2, name: "MacBook Air M2", price: 24500000, image: "https://via.placeholder.com/150" },
   { id: 3, name: "AirPods Pro 2", price: 5900000, image: "https://via.placeholder.com/150" },
   { id: 4, name: "Apple Watch S9", price: 10200000, image: "https://via.placeholder.com/150" }
];

let cart = [];

function initCart() {
   try {
      const savedCart = localStorage.getItem("shopping_cart");
      cart = savedCart ? JSON.parse(savedCart) : [];
   } catch (error) {
      cart = [];
   }
   renderProducts();
   renderCart();
}

function renderProducts() {
   const productContainer = document.getElementById("product-render");
   productContainer.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p class="price">${p.price.toLocaleString()} VNĐ</p>
            <button onclick="addToCart(${p.id})">Thêm vào giỏ</button>
        </div>
    `).join("");
}

function addToCart(id) {
   const product = products.find(p => p.id === id);
   const cartItem = cart.find(item => item.id === id);

   if (cartItem) {
      cartItem.quantity += 1;
   } else {
      cart.push({ ...product, quantity: 1 });
   }
   updateData();
}

function renderCart() {
   const cartRender = document.getElementById("cart-render");
   const emptyMsg = document.getElementById("empty-cart-msg");

   if (cart.length === 0) {
      cartRender.innerHTML = "";
      emptyMsg.style.display = "block";
   } else {
      emptyMsg.style.display = "none";
      cartRender.innerHTML = cart.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.price.toLocaleString()}</td>
                <td>
                    <button onclick="changeQty(${item.id}, -1)">-</button>
                    ${item.quantity}
                    <button onclick="changeQty(${item.id}, 1)">+</button>
                </td>
                <td>${(item.price * item.quantity).toLocaleString()} VNĐ</td>
                <td><button onclick="removeItem(${item.id})">Xóa</button></td>
            </tr>
        `).join("");
   }
   updateSummary();
}

function changeQty(id, delta) {
   const item = cart.find(i => i.id === id);
   if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
         removeItem(id);
         return;
      }
   }
   updateData();
}

function removeItem(id) {
   const item = cart.find(i => i.id === id);
   if (confirm(`Xóa ${item.name}?`)) {
      cart = cart.filter(i => i.id !== id);
      updateData();
   }
}

document.getElementById("clear-cart").onclick = () => {
   if (confirm("Xóa toàn bộ giỏ hàng?")) {
      cart = [];
      updateData();
   }
};

function updateData() {
   localStorage.setItem("shopping_cart", JSON.stringify(cart));
   renderCart();
}

function updateSummary() {
   const totalUnique = cart.length;
   const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
   const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

   document.getElementById("total-unique").innerText = totalUnique;
   document.getElementById("total-quantity").innerText = totalQty;
   document.getElementById("total-price").innerText = totalPrice.toLocaleString() + " VNĐ";
}

initCart();