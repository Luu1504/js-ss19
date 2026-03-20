const products = [
   { id: 1, name: "Tai nghe Bluetooth TWS", price: 320000, image: "https://picsum.photos/seed/mp19-tws/1200/800", description: "Chống ồn nhẹ, pin 20h, kết nối ổn định." },
   { id: 2, name: "Bàn phím cơ 87 phím", price: 790000, image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=60", description: "Switch blue, led trắng, gõ sướng tay." },
   { id: 3, name: "Chuột không dây công thái học", price: 450000, image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=60", description: "Thiết kế ergonomic, sạc USB-C." },
   { id: 4, name: "USB 64GB", price: 120000, image: "https://picsum.photos/seed/mp19-usb/1200/800", description: "Nhỏ gọn, tốc độ đọc/ghi ổn định." },
   { id: 5, name: "Đế tản nhiệt laptop", price: 210000, image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=1200&q=60", description: "2 quạt gió, đỡ mỏi cổ tay." },
   { id: 6, name: "Cáp sạc Type-C 1m", price: 80000, image: "https://picsum.photos/seed/mp19-cable/1200/800", description: "Bọc dù, hỗ trợ sạc nhanh." }
];

let cart = [];

function init() {
   loadCartFromStorage();
   renderProducts();
   updateUI();
}

function renderProducts() {
   const productsGrid = document.getElementById("products-grid");
   const productsEmpty = document.getElementById("products-empty");
   const productBadge = document.getElementById("product-count-badge");

   if (products.length === 0) {
      productsEmpty.classList.remove("hidden");
      productsGrid.innerHTML = "";
      productBadge.innerText = "0 sản phẩm";
      return;
   }

   productsEmpty.classList.add("hidden");
   productBadge.innerText = `${products.length} sản phẩm`;

   productsGrid.innerHTML = products.map(p => `
        <article class="card">
            <div class="card-img">
                <img src="${p.image}" alt="${p.name}" loading="lazy" />
            </div>
            <div class="card-body">
                <h3 class="card-title">${p.name}</h3>
                <p class="card-desc">${p.description || ''}</p>
                <div class="card-footer">
                    <div class="price">${p.price.toLocaleString('vi-VN')} VNĐ</div>
                    <button class="btn btn-primary" onclick="addToCart(${p.id})">Thêm vào giỏ</button>
                </div>
            </div>
        </article>
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
   saveCartAndRefresh();
}

function renderCart() {
   const cartTbody = document.getElementById("cart-tbody");
   const cartEmpty = document.getElementById("cart-empty");

   if (cart.length === 0) {
      cartEmpty.classList.remove("hidden");
      cartTbody.innerHTML = "";
      return;
   }

   cartEmpty.classList.add("hidden");
   cartTbody.innerHTML = cart.map(item => `
        <tr>
            <td>${item.name}</td>
            <td class="right">${item.price.toLocaleString('vi-VN')} VNĐ</td>
            <td class="center">
                <div class="qty-controls">
                    <button class="btn btn-icon btn-ghost" onclick="changeQty(${item.id}, -1)">-</button>
                    <span class="qty">${item.quantity}</span>
                    <button class="btn btn-icon btn-ghost" onclick="changeQty(${item.id}, 1)">+</button>
                </div>
            </td>
            <td class="right">${(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ</td>
            <td class="center">
                <button class="btn btn-danger" onclick="removeItem(${item.id})">Xóa</button>
            </td>
        </tr>
    `).join("");
}

window.changeQty = function (id, delta) {
   const item = cart.find(i => i.id === id);
   if (!item) return;

   item.quantity += delta;

   if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== id);
   }
   saveCartAndRefresh();
};

window.removeItem = function (id) {
   const item = cart.find(i => i.id === id);
   if (confirm(`Bạn có chắc chắn muốn xóa "${item.name}" khỏi giỏ hàng?`)) {
      cart = cart.filter(i => i.id !== id);
      saveCartAndRefresh();
   }
};

document.getElementById("clear-cart-btn").onclick = () => {
   if (cart.length === 0) return;
   if (confirm("CẢNH BÁO: Bạn có chắc chắn muốn xóa TOÀN BỘ giỏ hàng không?")) {
      cart = [];
      saveCartAndRefresh();
   }
};

function updateSummary() {
   const totalLines = cart.length;
   const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
   const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

   document.getElementById("cart-lines-badge").innerText = `${totalLines} dòng`;
   document.getElementById("cart-qty-badge").innerText = `${totalQty} món`;
   document.getElementById("stat-lines").innerText = totalLines;
   document.getElementById("stat-qty").innerText = totalQty;
   document.getElementById("stat-total").innerText = totalPrice.toLocaleString('vi-VN') + " VNĐ";
}

function saveCartAndRefresh() {
   localStorage.setItem("shopping_cart", JSON.stringify(cart));
   updateUI();
}

function updateUI() {
   renderCart();
   updateSummary();
}

function loadCartFromStorage() {
   try {
      const savedCart = localStorage.getItem("shopping_cart");
      cart = savedCart ? JSON.parse(savedCart) : [];
   } catch (error) {
      cart = [];
   }
}

document.addEventListener("DOMContentLoaded", init);