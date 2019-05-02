/**
 * Budget Controller
 */
var budgetController = (function() {})();

/**
 * UI Controller
 */
var UIController = (function() {
  var DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
    clickEvent: "click",
    keyPressEvent: "keypress"
  };

  return {
    getInput: function() {
      // Either 'inc' or 'exp', income and expense, respectively
      var type = document.querySelector(DOMStrings.inputType).value;
      var description = document.querySelector(DOMStrings.inputDescription)
        .value;
      var value = document.querySelector(DOMStrings.inputValue).value;

      return {
        type: type,
        description: description,
        value: value
      };
    },
    getDOMStrings: function() {
      return DOMStrings;
    }
  };
})();

/**
 * Global App Controller
 */
var controller = (function(budgetCtrl, UICtrl) {
  var DOM = UICtrl.getDOMStrings();
  var ctrlAddItem = function() {
    // Grab input data ✅
    var input = UICtrl.getInput();
    // Add item to the budget controller
    // Add the item to the UI
    // Calculate budget
    // Display the budget on the UI
    console.log(input);
  };
  document
    .querySelector(DOM.inputButton)
    .addEventListener(DOM.clickEvent, ctrlAddItem);
  document.addEventListener(DOM.keyPressEvent, function(event) {
    // Older browser compatibility with which
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });
})(budgetController, UIController);
