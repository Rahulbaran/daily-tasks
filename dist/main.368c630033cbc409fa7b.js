/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
 // Selectors

var $listField = document.querySelector(".list__form input");
var $listSubmitBtn = document.querySelector(".list__form button");
var $listContainer = document.querySelector(".list--container");
var $listTemplate = document.querySelector(".list__template");
var $itemTemplate = document.querySelector(".item__template");
var listId = 0,
    itemId = 0;
var appData = {
  list: [],
  listIds: [],
  listItemIds: {}
}; // Function for setting focus to list field

var listFieldFunc = function listFieldFunc() {
  $listField.value = "";
  $listField.focus();
}; // Function for modifying String


var modifyString = function modifyString(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
};
/*--------------- Event Handler for list input button ---------------*/


$listSubmitBtn.addEventListener("click", function (e) {
  // 1) Prevent Default Behavior
  e.preventDefault(); // 2) Get the list name

  var listName = $listField.value.trim(); // 3) Check for truthy value of listName

  if (listName && listName.length <= 20) {
    // i) Modify List Name
    listName = modifyString(listName); // iii) Store list index in appData.listIds array

    appData.listIds.push(listId); // ii) Store list in local Storage & also in appData.list array

    appData.list.push({
      listId: listId,
      listName: listName,
      items: []
    });
    localStorage.setItem("list", JSON.stringify(appData.list)); // iii) Empty input field

    listFieldFunc(); // iv) Display List in UI

    $listContainer.append($listTemplate.content.cloneNode(true));
    var $lastList = $listContainer.lastElementChild;
    $lastList.setAttribute("id", "list-".concat(listId));
    $lastList.querySelector("h2").innerText = listName; // v) Increase listId by 1

    listId++;
  }
});
/*----------- EventHandler for List Container When new item is added -----------*/

$listContainer.addEventListener("click", function (e) {
  var _e$target$previousEle;

  var $itemInputField = e.target.previousElementSibling;
  var itemName = (_e$target$previousEle = e.target.previousElementSibling) === null || _e$target$previousEle === void 0 ? void 0 : _e$target$previousEle.value.trim(); // Check if item add button is clicked & itemName is truthy

  if (e.target.matches(".btn__item--add") && itemName && itemName.length <= 30) {
    // i) Modify itemName
    itemName = modifyString(itemName); // ii)  Get list id

    var itemsListId = +e.target.closest(".list").id.split("-")[1]; // iii) Store itemId in appData.listItemIds

    if (appData.listItemIds[itemsListId]) appData.listItemIds[itemsListId].push(itemId);else {
      appData.listItemIds[itemsListId] = [];
      appData.listItemIds[itemsListId].push(itemId);
    } // iv) Store item in localStorage & appData.list array both

    var listIndex = appData.listIds.indexOf(itemsListId);
    appData.list[listIndex].items.push({
      itemId: itemId,
      itemName: itemName
    });
    localStorage.setItem("list", JSON.stringify(appData)); // v) Empty item Input Field & set the focus back

    $itemInputField.value = "";
    $itemInputField.focus(); // vi) Display item in UI

    var $itemsContainer = e.target.closest(".item__form").nextElementSibling;
    $itemsContainer.append($itemTemplate.content.cloneNode(true));
    var $lastItem = $itemsContainer.lastElementChild;
    $lastItem.setAttribute("id", "item-".concat(itemId));
    $lastItem.querySelector("p").innerText = itemName; // vii) Increase item id by 1

    itemId++;
  }
});
/*------------- Displaying list Data from localStorage on window loading -------------*/

window.addEventListener("load", function () {
  // Setting Focus to list Field
  listFieldFunc();
});
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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K0IsZUFBZSxDQUFDMUIsS0FBaEIsR0FBd0IsRUFBeEI7SUFDQTBCLGVBQWUsQ0FBQ3pCLEtBQWhCLEdBdEJBLENBd0JBOztJQUNBLElBQU1vQyxlQUFlLEdBQUc3QixDQUFDLENBQUNtQixNQUFGLENBQVNLLE9BQVQsQ0FBaUIsYUFBakIsRUFBZ0NNLGtCQUF4RDtJQUNBRCxlQUFlLENBQUNsQixNQUFoQixDQUF1QjNCLGFBQWEsQ0FBQzRCLE9BQWQsQ0FBc0JDLFNBQXRCLENBQWdDLElBQWhDLENBQXZCO0lBQ0EsSUFBTWtCLFNBQVMsR0FBR0YsZUFBZSxDQUFDZCxnQkFBbEM7SUFDQWdCLFNBQVMsQ0FBQ2YsWUFBVixDQUF1QixJQUF2QixpQkFBcUM5QixNQUFyQztJQUNBNkMsU0FBUyxDQUFDbkQsYUFBVixDQUF3QixHQUF4QixFQUE2QnFDLFNBQTdCLEdBQXlDSSxRQUF6QyxDQTdCQSxDQStCQTs7SUFDQW5DLE1BQU07RUFDUDtBQUNGLENBM0NEO0FBNkNBOztBQUNBOEMsTUFBTSxDQUFDakMsZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsWUFBTTtFQUNwQztFQUNBUixhQUFhO0FBQ2QsQ0FIRCxFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vanMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXCIuLi9zY3NzL21haW4uc2Nzc1wiO1xuXG4vLyBTZWxlY3RvcnNcbmNvbnN0ICRsaXN0RmllbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxpc3RfX2Zvcm0gaW5wdXRcIik7XG5jb25zdCAkbGlzdFN1Ym1pdEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubGlzdF9fZm9ybSBidXR0b25cIik7XG5jb25zdCAkbGlzdENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubGlzdC0tY29udGFpbmVyXCIpO1xuY29uc3QgJGxpc3RUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubGlzdF9fdGVtcGxhdGVcIik7XG5jb25zdCAkaXRlbVRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5pdGVtX190ZW1wbGF0ZVwiKTtcblxubGV0IFtsaXN0SWQsIGl0ZW1JZF0gPSBbMCwgMF07XG5jb25zdCBhcHBEYXRhID0ge1xuICBsaXN0OiBbXSxcbiAgbGlzdElkczogW10sXG4gIGxpc3RJdGVtSWRzOiB7fVxufTtcblxuLy8gRnVuY3Rpb24gZm9yIHNldHRpbmcgZm9jdXMgdG8gbGlzdCBmaWVsZFxuY29uc3QgbGlzdEZpZWxkRnVuYyA9ICgpID0+IHtcbiAgJGxpc3RGaWVsZC52YWx1ZSA9IFwiXCI7XG4gICRsaXN0RmllbGQuZm9jdXMoKTtcbn07XG5cbi8vIEZ1bmN0aW9uIGZvciBtb2RpZnlpbmcgU3RyaW5nXG5jb25zdCBtb2RpZnlTdHJpbmcgPSBzdHIgPT4gc3RyWzBdLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcblxuLyotLS0tLS0tLS0tLS0tLS0gRXZlbnQgSGFuZGxlciBmb3IgbGlzdCBpbnB1dCBidXR0b24gLS0tLS0tLS0tLS0tLS0tKi9cbiRsaXN0U3VibWl0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcbiAgLy8gMSkgUHJldmVudCBEZWZhdWx0IEJlaGF2aW9yXG4gIGUucHJldmVudERlZmF1bHQoKTtcblxuICAvLyAyKSBHZXQgdGhlIGxpc3QgbmFtZVxuICBsZXQgbGlzdE5hbWUgPSAkbGlzdEZpZWxkLnZhbHVlLnRyaW0oKTtcblxuICAvLyAzKSBDaGVjayBmb3IgdHJ1dGh5IHZhbHVlIG9mIGxpc3ROYW1lXG4gIGlmIChsaXN0TmFtZSAmJiBsaXN0TmFtZS5sZW5ndGggPD0gMjApIHtcbiAgICAvLyBpKSBNb2RpZnkgTGlzdCBOYW1lXG4gICAgbGlzdE5hbWUgPSBtb2RpZnlTdHJpbmcobGlzdE5hbWUpO1xuXG4gICAgLy8gaWlpKSBTdG9yZSBsaXN0IGluZGV4IGluIGFwcERhdGEubGlzdElkcyBhcnJheVxuICAgIGFwcERhdGEubGlzdElkcy5wdXNoKGxpc3RJZCk7XG5cbiAgICAvLyBpaSkgU3RvcmUgbGlzdCBpbiBsb2NhbCBTdG9yYWdlICYgYWxzbyBpbiBhcHBEYXRhLmxpc3QgYXJyYXlcbiAgICBhcHBEYXRhLmxpc3QucHVzaCh7IGxpc3RJZCwgbGlzdE5hbWUsIGl0ZW1zOiBbXSB9KTtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImxpc3RcIiwgSlNPTi5zdHJpbmdpZnkoYXBwRGF0YS5saXN0KSk7XG5cbiAgICAvLyBpaWkpIEVtcHR5IGlucHV0IGZpZWxkXG4gICAgbGlzdEZpZWxkRnVuYygpO1xuXG4gICAgLy8gaXYpIERpc3BsYXkgTGlzdCBpbiBVSVxuICAgICRsaXN0Q29udGFpbmVyLmFwcGVuZCgkbGlzdFRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpKTtcbiAgICBjb25zdCAkbGFzdExpc3QgPSAkbGlzdENvbnRhaW5lci5sYXN0RWxlbWVudENoaWxkO1xuICAgICRsYXN0TGlzdC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBgbGlzdC0ke2xpc3RJZH1gKTtcbiAgICAkbGFzdExpc3QucXVlcnlTZWxlY3RvcihcImgyXCIpLmlubmVyVGV4dCA9IGxpc3ROYW1lO1xuXG4gICAgLy8gdikgSW5jcmVhc2UgbGlzdElkIGJ5IDFcbiAgICBsaXN0SWQrKztcbiAgfVxufSk7XG5cbi8qLS0tLS0tLS0tLS0gRXZlbnRIYW5kbGVyIGZvciBMaXN0IENvbnRhaW5lciBXaGVuIG5ldyBpdGVtIGlzIGFkZGVkIC0tLS0tLS0tLS0tKi9cbiRsaXN0Q29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xuICBjb25zdCAkaXRlbUlucHV0RmllbGQgPSBlLnRhcmdldC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICBsZXQgaXRlbU5hbWUgPSBlLnRhcmdldC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nPy52YWx1ZS50cmltKCk7XG5cbiAgLy8gQ2hlY2sgaWYgaXRlbSBhZGQgYnV0dG9uIGlzIGNsaWNrZWQgJiBpdGVtTmFtZSBpcyB0cnV0aHlcbiAgaWYgKFxuICAgIGUudGFyZ2V0Lm1hdGNoZXMoXCIuYnRuX19pdGVtLS1hZGRcIikgJiZcbiAgICBpdGVtTmFtZSAmJlxuICAgIGl0ZW1OYW1lLmxlbmd0aCA8PSAzMFxuICApIHtcbiAgICAvLyBpKSBNb2RpZnkgaXRlbU5hbWVcbiAgICBpdGVtTmFtZSA9IG1vZGlmeVN0cmluZyhpdGVtTmFtZSk7XG5cbiAgICAvLyBpaSkgIEdldCBsaXN0IGlkXG4gICAgY29uc3QgaXRlbXNMaXN0SWQgPSArZS50YXJnZXQuY2xvc2VzdChcIi5saXN0XCIpLmlkLnNwbGl0KFwiLVwiKVsxXTtcblxuICAgIC8vIGlpaSkgU3RvcmUgaXRlbUlkIGluIGFwcERhdGEubGlzdEl0ZW1JZHNcbiAgICBpZiAoYXBwRGF0YS5saXN0SXRlbUlkc1tpdGVtc0xpc3RJZF0pXG4gICAgICBhcHBEYXRhLmxpc3RJdGVtSWRzW2l0ZW1zTGlzdElkXS5wdXNoKGl0ZW1JZCk7XG4gICAgZWxzZSB7XG4gICAgICBhcHBEYXRhLmxpc3RJdGVtSWRzW2l0ZW1zTGlzdElkXSA9IFtdO1xuICAgICAgYXBwRGF0YS5saXN0SXRlbUlkc1tpdGVtc0xpc3RJZF0ucHVzaChpdGVtSWQpO1xuICAgIH1cblxuICAgIC8vIGl2KSBTdG9yZSBpdGVtIGluIGxvY2FsU3RvcmFnZSAmIGFwcERhdGEubGlzdCBhcnJheSBib3RoXG4gICAgY29uc3QgbGlzdEluZGV4ID0gYXBwRGF0YS5saXN0SWRzLmluZGV4T2YoaXRlbXNMaXN0SWQpO1xuICAgIGFwcERhdGEubGlzdFtsaXN0SW5kZXhdLml0ZW1zLnB1c2goeyBpdGVtSWQsIGl0ZW1OYW1lIH0pO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibGlzdFwiLCBKU09OLnN0cmluZ2lmeShhcHBEYXRhKSk7XG5cbiAgICAvLyB2KSBFbXB0eSBpdGVtIElucHV0IEZpZWxkICYgc2V0IHRoZSBmb2N1cyBiYWNrXG4gICAgJGl0ZW1JbnB1dEZpZWxkLnZhbHVlID0gXCJcIjtcbiAgICAkaXRlbUlucHV0RmllbGQuZm9jdXMoKTtcblxuICAgIC8vIHZpKSBEaXNwbGF5IGl0ZW0gaW4gVUlcbiAgICBjb25zdCAkaXRlbXNDb250YWluZXIgPSBlLnRhcmdldC5jbG9zZXN0KFwiLml0ZW1fX2Zvcm1cIikubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICRpdGVtc0NvbnRhaW5lci5hcHBlbmQoJGl0ZW1UZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gICAgY29uc3QgJGxhc3RJdGVtID0gJGl0ZW1zQ29udGFpbmVyLmxhc3RFbGVtZW50Q2hpbGQ7XG4gICAgJGxhc3RJdGVtLnNldEF0dHJpYnV0ZShcImlkXCIsIGBpdGVtLSR7aXRlbUlkfWApO1xuICAgICRsYXN0SXRlbS5xdWVyeVNlbGVjdG9yKFwicFwiKS5pbm5lclRleHQgPSBpdGVtTmFtZTtcblxuICAgIC8vIHZpaSkgSW5jcmVhc2UgaXRlbSBpZCBieSAxXG4gICAgaXRlbUlkKys7XG4gIH1cbn0pO1xuXG4vKi0tLS0tLS0tLS0tLS0gRGlzcGxheWluZyBsaXN0IERhdGEgZnJvbSBsb2NhbFN0b3JhZ2Ugb24gd2luZG93IGxvYWRpbmcgLS0tLS0tLS0tLS0tLSovXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xuICAvLyBTZXR0aW5nIEZvY3VzIHRvIGxpc3QgRmllbGRcbiAgbGlzdEZpZWxkRnVuYygpO1xufSk7XG4iXSwibmFtZXMiOlsiJGxpc3RGaWVsZCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsIiRsaXN0U3VibWl0QnRuIiwiJGxpc3RDb250YWluZXIiLCIkbGlzdFRlbXBsYXRlIiwiJGl0ZW1UZW1wbGF0ZSIsImxpc3RJZCIsIml0ZW1JZCIsImFwcERhdGEiLCJsaXN0IiwibGlzdElkcyIsImxpc3RJdGVtSWRzIiwibGlzdEZpZWxkRnVuYyIsInZhbHVlIiwiZm9jdXMiLCJtb2RpZnlTdHJpbmciLCJzdHIiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwidG9Mb3dlckNhc2UiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsInByZXZlbnREZWZhdWx0IiwibGlzdE5hbWUiLCJ0cmltIiwibGVuZ3RoIiwicHVzaCIsIml0ZW1zIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsIkpTT04iLCJzdHJpbmdpZnkiLCJhcHBlbmQiLCJjb250ZW50IiwiY2xvbmVOb2RlIiwiJGxhc3RMaXN0IiwibGFzdEVsZW1lbnRDaGlsZCIsInNldEF0dHJpYnV0ZSIsImlubmVyVGV4dCIsIiRpdGVtSW5wdXRGaWVsZCIsInRhcmdldCIsInByZXZpb3VzRWxlbWVudFNpYmxpbmciLCJpdGVtTmFtZSIsIm1hdGNoZXMiLCJpdGVtc0xpc3RJZCIsImNsb3Nlc3QiLCJpZCIsInNwbGl0IiwibGlzdEluZGV4IiwiaW5kZXhPZiIsIiRpdGVtc0NvbnRhaW5lciIsIm5leHRFbGVtZW50U2libGluZyIsIiRsYXN0SXRlbSIsIndpbmRvdyJdLCJzb3VyY2VSb290IjoiIn0=