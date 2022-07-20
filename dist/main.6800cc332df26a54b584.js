/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./js/functions.js
var $listField = document.querySelector(".list__form input"); // Function for modifying String

var modifyString = function modifyString(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}; // Function for setting focus to list field


var listFieldFunc = function listFieldFunc() {
  $listField.value = "";
  $listField.focus();
}; // Function for storing JSON Data in localStorage


var storeJson = function storeJson(key, value) {
  return localStorage.setItem(key, JSON.stringify(value));
}; // Function for parsing JSON Data retrieved from localStorage


var parseJson = function parseJson(data) {
  return JSON.parse(localStorage.getItem(data));
};


;// CONCATENATED MODULE: ./js/main.js

 // Selectors

var main_$listField = document.querySelector(".list__form input");
var $listSubmitBtn = document.querySelector(".list__form button");
var $dialogContainer = document.querySelector(".dialog--container");
var $listContainer = document.querySelector(".list--container");
var $listTemplate = document.querySelector(".list__template");
var $itemTemplate = document.querySelector(".item__template");
var listId = 0,
    itemId = 0;
var appData = {
  list: [],
  listIds: [],
  lastItemId: 0
};
var listItemIds = new Map(); // Function for displaying list

var displayList = function displayList(list) {
  $listContainer.append($listTemplate.content.cloneNode(true));
  var $lastList = $listContainer.lastElementChild;
  $lastList.setAttribute("id", "list-".concat(list.listId));
  $lastList.querySelector("h2").innerText = list.listName;
}; // Function for displaying list's item


var displayListItem = function displayListItem(itemsContainer, item) {
  itemsContainer.append($itemTemplate.content.cloneNode(true));
  var $lastItem = itemsContainer.lastElementChild;
  $lastItem.setAttribute("id", "item-".concat(item.itemId));
  $lastItem.querySelector("p").innerText = item.itemName;
};
/*------------- Displaying list Data from localStorage on window loading -------------*/


window.addEventListener("load", function () {
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
      var $itemsWrapper = $listContainer.lastElementChild.querySelector(".items__wrapper");
      list.items.forEach(function (item) {
        displayListItem($itemsWrapper, item);
      });
    });
  }
});
/*----------------- Event Handler for list input button -------------------*/

$listSubmitBtn.addEventListener("click", function (e) {
  // 1) Prevent Default Behavior
  e.preventDefault(); // 2) Get the list name

  var listName = main_$listField.value.trim(); // 3) Check for truthy value of listName

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
});
/*----------- EventHandler for List Container When delete icon is clicked -----------*/

var listToDelete;
$listContainer.addEventListener("click", function (e) {
  if (e.target.matches(".bx-trash")) {
    // i) Display dialog box with list name
    $dialogContainer.classList.add("dialog-visible");
    $dialogContainer.querySelector("p strong").textContent = e.target.closest(".list").querySelector("h2").textContent; // ii) Assigning list to listToDelete variable

    listToDelete = e.target.closest(".list");
  }
});
/*------------------ Event Handler for Delete Button  ------------------*/

$dialogContainer.querySelector(".btn__delete").addEventListener("click", function () {
  // i) Get the listId
  var listId = +listToDelete.id.split("-")[1]; // ii) Find Index of the list

  var listIndex = appData.listIds.indexOf(listId); // iii) Remove listId, listItems Ids & list from appData Object

  appData.listIds.splice(listIndex, 1);
  listItemIds["delete"](String(listId));
  appData.list.splice(listIndex, 1); // iv) Update localStorage

  storeJson("list", appData);
  storeJson("listItemIds", Object.fromEntries(listItemIds)); // v) Update UI

  listToDelete.remove(); // vi) Hide dialog box

  $dialogContainer.classList.remove("dialog-visible");
});
/*-----------------  Event Handler for Cancel Button ------------------*/

$dialogContainer.querySelector(".btn__cancel").addEventListener("click", function () {
  $dialogContainer.classList.remove("dialog-visible");
});
/*----------- EventHandler for List Container When new item is added -----------*/

$listContainer.addEventListener("click", function (e) {
  var _e$target$previousEle;

  var $itemInputField = e.target.previousElementSibling;
  var itemName = (_e$target$previousEle = e.target.previousElementSibling) === null || _e$target$previousEle === void 0 ? void 0 : _e$target$previousEle.value.trim(); // Check if item add button is clicked & itemName is truthy

  if (e.target.matches(".btn__item--add") && itemName && itemName.length <= 30) {
    // i) Modify itemName
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
  }
});
/*---------------- Event Handler for list Container When item of a list is deleted  -----------------*/
// $listContainer.addEventListener("click", e => {
//   if (e.target.matches(".bx-minus-circle")) {
//     console.log(e);
//   }
// });
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QXJDLEVBQWtEbEIsSUFBbEQsQ0FBdURuQyxNQUF2RCxDQUZKO0lBSUFQLFNBQUEsQ0FBZSxhQUFmLEVBQThCa0MsTUFBTSxDQUFDc0IsV0FBUCxDQUFtQjVDLFdBQW5CLENBQTlCLEVBWkEsQ0FjQTs7SUFDQSxJQUFNd0MsU0FBUyxHQUFHNUMsT0FBTyxDQUFDRSxPQUFSLENBQWdCMkMsT0FBaEIsQ0FBd0IsQ0FBQ08sV0FBekIsQ0FBbEI7SUFDQXBELE9BQU8sQ0FBQ0MsSUFBUixDQUFhMkMsU0FBYixFQUF3QmQsS0FBeEIsQ0FBOEJJLElBQTlCLENBQW1DO01BQUVuQyxNQUFNLEVBQU5BLE1BQUY7TUFBVW9CLFFBQVEsRUFBUkE7SUFBVixDQUFuQztJQUNBbkIsT0FBTyxDQUFDRyxVQUFSLEdBQXFCSixNQUFyQjtJQUNBUCxTQUFBLENBQWUsTUFBZixFQUF1QlEsT0FBdkIsRUFsQkEsQ0FvQkE7O0lBQ0FrRCxlQUFlLENBQUN0RSxLQUFoQixHQUF3QixFQUF4QjtJQUNBc0UsZUFBZSxDQUFDckUsS0FBaEIsR0F0QkEsQ0F3QkE7O0lBQ0EsSUFBTTJFLGVBQWUsR0FBR3pCLENBQUMsQ0FBQ0ssTUFBRixDQUFTSyxPQUFULENBQWlCLGFBQWpCLEVBQWdDZ0Isa0JBQXhEO0lBQ0ExQyxlQUFlLENBQUN5QyxlQUFELEVBQWtCO01BQUV6RCxNQUFNLEVBQU5BLE1BQUY7TUFBVW9CLFFBQVEsRUFBUkE7SUFBVixDQUFsQixDQUFmLENBMUJBLENBNEJBOztJQUNBcEIsTUFBTTtFQUNQO0FBQ0YsQ0F4Q0Q7QUEwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE0iLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9qcy9mdW5jdGlvbnMuanMiLCJ3ZWJwYWNrOi8vLy4vanMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCAkbGlzdEZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5saXN0X19mb3JtIGlucHV0XCIpO1xuXG4vLyBGdW5jdGlvbiBmb3IgbW9kaWZ5aW5nIFN0cmluZ1xuY29uc3QgbW9kaWZ5U3RyaW5nID0gc3RyID0+IHN0clswXS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCk7XG5cbi8vIEZ1bmN0aW9uIGZvciBzZXR0aW5nIGZvY3VzIHRvIGxpc3QgZmllbGRcbmNvbnN0IGxpc3RGaWVsZEZ1bmMgPSAoKSA9PiB7XG4gICRsaXN0RmllbGQudmFsdWUgPSBcIlwiO1xuICAkbGlzdEZpZWxkLmZvY3VzKCk7XG59O1xuXG4vLyBGdW5jdGlvbiBmb3Igc3RvcmluZyBKU09OIERhdGEgaW4gbG9jYWxTdG9yYWdlXG5jb25zdCBzdG9yZUpzb24gPSAoa2V5LCB2YWx1ZSkgPT5cbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xuXG4vLyBGdW5jdGlvbiBmb3IgcGFyc2luZyBKU09OIERhdGEgcmV0cmlldmVkIGZyb20gbG9jYWxTdG9yYWdlXG5jb25zdCBwYXJzZUpzb24gPSBkYXRhID0+IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oZGF0YSkpO1xuXG5leHBvcnQgeyBtb2RpZnlTdHJpbmcsIGxpc3RGaWVsZEZ1bmMsIHN0b3JlSnNvbiwgcGFyc2VKc29uIH07XG4iLCJpbXBvcnQgXCIuLi9zY3NzL21haW4uc2Nzc1wiO1xuaW1wb3J0ICogYXMgZnVuYyBmcm9tIFwiLi9mdW5jdGlvbnNcIjtcblxuLy8gU2VsZWN0b3JzXG5jb25zdCAkbGlzdEZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5saXN0X19mb3JtIGlucHV0XCIpO1xuY29uc3QgJGxpc3RTdWJtaXRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxpc3RfX2Zvcm0gYnV0dG9uXCIpO1xuY29uc3QgJGRpYWxvZ0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGlhbG9nLS1jb250YWluZXJcIik7XG5jb25zdCAkbGlzdENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubGlzdC0tY29udGFpbmVyXCIpO1xuY29uc3QgJGxpc3RUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubGlzdF9fdGVtcGxhdGVcIik7XG5jb25zdCAkaXRlbVRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5pdGVtX190ZW1wbGF0ZVwiKTtcblxubGV0IFtsaXN0SWQsIGl0ZW1JZF0gPSBbMCwgMF07XG5sZXQgYXBwRGF0YSA9IHtcbiAgbGlzdDogW10sXG4gIGxpc3RJZHM6IFtdLFxuICBsYXN0SXRlbUlkOiAwXG59O1xubGV0IGxpc3RJdGVtSWRzID0gbmV3IE1hcCgpO1xuXG4vLyBGdW5jdGlvbiBmb3IgZGlzcGxheWluZyBsaXN0XG5jb25zdCBkaXNwbGF5TGlzdCA9IGxpc3QgPT4ge1xuICAkbGlzdENvbnRhaW5lci5hcHBlbmQoJGxpc3RUZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gIGNvbnN0ICRsYXN0TGlzdCA9ICRsaXN0Q29udGFpbmVyLmxhc3RFbGVtZW50Q2hpbGQ7XG4gICRsYXN0TGlzdC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBgbGlzdC0ke2xpc3QubGlzdElkfWApO1xuICAkbGFzdExpc3QucXVlcnlTZWxlY3RvcihcImgyXCIpLmlubmVyVGV4dCA9IGxpc3QubGlzdE5hbWU7XG59O1xuXG4vLyBGdW5jdGlvbiBmb3IgZGlzcGxheWluZyBsaXN0J3MgaXRlbVxuY29uc3QgZGlzcGxheUxpc3RJdGVtID0gKGl0ZW1zQ29udGFpbmVyLCBpdGVtKSA9PiB7XG4gIGl0ZW1zQ29udGFpbmVyLmFwcGVuZCgkaXRlbVRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpKTtcbiAgY29uc3QgJGxhc3RJdGVtID0gaXRlbXNDb250YWluZXIubGFzdEVsZW1lbnRDaGlsZDtcbiAgJGxhc3RJdGVtLnNldEF0dHJpYnV0ZShcImlkXCIsIGBpdGVtLSR7aXRlbS5pdGVtSWR9YCk7XG4gICRsYXN0SXRlbS5xdWVyeVNlbGVjdG9yKFwicFwiKS5pbm5lclRleHQgPSBpdGVtLml0ZW1OYW1lO1xufTtcblxuLyotLS0tLS0tLS0tLS0tIERpc3BsYXlpbmcgbGlzdCBEYXRhIGZyb20gbG9jYWxTdG9yYWdlIG9uIHdpbmRvdyBsb2FkaW5nIC0tLS0tLS0tLS0tLS0qL1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcbiAgLy8gaSkgU2V0dGluZyBGb2N1cyB0byBsaXN0IEZpZWxkXG4gIGZ1bmMubGlzdEZpZWxkRnVuYygpO1xuXG4gIC8vIGlpKSBSZWFzc2lnbmluZyBkYXRhIHRvIHZhcmlhYmxlc1xuICBjb25zdCBbbGlzdERhdGEsIGl0ZW1JZHNdID0gW1xuICAgIGZ1bmMucGFyc2VKc29uKFwibGlzdFwiKSxcbiAgICBmdW5jLnBhcnNlSnNvbihcImxpc3RJdGVtSWRzXCIpXG4gIF07XG4gIGlmIChsaXN0RGF0YSAmJiBsaXN0RGF0YS5saXN0SWRzLmxlbmd0aCkge1xuICAgIGFwcERhdGEgPSBsaXN0RGF0YTtcbiAgICBsaXN0SWQgPSBsaXN0RGF0YS5saXN0SWRzLmF0KC0xKSArIDE7XG4gIH1cbiAgaWYgKGxpc3REYXRhICYmIGxpc3REYXRhLmxhc3RJdGVtSWQpIHtcbiAgICBsaXN0SXRlbUlkcyA9IG5ldyBNYXAoT2JqZWN0LmVudHJpZXMoaXRlbUlkcykpO1xuICAgIGl0ZW1JZCA9IGxpc3REYXRhLmxhc3RJdGVtSWQgKyAxO1xuICB9XG5cbiAgLy8gaWlpKSBEaXNwbGF5IGxpc3RzICYgdGhlaXIgaXRlbXMgaW4gVUlcbiAgaWYgKGxpc3REYXRhICYmIGxpc3REYXRhLmxpc3QubGVuZ3RoKSB7XG4gICAgbGlzdERhdGEubGlzdC5mb3JFYWNoKGxpc3QgPT4ge1xuICAgICAgZGlzcGxheUxpc3QobGlzdCk7XG4gICAgICBjb25zdCAkaXRlbXNXcmFwcGVyID1cbiAgICAgICAgJGxpc3RDb250YWluZXIubGFzdEVsZW1lbnRDaGlsZC5xdWVyeVNlbGVjdG9yKFwiLml0ZW1zX193cmFwcGVyXCIpO1xuICAgICAgbGlzdC5pdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBkaXNwbGF5TGlzdEl0ZW0oJGl0ZW1zV3JhcHBlciwgaXRlbSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufSk7XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0gRXZlbnQgSGFuZGxlciBmb3IgbGlzdCBpbnB1dCBidXR0b24gLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4kbGlzdFN1Ym1pdEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XG4gIC8vIDEpIFByZXZlbnQgRGVmYXVsdCBCZWhhdmlvclxuICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgLy8gMikgR2V0IHRoZSBsaXN0IG5hbWVcbiAgbGV0IGxpc3ROYW1lID0gJGxpc3RGaWVsZC52YWx1ZS50cmltKCk7XG5cbiAgLy8gMykgQ2hlY2sgZm9yIHRydXRoeSB2YWx1ZSBvZiBsaXN0TmFtZVxuICBpZiAobGlzdE5hbWUgJiYgbGlzdE5hbWUubGVuZ3RoIDw9IDIwKSB7XG4gICAgLy8gaSkgTW9kaWZ5IExpc3QgTmFtZVxuICAgIGxpc3ROYW1lID0gZnVuYy5tb2RpZnlTdHJpbmcobGlzdE5hbWUpO1xuXG4gICAgLy8gaWlpKSBTdG9yZSBsaXN0IGluZGV4IGluIGFwcERhdGEubGlzdElkcyBhcnJheVxuICAgIGFwcERhdGEubGlzdElkcy5wdXNoKGxpc3RJZCk7XG5cbiAgICAvLyBpaSkgU3RvcmUgbGlzdCBpbiBsb2NhbCBTdG9yYWdlICYgYWxzbyBpbiBhcHBEYXRhLmxpc3QgYXJyYXlcbiAgICBhcHBEYXRhLmxpc3QucHVzaCh7IGxpc3RJZCwgbGlzdE5hbWUsIGl0ZW1zOiBbXSB9KTtcbiAgICBmdW5jLnN0b3JlSnNvbihcImxpc3RcIiwgYXBwRGF0YSk7XG5cbiAgICAvLyBpaWkpIEVtcHR5IGlucHV0IGZpZWxkXG4gICAgZnVuYy5saXN0RmllbGRGdW5jKCk7XG5cbiAgICAvLyBpdikgRGlzcGxheSBMaXN0IGluIFVJXG4gICAgZGlzcGxheUxpc3QoeyBsaXN0SWQsIGxpc3ROYW1lIH0pO1xuXG4gICAgLy8gdikgSW5jcmVhc2UgbGlzdElkIGJ5IDFcbiAgICBsaXN0SWQrKztcbiAgfVxufSk7XG5cbi8qLS0tLS0tLS0tLS0gRXZlbnRIYW5kbGVyIGZvciBMaXN0IENvbnRhaW5lciBXaGVuIGRlbGV0ZSBpY29uIGlzIGNsaWNrZWQgLS0tLS0tLS0tLS0qL1xubGV0IGxpc3RUb0RlbGV0ZTtcbiRsaXN0Q29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcbiAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoXCIuYngtdHJhc2hcIikpIHtcbiAgICAvLyBpKSBEaXNwbGF5IGRpYWxvZyBib3ggd2l0aCBsaXN0IG5hbWVcbiAgICAkZGlhbG9nQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJkaWFsb2ctdmlzaWJsZVwiKTtcbiAgICAkZGlhbG9nQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCJwIHN0cm9uZ1wiKS50ZXh0Q29udGVudCA9IGUudGFyZ2V0XG4gICAgICAuY2xvc2VzdChcIi5saXN0XCIpXG4gICAgICAucXVlcnlTZWxlY3RvcihcImgyXCIpLnRleHRDb250ZW50O1xuXG4gICAgLy8gaWkpIEFzc2lnbmluZyBsaXN0IHRvIGxpc3RUb0RlbGV0ZSB2YXJpYWJsZVxuICAgIGxpc3RUb0RlbGV0ZSA9IGUudGFyZ2V0LmNsb3Nlc3QoXCIubGlzdFwiKTtcbiAgfVxufSk7XG5cbi8qLS0tLS0tLS0tLS0tLS0tLS0tIEV2ZW50IEhhbmRsZXIgZm9yIERlbGV0ZSBCdXR0b24gIC0tLS0tLS0tLS0tLS0tLS0tLSovXG4kZGlhbG9nQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIuYnRuX19kZWxldGVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgLy8gaSkgR2V0IHRoZSBsaXN0SWRcbiAgY29uc3QgbGlzdElkID0gK2xpc3RUb0RlbGV0ZS5pZC5zcGxpdChcIi1cIilbMV07XG5cbiAgLy8gaWkpIEZpbmQgSW5kZXggb2YgdGhlIGxpc3RcbiAgY29uc3QgbGlzdEluZGV4ID0gYXBwRGF0YS5saXN0SWRzLmluZGV4T2YobGlzdElkKTtcblxuICAvLyBpaWkpIFJlbW92ZSBsaXN0SWQsIGxpc3RJdGVtcyBJZHMgJiBsaXN0IGZyb20gYXBwRGF0YSBPYmplY3RcbiAgYXBwRGF0YS5saXN0SWRzLnNwbGljZShsaXN0SW5kZXgsIDEpO1xuICBsaXN0SXRlbUlkcy5kZWxldGUoU3RyaW5nKGxpc3RJZCkpO1xuICBhcHBEYXRhLmxpc3Quc3BsaWNlKGxpc3RJbmRleCwgMSk7XG5cbiAgLy8gaXYpIFVwZGF0ZSBsb2NhbFN0b3JhZ2VcbiAgZnVuYy5zdG9yZUpzb24oXCJsaXN0XCIsIGFwcERhdGEpO1xuICBmdW5jLnN0b3JlSnNvbihcImxpc3RJdGVtSWRzXCIsIE9iamVjdC5mcm9tRW50cmllcyhsaXN0SXRlbUlkcykpO1xuXG4gIC8vIHYpIFVwZGF0ZSBVSVxuICBsaXN0VG9EZWxldGUucmVtb3ZlKCk7XG5cbiAgLy8gdmkpIEhpZGUgZGlhbG9nIGJveFxuICAkZGlhbG9nQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJkaWFsb2ctdmlzaWJsZVwiKTtcbn0pO1xuXG4vKi0tLS0tLS0tLS0tLS0tLS0tICBFdmVudCBIYW5kbGVyIGZvciBDYW5jZWwgQnV0dG9uIC0tLS0tLS0tLS0tLS0tLS0tLSovXG4kZGlhbG9nQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIuYnRuX19jYW5jZWxcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgJGRpYWxvZ0NvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiZGlhbG9nLXZpc2libGVcIik7XG59KTtcblxuLyotLS0tLS0tLS0tLSBFdmVudEhhbmRsZXIgZm9yIExpc3QgQ29udGFpbmVyIFdoZW4gbmV3IGl0ZW0gaXMgYWRkZWQgLS0tLS0tLS0tLS0qL1xuJGxpc3RDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUgPT4ge1xuICBjb25zdCAkaXRlbUlucHV0RmllbGQgPSBlLnRhcmdldC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICBsZXQgaXRlbU5hbWUgPSBlLnRhcmdldC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nPy52YWx1ZS50cmltKCk7XG5cbiAgLy8gQ2hlY2sgaWYgaXRlbSBhZGQgYnV0dG9uIGlzIGNsaWNrZWQgJiBpdGVtTmFtZSBpcyB0cnV0aHlcbiAgaWYgKFxuICAgIGUudGFyZ2V0Lm1hdGNoZXMoXCIuYnRuX19pdGVtLS1hZGRcIikgJiZcbiAgICBpdGVtTmFtZSAmJlxuICAgIGl0ZW1OYW1lLmxlbmd0aCA8PSAzMFxuICApIHtcbiAgICAvLyBpKSBNb2RpZnkgaXRlbU5hbWVcbiAgICBpdGVtTmFtZSA9IGZ1bmMubW9kaWZ5U3RyaW5nKGl0ZW1OYW1lKTtcblxuICAgIC8vIGlpKSAgR2V0IGxpc3QgaWRcbiAgICBjb25zdCBpdGVtc0xpc3RJZCA9IGUudGFyZ2V0LmNsb3Nlc3QoXCIubGlzdFwiKS5pZC5zcGxpdChcIi1cIilbMV07XG5cbiAgICAvLyBpaWkpIFN0b3JlIGl0ZW1JZCBpbiBsaXN0SXRlbUlkcyBtYXAgJiBpbiBsb2NhbFN0b3JhZ2VcbiAgICBsaXN0SXRlbUlkcy5oYXMoaXRlbXNMaXN0SWQpXG4gICAgICA/IGxpc3RJdGVtSWRzLmdldChpdGVtc0xpc3RJZCkucHVzaChpdGVtSWQpXG4gICAgICA6IGxpc3RJdGVtSWRzLnNldChpdGVtc0xpc3RJZCwgW10pLmdldChpdGVtc0xpc3RJZCkucHVzaChpdGVtSWQpO1xuXG4gICAgZnVuYy5zdG9yZUpzb24oXCJsaXN0SXRlbUlkc1wiLCBPYmplY3QuZnJvbUVudHJpZXMobGlzdEl0ZW1JZHMpKTtcblxuICAgIC8vIGl2KSBTdG9yZSBpdGVtIGluIGxvY2FsU3RvcmFnZSAmIGFwcERhdGEubGlzdCBhcnJheSBib3RoXG4gICAgY29uc3QgbGlzdEluZGV4ID0gYXBwRGF0YS5saXN0SWRzLmluZGV4T2YoK2l0ZW1zTGlzdElkKTtcbiAgICBhcHBEYXRhLmxpc3RbbGlzdEluZGV4XS5pdGVtcy5wdXNoKHsgaXRlbUlkLCBpdGVtTmFtZSB9KTtcbiAgICBhcHBEYXRhLmxhc3RJdGVtSWQgPSBpdGVtSWQ7XG4gICAgZnVuYy5zdG9yZUpzb24oXCJsaXN0XCIsIGFwcERhdGEpO1xuXG4gICAgLy8gdikgRW1wdHkgaXRlbSBJbnB1dCBGaWVsZCAmIHNldCB0aGUgZm9jdXNcbiAgICAkaXRlbUlucHV0RmllbGQudmFsdWUgPSBcIlwiO1xuICAgICRpdGVtSW5wdXRGaWVsZC5mb2N1cygpO1xuXG4gICAgLy8gdmkpIERpc3BsYXkgaXRlbSBpbiBVSVxuICAgIGNvbnN0ICRpdGVtc0NvbnRhaW5lciA9IGUudGFyZ2V0LmNsb3Nlc3QoXCIuaXRlbV9fZm9ybVwiKS5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgZGlzcGxheUxpc3RJdGVtKCRpdGVtc0NvbnRhaW5lciwgeyBpdGVtSWQsIGl0ZW1OYW1lIH0pO1xuXG4gICAgLy8gdmlpKSBJbmNyZWFzZSBpdGVtIGlkIGJ5IDFcbiAgICBpdGVtSWQrKztcbiAgfVxufSk7XG5cbi8qLS0tLS0tLS0tLS0tLS0tLSBFdmVudCBIYW5kbGVyIGZvciBsaXN0IENvbnRhaW5lciBXaGVuIGl0ZW0gb2YgYSBsaXN0IGlzIGRlbGV0ZWQgIC0tLS0tLS0tLS0tLS0tLS0tKi9cbi8vICRsaXN0Q29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcbi8vICAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoXCIuYngtbWludXMtY2lyY2xlXCIpKSB7XG4vLyAgICAgY29uc29sZS5sb2coZSk7XG4vLyAgIH1cbi8vIH0pO1xuIl0sIm5hbWVzIjpbIiRsaXN0RmllbGQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJtb2RpZnlTdHJpbmciLCJzdHIiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwidG9Mb3dlckNhc2UiLCJsaXN0RmllbGRGdW5jIiwidmFsdWUiLCJmb2N1cyIsInN0b3JlSnNvbiIsImtleSIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJKU09OIiwic3RyaW5naWZ5IiwicGFyc2VKc29uIiwiZGF0YSIsInBhcnNlIiwiZ2V0SXRlbSIsImZ1bmMiLCIkbGlzdFN1Ym1pdEJ0biIsIiRkaWFsb2dDb250YWluZXIiLCIkbGlzdENvbnRhaW5lciIsIiRsaXN0VGVtcGxhdGUiLCIkaXRlbVRlbXBsYXRlIiwibGlzdElkIiwiaXRlbUlkIiwiYXBwRGF0YSIsImxpc3QiLCJsaXN0SWRzIiwibGFzdEl0ZW1JZCIsImxpc3RJdGVtSWRzIiwiTWFwIiwiZGlzcGxheUxpc3QiLCJhcHBlbmQiLCJjb250ZW50IiwiY2xvbmVOb2RlIiwiJGxhc3RMaXN0IiwibGFzdEVsZW1lbnRDaGlsZCIsInNldEF0dHJpYnV0ZSIsImlubmVyVGV4dCIsImxpc3ROYW1lIiwiZGlzcGxheUxpc3RJdGVtIiwiaXRlbXNDb250YWluZXIiLCJpdGVtIiwiJGxhc3RJdGVtIiwiaXRlbU5hbWUiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwibGlzdERhdGEiLCJpdGVtSWRzIiwibGVuZ3RoIiwiYXQiLCJPYmplY3QiLCJlbnRyaWVzIiwiZm9yRWFjaCIsIiRpdGVtc1dyYXBwZXIiLCJpdGVtcyIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInRyaW0iLCJwdXNoIiwibGlzdFRvRGVsZXRlIiwidGFyZ2V0IiwibWF0Y2hlcyIsImNsYXNzTGlzdCIsImFkZCIsInRleHRDb250ZW50IiwiY2xvc2VzdCIsImlkIiwic3BsaXQiLCJsaXN0SW5kZXgiLCJpbmRleE9mIiwic3BsaWNlIiwiU3RyaW5nIiwiZnJvbUVudHJpZXMiLCJyZW1vdmUiLCIkaXRlbUlucHV0RmllbGQiLCJwcmV2aW91c0VsZW1lbnRTaWJsaW5nIiwiaXRlbXNMaXN0SWQiLCJoYXMiLCJnZXQiLCJzZXQiLCIkaXRlbXNDb250YWluZXIiLCJuZXh0RWxlbWVudFNpYmxpbmciXSwic291cmNlUm9vdCI6IiJ9