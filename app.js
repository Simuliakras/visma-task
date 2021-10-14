let sortBy = "name";

//Function for checking if string is empty or spaces
function isEmptyOrSpaces(str) {
  return str === null || str.match(/^ *$/) !== null;
}

//Function for removing items
function removeMenuItem(index) {
  const menuList = JSON.parse(sessionStorage.getItem("menu-list"));
  menuList.splice(index, 1);
  sessionStorage.setItem("menu-list", JSON.stringify(menuList));
  renderMenuList();
}

//Function for rendering menu items
function renderMenuList(
  menuList = JSON.parse(sessionStorage.getItem("menu-list"))
) {
  if (!menuList) {
    return null;
  }

  //Sorting logic
  const ogMenuList = [...menuList];
  switch (sortBy) {
    case "name":
      menuList = menuList.sort((a, b) =>
        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      );
      break;
    case "heat":
      menuList = menuList.sort((a, b) => a.heat - b.heat);
      break;
    case "price":
      menuList = menuList.sort((a, b) => a.price - b.price);
      break;
  }
  const menuContainer = document.querySelector(".menu-container");
  menuContainer.innerHTML = "";

  // Creating cards
  menuList.forEach(function (menuItem) {
    const card = document.createElement("div");
    const cardBody = document.createElement("div");
    const cardImage = document.createElement("img");
    const cardName = document.createElement("p");
    const cardPrice = document.createElement("p");
    const heatPepper = document.createElement("img");
    const cardToppings = document.createElement("span");
    const cardDeleteButton = document.createElement("button");

    // Adding classes
    card.classList.add("card");
    cardBody.classList.add("card-body");
    cardImage.classList.add("card-image");
    cardName.classList.add("card-name");
    cardPrice.classList.add("card-price");
    heatPepper.classList.add("heat-pepper");
    cardToppings.classList.add("card-toppings");
    cardDeleteButton.classList.add("delete-button");

    // Setting input values to card data
    const photoUrl = menuItem.photo;
    cardName.textContent = "Pizza name: " + menuItem.name;
    cardPrice.textContent = "Pizza price: " + menuItem.price + "€";
    cardToppings.textContent = "Pizza toppings: " + menuItem.toppings;
    cardDeleteButton.textContent = "Delete pizza";

    //Checking pizza heat and appending needed peppers
    heatPepper.setAttribute("src", "images/pepper.png");

    for (let i = 0; i < menuItem.heat; i++) {
      cardName.appendChild(heatPepper.cloneNode());
    }

    // Setting photo attributes
    cardImage.setAttribute("src", photoUrl);
    cardImage.setAttribute("alt", "Pizza image");

    // Click listener for delete button
    cardDeleteButton.addEventListener("click", function () {
      let confirmDeletion = confirm("Are you sure you want to delete?");
      if (confirmDeletion == true) {
        removeMenuItem(ogMenuList.indexOf(menuItem));
      } else {
        return false;
      }
    });

    // parent.appendChild(child)
    cardBody.appendChild(cardName);
    cardBody.appendChild(cardPrice);
    cardBody.appendChild(cardToppings);
    cardBody.appendChild(cardDeleteButton);
    card.appendChild(cardImage);
    card.appendChild(cardBody);

    menuContainer.appendChild(card);
  });
}

//Onload function
window.onload = function () {
  const form = document.getElementById("pizza-form");
  const nameInput = document.getElementById("name-input");
  const priceInput = document.getElementById("price-input");
  const heatInput = document.getElementById("heat-input");
  const toppingsInput = document.getElementById("toppings-input");
  const addTopping = document.getElementById("toppings-button");
  const toppingsList = document.getElementById("toppings-list");
  const photoInput = document.getElementById("photo-input");
  const submitButton = document.getElementById("submit-button");
  const sortButton = document.getElementById("sort-button");
  const sortInput = document.getElementById("sort-input");

  //Calling a menu items rendering function
  renderMenuList();

  // Event listener for adding toppings
  addTopping.addEventListener("click", (e) => {
    const listItem = document.createElement("li");
    const itemText = document.createTextNode(toppingsInput.value);

    if (itemText && itemText.length !== 0) {
      listItem.appendChild(itemText);
      toppingsList.appendChild(listItem);
      toppingsInput.value = "";
    } else {
      alert("Toppings field is required");
    }
    e.preventDefault();
  });

    //Event listener for sorting menu items
  sortButton.addEventListener("click", (e) => {
    e.preventDefault();
    sortBy = sortInput.value;
    renderMenuList();
  });

    //Event listener for adding new menu item from form
  submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    const name = nameInput.value;
    const price = parseFloat(priceInput.value).toFixed(2);
    const heat = parseInt(heatInput.value);
    const photo = photoInput.value;
    const toppingsListItems = toppingsList.getElementsByTagName("li");
    let toppingsArray = [];
    for (let i = 0; i <= toppingsListItems.length - 1; i++) {
      toppingsArray.push(toppingsListItems[i].innerText);
    }

    if (isEmptyOrSpaces(name)) {
      alert("Name field is required.");
    } else if (name.length > 30) {
      alert("Name can't be longer than 30 characters.");
    } else if (isNaN(price)) {
      alert("Price field is required.");
    } else if (Math.sign(price) === -1) {
      alert("Price can't be negative number.");
    } else if (toppingsArray.length < 2) {
      alert("At least two toppings required.");
    } else {
      const menuList = sessionStorage.getItem("menu-list")
        ? JSON.parse(sessionStorage.getItem("menu-list"))
        : [];

      const newMenuItem = {
        id: Math.floor(Math.random() * 100000),
        name: name,
        price: price,
        heat: heat,
        toppings: toppingsArray,
        photo: photo,
      };

      menuList.push(newMenuItem);
      sessionStorage.setItem("menu-list", JSON.stringify(menuList));
      renderMenuList();
      form.reset();
      while (toppingsList.firstChild) {
        toppingsList.removeChild(toppingsList.firstChild);
      }
    }
  });
};