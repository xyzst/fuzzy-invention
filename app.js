/**
 * Budget Controller
 */
var budgetController = (function() {
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };
  // Function constructor for Expense type
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  //Function constructor for Income type
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var budgetFactory = function(input) {
    switch (true) {
      case input.type === "inc":
        var x = new Income(0, input.description, input.value);
        data.allItems.inc.push(x);
        return x;
      case input.type === "exp":
        var y = new Expense(0, input.description, input.value);
        data.allItems.exp.push(y);
        return y;
      default:
        console.log("Unexpected expense type of " + input.type);
        break;
    }
  };

  return {
    pushItem: function(input) {
      return budgetFactory(input);
    },
    getData: function() {
      return data;
    }
  };
})();

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
  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMStrings();
    document
      .querySelector(DOM.inputButton)
      .addEventListener(DOM.clickEvent, ctrlAddItem);
    document.addEventListener(DOM.keyPressEvent, function(event) {
      // Older browser compatibility with which
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  var ctrlAddItem = function() {
    // Grab input data ✅
    var input = UICtrl.getInput();
    // Add item to the budget controller
    budgetCtrl.pushItem(input);
    var z = budgetCtrl.getData();
    // Add the item to the UI
    // Calculate budget
    // Display the budget on the UI
    console.log(z);
  };

  return {
    init: function() {
      console.log("Application has started!");
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();
