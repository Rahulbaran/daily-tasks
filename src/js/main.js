import "../scss/main.scss";
import { selectors as s } from "./selectors";
import * as func from "./functions";

/*------------- Displaying list Data from localStorage on window loading -------------*/
window.addEventListener("load", func.loadAppData);

/*----------------------- Event Handler for list input button ------------------------*/
s.listSubmitBtn.addEventListener("click", func.createList);

/*----------- EventHandler for List Container When delete icon is clicked -----------*/
let listToDelete;
s.listContainer.addEventListener("click", e => {
  if (e.target.matches(".bx-trash")) {
    s.dialogContainer.classList.add("dialog-visible");
    s.dialogContainer.querySelector("p strong").textContent = e.target
      .closest(".list")
      .querySelector("h2").textContent;

    listToDelete = e.target.closest(".list");
  }
});

/*----------------------- Event Handler for Delete Button  -------------------------*/
s.dialogContainer
  .querySelector(".btn__delete")
  .addEventListener("click", () => func.deleteList(listToDelete));

/*-----------------------  Event Handler for Cancel Button ------------------------*/
s.dialogContainer
  .querySelector(".btn__cancel")
  .addEventListener("click", () => {
    s.dialogContainer.classList.remove("dialog-visible");
  });

/*------------------------ EventHandler for List Container ------------------------*/
s.listContainer.addEventListener("click", e => {
  let itemName = e.target.previousElementSibling?.value?.trim();

  // Check if item add button is clicked & itemName is truthy
  if (
    e.target.matches(".btn__item--add") &&
    itemName &&
    itemName.length <= 30
  ) {
    func.addNewItem(e, itemName);
  }

  // Check if item delete icon is clicked
  else if (e.target.matches(".bx-minus-circle")) {
    const curListId = +e.target.closest(".list").id.split("-")[1];
    const curItemId = +e.target.closest(".item").id.split("-")[1];
  }
});

/* Might be of use in future------------------------------------------*/
// let [listId, itemId] = [0, 0];
// let appData = {
//   list: [],
//   listIds: [],
//   lastItemId: 0
// };
// let listItemIds = new Map();

// // Function for displaying list
// const displayList = list => {
//   s.listContainer.append(s.listTemplate.content.cloneNode(true));
//   const $lastList = s.listContainer.lastElementChild;
//   $lastList.setAttribute("id", `list-${list.listId}`);
//   $lastList.querySelector("h2").innerText = list.listName;
// };

// //  Function for displaying list's item
// const displayListItem = (itemsContainer, item) => {
//   itemsContainer.append(s.itemTemplate.content.cloneNode(true));
//   const $lastItem = itemsContainer.lastElementChild;
//   $lastItem.setAttribute("id", `item-${item.itemId}`);
//   $lastItem.querySelector("p").innerText = item.itemName;
// };

// // Function for loading data from localStorage
// const loadAppData = () => {
//   // i) Setting Focus to list Field
//   func.listFieldFunc();

//   // ii) Reassigning data to variables
//   const [listData, itemIds] = [
//     func.parseJson("list"),
//     func.parseJson("listItemIds")
//   ];
//   if (listData && listData.listIds.length) {
//     appData = listData;
//     listId = listData.listIds.at(-1) + 1;
//   }
//   if (listData && listData.lastItemId) {
//     listItemIds = new Map(Object.entries(itemIds));
//     itemId = listData.lastItemId + 1;
//   }

//   // iii) Display lists & their items in UI
//   if (listData && listData.list.length) {
//     listData.list.forEach(list => {
//       displayList(list);
//       const $itemsWrapper =
//         s.listContainer.lastElementChild.querySelector(".items__wrapper");
//       list.items.forEach(item => {
//         displayListItem($itemsWrapper, item);
//       });
//     });
//   }
// };

// //  Function for Creating new list
// const createList = e => {
//   // 1) Prevent Default Behavior
//   e.preventDefault();

//   // 2) Get the list name
//   let listName = s.listField.value.trim();

//   // 3) Check for truthy value of listName
//   if (listName && listName.length <= 20) {
//     // i) Modify List Name
//     listName = func.modifyString(listName);

//     // iii) Store list index in appData.listIds array
//     appData.listIds.push(listId);

//     // ii) Store list in local Storage & also in appData.list array
//     appData.list.push({ listId, listName, items: [] });
//     func.storeJson("list", appData);

//     // iii) Empty input field
//     func.listFieldFunc();

//     // iv) Display List in UI
//     displayList({ listId, listName });

//     // v) Increase listId by 1
//     listId++;
//   }
// };

// // Function for Deleting list
// const deleteList = () => {
//   // i) Get the listId
//   const listId = +listToDelete.id.split("-")[1];

//   // ii) Find Index of the list
//   const listIndex = appData.listIds.indexOf(listId);

//   // iii) Remove listId, listItems Ids & list from appData Object
//   appData.listIds.splice(listIndex, 1);
//   listItemIds.delete(String(listId));
//   appData.list.splice(listIndex, 1);

//   // iv) Update localStorage
//   func.storeJson("list", appData);
//   func.storeJson("listItemIds", Object.fromEntries(listItemIds));

//   // v) Update UI
//   listToDelete.remove();

//   // vi) Hide dialog box
//   s.dialogContainer.classList.remove("dialog-visible");
// };

// // Function for adding new item
// const addNewItem = (e, itemName) => {
//   const $itemInputField = e.target.previousElementSibling;

//   // i) Modify itemName
//   itemName = func.modifyString(itemName);

//   // ii)  Get list id
//   const itemsListId = e.target.closest(".list").id.split("-")[1];

//   // iii) Store itemId in listItemIds map & in localStorage
//   listItemIds.has(itemsListId)
//     ? listItemIds.get(itemsListId).push(itemId)
//     : listItemIds.set(itemsListId, []).get(itemsListId).push(itemId);

//   func.storeJson("listItemIds", Object.fromEntries(listItemIds));

//   // iv) Store item in localStorage & appData.list array both
//   const listIndex = appData.listIds.indexOf(+itemsListId);
//   appData.list[listIndex].items.push({ itemId, itemName });
//   appData.lastItemId = itemId;
//   func.storeJson("list", appData);

//   // v) Empty item Input Field & set the focus
//   $itemInputField.value = "";
//   $itemInputField.focus();

//   // vi) Display item in UI
//   const $itemsContainer = e.target.closest(".item__form").nextElementSibling;
//   displayListItem($itemsContainer, { itemId, itemName });

//   // vii) Increase item id by 1
//   itemId++;
// };
