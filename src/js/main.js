import "../scss/main.scss";

// Selectors
const $listField = document.querySelector(".list__form input");
const $listSubmitBtn = document.querySelector(".list__form button");
const $listContainer = document.querySelector(".list--container");
const $listTemplate = document.querySelector(".list__template");
const $itemTemplate = document.querySelector(".item__template");

let [listId, itemId] = [0, 0];
const appData = {
  list: [],
  listIds: [],
  listItemIds: {}
};

// Function for setting focus to list field
const listFieldFunc = () => {
  $listField.value = "";
  $listField.focus();
};

// Function for modifying String
const modifyString = str => str[0].toUpperCase() + str.slice(1).toLowerCase();

/*--------------- Event Handler for list input button ---------------*/
$listSubmitBtn.addEventListener("click", e => {
  // 1) Prevent Default Behavior
  e.preventDefault();

  // 2) Get the list name
  let listName = $listField.value.trim();

  // 3) Check for truthy value of listName
  if (listName && listName.length <= 20) {
    // i) Modify List Name
    listName = modifyString(listName);

    // iii) Store list index in appData.listIds array
    appData.listIds.push(listId);

    // ii) Store list in local Storage & also in appData.list array
    appData.list.push({ listId, listName, items: [] });
    localStorage.setItem("list", JSON.stringify(appData.list));

    // iii) Empty input field
    listFieldFunc();

    // iv) Display List in UI
    $listContainer.append($listTemplate.content.cloneNode(true));
    const $lastList = $listContainer.lastElementChild;
    $lastList.setAttribute("id", `list-${listId}`);
    $lastList.querySelector("h2").innerText = listName;

    // v) Increase listId by 1
    listId++;
  }
});

/*----------- EventHandler for List Container When new item is added -----------*/
$listContainer.addEventListener("click", function (e) {
  const $itemInputField = e.target.previousElementSibling;
  let itemName = e.target.previousElementSibling?.value.trim();

  // Check if item add button is clicked & itemName is truthy
  if (
    e.target.matches(".btn__item--add") &&
    itemName &&
    itemName.length <= 30
  ) {
    // i) Modify itemName
    itemName = modifyString(itemName);

    // ii)  Get list id
    const itemsListId = +e.target.closest(".list").id.split("-")[1];

    // iii) Store itemId in appData.listItemIds
    if (appData.listItemIds[itemsListId])
      appData.listItemIds[itemsListId].push(itemId);
    else {
      appData.listItemIds[itemsListId] = [];
      appData.listItemIds[itemsListId].push(itemId);
    }

    // iv) Store item in localStorage & appData.list array both
    const listIndex = appData.listIds.indexOf(itemsListId);
    appData.list[listIndex].items.push({ itemId, itemName });
    localStorage.setItem("list", JSON.stringify(appData));

    // v) Empty item Input Field & set the focus back
    $itemInputField.value = "";
    $itemInputField.focus();

    // vi) Display item in UI
    const $itemsContainer = e.target.closest(".item__form").nextElementSibling;
    $itemsContainer.append($itemTemplate.content.cloneNode(true));
    const $lastItem = $itemsContainer.lastElementChild;
    $lastItem.setAttribute("id", `item-${itemId}`);
    $lastItem.querySelector("p").innerText = itemName;

    // vii) Increase item id by 1
    itemId++;
  }
});

/*------------- Displaying list Data from localStorage on window loading -------------*/
window.addEventListener("load", () => {
  // Setting Focus to list Field
  listFieldFunc();
});
