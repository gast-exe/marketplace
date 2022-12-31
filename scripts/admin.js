let adminForm = document.getElementById("admin-form");

adminForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let data = JSON.stringify({
        "name": event.target["name"].value,
        "description": event.target["desc"].value,
        "price": event.target["price"].value,
        "photo_url": event.target["photo_url"].value
    });
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://marketdb-46b0.restdb.io/rest/products");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("x-apikey", "63b00b13969f06502871a7ee"); // 63b00b13969f06502871a7ee
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.send(data);

    xhr.onload = function () {
        window.open("index.html", "_self");
    };
});

let orderCards = document.getElementById("order-cards");
let xhr = new XMLHttpRequest();
xhr.open("GET", "https://marketdb-46b0.restdb.io/rest/order");
xhr.setRequestHeader("content-type", "application/json");
xhr.setRequestHeader("x-apikey", "63b00b13969f06502871a7ee");
xhr.setRequestHeader("cache-control", "no-cache");
xhr.responseType = "json";
xhr.send();
xhr.onload = function () {
    let orders = xhr.response;
    for (const order of orders) {
        orderCards.innerHTML += `
        <div class="card my-3">
            <div class="card-body">
                <h5 class="card-title">Order: ${order._id}</h5>
                <p class="card-text">Customer name: ${order.name}</p>
                <p class="card-text">Phone: ${order.phone}</p>
                <p class="card-text">Address: ${order.address}</p>
                <p class="card-text">Post office number: ${order.post_number}</p>
                <div id="id-${order._id}"></div>
            </div>
        </div>
        `;
        let productsEl = document.getElementById("id-" + order._id);
        let sum = 0;
        for (const product of JSON.parse(order.products)) {
            productsEl.innerHTML += `
                <p>
                    <img width="100px" src="${product.photo_url}">
                    ${product.name} |${product.price}UAH
                    <hr>
                </p>
            `;
            sum += +product.price;
        }
        productsEl.innerHTML += `<p>Total price: <b>${sum}UAH</b>`;
    }
};
