const $listField = document.querySelector(".list__form input");

// Function for modifying String
const modifyString = str => str[0].toUpperCase() + str.slice(1).toLowerCase();

// Function for setting focus to list field
const listFieldFunc = () => {
  $listField.value = "";
  $listField.focus();
};

export { modifyString, listFieldFunc };
