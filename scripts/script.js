const cartProd = document.getElementById('cart-products');

let productsArray;
let cart = [];

const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://marketdb-46b0.restdb.io/rest/products');
xhr.setRequestHeader('content-type', 'application/json');
xhr.setRequestHeader('x-apikey', '63b00b13969f06502871a7ee');
xhr.setRequestHeader('cache-control', 'no-cache');
xhr.send();
xhr.onload = () => {
	const productsGrid = document.getElementById('products-grid');
	productsArray = JSON.parse(xhr.response);

	productsGrid.innerHTML = null;
	for (const product of productsArray) {
		const productElement = document.createElement('div');
		productElement.classList.add('product');
		productElement.innerHTML = `
				<h2 class="product-name">${product.name}</h2>
				<img class="product-img" src="${product.photo_url}" alt="${product.name}">
				<p class="product-desc">${product.description}</p>
				<p class="product-price">Price: ${product.price}UAH</p>
				<button onclick="addProductToCart('${product._id}')">Buy</button>
		  `;
		productsGrid.append(productElement);
	}
};

if (localStorage.getItem('cart')) {
	cart = JSON.parse(localStorage.getItem('cart'));
	showCartProducts();
}

document.getElementById('order-form').addEventListener('submit', event => {
	event.preventDefault();
	const data = JSON.stringify({
		'name': event.target['name'].value,
		'address': event.target['address'].value,
		'phone': event.target['phone'].value,
		'post_number': event.target['post_number'].value,
		'products': localStorage.getItem('cart')
	});

	const xhr = new XMLHttpRequest();
	xhr.open('POST', 'https://marketdb-46b0.restdb.io/rest/order');
	xhr.setRequestHeader('content-type', 'application/json');
	xhr.setRequestHeader('x-apikey', '63b00b13969f06502871a7ee');
	xhr.setRequestHeader('cache-control', 'no-cache');
	xhr.send(data);

	xhr.onload = () => {
		localStorage.removeItem('cart');
		window.open('index.html', '_self');
	};
});

function addProductToCart(id) {
	console.log(id);
	const cartButton = document.getElementById('cart-button');
	const product = productsArray.find(p => p._id == id);
	cart.push(product);
	showCartProducts();

	localStorage.setItem('cart', JSON.stringify(cart));

	cartButton.classList.add('active');
	setTimeout(() => cartButton.classList.remove('active'), 500);
}

function showCartProducts() {
	if (cart.length == 0) return cartProd.innerHTML = 'Cart is empty';
	cartProd.innerHTML = null;
	let sum = 0;
	for (const product of cart) {
		cartProd.innerHTML += `
				<p>
					 <img src="${product.photo_url}">
					 ${product.name} |${product.price}UAH
					 <hr>
				</p>
		  `;
		sum += +product.price;
	}

	cartProd.innerHTML += `
		  <p>Total price: <b>${sum}UAH</b></p>
		  <button onclick="buyAll(${sum})" type="button" class="btn btn-primary" 
		  data-bs-toggle="modal" data-bs-target="#exampleModal">Buy All</button>
	 `;
}


const cartToggle = () => cartProd.classList.toggle('hide');

const buyAll = sum => {
	const orderProducts = document.getElementById('order-products');

	orderProducts.innerHTML = null;
	for (const product of cart) {
		orderProducts.innerHTML += `
				<div class="card col-6">
					 <img src="${product.photo_url}" class="card-img-top">
					 <div class="card-body">
						  <p class="card-text">${product.name} | ${product.price}UAH</p>
					 </div>
				</div>
		  `;
	}
	document.getElementById('sum').innerHTML = 'Total price: ' + sum + 'UAH';
};
