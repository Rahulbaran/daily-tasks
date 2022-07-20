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
    var curListId = +e.target.closest(".list").id.split("-")[1];
    var curItemId = +e.target.closest(".item").id.split("-")[1];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFULENBQWlCLE9BQWpCLEVBQTBCZCxFQUExQixDQUE2QkMsS0FBN0IsQ0FBbUMsR0FBbkMsRUFBd0MsQ0FBeEMsQ0FBbkI7RUFDRDtBQUNGLENBakJEO0FBbUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBLEsiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9qcy9zZWxlY3RvcnMuanMiLCJ3ZWJwYWNrOi8vLy4vanMvZnVuY3Rpb25zLmpzIiwid2VicGFjazovLy8uL2pzL21haW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IHNlbGVjdG9ycyA9IHtcbiAgbGlzdEZpZWxkOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxpc3RfX2Zvcm0gaW5wdXRcIiksXG4gIGxpc3RTdWJtaXRCdG46IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubGlzdF9fZm9ybSBidXR0b25cIiksXG4gIGRpYWxvZ0NvbnRhaW5lcjogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kaWFsb2ctLWNvbnRhaW5lclwiKSxcbiAgbGlzdENvbnRhaW5lcjogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5saXN0LS1jb250YWluZXJcIiksXG4gIGxpc3RUZW1wbGF0ZTogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5saXN0X190ZW1wbGF0ZVwiKSxcbiAgaXRlbVRlbXBsYXRlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLml0ZW1fX3RlbXBsYXRlXCIpXG59O1xuIiwiaW1wb3J0IHsgc2VsZWN0b3JzIGFzIHMgfSBmcm9tIFwiLi9zZWxlY3RvcnNcIjtcblxubGV0IFtsaXN0SWQsIGl0ZW1JZF0gPSBbMCwgMF07XG5sZXQgYXBwRGF0YSA9IHtcbiAgbGlzdDogW10sXG4gIGxpc3RJZHM6IFtdLFxuICBsYXN0SXRlbUlkOiAwXG59O1xubGV0IGxpc3RJdGVtSWRzID0gbmV3IE1hcCgpO1xuXG4vLyBGdW5jdGlvbiBmb3IgbW9kaWZ5aW5nIFN0cmluZ1xuZXhwb3J0IGNvbnN0IG1vZGlmeVN0cmluZyA9IHN0ciA9PlxuICBzdHJbMF0udG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xuXG4vLyBGdW5jdGlvbiBmb3Igc2V0dGluZyBmb2N1cyB0byBsaXN0IGZpZWxkXG5leHBvcnQgY29uc3QgbGlzdEZpZWxkRnVuYyA9ICgpID0+IHtcbiAgcy5saXN0RmllbGQudmFsdWUgPSBcIlwiO1xuICBzLmxpc3RGaWVsZC5mb2N1cygpO1xufTtcblxuLy8gRnVuY3Rpb24gZm9yIHN0b3JpbmcgSlNPTiBEYXRhIGluIGxvY2FsU3RvcmFnZVxuZXhwb3J0IGNvbnN0IHN0b3JlSnNvbiA9IChrZXksIHZhbHVlKSA9PlxuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XG5cbi8vIEZ1bmN0aW9uIGZvciBwYXJzaW5nIEpTT04gRGF0YSByZXRyaWV2ZWQgZnJvbSBsb2NhbFN0b3JhZ2VcbmV4cG9ydCBjb25zdCBwYXJzZUpzb24gPSBkYXRhID0+IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oZGF0YSkpO1xuXG4vLyAgRnVuY3Rpb24gZm9yIGRpc3BsYXlpbmcgbGlzdFxuZXhwb3J0IGNvbnN0IGRpc3BsYXlMaXN0ID0gbGlzdCA9PiB7XG4gIHMubGlzdENvbnRhaW5lci5hcHBlbmQocy5saXN0VGVtcGxhdGUuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkpO1xuICBjb25zdCAkbGFzdExpc3QgPSBzLmxpc3RDb250YWluZXIubGFzdEVsZW1lbnRDaGlsZDtcbiAgJGxhc3RMaXN0LnNldEF0dHJpYnV0ZShcImlkXCIsIGBsaXN0LSR7bGlzdC5saXN0SWR9YCk7XG4gICRsYXN0TGlzdC5xdWVyeVNlbGVjdG9yKFwiaDJcIikuaW5uZXJUZXh0ID0gbGlzdC5saXN0TmFtZTtcbn07XG5cbi8vICBGdW5jdGlvbiBmb3IgZGlzcGxheWluZyBsaXN0J3MgaXRlbVxuY29uc3QgZGlzcGxheUxpc3RJdGVtID0gKGl0ZW1zQ29udGFpbmVyLCBpdGVtKSA9PiB7XG4gIGl0ZW1zQ29udGFpbmVyLmFwcGVuZChzLml0ZW1UZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gIGNvbnN0ICRsYXN0SXRlbSA9IGl0ZW1zQ29udGFpbmVyLmxhc3RFbGVtZW50Q2hpbGQ7XG4gICRsYXN0SXRlbS5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBgaXRlbS0ke2l0ZW0uaXRlbUlkfWApO1xuICAkbGFzdEl0ZW0ucXVlcnlTZWxlY3RvcihcInBcIikuaW5uZXJUZXh0ID0gaXRlbS5pdGVtTmFtZTtcbn07XG5cbi8vIEZ1bmN0aW9uIGZvciBsb2FkaW5nIGRhdGEgZnJvbSBsb2NhbFN0b3JhZ2VcbmV4cG9ydCBjb25zdCBsb2FkQXBwRGF0YSA9ICgpID0+IHtcbiAgLy8gaSkgU2V0dGluZyBGb2N1cyB0byBsaXN0IEZpZWxkXG4gIGxpc3RGaWVsZEZ1bmMoKTtcblxuICAvLyBpaSkgUmVhc3NpZ25pbmcgZGF0YSB0byB2YXJpYWJsZXNcbiAgY29uc3QgW2xpc3REYXRhLCBpdGVtSWRzXSA9IFtwYXJzZUpzb24oXCJsaXN0XCIpLCBwYXJzZUpzb24oXCJsaXN0SXRlbUlkc1wiKV07XG4gIGlmIChsaXN0RGF0YSAmJiBsaXN0RGF0YS5saXN0SWRzLmxlbmd0aCkge1xuICAgIGFwcERhdGEgPSBsaXN0RGF0YTtcbiAgICBsaXN0SWQgPSBsaXN0RGF0YS5saXN0SWRzLmF0KC0xKSArIDE7XG4gIH1cbiAgaWYgKGxpc3REYXRhICYmIGxpc3REYXRhLmxhc3RJdGVtSWQpIHtcbiAgICBsaXN0SXRlbUlkcyA9IG5ldyBNYXAoT2JqZWN0LmVudHJpZXMoaXRlbUlkcykpO1xuICAgIGl0ZW1JZCA9IGxpc3REYXRhLmxhc3RJdGVtSWQgKyAxO1xuICB9XG5cbiAgLy8gaWlpKSBEaXNwbGF5IGxpc3RzICYgdGhlaXIgaXRlbXMgaW4gVUlcbiAgaWYgKGxpc3REYXRhICYmIGxpc3REYXRhLmxpc3QubGVuZ3RoKSB7XG4gICAgbGlzdERhdGEubGlzdC5mb3JFYWNoKGxpc3QgPT4ge1xuICAgICAgZGlzcGxheUxpc3QobGlzdCk7XG4gICAgICBjb25zdCAkaXRlbXNXcmFwcGVyID1cbiAgICAgICAgcy5saXN0Q29udGFpbmVyLmxhc3RFbGVtZW50Q2hpbGQucXVlcnlTZWxlY3RvcihcIi5pdGVtc19fd3JhcHBlclwiKTtcbiAgICAgIGxpc3QuaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgZGlzcGxheUxpc3RJdGVtKCRpdGVtc1dyYXBwZXIsIGl0ZW0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn07XG5cbi8vIEZ1bmN0aW9uIGZvciBDcmVhdGluZyBuZXcgbGlzdFxuZXhwb3J0IGNvbnN0IGNyZWF0ZUxpc3QgPSBlID0+IHtcbiAgLy8gMSkgUHJldmVudCBEZWZhdWx0IEJlaGF2aW9yXG4gIGUucHJldmVudERlZmF1bHQoKTtcblxuICAvLyAyKSBHZXQgdGhlIGxpc3QgbmFtZVxuICBsZXQgbGlzdE5hbWUgPSBzLmxpc3RGaWVsZC52YWx1ZS50cmltKCk7XG5cbiAgLy8gMykgQ2hlY2sgZm9yIHRydXRoeSB2YWx1ZSBvZiBsaXN0TmFtZVxuICBpZiAobGlzdE5hbWUgJiYgbGlzdE5hbWUubGVuZ3RoIDw9IDIwKSB7XG4gICAgLy8gaSkgTW9kaWZ5IExpc3QgTmFtZVxuICAgIGxpc3ROYW1lID0gbW9kaWZ5U3RyaW5nKGxpc3ROYW1lKTtcblxuICAgIC8vIGlpaSkgU3RvcmUgbGlzdCBpbmRleCBpbiBhcHBEYXRhLmxpc3RJZHMgYXJyYXlcbiAgICBhcHBEYXRhLmxpc3RJZHMucHVzaChsaXN0SWQpO1xuXG4gICAgLy8gaWkpIFN0b3JlIGxpc3QgaW4gbG9jYWwgU3RvcmFnZSAmIGFsc28gaW4gYXBwRGF0YS5saXN0IGFycmF5XG4gICAgYXBwRGF0YS5saXN0LnB1c2goeyBsaXN0SWQsIGxpc3ROYW1lLCBpdGVtczogW10gfSk7XG4gICAgc3RvcmVKc29uKFwibGlzdFwiLCBhcHBEYXRhKTtcblxuICAgIC8vIGlpaSkgRW1wdHkgaW5wdXQgZmllbGRcbiAgICBsaXN0RmllbGRGdW5jKCk7XG5cbiAgICAvLyBpdikgRGlzcGxheSBMaXN0IGluIFVJXG4gICAgZGlzcGxheUxpc3QoeyBsaXN0SWQsIGxpc3ROYW1lIH0pO1xuXG4gICAgLy8gdikgSW5jcmVhc2UgbGlzdElkIGJ5IDFcbiAgICBsaXN0SWQrKztcbiAgfVxufTtcblxuLy8gRnVuY3Rpb24gZm9yIERlbGV0aW5nIGxpc3RcbmV4cG9ydCBjb25zdCBkZWxldGVMaXN0ID0gbGlzdFRvRGVsZXRlID0+IHtcbiAgLy8gaSkgR2V0IHRoZSBsaXN0SWRcbiAgY29uc3QgbGlzdElkID0gK2xpc3RUb0RlbGV0ZS5pZC5zcGxpdChcIi1cIilbMV07XG5cbiAgLy8gaWkpIEZpbmQgSW5kZXggb2YgdGhlIGxpc3RcbiAgY29uc3QgbGlzdEluZGV4ID0gYXBwRGF0YS5saXN0SWRzLmluZGV4T2YobGlzdElkKTtcblxuICAvLyBpaWkpIFJlbW92ZSBsaXN0SWQsIGxpc3RJdGVtcyBJZHMgJiBsaXN0IGZyb20gYXBwRGF0YSBPYmplY3RcbiAgYXBwRGF0YS5saXN0SWRzLnNwbGljZShsaXN0SW5kZXgsIDEpO1xuICBsaXN0SXRlbUlkcy5kZWxldGUoU3RyaW5nKGxpc3RJZCkpO1xuICBhcHBEYXRhLmxpc3Quc3BsaWNlKGxpc3RJbmRleCwgMSk7XG5cbiAgLy8gaXYpIFVwZGF0ZSBsb2NhbFN0b3JhZ2VcbiAgc3RvcmVKc29uKFwibGlzdFwiLCBhcHBEYXRhKTtcbiAgc3RvcmVKc29uKFwibGlzdEl0ZW1JZHNcIiwgT2JqZWN0LmZyb21FbnRyaWVzKGxpc3RJdGVtSWRzKSk7XG5cbiAgLy8gdikgVXBkYXRlIFVJXG4gIGxpc3RUb0RlbGV0ZS5yZW1vdmUoKTtcblxuICAvLyB2aSkgSGlkZSBkaWFsb2cgYm94XG4gIHMuZGlhbG9nQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJkaWFsb2ctdmlzaWJsZVwiKTtcbn07XG5cbi8vIEZ1bmN0aW9uIGZvciBhZGRpbmcgbmV3IGl0ZW1cbmV4cG9ydCBjb25zdCBhZGROZXdJdGVtID0gKGUsIGl0ZW1OYW1lKSA9PiB7XG4gIGNvbnN0ICRpdGVtSW5wdXRGaWVsZCA9IGUudGFyZ2V0LnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG5cbiAgLy8gaSkgTW9kaWZ5IGl0ZW1OYW1lXG4gIGl0ZW1OYW1lID0gbW9kaWZ5U3RyaW5nKGl0ZW1OYW1lKTtcblxuICAvLyBpaSkgIEdldCBsaXN0IGlkXG4gIGNvbnN0IGl0ZW1zTGlzdElkID0gZS50YXJnZXQuY2xvc2VzdChcIi5saXN0XCIpLmlkLnNwbGl0KFwiLVwiKVsxXTtcblxuICAvLyBpaWkpIFN0b3JlIGl0ZW1JZCBpbiBsaXN0SXRlbUlkcyBtYXAgJiBpbiBsb2NhbFN0b3JhZ2VcbiAgbGlzdEl0ZW1JZHMuaGFzKGl0ZW1zTGlzdElkKVxuICAgID8gbGlzdEl0ZW1JZHMuZ2V0KGl0ZW1zTGlzdElkKS5wdXNoKGl0ZW1JZClcbiAgICA6IGxpc3RJdGVtSWRzLnNldChpdGVtc0xpc3RJZCwgW10pLmdldChpdGVtc0xpc3RJZCkucHVzaChpdGVtSWQpO1xuXG4gIHN0b3JlSnNvbihcImxpc3RJdGVtSWRzXCIsIE9iamVjdC5mcm9tRW50cmllcyhsaXN0SXRlbUlkcykpO1xuXG4gIC8vIGl2KSBTdG9yZSBpdGVtIGluIGxvY2FsU3RvcmFnZSAmIGFwcERhdGEubGlzdCBhcnJheSBib3RoXG4gIGNvbnN0IGxpc3RJbmRleCA9IGFwcERhdGEubGlzdElkcy5pbmRleE9mKCtpdGVtc0xpc3RJZCk7XG4gIGFwcERhdGEubGlzdFtsaXN0SW5kZXhdLml0ZW1zLnB1c2goeyBpdGVtSWQsIGl0ZW1OYW1lIH0pO1xuICBhcHBEYXRhLmxhc3RJdGVtSWQgPSBpdGVtSWQ7XG4gIHN0b3JlSnNvbihcImxpc3RcIiwgYXBwRGF0YSk7XG5cbiAgLy8gdikgRW1wdHkgaXRlbSBJbnB1dCBGaWVsZCAmIHNldCB0aGUgZm9jdXNcbiAgJGl0ZW1JbnB1dEZpZWxkLnZhbHVlID0gXCJcIjtcbiAgJGl0ZW1JbnB1dEZpZWxkLmZvY3VzKCk7XG5cbiAgLy8gdmkpIERpc3BsYXkgaXRlbSBpbiBVSVxuICBjb25zdCAkaXRlbXNDb250YWluZXIgPSBlLnRhcmdldC5jbG9zZXN0KFwiLml0ZW1fX2Zvcm1cIikubmV4dEVsZW1lbnRTaWJsaW5nO1xuICBkaXNwbGF5TGlzdEl0ZW0oJGl0ZW1zQ29udGFpbmVyLCB7IGl0ZW1JZCwgaXRlbU5hbWUgfSk7XG5cbiAgLy8gdmlpKSBJbmNyZWFzZSBpdGVtIGlkIGJ5IDFcbiAgaXRlbUlkKys7XG59O1xuIiwiaW1wb3J0IFwiLi4vc2Nzcy9tYWluLnNjc3NcIjtcbmltcG9ydCB7IHNlbGVjdG9ycyBhcyBzIH0gZnJvbSBcIi4vc2VsZWN0b3JzXCI7XG5pbXBvcnQgKiBhcyBmdW5jIGZyb20gXCIuL2Z1bmN0aW9uc1wiO1xuXG4vKi0tLS0tLS0tLS0tLS0gRGlzcGxheWluZyBsaXN0IERhdGEgZnJvbSBsb2NhbFN0b3JhZ2Ugb24gd2luZG93IGxvYWRpbmcgLS0tLS0tLS0tLS0tLSovXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuYy5sb2FkQXBwRGF0YSk7XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gRXZlbnQgSGFuZGxlciBmb3IgbGlzdCBpbnB1dCBidXR0b24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbnMubGlzdFN1Ym1pdEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuYy5jcmVhdGVMaXN0KTtcblxuLyotLS0tLS0tLS0tLSBFdmVudEhhbmRsZXIgZm9yIExpc3QgQ29udGFpbmVyIFdoZW4gZGVsZXRlIGljb24gaXMgY2xpY2tlZCAtLS0tLS0tLS0tLSovXG5sZXQgbGlzdFRvRGVsZXRlO1xucy5saXN0Q29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcbiAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoXCIuYngtdHJhc2hcIikpIHtcbiAgICBzLmRpYWxvZ0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiZGlhbG9nLXZpc2libGVcIik7XG4gICAgcy5kaWFsb2dDb250YWluZXIucXVlcnlTZWxlY3RvcihcInAgc3Ryb25nXCIpLnRleHRDb250ZW50ID0gZS50YXJnZXRcbiAgICAgIC5jbG9zZXN0KFwiLmxpc3RcIilcbiAgICAgIC5xdWVyeVNlbGVjdG9yKFwiaDJcIikudGV4dENvbnRlbnQ7XG5cbiAgICBsaXN0VG9EZWxldGUgPSBlLnRhcmdldC5jbG9zZXN0KFwiLmxpc3RcIik7XG4gIH1cbn0pO1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEV2ZW50IEhhbmRsZXIgZm9yIERlbGV0ZSBCdXR0b24gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xucy5kaWFsb2dDb250YWluZXJcbiAgLnF1ZXJ5U2VsZWN0b3IoXCIuYnRuX19kZWxldGVcIilcbiAgLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBmdW5jLmRlbGV0ZUxpc3QobGlzdFRvRGVsZXRlKSk7XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gIEV2ZW50IEhhbmRsZXIgZm9yIENhbmNlbCBCdXR0b24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbnMuZGlhbG9nQ29udGFpbmVyXG4gIC5xdWVyeVNlbGVjdG9yKFwiLmJ0bl9fY2FuY2VsXCIpXG4gIC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIHMuZGlhbG9nQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJkaWFsb2ctdmlzaWJsZVwiKTtcbiAgfSk7XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEV2ZW50SGFuZGxlciBmb3IgTGlzdCBDb250YWluZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbnMubGlzdENvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XG4gIGxldCBpdGVtTmFtZSA9IGUudGFyZ2V0LnByZXZpb3VzRWxlbWVudFNpYmxpbmc/LnZhbHVlPy50cmltKCk7XG5cbiAgLy8gQ2hlY2sgaWYgaXRlbSBhZGQgYnV0dG9uIGlzIGNsaWNrZWQgJiBpdGVtTmFtZSBpcyB0cnV0aHlcbiAgaWYgKFxuICAgIGUudGFyZ2V0Lm1hdGNoZXMoXCIuYnRuX19pdGVtLS1hZGRcIikgJiZcbiAgICBpdGVtTmFtZSAmJlxuICAgIGl0ZW1OYW1lLmxlbmd0aCA8PSAzMFxuICApIHtcbiAgICBmdW5jLmFkZE5ld0l0ZW0oZSwgaXRlbU5hbWUpO1xuICB9XG5cbiAgLy8gQ2hlY2sgaWYgaXRlbSBkZWxldGUgaWNvbiBpcyBjbGlja2VkXG4gIGVsc2UgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoXCIuYngtbWludXMtY2lyY2xlXCIpKSB7XG4gICAgY29uc3QgY3VyTGlzdElkID0gK2UudGFyZ2V0LmNsb3Nlc3QoXCIubGlzdFwiKS5pZC5zcGxpdChcIi1cIilbMV07XG4gICAgY29uc3QgY3VySXRlbUlkID0gK2UudGFyZ2V0LmNsb3Nlc3QoXCIuaXRlbVwiKS5pZC5zcGxpdChcIi1cIilbMV07XG4gIH1cbn0pO1xuXG4vKiBNaWdodCBiZSBvZiB1c2UgaW4gZnV0dXJlLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbi8vIGxldCBbbGlzdElkLCBpdGVtSWRdID0gWzAsIDBdO1xuLy8gbGV0IGFwcERhdGEgPSB7XG4vLyAgIGxpc3Q6IFtdLFxuLy8gICBsaXN0SWRzOiBbXSxcbi8vICAgbGFzdEl0ZW1JZDogMFxuLy8gfTtcbi8vIGxldCBsaXN0SXRlbUlkcyA9IG5ldyBNYXAoKTtcblxuLy8gLy8gRnVuY3Rpb24gZm9yIGRpc3BsYXlpbmcgbGlzdFxuLy8gY29uc3QgZGlzcGxheUxpc3QgPSBsaXN0ID0+IHtcbi8vICAgcy5saXN0Q29udGFpbmVyLmFwcGVuZChzLmxpc3RUZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSk7XG4vLyAgIGNvbnN0ICRsYXN0TGlzdCA9IHMubGlzdENvbnRhaW5lci5sYXN0RWxlbWVudENoaWxkO1xuLy8gICAkbGFzdExpc3Quc2V0QXR0cmlidXRlKFwiaWRcIiwgYGxpc3QtJHtsaXN0Lmxpc3RJZH1gKTtcbi8vICAgJGxhc3RMaXN0LnF1ZXJ5U2VsZWN0b3IoXCJoMlwiKS5pbm5lclRleHQgPSBsaXN0Lmxpc3ROYW1lO1xuLy8gfTtcblxuLy8gLy8gIEZ1bmN0aW9uIGZvciBkaXNwbGF5aW5nIGxpc3QncyBpdGVtXG4vLyBjb25zdCBkaXNwbGF5TGlzdEl0ZW0gPSAoaXRlbXNDb250YWluZXIsIGl0ZW0pID0+IHtcbi8vICAgaXRlbXNDb250YWluZXIuYXBwZW5kKHMuaXRlbVRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpKTtcbi8vICAgY29uc3QgJGxhc3RJdGVtID0gaXRlbXNDb250YWluZXIubGFzdEVsZW1lbnRDaGlsZDtcbi8vICAgJGxhc3RJdGVtLnNldEF0dHJpYnV0ZShcImlkXCIsIGBpdGVtLSR7aXRlbS5pdGVtSWR9YCk7XG4vLyAgICRsYXN0SXRlbS5xdWVyeVNlbGVjdG9yKFwicFwiKS5pbm5lclRleHQgPSBpdGVtLml0ZW1OYW1lO1xuLy8gfTtcblxuLy8gLy8gRnVuY3Rpb24gZm9yIGxvYWRpbmcgZGF0YSBmcm9tIGxvY2FsU3RvcmFnZVxuLy8gY29uc3QgbG9hZEFwcERhdGEgPSAoKSA9PiB7XG4vLyAgIC8vIGkpIFNldHRpbmcgRm9jdXMgdG8gbGlzdCBGaWVsZFxuLy8gICBmdW5jLmxpc3RGaWVsZEZ1bmMoKTtcblxuLy8gICAvLyBpaSkgUmVhc3NpZ25pbmcgZGF0YSB0byB2YXJpYWJsZXNcbi8vICAgY29uc3QgW2xpc3REYXRhLCBpdGVtSWRzXSA9IFtcbi8vICAgICBmdW5jLnBhcnNlSnNvbihcImxpc3RcIiksXG4vLyAgICAgZnVuYy5wYXJzZUpzb24oXCJsaXN0SXRlbUlkc1wiKVxuLy8gICBdO1xuLy8gICBpZiAobGlzdERhdGEgJiYgbGlzdERhdGEubGlzdElkcy5sZW5ndGgpIHtcbi8vICAgICBhcHBEYXRhID0gbGlzdERhdGE7XG4vLyAgICAgbGlzdElkID0gbGlzdERhdGEubGlzdElkcy5hdCgtMSkgKyAxO1xuLy8gICB9XG4vLyAgIGlmIChsaXN0RGF0YSAmJiBsaXN0RGF0YS5sYXN0SXRlbUlkKSB7XG4vLyAgICAgbGlzdEl0ZW1JZHMgPSBuZXcgTWFwKE9iamVjdC5lbnRyaWVzKGl0ZW1JZHMpKTtcbi8vICAgICBpdGVtSWQgPSBsaXN0RGF0YS5sYXN0SXRlbUlkICsgMTtcbi8vICAgfVxuXG4vLyAgIC8vIGlpaSkgRGlzcGxheSBsaXN0cyAmIHRoZWlyIGl0ZW1zIGluIFVJXG4vLyAgIGlmIChsaXN0RGF0YSAmJiBsaXN0RGF0YS5saXN0Lmxlbmd0aCkge1xuLy8gICAgIGxpc3REYXRhLmxpc3QuZm9yRWFjaChsaXN0ID0+IHtcbi8vICAgICAgIGRpc3BsYXlMaXN0KGxpc3QpO1xuLy8gICAgICAgY29uc3QgJGl0ZW1zV3JhcHBlciA9XG4vLyAgICAgICAgIHMubGlzdENvbnRhaW5lci5sYXN0RWxlbWVudENoaWxkLnF1ZXJ5U2VsZWN0b3IoXCIuaXRlbXNfX3dyYXBwZXJcIik7XG4vLyAgICAgICBsaXN0Lml0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4vLyAgICAgICAgIGRpc3BsYXlMaXN0SXRlbSgkaXRlbXNXcmFwcGVyLCBpdGVtKTtcbi8vICAgICAgIH0pO1xuLy8gICAgIH0pO1xuLy8gICB9XG4vLyB9O1xuXG4vLyAvLyAgRnVuY3Rpb24gZm9yIENyZWF0aW5nIG5ldyBsaXN0XG4vLyBjb25zdCBjcmVhdGVMaXN0ID0gZSA9PiB7XG4vLyAgIC8vIDEpIFByZXZlbnQgRGVmYXVsdCBCZWhhdmlvclxuLy8gICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbi8vICAgLy8gMikgR2V0IHRoZSBsaXN0IG5hbWVcbi8vICAgbGV0IGxpc3ROYW1lID0gcy5saXN0RmllbGQudmFsdWUudHJpbSgpO1xuXG4vLyAgIC8vIDMpIENoZWNrIGZvciB0cnV0aHkgdmFsdWUgb2YgbGlzdE5hbWVcbi8vICAgaWYgKGxpc3ROYW1lICYmIGxpc3ROYW1lLmxlbmd0aCA8PSAyMCkge1xuLy8gICAgIC8vIGkpIE1vZGlmeSBMaXN0IE5hbWVcbi8vICAgICBsaXN0TmFtZSA9IGZ1bmMubW9kaWZ5U3RyaW5nKGxpc3ROYW1lKTtcblxuLy8gICAgIC8vIGlpaSkgU3RvcmUgbGlzdCBpbmRleCBpbiBhcHBEYXRhLmxpc3RJZHMgYXJyYXlcbi8vICAgICBhcHBEYXRhLmxpc3RJZHMucHVzaChsaXN0SWQpO1xuXG4vLyAgICAgLy8gaWkpIFN0b3JlIGxpc3QgaW4gbG9jYWwgU3RvcmFnZSAmIGFsc28gaW4gYXBwRGF0YS5saXN0IGFycmF5XG4vLyAgICAgYXBwRGF0YS5saXN0LnB1c2goeyBsaXN0SWQsIGxpc3ROYW1lLCBpdGVtczogW10gfSk7XG4vLyAgICAgZnVuYy5zdG9yZUpzb24oXCJsaXN0XCIsIGFwcERhdGEpO1xuXG4vLyAgICAgLy8gaWlpKSBFbXB0eSBpbnB1dCBmaWVsZFxuLy8gICAgIGZ1bmMubGlzdEZpZWxkRnVuYygpO1xuXG4vLyAgICAgLy8gaXYpIERpc3BsYXkgTGlzdCBpbiBVSVxuLy8gICAgIGRpc3BsYXlMaXN0KHsgbGlzdElkLCBsaXN0TmFtZSB9KTtcblxuLy8gICAgIC8vIHYpIEluY3JlYXNlIGxpc3RJZCBieSAxXG4vLyAgICAgbGlzdElkKys7XG4vLyAgIH1cbi8vIH07XG5cbi8vIC8vIEZ1bmN0aW9uIGZvciBEZWxldGluZyBsaXN0XG4vLyBjb25zdCBkZWxldGVMaXN0ID0gKCkgPT4ge1xuLy8gICAvLyBpKSBHZXQgdGhlIGxpc3RJZFxuLy8gICBjb25zdCBsaXN0SWQgPSArbGlzdFRvRGVsZXRlLmlkLnNwbGl0KFwiLVwiKVsxXTtcblxuLy8gICAvLyBpaSkgRmluZCBJbmRleCBvZiB0aGUgbGlzdFxuLy8gICBjb25zdCBsaXN0SW5kZXggPSBhcHBEYXRhLmxpc3RJZHMuaW5kZXhPZihsaXN0SWQpO1xuXG4vLyAgIC8vIGlpaSkgUmVtb3ZlIGxpc3RJZCwgbGlzdEl0ZW1zIElkcyAmIGxpc3QgZnJvbSBhcHBEYXRhIE9iamVjdFxuLy8gICBhcHBEYXRhLmxpc3RJZHMuc3BsaWNlKGxpc3RJbmRleCwgMSk7XG4vLyAgIGxpc3RJdGVtSWRzLmRlbGV0ZShTdHJpbmcobGlzdElkKSk7XG4vLyAgIGFwcERhdGEubGlzdC5zcGxpY2UobGlzdEluZGV4LCAxKTtcblxuLy8gICAvLyBpdikgVXBkYXRlIGxvY2FsU3RvcmFnZVxuLy8gICBmdW5jLnN0b3JlSnNvbihcImxpc3RcIiwgYXBwRGF0YSk7XG4vLyAgIGZ1bmMuc3RvcmVKc29uKFwibGlzdEl0ZW1JZHNcIiwgT2JqZWN0LmZyb21FbnRyaWVzKGxpc3RJdGVtSWRzKSk7XG5cbi8vICAgLy8gdikgVXBkYXRlIFVJXG4vLyAgIGxpc3RUb0RlbGV0ZS5yZW1vdmUoKTtcblxuLy8gICAvLyB2aSkgSGlkZSBkaWFsb2cgYm94XG4vLyAgIHMuZGlhbG9nQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJkaWFsb2ctdmlzaWJsZVwiKTtcbi8vIH07XG5cbi8vIC8vIEZ1bmN0aW9uIGZvciBhZGRpbmcgbmV3IGl0ZW1cbi8vIGNvbnN0IGFkZE5ld0l0ZW0gPSAoZSwgaXRlbU5hbWUpID0+IHtcbi8vICAgY29uc3QgJGl0ZW1JbnB1dEZpZWxkID0gZS50YXJnZXQucHJldmlvdXNFbGVtZW50U2libGluZztcblxuLy8gICAvLyBpKSBNb2RpZnkgaXRlbU5hbWVcbi8vICAgaXRlbU5hbWUgPSBmdW5jLm1vZGlmeVN0cmluZyhpdGVtTmFtZSk7XG5cbi8vICAgLy8gaWkpICBHZXQgbGlzdCBpZFxuLy8gICBjb25zdCBpdGVtc0xpc3RJZCA9IGUudGFyZ2V0LmNsb3Nlc3QoXCIubGlzdFwiKS5pZC5zcGxpdChcIi1cIilbMV07XG5cbi8vICAgLy8gaWlpKSBTdG9yZSBpdGVtSWQgaW4gbGlzdEl0ZW1JZHMgbWFwICYgaW4gbG9jYWxTdG9yYWdlXG4vLyAgIGxpc3RJdGVtSWRzLmhhcyhpdGVtc0xpc3RJZClcbi8vICAgICA/IGxpc3RJdGVtSWRzLmdldChpdGVtc0xpc3RJZCkucHVzaChpdGVtSWQpXG4vLyAgICAgOiBsaXN0SXRlbUlkcy5zZXQoaXRlbXNMaXN0SWQsIFtdKS5nZXQoaXRlbXNMaXN0SWQpLnB1c2goaXRlbUlkKTtcblxuLy8gICBmdW5jLnN0b3JlSnNvbihcImxpc3RJdGVtSWRzXCIsIE9iamVjdC5mcm9tRW50cmllcyhsaXN0SXRlbUlkcykpO1xuXG4vLyAgIC8vIGl2KSBTdG9yZSBpdGVtIGluIGxvY2FsU3RvcmFnZSAmIGFwcERhdGEubGlzdCBhcnJheSBib3RoXG4vLyAgIGNvbnN0IGxpc3RJbmRleCA9IGFwcERhdGEubGlzdElkcy5pbmRleE9mKCtpdGVtc0xpc3RJZCk7XG4vLyAgIGFwcERhdGEubGlzdFtsaXN0SW5kZXhdLml0ZW1zLnB1c2goeyBpdGVtSWQsIGl0ZW1OYW1lIH0pO1xuLy8gICBhcHBEYXRhLmxhc3RJdGVtSWQgPSBpdGVtSWQ7XG4vLyAgIGZ1bmMuc3RvcmVKc29uKFwibGlzdFwiLCBhcHBEYXRhKTtcblxuLy8gICAvLyB2KSBFbXB0eSBpdGVtIElucHV0IEZpZWxkICYgc2V0IHRoZSBmb2N1c1xuLy8gICAkaXRlbUlucHV0RmllbGQudmFsdWUgPSBcIlwiO1xuLy8gICAkaXRlbUlucHV0RmllbGQuZm9jdXMoKTtcblxuLy8gICAvLyB2aSkgRGlzcGxheSBpdGVtIGluIFVJXG4vLyAgIGNvbnN0ICRpdGVtc0NvbnRhaW5lciA9IGUudGFyZ2V0LmNsb3Nlc3QoXCIuaXRlbV9fZm9ybVwiKS5uZXh0RWxlbWVudFNpYmxpbmc7XG4vLyAgIGRpc3BsYXlMaXN0SXRlbSgkaXRlbXNDb250YWluZXIsIHsgaXRlbUlkLCBpdGVtTmFtZSB9KTtcblxuLy8gICAvLyB2aWkpIEluY3JlYXNlIGl0ZW0gaWQgYnkgMVxuLy8gICBpdGVtSWQrKztcbi8vIH07XG4iXSwibmFtZXMiOlsic2VsZWN0b3JzIiwibGlzdEZpZWxkIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwibGlzdFN1Ym1pdEJ0biIsImRpYWxvZ0NvbnRhaW5lciIsImxpc3RDb250YWluZXIiLCJsaXN0VGVtcGxhdGUiLCJpdGVtVGVtcGxhdGUiLCJzIiwibGlzdElkIiwiaXRlbUlkIiwiYXBwRGF0YSIsImxpc3QiLCJsaXN0SWRzIiwibGFzdEl0ZW1JZCIsImxpc3RJdGVtSWRzIiwiTWFwIiwibW9kaWZ5U3RyaW5nIiwic3RyIiwidG9VcHBlckNhc2UiLCJzbGljZSIsInRvTG93ZXJDYXNlIiwibGlzdEZpZWxkRnVuYyIsInZhbHVlIiwiZm9jdXMiLCJzdG9yZUpzb24iLCJrZXkiLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiSlNPTiIsInN0cmluZ2lmeSIsInBhcnNlSnNvbiIsImRhdGEiLCJwYXJzZSIsImdldEl0ZW0iLCJkaXNwbGF5TGlzdCIsImFwcGVuZCIsImNvbnRlbnQiLCJjbG9uZU5vZGUiLCIkbGFzdExpc3QiLCJsYXN0RWxlbWVudENoaWxkIiwic2V0QXR0cmlidXRlIiwiaW5uZXJUZXh0IiwibGlzdE5hbWUiLCJkaXNwbGF5TGlzdEl0ZW0iLCJpdGVtc0NvbnRhaW5lciIsIml0ZW0iLCIkbGFzdEl0ZW0iLCJpdGVtTmFtZSIsImxvYWRBcHBEYXRhIiwibGlzdERhdGEiLCJpdGVtSWRzIiwibGVuZ3RoIiwiYXQiLCJPYmplY3QiLCJlbnRyaWVzIiwiZm9yRWFjaCIsIiRpdGVtc1dyYXBwZXIiLCJpdGVtcyIsImNyZWF0ZUxpc3QiLCJlIiwicHJldmVudERlZmF1bHQiLCJ0cmltIiwicHVzaCIsImRlbGV0ZUxpc3QiLCJsaXN0VG9EZWxldGUiLCJpZCIsInNwbGl0IiwibGlzdEluZGV4IiwiaW5kZXhPZiIsInNwbGljZSIsIlN0cmluZyIsImZyb21FbnRyaWVzIiwicmVtb3ZlIiwiY2xhc3NMaXN0IiwiYWRkTmV3SXRlbSIsIiRpdGVtSW5wdXRGaWVsZCIsInRhcmdldCIsInByZXZpb3VzRWxlbWVudFNpYmxpbmciLCJpdGVtc0xpc3RJZCIsImNsb3Nlc3QiLCJoYXMiLCJnZXQiLCJzZXQiLCIkaXRlbXNDb250YWluZXIiLCJuZXh0RWxlbWVudFNpYmxpbmciLCJmdW5jIiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsIm1hdGNoZXMiLCJhZGQiLCJ0ZXh0Q29udGVudCIsImN1ckxpc3RJZCIsImN1ckl0ZW1JZCJdLCJzb3VyY2VSb290IjoiIn0=