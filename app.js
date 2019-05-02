/**
 * Budget Controller
 */
var budgetController = (function() {})();

/**
 * UI Controller
 */
var UIController = (function() {
  return {
    getInput: function() {
      // Either 'inc' or 'exp', income and expense, respectively
      var type = document.querySelector(".add__type").value;
      var description = document.querySelector(".add__description").value;
      var value = document.querySelector(".add__value").value;

      return {
        type: type,
        description: description,
        value: value
      };
    }
  };
})();

/**
 * Global App Controller
 */
var controller = (function(budgetCtrl, UICtrl) {
  var ctrlAddItem = function() {
    // Grab input data ✅
    var input = UICtrl.getInput();
    // Add item to the budget controller
    // Add the item to the UI
    // Calculate budget
    // Display the budget on the UI
  };
  document.querySelector(".add__btn").addEventListener("click", ctrlAddItem);
  document.addEventListener("keypress", function(event) {
    // Older browser compatibility with which
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });
})(budgetController, UIController);
