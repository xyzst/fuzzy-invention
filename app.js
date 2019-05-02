/**
 * Budget Controller
 */
var budgetController = (function() {})();

/**
 * UI Controller
 */
var UIController = (function() {})();

/**
 * Global App Controller
 */
var controller = (function(budgetCtrl, UICtrl) {
  var ctrlAddItem = function() {
    // Get filled input data
    // Add item to the budget controller
    // Add the item to the UI
    // Calculate budget
    // Display the budget on the UI
    console.log("DATA DATA");
  };
  document.querySelector(".add__btn").addEventListener("click", ctrlAddItem);
  document.addEventListener("keypress", function(event) {
    // Older browser compatibility with which
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });
})(budgetController, UIController);
