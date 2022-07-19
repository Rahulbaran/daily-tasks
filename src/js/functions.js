const $listField = document.querySelector(".list__form input");

// Function for modifying String
const modifyString = str => str[0].toUpperCase() + str.slice(1).toLowerCase();

// Function for setting focus to list field
const listFieldFunc = () => {
  $listField.value = "";
  $listField.focus();
};

// Function for storing JSON Data in localStorage
const storeJson = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

// Function for parsing JSON Data retrieved from localStorage
const parseJson = data => JSON.parse(localStorage.getItem(data));

export { modifyString, listFieldFunc, storeJson, parseJson };
