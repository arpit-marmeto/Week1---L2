let openShopping = document.querySelector('.shopping');
let closeShopping = document.querySelector('.closeShopping');
let list = document.querySelector('.list');
let listCard = document.querySelector('.listCard');
let body = document.querySelector('body');
let total = document.querySelector('.total');
let quantity = document.querySelector('.quantity');
let notification = document.querySelector('.notification');

openShopping.addEventListener('click', () => {
    body.classList.add('active');
});
closeShopping.addEventListener('click', () => {
    body.classList.remove('active');
});

let products = [
    { id: 1, name: 'Paneer Butter Masala', image: '4.PNG', price: 250, category: 'North Indian' },
    { id: 2, name: 'Masala Dosa', image: '1.PNG', price: 150, category: 'South Indian' },
    { id: 3, name: 'Margherita Pizza', image: '6.PNG', price: 300, category: 'Italian' },
    { id: 4, name: 'Kung Pao Chicken', image: '2.PNG', price: 350, category: 'Chinese' },
    { id: 5, name: 'Tacos', image: '5.PNG', price: 200, category: 'Mexican' },
    { id: 6, name: 'Spaghetti Carbonara', image: '3.PNG', price: 400, category: 'Italian' }
];

let listCards = []; // Array to store cart items
let addedButtons = {}; // Object to track buttons that are "Added"

// Initialize the application
function initApp() {
    displayItems(products);
}
initApp();

// Display items in the product list
function displayItems(items) {
    list.innerHTML = '';
    items.forEach((value, key) => {
        let newDiv = document.createElement('div');
        newDiv.classList.add('item');
        newDiv.innerHTML = `
            <img src="image/${value.image}" alt="${value.name}">
            <div class="title">${value.name}</div>
            <div class="price">₹${value.price.toLocaleString()}</div>
            <button id="add-to-cart-${value.id}" onclick="addToCart(${value.id}, this)">Add To Cart</button>`;
        list.appendChild(newDiv);
        
        // Reset button state if it was previously added
        if (addedButtons[value.id]) {
            const button = document.querySelector(`#add-to-cart-${value.id}`);
            button.innerText = "Added";
            button.style.backgroundColor = "#2f2f2f";
            button.style.color = "#F5E7B2"; // Adjust color for readability
            button.disabled = true; // Disable the button
        }
    });
}

// Filter items based on category
function filterCategory(category) {
    if (category === 'all') {
        displayItems(products);
    } else {
        const filteredItems = products.filter(item => item.category === category);
        displayItems(filteredItems);
    }
}

// Add an item to the cart
function addToCart(id, button) {
    if (listCards.length >= 100) {
        alert("Cart cannot contain more than 100 products.");
        return;
    }

    let product = products.find(item => item.id === id);
    if (!product) return;

    let cartItem = listCards.find(item => item.id === id);
    if (!cartItem) {
        listCards.push({ ...product, quantity: 1 });
        // Change button text and color to "Added" and #2f2f2f
        button.innerText = "Added";
        button.style.backgroundColor = "#2f2f2f";
        button.style.color = "#F5E7B2"; // Adjust color for readability
        button.disabled = true; // Disable the button
        addedButtons[id] = true; // Track the button state
    } else {
        cartItem.quantity += 1;
    }
    reloadCart();
}

// Reload cart to reflect changes
function reloadCart() {
    listCard.innerHTML = '';
    let count = 0;
    let totalPrice = 0;
    let totalItems = 0;

    listCards.forEach((value, key) => {
        totalPrice += value.price * value.quantity;
        totalItems += value.quantity;
        count += value.quantity;
        let newDiv = document.createElement('li');
        newDiv.innerHTML = `
            <div><img src="image/${value.image}" alt="${value.name}"></div>
            <div>${value.name}</div>
            <div>₹${(value.price * value.quantity).toLocaleString()}</div>
            <div>
                <button onclick="changeQuantity(${value.id}, ${value.quantity - 1})">-</button>
                <div class="count">${value.quantity}</div>
                <button onclick="changeQuantity(${value.id}, ${value.quantity + 1})">+</button>
            </div>`;
        listCard.appendChild(newDiv);
    });

    total.innerText = `Total: ₹${totalPrice.toLocaleString()}`;
    quantity.innerText = count;
    displayAveragePrice(totalPrice, totalItems);
}

// Change the quantity of an item in the cart
function changeQuantity(id, quantity) {
    let cartItem = listCards.find(item => item.id === id);
    if (cartItem) {
        if (quantity <= 0) {
            listCards = listCards.filter(item => item.id !== id);
            // Reset button state when item is removed from cart
            addedButtons[id] = false;
            const button = document.querySelector(`#add-to-cart-${id}`);
            if (button) {
                button.innerText = "Add To Cart";
                button.style.backgroundColor = "#973131"; // Reset background color
                button.style.color = "#F5E7B2"; // Default text color
                button.disabled = false; // Enable the button
            }
        } else {
            cartItem.quantity = quantity;
        }
    }
    reloadCart();
}

// Display the average price of items in the cart
function displayAveragePrice(totalPrice, totalItems) {
    const averagePrice = totalItems > 0 ? (totalPrice / totalItems).toFixed(2) : 0;
    document.querySelector('.average-price').innerText = `Average Price: ₹${averagePrice}`;
}

// Sort cart items by price
function sortCart(order = 'asc') {
    listCards.sort((a, b) => order === 'asc' ? a.price - b.price : b.price - a.price);
    reloadCart();
}

// Clear all items from the cart
function clearCart() {
    listCards = [];
    reloadCart();
    notification.innerText = "Your cart is empty";
    notification.classList.remove('hidden');
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// Handle checkout button click
document.querySelector('.checkout-btn').addEventListener('click', () => {
    notification.classList.remove('hidden');
    notification.innerText = "Your order is booked!";
    
    setTimeout(() => {
        notification.classList.add('hidden');
        clearCart();
    }, 3000);
});

// Event listeners for sorting and clearing the cart
document.querySelector('.sort-asc').addEventListener('click', () => sortCart('asc'));
document.querySelector('.sort-desc').addEventListener('click', () => sortCart('desc'));
document.querySelector('.clear-cart').addEventListener('click', clearCart);
