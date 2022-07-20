/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./js/selectors.js
var selectors = {
  listField: document.querySelector(".list__form input"),
  listSubmitBtn: document.querySelector(".list__form button"),
  dialogContainer: document.querySelector(".dialog--container"),
  listContainer: document.querySelector(".list--container"),
  listTemplate: document.querySelector(".list__template"),
  itemTemplate: document.querySelector(".item__template")
};
;// CONCATENATED MODULE: ./js/functions.js

var listId = 0,
    itemId = 0;
var appData = {
  list: [],
  listIds: [],
  lastItemId: 0
};
var listItemIds = new Map(); // Function for modifying String

var modifyString = function modifyString(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}; // Function for setting focus to list field

var listFieldFunc = function listFieldFunc() {
  selectors.listField.value = "";
  selectors.listField.focus();
}; // Function for storing JSON Data in localStorage

var storeJson = function storeJson(key, value) {
  return localStorage.setItem(key, JSON.stringify(value));
}; // Function for parsing JSON Data retrieved from localStorage

var parseJson = function parseJson(data) {
  return JSON.parse(localStorage.getItem(data));
}; //  Function for displaying list

var displayList = function displayList(list) {
  selectors.listContainer.append(selectors.listTemplate.content.cloneNode(true));
  var $lastList = selectors.listContainer.lastElementChild;
  $lastList.setAttribute("id", "list-".concat(list.listId));
  $lastList.querySelector("h2").innerText = list.listName;
}; //  Function for displaying list's item

var displayListItem = function displayListItem(itemsContainer, item) {
  itemsContainer.append(selectors.itemTemplate.content.cloneNode(true));
  var $lastItem = itemsContainer.lastElementChild;
  $lastItem.setAttribute("id", "item-".concat(item.itemId));
  $lastItem.querySelector("p").innerText = item.itemName;
}; // Function for loading data from localStorage


var loadAppData = function loadAppData() {
  // i) Setting Focus to list Field
  listFieldFunc(); // ii) Reassigning data to variables

  var _ref = [parseJson("list"), parseJson("listItemIds")],
      listData = _ref[0],
      itemIds = _ref[1];

  if (listData && listData.listIds.length) {
    appData = listData;
    listId = listData.listIds.at(-1) + 1;
  }

  if (listData && listData.lastItemId) {
    listItemIds = new Map(Object.entries(itemIds));
    itemId = listData.lastItemId + 1;
  } // iii) Display lists & their items in UI


  if (listData && listData.list.length) {
    listData.list.forEach(function (list) {
      displayList(list);
      var $itemsWrapper = selectors.listContainer.lastElementChild.querySelector(".items__wrapper");
      list.items.forEach(function (item) {
        displayListItem($itemsWrapper, item);
      });
    });
  }
}; // Function for Creating new list

var createList = function createList(e) {
  // 1) Prevent Default Behavior
  e.preventDefault(); // 2) Get the list name

  var listName = selectors.listField.value.trim(); // 3) Check for truthy value of listName

  if (listName && listName.length <= 20) {
    // i) Modify List Name
    listName = modifyString(listName); // iii) Store list index in appData.listIds array

    appData.listIds.push(listId); // ii) Store list in local Storage & also in appData.list array

    appData.list.push({
      listId: listId,
      listName: listName,
      items: []
    });
    storeJson("list", appData); // iii) Empty input field

    listFieldFunc(); // iv) Display List in UI

    displayList({
      listId: listId,
      listName: listName
    }); // v) Increase listId by 1

    listId++;
  }
}; // Function for Deleting list

var deleteList = function deleteList(listToDelete) {
  // i) Get the listId
  var listId = +listToDelete.id.split("-")[1]; // ii) Find Index of the list

  var listIndex = appData.listIds.indexOf(listId); // iii) Remove listId, listItems Ids & list from appData Object

  appData.listIds.splice(listIndex, 1);
  listItemIds["delete"](String(listId));
  appData.list.splice(listIndex, 1); // iv) Update localStorage

  storeJson("list", appData);
  storeJson("listItemIds", Object.fromEntries(listItemIds)); // v) Update UI

  listToDelete.remove(); // vi) Hide dialog box

  selectors.dialogContainer.classList.remove("dialog-visible");
}; // Function for adding new item

var addNewItem = function addNewItem(e, itemName) {
  var $itemInputField = e.target.previousElementSibling; // i) Modify itemName

  itemName = modifyString(itemName); // ii)  Get list id

  var itemsListId = e.target.closest(".list").id.split("-")[1]; // iii) Store itemId in listItemIds map & in localStorage

  listItemIds.has(itemsListId) ? listItemIds.get(itemsListId).push(itemId) : listItemIds.set(itemsListId, []).get(itemsListId).push(itemId);
  storeJson("listItemIds", Object.fromEntries(listItemIds)); // iv) Store item in localStorage & appData.list array both

  var listIndex = appData.listIds.indexOf(+itemsListId);
  appData.list[listIndex].items.push({
    itemId: itemId,
    itemName: itemName
  });
  appData.lastItemId = itemId;
  storeJson("list", appData); // v) Empty item Input Field & set the focus

  $itemInputField.value = "";
  $itemInputField.focus(); // vi) Display item in UI

  var $itemsContainer = e.target.closest(".item__form").nextElementSibling;
  displayListItem($itemsContainer, {
    itemId: itemId,
    itemName: itemName
  }); // vii) Increase item id by 1

  itemId++;
}; // Function for deleting item

var deleteItem = function deleteItem(e) {
  // i) Get current list id & item id
  var curListId = +e.target.closest(".list").id.split("-")[1];
  var curItemId = +e.target.closest(".item").id.split("-")[1]; // ii) Get indexes of both listid & itemid

  var listIndex = appData.listIds.indexOf(curListId);
  var itemIndex = listItemIds.get(String(curListId)).indexOf(curItemId); // iii) Delete item from appData.list & itemId from listItemIds

  appData.list[listIndex].items.splice(itemIndex, 1);
  listItemIds.get(String(curListId)).splice(itemIndex, 1); // iv) Update localStorage

  storeJson("list", appData);
  storeJson("listItemIds", Object.fromEntries(listItemIds)); // v) Remove item from UI

  e.target.closest(".item").remove();
};
;// CONCATENATED MODULE: ./js/main.js



/*------------- Displaying list Data from localStorage on window loading -------------*/

window.addEventListener("load", loadAppData);
/*----------------------- Event Handler for list input button ------------------------*/

selectors.listSubmitBtn.addEventListener("click", createList);
/*----------- EventHandler for List Container When delete icon is clicked -----------*/

var listToDelete;
selectors.listContainer.addEventListener("click", function (e) {
  if (e.target.matches(".bx-trash")) {
    selectors.dialogContainer.classList.add("dialog-visible");
    selectors.dialogContainer.querySelector("p strong").textContent = e.target.closest(".list").querySelector("h2").textContent;
    listToDelete = e.target.closest(".list");
  }
});
/*----------------------- Event Handler for Delete Button  -------------------------*/

selectors.dialogContainer.querySelector(".btn__delete").addEventListener("click", function () {
  return deleteList(listToDelete);
});
/*-----------------------  Event Handler for Cancel Button ------------------------*/

selectors.dialogContainer.querySelector(".btn__cancel").addEventListener("click", function () {
  selectors.dialogContainer.classList.remove("dialog-visible");
});
/*------------------------ EventHandler for List Container ------------------------*/

selectors.listContainer.addEventListener("click", function (e) {
  var _e$target$previousEle, _e$target$previousEle2;

  var itemName = (_e$target$previousEle = e.target.previousElementSibling) === null || _e$target$previousEle === void 0 ? void 0 : (_e$target$previousEle2 = _e$target$previousEle.value) === null || _e$target$previousEle2 === void 0 ? void 0 : _e$target$previousEle2.trim(); // Check if item add button is clicked & itemName is truthy

  if (e.target.matches(".btn__item--add") && itemName && itemName.length <= 30) {
    addNewItem(e, itemName);
  } // Check if item delete icon is clicked
  else if (e.target.matches(".bx-minus-circle")) {
    deleteItem(e);
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
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0EsSyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL2pzL3NlbGVjdG9ycy5qcyIsIndlYnBhY2s6Ly8vLi9qcy9mdW5jdGlvbnMuanMiLCJ3ZWJwYWNrOi8vLy4vanMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3Qgc2VsZWN0b3JzID0ge1xuICBsaXN0RmllbGQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubGlzdF9fZm9ybSBpbnB1dFwiKSxcbiAgbGlzdFN1Ym1pdEJ0bjogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5saXN0X19mb3JtIGJ1dHRvblwiKSxcbiAgZGlhbG9nQ29udGFpbmVyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRpYWxvZy0tY29udGFpbmVyXCIpLFxuICBsaXN0Q29udGFpbmVyOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxpc3QtLWNvbnRhaW5lclwiKSxcbiAgbGlzdFRlbXBsYXRlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxpc3RfX3RlbXBsYXRlXCIpLFxuICBpdGVtVGVtcGxhdGU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuaXRlbV9fdGVtcGxhdGVcIilcbn07XG4iLCJpbXBvcnQgeyBzZWxlY3RvcnMgYXMgcyB9IGZyb20gXCIuL3NlbGVjdG9yc1wiO1xuXG5sZXQgW2xpc3RJZCwgaXRlbUlkXSA9IFswLCAwXTtcbmxldCBhcHBEYXRhID0ge1xuICBsaXN0OiBbXSxcbiAgbGlzdElkczogW10sXG4gIGxhc3RJdGVtSWQ6IDBcbn07XG5sZXQgbGlzdEl0ZW1JZHMgPSBuZXcgTWFwKCk7XG5cbi8vIEZ1bmN0aW9uIGZvciBtb2RpZnlpbmcgU3RyaW5nXG5leHBvcnQgY29uc3QgbW9kaWZ5U3RyaW5nID0gc3RyID0+XG4gIHN0clswXS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCk7XG5cbi8vIEZ1bmN0aW9uIGZvciBzZXR0aW5nIGZvY3VzIHRvIGxpc3QgZmllbGRcbmV4cG9ydCBjb25zdCBsaXN0RmllbGRGdW5jID0gKCkgPT4ge1xuICBzLmxpc3RGaWVsZC52YWx1ZSA9IFwiXCI7XG4gIHMubGlzdEZpZWxkLmZvY3VzKCk7XG59O1xuXG4vLyBGdW5jdGlvbiBmb3Igc3RvcmluZyBKU09OIERhdGEgaW4gbG9jYWxTdG9yYWdlXG5leHBvcnQgY29uc3Qgc3RvcmVKc29uID0gKGtleSwgdmFsdWUpID0+XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcblxuLy8gRnVuY3Rpb24gZm9yIHBhcnNpbmcgSlNPTiBEYXRhIHJldHJpZXZlZCBmcm9tIGxvY2FsU3RvcmFnZVxuZXhwb3J0IGNvbnN0IHBhcnNlSnNvbiA9IGRhdGEgPT4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShkYXRhKSk7XG5cbi8vICBGdW5jdGlvbiBmb3IgZGlzcGxheWluZyBsaXN0XG5leHBvcnQgY29uc3QgZGlzcGxheUxpc3QgPSBsaXN0ID0+IHtcbiAgcy5saXN0Q29udGFpbmVyLmFwcGVuZChzLmxpc3RUZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gIGNvbnN0ICRsYXN0TGlzdCA9IHMubGlzdENvbnRhaW5lci5sYXN0RWxlbWVudENoaWxkO1xuICAkbGFzdExpc3Quc2V0QXR0cmlidXRlKFwiaWRcIiwgYGxpc3QtJHtsaXN0Lmxpc3RJZH1gKTtcbiAgJGxhc3RMaXN0LnF1ZXJ5U2VsZWN0b3IoXCJoMlwiKS5pbm5lclRleHQgPSBsaXN0Lmxpc3ROYW1lO1xufTtcblxuLy8gIEZ1bmN0aW9uIGZvciBkaXNwbGF5aW5nIGxpc3QncyBpdGVtXG5jb25zdCBkaXNwbGF5TGlzdEl0ZW0gPSAoaXRlbXNDb250YWluZXIsIGl0ZW0pID0+IHtcbiAgaXRlbXNDb250YWluZXIuYXBwZW5kKHMuaXRlbVRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpKTtcbiAgY29uc3QgJGxhc3RJdGVtID0gaXRlbXNDb250YWluZXIubGFzdEVsZW1lbnRDaGlsZDtcbiAgJGxhc3RJdGVtLnNldEF0dHJpYnV0ZShcImlkXCIsIGBpdGVtLSR7aXRlbS5pdGVtSWR9YCk7XG4gICRsYXN0SXRlbS5xdWVyeVNlbGVjdG9yKFwicFwiKS5pbm5lclRleHQgPSBpdGVtLml0ZW1OYW1lO1xufTtcblxuLy8gRnVuY3Rpb24gZm9yIGxvYWRpbmcgZGF0YSBmcm9tIGxvY2FsU3RvcmFnZVxuZXhwb3J0IGNvbnN0IGxvYWRBcHBEYXRhID0gKCkgPT4ge1xuICAvLyBpKSBTZXR0aW5nIEZvY3VzIHRvIGxpc3QgRmllbGRcbiAgbGlzdEZpZWxkRnVuYygpO1xuXG4gIC8vIGlpKSBSZWFzc2lnbmluZyBkYXRhIHRvIHZhcmlhYmxlc1xuICBjb25zdCBbbGlzdERhdGEsIGl0ZW1JZHNdID0gW3BhcnNlSnNvbihcImxpc3RcIiksIHBhcnNlSnNvbihcImxpc3RJdGVtSWRzXCIpXTtcbiAgaWYgKGxpc3REYXRhICYmIGxpc3REYXRhLmxpc3RJZHMubGVuZ3RoKSB7XG4gICAgYXBwRGF0YSA9IGxpc3REYXRhO1xuICAgIGxpc3RJZCA9IGxpc3REYXRhLmxpc3RJZHMuYXQoLTEpICsgMTtcbiAgfVxuICBpZiAobGlzdERhdGEgJiYgbGlzdERhdGEubGFzdEl0ZW1JZCkge1xuICAgIGxpc3RJdGVtSWRzID0gbmV3IE1hcChPYmplY3QuZW50cmllcyhpdGVtSWRzKSk7XG4gICAgaXRlbUlkID0gbGlzdERhdGEubGFzdEl0ZW1JZCArIDE7XG4gIH1cblxuICAvLyBpaWkpIERpc3BsYXkgbGlzdHMgJiB0aGVpciBpdGVtcyBpbiBVSVxuICBpZiAobGlzdERhdGEgJiYgbGlzdERhdGEubGlzdC5sZW5ndGgpIHtcbiAgICBsaXN0RGF0YS5saXN0LmZvckVhY2gobGlzdCA9PiB7XG4gICAgICBkaXNwbGF5TGlzdChsaXN0KTtcbiAgICAgIGNvbnN0ICRpdGVtc1dyYXBwZXIgPVxuICAgICAgICBzLmxpc3RDb250YWluZXIubGFzdEVsZW1lbnRDaGlsZC5xdWVyeVNlbGVjdG9yKFwiLml0ZW1zX193cmFwcGVyXCIpO1xuICAgICAgbGlzdC5pdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBkaXNwbGF5TGlzdEl0ZW0oJGl0ZW1zV3JhcHBlciwgaXRlbSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufTtcblxuLy8gRnVuY3Rpb24gZm9yIENyZWF0aW5nIG5ldyBsaXN0XG5leHBvcnQgY29uc3QgY3JlYXRlTGlzdCA9IGUgPT4ge1xuICAvLyAxKSBQcmV2ZW50IERlZmF1bHQgQmVoYXZpb3JcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gIC8vIDIpIEdldCB0aGUgbGlzdCBuYW1lXG4gIGxldCBsaXN0TmFtZSA9IHMubGlzdEZpZWxkLnZhbHVlLnRyaW0oKTtcblxuICAvLyAzKSBDaGVjayBmb3IgdHJ1dGh5IHZhbHVlIG9mIGxpc3ROYW1lXG4gIGlmIChsaXN0TmFtZSAmJiBsaXN0TmFtZS5sZW5ndGggPD0gMjApIHtcbiAgICAvLyBpKSBNb2RpZnkgTGlzdCBOYW1lXG4gICAgbGlzdE5hbWUgPSBtb2RpZnlTdHJpbmcobGlzdE5hbWUpO1xuXG4gICAgLy8gaWlpKSBTdG9yZSBsaXN0IGluZGV4IGluIGFwcERhdGEubGlzdElkcyBhcnJheVxuICAgIGFwcERhdGEubGlzdElkcy5wdXNoKGxpc3RJZCk7XG5cbiAgICAvLyBpaSkgU3RvcmUgbGlzdCBpbiBsb2NhbCBTdG9yYWdlICYgYWxzbyBpbiBhcHBEYXRhLmxpc3QgYXJyYXlcbiAgICBhcHBEYXRhLmxpc3QucHVzaCh7IGxpc3RJZCwgbGlzdE5hbWUsIGl0ZW1zOiBbXSB9KTtcbiAgICBzdG9yZUpzb24oXCJsaXN0XCIsIGFwcERhdGEpO1xuXG4gICAgLy8gaWlpKSBFbXB0eSBpbnB1dCBmaWVsZFxuICAgIGxpc3RGaWVsZEZ1bmMoKTtcblxuICAgIC8vIGl2KSBEaXNwbGF5IExpc3QgaW4gVUlcbiAgICBkaXNwbGF5TGlzdCh7IGxpc3RJZCwgbGlzdE5hbWUgfSk7XG5cbiAgICAvLyB2KSBJbmNyZWFzZSBsaXN0SWQgYnkgMVxuICAgIGxpc3RJZCsrO1xuICB9XG59O1xuXG4vLyBGdW5jdGlvbiBmb3IgRGVsZXRpbmcgbGlzdFxuZXhwb3J0IGNvbnN0IGRlbGV0ZUxpc3QgPSBsaXN0VG9EZWxldGUgPT4ge1xuICAvLyBpKSBHZXQgdGhlIGxpc3RJZFxuICBjb25zdCBsaXN0SWQgPSArbGlzdFRvRGVsZXRlLmlkLnNwbGl0KFwiLVwiKVsxXTtcblxuICAvLyBpaSkgRmluZCBJbmRleCBvZiB0aGUgbGlzdFxuICBjb25zdCBsaXN0SW5kZXggPSBhcHBEYXRhLmxpc3RJZHMuaW5kZXhPZihsaXN0SWQpO1xuXG4gIC8vIGlpaSkgUmVtb3ZlIGxpc3RJZCwgbGlzdEl0ZW1zIElkcyAmIGxpc3QgZnJvbSBhcHBEYXRhIE9iamVjdFxuICBhcHBEYXRhLmxpc3RJZHMuc3BsaWNlKGxpc3RJbmRleCwgMSk7XG4gIGxpc3RJdGVtSWRzLmRlbGV0ZShTdHJpbmcobGlzdElkKSk7XG4gIGFwcERhdGEubGlzdC5zcGxpY2UobGlzdEluZGV4LCAxKTtcblxuICAvLyBpdikgVXBkYXRlIGxvY2FsU3RvcmFnZVxuICBzdG9yZUpzb24oXCJsaXN0XCIsIGFwcERhdGEpO1xuICBzdG9yZUpzb24oXCJsaXN0SXRlbUlkc1wiLCBPYmplY3QuZnJvbUVudHJpZXMobGlzdEl0ZW1JZHMpKTtcblxuICAvLyB2KSBVcGRhdGUgVUlcbiAgbGlzdFRvRGVsZXRlLnJlbW92ZSgpO1xuXG4gIC8vIHZpKSBIaWRlIGRpYWxvZyBib3hcbiAgcy5kaWFsb2dDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcImRpYWxvZy12aXNpYmxlXCIpO1xufTtcblxuLy8gRnVuY3Rpb24gZm9yIGFkZGluZyBuZXcgaXRlbVxuZXhwb3J0IGNvbnN0IGFkZE5ld0l0ZW0gPSAoZSwgaXRlbU5hbWUpID0+IHtcbiAgY29uc3QgJGl0ZW1JbnB1dEZpZWxkID0gZS50YXJnZXQucHJldmlvdXNFbGVtZW50U2libGluZztcblxuICAvLyBpKSBNb2RpZnkgaXRlbU5hbWVcbiAgaXRlbU5hbWUgPSBtb2RpZnlTdHJpbmcoaXRlbU5hbWUpO1xuXG4gIC8vIGlpKSAgR2V0IGxpc3QgaWRcbiAgY29uc3QgaXRlbXNMaXN0SWQgPSBlLnRhcmdldC5jbG9zZXN0KFwiLmxpc3RcIikuaWQuc3BsaXQoXCItXCIpWzFdO1xuXG4gIC8vIGlpaSkgU3RvcmUgaXRlbUlkIGluIGxpc3RJdGVtSWRzIG1hcCAmIGluIGxvY2FsU3RvcmFnZVxuICBsaXN0SXRlbUlkcy5oYXMoaXRlbXNMaXN0SWQpXG4gICAgPyBsaXN0SXRlbUlkcy5nZXQoaXRlbXNMaXN0SWQpLnB1c2goaXRlbUlkKVxuICAgIDogbGlzdEl0ZW1JZHMuc2V0KGl0ZW1zTGlzdElkLCBbXSkuZ2V0KGl0ZW1zTGlzdElkKS5wdXNoKGl0ZW1JZCk7XG5cbiAgc3RvcmVKc29uKFwibGlzdEl0ZW1JZHNcIiwgT2JqZWN0LmZyb21FbnRyaWVzKGxpc3RJdGVtSWRzKSk7XG5cbiAgLy8gaXYpIFN0b3JlIGl0ZW0gaW4gbG9jYWxTdG9yYWdlICYgYXBwRGF0YS5saXN0IGFycmF5IGJvdGhcbiAgY29uc3QgbGlzdEluZGV4ID0gYXBwRGF0YS5saXN0SWRzLmluZGV4T2YoK2l0ZW1zTGlzdElkKTtcbiAgYXBwRGF0YS5saXN0W2xpc3RJbmRleF0uaXRlbXMucHVzaCh7IGl0ZW1JZCwgaXRlbU5hbWUgfSk7XG4gIGFwcERhdGEubGFzdEl0ZW1JZCA9IGl0ZW1JZDtcbiAgc3RvcmVKc29uKFwibGlzdFwiLCBhcHBEYXRhKTtcblxuICAvLyB2KSBFbXB0eSBpdGVtIElucHV0IEZpZWxkICYgc2V0IHRoZSBmb2N1c1xuICAkaXRlbUlucHV0RmllbGQudmFsdWUgPSBcIlwiO1xuICAkaXRlbUlucHV0RmllbGQuZm9jdXMoKTtcblxuICAvLyB2aSkgRGlzcGxheSBpdGVtIGluIFVJXG4gIGNvbnN0ICRpdGVtc0NvbnRhaW5lciA9IGUudGFyZ2V0LmNsb3Nlc3QoXCIuaXRlbV9fZm9ybVwiKS5uZXh0RWxlbWVudFNpYmxpbmc7XG4gIGRpc3BsYXlMaXN0SXRlbSgkaXRlbXNDb250YWluZXIsIHsgaXRlbUlkLCBpdGVtTmFtZSB9KTtcblxuICAvLyB2aWkpIEluY3JlYXNlIGl0ZW0gaWQgYnkgMVxuICBpdGVtSWQrKztcbn07XG5cbi8vIEZ1bmN0aW9uIGZvciBkZWxldGluZyBpdGVtXG5leHBvcnQgY29uc3QgZGVsZXRlSXRlbSA9IGUgPT4ge1xuICAvLyBpKSBHZXQgY3VycmVudCBsaXN0IGlkICYgaXRlbSBpZFxuICBjb25zdCBjdXJMaXN0SWQgPSArZS50YXJnZXQuY2xvc2VzdChcIi5saXN0XCIpLmlkLnNwbGl0KFwiLVwiKVsxXTtcbiAgY29uc3QgY3VySXRlbUlkID0gK2UudGFyZ2V0LmNsb3Nlc3QoXCIuaXRlbVwiKS5pZC5zcGxpdChcIi1cIilbMV07XG5cbiAgLy8gaWkpIEdldCBpbmRleGVzIG9mIGJvdGggbGlzdGlkICYgaXRlbWlkXG4gIGNvbnN0IGxpc3RJbmRleCA9IGFwcERhdGEubGlzdElkcy5pbmRleE9mKGN1ckxpc3RJZCk7XG4gIGNvbnN0IGl0ZW1JbmRleCA9IGxpc3RJdGVtSWRzLmdldChTdHJpbmcoY3VyTGlzdElkKSkuaW5kZXhPZihjdXJJdGVtSWQpO1xuXG4gIC8vIGlpaSkgRGVsZXRlIGl0ZW0gZnJvbSBhcHBEYXRhLmxpc3QgJiBpdGVtSWQgZnJvbSBsaXN0SXRlbUlkc1xuICBhcHBEYXRhLmxpc3RbbGlzdEluZGV4XS5pdGVtcy5zcGxpY2UoaXRlbUluZGV4LCAxKTtcbiAgbGlzdEl0ZW1JZHMuZ2V0KFN0cmluZyhjdXJMaXN0SWQpKS5zcGxpY2UoaXRlbUluZGV4LCAxKTtcblxuICAvLyBpdikgVXBkYXRlIGxvY2FsU3RvcmFnZVxuICBzdG9yZUpzb24oXCJsaXN0XCIsIGFwcERhdGEpO1xuICBzdG9yZUpzb24oXCJsaXN0SXRlbUlkc1wiLCBPYmplY3QuZnJvbUVudHJpZXMobGlzdEl0ZW1JZHMpKTtcblxuICAvLyB2KSBSZW1vdmUgaXRlbSBmcm9tIFVJXG4gIGUudGFyZ2V0LmNsb3Nlc3QoXCIuaXRlbVwiKS5yZW1vdmUoKTtcbn07XG4iLCJpbXBvcnQgXCIuLi9zY3NzL21haW4uc2Nzc1wiO1xuaW1wb3J0IHsgc2VsZWN0b3JzIGFzIHMgfSBmcm9tIFwiLi9zZWxlY3RvcnNcIjtcbmltcG9ydCAqIGFzIGZ1bmMgZnJvbSBcIi4vZnVuY3Rpb25zXCI7XG5cbi8qLS0tLS0tLS0tLS0tLSBEaXNwbGF5aW5nIGxpc3QgRGF0YSBmcm9tIGxvY2FsU3RvcmFnZSBvbiB3aW5kb3cgbG9hZGluZyAtLS0tLS0tLS0tLS0tKi9cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jLmxvYWRBcHBEYXRhKTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBFdmVudCBIYW5kbGVyIGZvciBsaXN0IGlucHV0IGJ1dHRvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xucy5saXN0U3VibWl0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jLmNyZWF0ZUxpc3QpO1xuXG4vKi0tLS0tLS0tLS0tIEV2ZW50SGFuZGxlciBmb3IgTGlzdCBDb250YWluZXIgV2hlbiBkZWxldGUgaWNvbiBpcyBjbGlja2VkIC0tLS0tLS0tLS0tKi9cbmxldCBsaXN0VG9EZWxldGU7XG5zLmxpc3RDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUgPT4ge1xuICBpZiAoZS50YXJnZXQubWF0Y2hlcyhcIi5ieC10cmFzaFwiKSkge1xuICAgIHMuZGlhbG9nQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJkaWFsb2ctdmlzaWJsZVwiKTtcbiAgICBzLmRpYWxvZ0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwicCBzdHJvbmdcIikudGV4dENvbnRlbnQgPSBlLnRhcmdldFxuICAgICAgLmNsb3Nlc3QoXCIubGlzdFwiKVxuICAgICAgLnF1ZXJ5U2VsZWN0b3IoXCJoMlwiKS50ZXh0Q29udGVudDtcblxuICAgIGxpc3RUb0RlbGV0ZSA9IGUudGFyZ2V0LmNsb3Nlc3QoXCIubGlzdFwiKTtcbiAgfVxufSk7XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gRXZlbnQgSGFuZGxlciBmb3IgRGVsZXRlIEJ1dHRvbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5zLmRpYWxvZ0NvbnRhaW5lclxuICAucXVlcnlTZWxlY3RvcihcIi5idG5fX2RlbGV0ZVwiKVxuICAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IGZ1bmMuZGVsZXRlTGlzdChsaXN0VG9EZWxldGUpKTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAgRXZlbnQgSGFuZGxlciBmb3IgQ2FuY2VsIEJ1dHRvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xucy5kaWFsb2dDb250YWluZXJcbiAgLnF1ZXJ5U2VsZWN0b3IoXCIuYnRuX19jYW5jZWxcIilcbiAgLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgcy5kaWFsb2dDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcImRpYWxvZy12aXNpYmxlXCIpO1xuICB9KTtcblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gRXZlbnRIYW5kbGVyIGZvciBMaXN0IENvbnRhaW5lciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xucy5saXN0Q29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcbiAgbGV0IGl0ZW1OYW1lID0gZS50YXJnZXQucHJldmlvdXNFbGVtZW50U2libGluZz8udmFsdWU/LnRyaW0oKTtcblxuICAvLyBDaGVjayBpZiBpdGVtIGFkZCBidXR0b24gaXMgY2xpY2tlZCAmIGl0ZW1OYW1lIGlzIHRydXRoeVxuICBpZiAoXG4gICAgZS50YXJnZXQubWF0Y2hlcyhcIi5idG5fX2l0ZW0tLWFkZFwiKSAmJlxuICAgIGl0ZW1OYW1lICYmXG4gICAgaXRlbU5hbWUubGVuZ3RoIDw9IDMwXG4gICkge1xuICAgIGZ1bmMuYWRkTmV3SXRlbShlLCBpdGVtTmFtZSk7XG4gIH1cblxuICAvLyBDaGVjayBpZiBpdGVtIGRlbGV0ZSBpY29uIGlzIGNsaWNrZWRcbiAgZWxzZSBpZiAoZS50YXJnZXQubWF0Y2hlcyhcIi5ieC1taW51cy1jaXJjbGVcIikpIHtcbiAgICBmdW5jLmRlbGV0ZUl0ZW0oZSk7XG4gIH1cbn0pO1xuXG4vKiBNaWdodCBiZSBvZiB1c2UgaW4gZnV0dXJlLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8vIGxldCBbbGlzdElkLCBpdGVtSWRdID0gWzAsIDBdO1xuLy8gbGV0IGFwcERhdGEgPSB7XG4vLyAgIGxpc3Q6IFtdLFxuLy8gICBsaXN0SWRzOiBbXSxcbi8vICAgbGFzdEl0ZW1JZDogMFxuLy8gfTtcbi8vIGxldCBsaXN0SXRlbUlkcyA9IG5ldyBNYXAoKTtcblxuLy8gLy8gRnVuY3Rpb24gZm9yIGRpc3BsYXlpbmcgbGlzdFxuLy8gY29uc3QgZGlzcGxheUxpc3QgPSBsaXN0ID0+IHtcbi8vICAgcy5saXN0Q29udGFpbmVyLmFwcGVuZChzLmxpc3RUZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSk7XG4vLyAgIGNvbnN0ICRsYXN0TGlzdCA9IHMubGlzdENvbnRhaW5lci5sYXN0RWxlbWVudENoaWxkO1xuLy8gICAkbGFzdExpc3Quc2V0QXR0cmlidXRlKFwiaWRcIiwgYGxpc3QtJHtsaXN0Lmxpc3RJZH1gKTtcbi8vICAgJGxhc3RMaXN0LnF1ZXJ5U2VsZWN0b3IoXCJoMlwiKS5pbm5lclRleHQgPSBsaXN0Lmxpc3ROYW1lO1xuLy8gfTtcblxuLy8gLy8gIEZ1bmN0aW9uIGZvciBkaXNwbGF5aW5nIGxpc3QncyBpdGVtXG4vLyBjb25zdCBkaXNwbGF5TGlzdEl0ZW0gPSAoaXRlbXNDb250YWluZXIsIGl0ZW0pID0+IHtcbi8vICAgaXRlbXNDb250YWluZXIuYXBwZW5kKHMuaXRlbVRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpKTtcbi8vICAgY29uc3QgJGxhc3RJdGVtID0gaXRlbXNDb250YWluZXIubGFzdEVsZW1lbnRDaGlsZDtcbi8vICAgJGxhc3RJdGVtLnNldEF0dHJpYnV0ZShcImlkXCIsIGBpdGVtLSR7aXRlbS5pdGVtSWR9YCk7XG4vLyAgICRsYXN0SXRlbS5xdWVyeVNlbGVjdG9yKFwicFwiKS5pbm5lclRleHQgPSBpdGVtLml0ZW1OYW1lO1xuLy8gfTtcblxuLy8gLy8gRnVuY3Rpb24gZm9yIGxvYWRpbmcgZGF0YSBmcm9tIGxvY2FsU3RvcmFnZVxuLy8gY29uc3QgbG9hZEFwcERhdGEgPSAoKSA9PiB7XG4vLyAgIC8vIGkpIFNldHRpbmcgRm9jdXMgdG8gbGlzdCBGaWVsZFxuLy8gICBmdW5jLmxpc3RGaWVsZEZ1bmMoKTtcblxuLy8gICAvLyBpaSkgUmVhc3NpZ25pbmcgZGF0YSB0byB2YXJpYWJsZXNcbi8vICAgY29uc3QgW2xpc3REYXRhLCBpdGVtSWRzXSA9IFtcbi8vICAgICBmdW5jLnBhcnNlSnNvbihcImxpc3RcIiksXG4vLyAgICAgZnVuYy5wYXJzZUpzb24oXCJsaXN0SXRlbUlkc1wiKVxuLy8gICBdO1xuLy8gICBpZiAobGlzdERhdGEgJiYgbGlzdERhdGEubGlzdElkcy5sZW5ndGgpIHtcbi8vICAgICBhcHBEYXRhID0gbGlzdERhdGE7XG4vLyAgICAgbGlzdElkID0gbGlzdERhdGEubGlzdElkcy5hdCgtMSkgKyAxO1xuLy8gICB9XG4vLyAgIGlmIChsaXN0RGF0YSAmJiBsaXN0RGF0YS5sYXN0SXRlbUlkKSB7XG4vLyAgICAgbGlzdEl0ZW1JZHMgPSBuZXcgTWFwKE9iamVjdC5lbnRyaWVzKGl0ZW1JZHMpKTtcbi8vICAgICBpdGVtSWQgPSBsaXN0RGF0YS5sYXN0SXRlbUlkICsgMTtcbi8vICAgfVxuXG4vLyAgIC8vIGlpaSkgRGlzcGxheSBsaXN0cyAmIHRoZWlyIGl0ZW1zIGluIFVJXG4vLyAgIGlmIChsaXN0RGF0YSAmJiBsaXN0RGF0YS5saXN0Lmxlbmd0aCkge1xuLy8gICAgIGxpc3REYXRhLmxpc3QuZm9yRWFjaChsaXN0ID0+IHtcbi8vICAgICAgIGRpc3BsYXlMaXN0KGxpc3QpO1xuLy8gICAgICAgY29uc3QgJGl0ZW1zV3JhcHBlciA9XG4vLyAgICAgICAgIHMubGlzdENvbnRhaW5lci5sYXN0RWxlbWVudENoaWxkLnF1ZXJ5U2VsZWN0b3IoXCIuaXRlbXNfX3dyYXBwZXJcIik7XG4vLyAgICAgICBsaXN0Lml0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4vLyAgICAgICAgIGRpc3BsYXlMaXN0SXRlbSgkaXRlbXNXcmFwcGVyLCBpdGVtKTtcbi8vICAgICAgIH0pO1xuLy8gICAgIH0pO1xuLy8gICB9XG4vLyB9O1xuXG4vLyAvLyAgRnVuY3Rpb24gZm9yIENyZWF0aW5nIG5ldyBsaXN0XG4vLyBjb25zdCBjcmVhdGVMaXN0ID0gZSA9PiB7XG4vLyAgIC8vIDEpIFByZXZlbnQgRGVmYXVsdCBCZWhhdmlvclxuLy8gICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbi8vICAgLy8gMikgR2V0IHRoZSBsaXN0IG5hbWVcbi8vICAgbGV0IGxpc3ROYW1lID0gcy5saXN0RmllbGQudmFsdWUudHJpbSgpO1xuXG4vLyAgIC8vIDMpIENoZWNrIGZvciB0cnV0aHkgdmFsdWUgb2YgbGlzdE5hbWVcbi8vICAgaWYgKGxpc3ROYW1lICYmIGxpc3ROYW1lLmxlbmd0aCA8PSAyMCkge1xuLy8gICAgIC8vIGkpIE1vZGlmeSBMaXN0IE5hbWVcbi8vICAgICBsaXN0TmFtZSA9IGZ1bmMubW9kaWZ5U3RyaW5nKGxpc3ROYW1lKTtcblxuLy8gICAgIC8vIGlpaSkgU3RvcmUgbGlzdCBpbmRleCBpbiBhcHBEYXRhLmxpc3RJZHMgYXJyYXlcbi8vICAgICBhcHBEYXRhLmxpc3RJZHMucHVzaChsaXN0SWQpO1xuXG4vLyAgICAgLy8gaWkpIFN0b3JlIGxpc3QgaW4gbG9jYWwgU3RvcmFnZSAmIGFsc28gaW4gYXBwRGF0YS5saXN0IGFycmF5XG4vLyAgICAgYXBwRGF0YS5saXN0LnB1c2goeyBsaXN0SWQsIGxpc3ROYW1lLCBpdGVtczogW10gfSk7XG4vLyAgICAgZnVuYy5zdG9yZUpzb24oXCJsaXN0XCIsIGFwcERhdGEpO1xuXG4vLyAgICAgLy8gaWlpKSBFbXB0eSBpbnB1dCBmaWVsZFxuLy8gICAgIGZ1bmMubGlzdEZpZWxkRnVuYygpO1xuXG4vLyAgICAgLy8gaXYpIERpc3BsYXkgTGlzdCBpbiBVSVxuLy8gICAgIGRpc3BsYXlMaXN0KHsgbGlzdElkLCBsaXN0TmFtZSB9KTtcblxuLy8gICAgIC8vIHYpIEluY3JlYXNlIGxpc3RJZCBieSAxXG4vLyAgICAgbGlzdElkKys7XG4vLyAgIH1cbi8vIH07XG5cbi8vIC8vIEZ1bmN0aW9uIGZvciBEZWxldGluZyBsaXN0XG4vLyBjb25zdCBkZWxldGVMaXN0ID0gKCkgPT4ge1xuLy8gICAvLyBpKSBHZXQgdGhlIGxpc3RJZFxuLy8gICBjb25zdCBsaXN0SWQgPSArbGlzdFRvRGVsZXRlLmlkLnNwbGl0KFwiLVwiKVsxXTtcblxuLy8gICAvLyBpaSkgRmluZCBJbmRleCBvZiB0aGUgbGlzdFxuLy8gICBjb25zdCBsaXN0SW5kZXggPSBhcHBEYXRhLmxpc3RJZHMuaW5kZXhPZihsaXN0SWQpO1xuXG4vLyAgIC8vIGlpaSkgUmVtb3ZlIGxpc3RJZCwgbGlzdEl0ZW1zIElkcyAmIGxpc3QgZnJvbSBhcHBEYXRhIE9iamVjdFxuLy8gICBhcHBEYXRhLmxpc3RJZHMuc3BsaWNlKGxpc3RJbmRleCwgMSk7XG4vLyAgIGxpc3RJdGVtSWRzLmRlbGV0ZShTdHJpbmcobGlzdElkKSk7XG4vLyAgIGFwcERhdGEubGlzdC5zcGxpY2UobGlzdEluZGV4LCAxKTtcblxuLy8gICAvLyBpdikgVXBkYXRlIGxvY2FsU3RvcmFnZVxuLy8gICBmdW5jLnN0b3JlSnNvbihcImxpc3RcIiwgYXBwRGF0YSk7XG4vLyAgIGZ1bmMuc3RvcmVKc29uKFwibGlzdEl0ZW1JZHNcIiwgT2JqZWN0LmZyb21FbnRyaWVzKGxpc3RJdGVtSWRzKSk7XG5cbi8vICAgLy8gdikgVXBkYXRlIFVJXG4vLyAgIGxpc3RUb0RlbGV0ZS5yZW1vdmUoKTtcblxuLy8gICAvLyB2aSkgSGlkZSBkaWFsb2cgYm94XG4vLyAgIHMuZGlhbG9nQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJkaWFsb2ctdmlzaWJsZVwiKTtcbi8vIH07XG5cbi8vIC8vIEZ1bmN0aW9uIGZvciBhZGRpbmcgbmV3IGl0ZW1cbi8vIGNvbnN0IGFkZE5ld0l0ZW0gPSAoZSwgaXRlbU5hbWUpID0+IHtcbi8vICAgY29uc3QgJGl0ZW1JbnB1dEZpZWxkID0gZS50YXJnZXQucHJldmlvdXNFbGVtZW50U2libGluZztcblxuLy8gICAvLyBpKSBNb2RpZnkgaXRlbU5hbWVcbi8vICAgaXRlbU5hbWUgPSBmdW5jLm1vZGlmeVN0cmluZyhpdGVtTmFtZSk7XG5cbi8vICAgLy8gaWkpICBHZXQgbGlzdCBpZFxuLy8gICBjb25zdCBpdGVtc0xpc3RJZCA9IGUudGFyZ2V0LmNsb3Nlc3QoXCIubGlzdFwiKS5pZC5zcGxpdChcIi1cIilbMV07XG5cbi8vICAgLy8gaWlpKSBTdG9yZSBpdGVtSWQgaW4gbGlzdEl0ZW1JZHMgbWFwICYgaW4gbG9jYWxTdG9yYWdlXG4vLyAgIGxpc3RJdGVtSWRzLmhhcyhpdGVtc0xpc3RJZClcbi8vICAgICA/IGxpc3RJdGVtSWRzLmdldChpdGVtc0xpc3RJZCkucHVzaChpdGVtSWQpXG4vLyAgICAgOiBsaXN0SXRlbUlkcy5zZXQoaXRlbXNMaXN0SWQsIFtdKS5nZXQoaXRlbXNMaXN0SWQpLnB1c2goaXRlbUlkKTtcblxuLy8gICBmdW5jLnN0b3JlSnNvbihcImxpc3RJdGVtSWRzXCIsIE9iamVjdC5mcm9tRW50cmllcyhsaXN0SXRlbUlkcykpO1xuXG4vLyAgIC8vIGl2KSBTdG9yZSBpdGVtIGluIGxvY2FsU3RvcmFnZSAmIGFwcERhdGEubGlzdCBhcnJheSBib3RoXG4vLyAgIGNvbnN0IGxpc3RJbmRleCA9IGFwcERhdGEubGlzdElkcy5pbmRleE9mKCtpdGVtc0xpc3RJZCk7XG4vLyAgIGFwcERhdGEubGlzdFtsaXN0SW5kZXhdLml0ZW1zLnB1c2goeyBpdGVtSWQsIGl0ZW1OYW1lIH0pO1xuLy8gICBhcHBEYXRhLmxhc3RJdGVtSWQgPSBpdGVtSWQ7XG4vLyAgIGZ1bmMuc3RvcmVKc29uKFwibGlzdFwiLCBhcHBEYXRhKTtcblxuLy8gICAvLyB2KSBFbXB0eSBpdGVtIElucHV0IEZpZWxkICYgc2V0IHRoZSBmb2N1c1xuLy8gICAkaXRlbUlucHV0RmllbGQudmFsdWUgPSBcIlwiO1xuLy8gICAkaXRlbUlucHV0RmllbGQuZm9jdXMoKTtcblxuLy8gICAvLyB2aSkgRGlzcGxheSBpdGVtIGluIFVJXG4vLyAgIGNvbnN0ICRpdGVtc0NvbnRhaW5lciA9IGUudGFyZ2V0LmNsb3Nlc3QoXCIuaXRlbV9fZm9ybVwiKS5uZXh0RWxlbWVudFNpYmxpbmc7XG4vLyAgIGRpc3BsYXlMaXN0SXRlbSgkaXRlbXNDb250YWluZXIsIHsgaXRlbUlkLCBpdGVtTmFtZSB9KTtcblxuLy8gICAvLyB2aWkpIEluY3JlYXNlIGl0ZW0gaWQgYnkgMVxuLy8gICBpdGVtSWQrKztcbi8vIH07XG4iXSwibmFtZXMiOlsic2VsZWN0b3JzIiwibGlzdEZpZWxkIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwibGlzdFN1Ym1pdEJ0biIsImRpYWxvZ0NvbnRhaW5lciIsImxpc3RDb250YWluZXIiLCJsaXN0VGVtcGxhdGUiLCJpdGVtVGVtcGxhdGUiLCJzIiwibGlzdElkIiwiaXRlbUlkIiwiYXBwRGF0YSIsImxpc3QiLCJsaXN0SWRzIiwibGFzdEl0ZW1JZCIsImxpc3RJdGVtSWRzIiwiTWFwIiwibW9kaWZ5U3RyaW5nIiwic3RyIiwidG9VcHBlckNhc2UiLCJzbGljZSIsInRvTG93ZXJDYXNlIiwibGlzdEZpZWxkRnVuYyIsInZhbHVlIiwiZm9jdXMiLCJzdG9yZUpzb24iLCJrZXkiLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiSlNPTiIsInN0cmluZ2lmeSIsInBhcnNlSnNvbiIsImRhdGEiLCJwYXJzZSIsImdldEl0ZW0iLCJkaXNwbGF5TGlzdCIsImFwcGVuZCIsImNvbnRlbnQiLCJjbG9uZU5vZGUiLCIkbGFzdExpc3QiLCJsYXN0RWxlbWVudENoaWxkIiwic2V0QXR0cmlidXRlIiwiaW5uZXJUZXh0IiwibGlzdE5hbWUiLCJkaXNwbGF5TGlzdEl0ZW0iLCJpdGVtc0NvbnRhaW5lciIsIml0ZW0iLCIkbGFzdEl0ZW0iLCJpdGVtTmFtZSIsImxvYWRBcHBEYXRhIiwibGlzdERhdGEiLCJpdGVtSWRzIiwibGVuZ3RoIiwiYXQiLCJPYmplY3QiLCJlbnRyaWVzIiwiZm9yRWFjaCIsIiRpdGVtc1dyYXBwZXIiLCJpdGVtcyIsImNyZWF0ZUxpc3QiLCJlIiwicHJldmVudERlZmF1bHQiLCJ0cmltIiwicHVzaCIsImRlbGV0ZUxpc3QiLCJsaXN0VG9EZWxldGUiLCJpZCIsInNwbGl0IiwibGlzdEluZGV4IiwiaW5kZXhPZiIsInNwbGljZSIsIlN0cmluZyIsImZyb21FbnRyaWVzIiwicmVtb3ZlIiwiY2xhc3NMaXN0IiwiYWRkTmV3SXRlbSIsIiRpdGVtSW5wdXRGaWVsZCIsInRhcmdldCIsInByZXZpb3VzRWxlbWVudFNpYmxpbmciLCJpdGVtc0xpc3RJZCIsImNsb3Nlc3QiLCJoYXMiLCJnZXQiLCJzZXQiLCIkaXRlbXNDb250YWluZXIiLCJuZXh0RWxlbWVudFNpYmxpbmciLCJkZWxldGVJdGVtIiwiY3VyTGlzdElkIiwiY3VySXRlbUlkIiwiaXRlbUluZGV4IiwiZnVuYyIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJtYXRjaGVzIiwiYWRkIiwidGV4dENvbnRlbnQiXSwic291cmNlUm9vdCI6IiJ9