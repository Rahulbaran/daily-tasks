import { selectors as s } from "./selectors";

let [listId, itemId] = [0, 0];
let appData = {
  list: [],
  listIds: [],
  lastItemId: 0
};
let listItemIds = new Map();

// Function for modifying String
export const modifyString = str =>
  str[0].toUpperCase() + str.slice(1).toLowerCase();

// Function for setting focus to list field
export const listFieldFunc = () => {
  s.listField.value = "";
  s.listField.focus();
};

// Function for storing JSON Data in localStorage
export const storeJson = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

// Function for parsing JSON Data retrieved from localStorage
export const parseJson = data => JSON.parse(localStorage.getItem(data));

//  Function for displaying list
export const displayList = list => {
  s.listContainer.append(s.listTemplate.content.cloneNode(true));
  const $lastList = s.listContainer.lastElementChild;
  $lastList.setAttribute("id", `list-${list.listId}`);
  $lastList.querySelector("h2").innerText = list.listName;
};

//  Function for displaying list's item
const displayListItem = (itemsContainer, item) => {
  itemsContainer.append(s.itemTemplate.content.cloneNode(true));
  const $lastItem = itemsContainer.lastElementChild;
  $lastItem.setAttribute("id", `item-${item.itemId}`);
  $lastItem.querySelector("p").innerText = item.itemName;
};

// Function for loading data from localStorage
export const loadAppData = () => {
  // i) Setting Focus to list Field
  listFieldFunc();

  // ii) Reassigning data to variables
  const [listData, itemIds] = [parseJson("list"), parseJson("listItemIds")];
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
        s.listContainer.lastElementChild.querySelector(".items__wrapper");
      list.items.forEach(item => {
        displayListItem($itemsWrapper, item);
      });
    });
  }
};

// Function for Creating new list
export const createList = e => {
  // 1) Prevent Default Behavior
  e.preventDefault();

  // 2) Get the list name
  let listName = s.listField.value.trim();

  // 3) Check for truthy value of listName
  if (listName && listName.length <= 20) {
    // i) Modify List Name
    listName = modifyString(listName);

    // iii) Store list index in appData.listIds array
    appData.listIds.push(listId);

    // ii) Store list in local Storage & also in appData.list array
    appData.list.push({ listId, listName, items: [] });
    storeJson("list", appData);

    // iii) Empty input field
    listFieldFunc();

    // iv) Display List in UI
    displayList({ listId, listName });

    // v) Increase listId by 1
    listId++;
  }
};

// Function for Deleting list
export const deleteList = listToDelete => {
  // i) Get the listId
  const listId = +listToDelete.id.split("-")[1];

  // ii) Find Index of the list
  const listIndex = appData.listIds.indexOf(listId);

  // iii) Remove listId, listItems Ids & list from appData Object
  appData.listIds.splice(listIndex, 1);
  listItemIds.delete(String(listId));
  appData.list.splice(listIndex, 1);

  // iv) Update localStorage
  storeJson("list", appData);
  storeJson("listItemIds", Object.fromEntries(listItemIds));

  // v) Update UI
  listToDelete.remove();

  // vi) Hide dialog box
  s.dialogContainer.classList.remove("dialog-visible");
};

// Function for adding new item
export const addNewItem = (e, itemName) => {
  const $itemInputField = e.target.previousElementSibling;

  // i) Modify itemName
  itemName = modifyString(itemName);

  // ii)  Get list id
  const itemsListId = e.target.closest(".list").id.split("-")[1];

  // iii) Store itemId in listItemIds map & in localStorage
  listItemIds.has(itemsListId)
    ? listItemIds.get(itemsListId).push(itemId)
    : listItemIds.set(itemsListId, []).get(itemsListId).push(itemId);

  storeJson("listItemIds", Object.fromEntries(listItemIds));

  // iv) Store item in localStorage & appData.list array both
  const listIndex = appData.listIds.indexOf(+itemsListId);
  appData.list[listIndex].items.push({ itemId, itemName });
  appData.lastItemId = itemId;
  storeJson("list", appData);

  // v) Empty item Input Field & set the focus
  $itemInputField.value = "";
  $itemInputField.focus();

  // vi) Display item in UI
  const $itemsContainer = e.target.closest(".item__form").nextElementSibling;
  displayListItem($itemsContainer, { itemId, itemName });

  // vii) Increase item id by 1
  itemId++;
};
