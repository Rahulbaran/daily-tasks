import "../scss/main.scss";
import * as func from "./functions";

// Selectors
const $listField = document.querySelector(".list__form input");
const $listSubmitBtn = document.querySelector(".list__form button");
const $listContainer = document.querySelector(".list--container");
const $listTemplate = document.querySelector(".list__template");
const $itemTemplate = document.querySelector(".item__template");

let [listId, itemId] = [0, 0];
let appData = {
  list: [],
  listIds: [],
  lastItemId: 0
};
let listItemIds = new Map();

// Function for displaying list
const displayList = list => {
  $listContainer.append($listTemplate.content.cloneNode(true));
  const $lastList = $listContainer.lastElementChild;
  $lastList.setAttribute("id", `list-${list.listId}`);
  $lastList.querySelector("h2").innerText = list.listName;
};

// Function for displaying list's item
const displayListItem = (itemsContainer, item) => {
  itemsContainer.append($itemTemplate.content.cloneNode(true));
  const $lastItem = itemsContainer.lastElementChild;
  $lastItem.setAttribute("id", `item-${item.itemId}`);
  $lastItem.querySelector("p").innerText = item.itemName;
};

/*------------- Displaying list Data from localStorage on window loading -------------*/
window.addEventListener("load", () => {
  // i) Setting Focus to list Field
  func.listFieldFunc();

  // ii) Reassigning data to variables
  const [listData, itemIds] = [
    func.parseJson("list"),
    func.parseJson("listItemIds")
  ];
  if (listData && listData.listIds.length) {
    appData = listData;
    listId = listData.listIds.at(-1) + 1;
  }
  if (listData && listData.lastItemId) {
    listItemIds = new Map(Object.entries(itemIds));
    itemId = listData.lastItemId + 1;
  }

  // iii) Display lists & their items in UI
  if (listData && listData.list.length) {
    listData.list.forEach(list => {
      displayList(list);
      const $itemsWrapper =
        $listContainer.lastElementChild.querySelector(".items__wrapper");
      list.items.forEach(item => {
        displayListItem($itemsWrapper, item);
      });
    });
  }
});

/*----------------- Event Handler for list input button -------------------*/
$listSubmitBtn.addEventListener("click", e => {
  // 1) Prevent Default Behavior
  e.preventDefault();

  // 2) Get the list name
  let listName = $listField.value.trim();

  // 3) Check for truthy value of listName
  if (listName && listName.length <= 20) {
    // i) Modify List Name
    listName = func.modifyString(listName);

    // iii) Store list index in appData.listIds array
    appData.listIds.push(listId);

    // ii) Store list in local Storage & also in appData.list array
    appData.list.push({ listId, listName, items: [] });
    func.storeJson("list", appData);

    // iii) Empty input field
    func.listFieldFunc();

    // iv) Display List in UI
    displayList({ listId, listName });

    // v) Increase listId by 1
    listId++;
  }
});

/*----------- EventHandler for List Container When list is deleted -----------*/
$listContainer.addEventListener("click", e => {
  if (e.target.matches(".bx-trash")) {
    // i) Get the listId
    const listId = +e.target.closest(".list").id.split("-")[1];

    // ii) Find Index of the list
    const listIndex = appData.listIds.indexOf(listId);

    // iii) Remove listId, listItems Ids & list from appData Object
    appData.listIds.splice(listIndex, 1);
    listItemIds.delete(String(listId));
    appData.list.splice(listIndex, 1);

    // iv) Update localStorage
    func.storeJson("list", appData);
    func.storeJson("listItemIds", Object.fromEntries(listItemIds));

    // v) Update UI
    e.target.closest(".list").remove();
  }
});

/*----------- EventHandler for List Container When new item is added -----------*/
$listContainer.addEventListener("click", function (e) {
  const $itemInputField = e.target.previousElementSibling;
  let itemName = e.target.previousElementSibling?.value?.trim();

  // Check if item add button is clicked & itemName is truthy
  if (
    e.target.matches(".btn__item--add") &&
    itemName &&
    itemName.length <= 30
  ) {
    // i) Modify itemName
    itemName = func.modifyString(itemName);

    // ii)  Get list id
    const itemsListId = e.target.closest(".list").id.split("-")[1];

    // iii) Store itemId in listItemIds map & in localStorage
    listItemIds.has(itemsListId)
      ? listItemIds.get(itemsListId).push(itemId)
      : listItemIds.set(itemsListId, []).get(itemsListId).push(itemId);

    func.storeJson("listItemIds", Object.fromEntries(listItemIds));

    // iv) Store item in localStorage & appData.list array both
    const listIndex = appData.listIds.indexOf(+itemsListId);
    appData.list[listIndex].items.push({ itemId, itemName });
    appData.lastItemId = itemId;
    func.storeJson("list", appData);

    // v) Empty item Input Field & set the focus
    $itemInputField.value = "";
    $itemInputField.focus();

    // vi) Display item in UI
    const $itemsContainer = e.target.closest(".item__form").nextElementSibling;
    displayListItem($itemsContainer, { itemId, itemName });

    // vii) Increase item id by 1
    itemId++;
  }
});
