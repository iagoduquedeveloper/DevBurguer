const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const nameUser = document.getElementById("name-user");

window.addEventListener("scroll", function(){
  let header = document.getElementById("header-site")
  header.classList.toggle("md:fixed", window.scrollY > 400)
  header.classList.toggle("md:flex", window.scrollY > 400)
  header.classList.toggle("md:flex-row", window.scrollY > 400)
  header.classList.toggle("md:top-0", window.scrollY > 400)
  header.classList.toggle("md:w-full", window.scrollY > 400)
  header.classList.toggle("md:z-40", window.scrollY > 400)
  header.classList.toggle("md:bg-gray-900", window.scrollY > 400)
  header.classList.toggle("md:text-white", window.scrollY > 400)

})
/*w-full fixed top-0 z-40 items-center justify-center fixed*/ 
let cart = [];
//Open Modal

cartBtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex";
});

// Close modal menu
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});
//close modal button
closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});
//Function to get which item and price the user clicked on
menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    addToCart(name, price);

    Toastify({
      text: `O ${name} foi adicionado ao seu carrinho.`,
      duration: 3000,
      className: "bg-green-600 rounded ",
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "rgb(22 163 74 / var(--tw-bg-opacity))",
      },
    }).showToast();
  }
});

//Function to add to cart

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }
  updateCartModal();
}

//update cart modal

function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  var total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    cartItemElement.innerHTML = `
        
            <div class="flex items-center justify-between" >
            
                <div>
                    <p class="font-medium" >${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2" >${item.price.toFixed(2)}</p>
                </div>
                
                    <buttom style= "cursor: pointer;" class="remove-from-cart-btn  text-red-500 font-medium px-5" data-name="${
                      item.name
                    }" >Remover</buttom>
                
            </div>

        `;
    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.innerHTML = cart.length;
}

//Remove item cart

cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");

    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }
    cart.splice(index, 1);
    updateCartModal();
    Toastify({
      text: `${name} removido do seu carrinho.`,
      duration: 3000,
      className: "bg-red-600 rounded ",
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
    }).showToast();
  }
}

// warning andress

addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    addressWarn.classList.add("hidden");
    addressInput.classList.remove("boder-red-500");
  }
});

checkoutBtn.addEventListener("click", function () {
  const isOpen = checkRestaurantOpen();

  if (!isOpen) {
    Toastify({
      text: "Ops o restaurante está fechado",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
    }).showToast();
    return;
  }

  if (cart.length === 0) return;
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");

    return;
  }
  //Send request
  const cartItems = cart
    .map((item) => {
      return `${item.quantity} - ${item.name} Preço: R$${item.price} |`;
    })
    .join();

  const message = encodeURIComponent(
    `${nameUser.value} fez um pedido de ${cartItems}`
  );
  const phone = "22992496407";

  window.open(
    `https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`,
    "_blank"
  );

  cart = [];
  updateCartModal();
});

// check time

function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 22;

  //true this restaurant
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-600");
  spanItem.classList.add("bg-green-600");
} else {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-600");
}
