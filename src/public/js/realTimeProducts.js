const socket = io();

const table = document.getElementById('table');

function addCar(car) {
  const html = `
                <td class="py-5">${car.brand}</td>
                <td class="py-5">${car.model}</td>
                <td class="py-5">$${car.price}</td>
                <td><img style="max-width: 200px;" src="${car.image}"></td>
                <td class="py-5">${car.stock} unidades</td> 
                <td class="py-5"><button name="admin-btn" id=${car._id} onclick="removeCar(this.id)" class="btn btn-danger">Borrar</button></td>
              `
  const tr = document.createElement('tr');
  tr.id = car._id;

  tr.innerHTML = html;
  table.appendChild(tr);
}

function removeCar(carId) {
  socket.emit("deleteCar", carId)
}

function deleteCar(carId) {
  const car = document.getElementById(carId);
  if (car) {
    table.removeChild(car);
  }
}

function createCars(cars) {
  while (table.firstChild) {
    table.removeChild(table.firstChild)
  }

  Array.from(cars).forEach((car) => addCar(car));

  rol()
}

function rol() {
  let admin = document.getElementById("admin")
  if (admin.innerText !== "admin") {
    let but = document.querySelectorAll("button")
    but.forEach((e) => {
      e.setAttribute("hidden", true)
    })
  }
}

socket.on('connect', () => {
  console.log('socket.io connected');
});

socket.on("addCar", (car) => {
  addCar(car);
});

socket.on("deleteCar", (carId) => {
  deleteCar(carId);
});

socket.on('initCars', (cars) => {
  createCars(cars);
});

socket.on("updateCar", (car) => {
  deleteCar(car._id);
  addCar(car);
});

socket.on('disconnect', () => {
  console.log('socket.io disconnected');
});