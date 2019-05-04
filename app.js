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
    },
    budget: 0,
    percentage: -1 // -1 is a 'do not exist' value
  };
  // Function constructor for Expense type
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1; // keeping consistent w/ data variable
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    this.percentage =
      totalIncome > 0 ? Math.round((this.value / totalIncome) * 100) : -1;
  };
  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  //Function constructor for Income type
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type) {
    return data.allItems[type].length === 0
      ? 0
      : data.allItems[type].map(x => x.value).reduce((a, b) => a + b);
  };

  var budgetFactory = function(input) {
    // Need to generate a unique id for each item in each array
    // Do not use size of array, but rather the actual value since items can be
    // deleted from either array
    // best case: [1 2 3 4 5], next Id = 6 (sorted)
    // worst case: [1 2 4 6 8], next Id = 9 (unsorted)
    var id =
      data.allItems[input.type].length === 0
        ? 0
        : data.allItems[input.type][data.allItems[input.type].length - 1].id +
          1;
    switch (true) {
      case input.type === "inc":
        var income = new Income(id, input.description, input.value);
        data.allItems[input.type].push(income);
        return income;
      case input.type === "exp":
        var expense = new Expense(id, input.description, input.value);
        data.allItems[input.type].push(expense);
        return expense;
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
    },
    getBudget: function() {
      return {
        budget: data.budget,
        percentage: data.percentage,
        totalIncome: data.totals.inc,
        totalExpenses: data.totals.exp
      };
    },
    calculateBudget: function() {
      // iterate through incomes and expenses
      data.totals.exp = calculateTotal("exp");
      data.totals.inc = calculateTotal("inc");
      // calculate budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      // calculate percentage of income that we spent
      data.percentage =
        data.totals.inc > 0
          ? Math.round((data.totals.exp / data.totals.inc) * 100)
          : -1;
    },
    /**
     * Sample case
     * a = 20 (a / income * 100 = 20%)
     * b = 10 (b / income * 100= 10%)
     * c = 40 (c / income * 100 40%)
     * income = 100
     */
    calculatePercentages: function() {
      data.allItems.exp.forEach(x => x.calcPercentage(data.totals.inc));
    },
    getPercentages: function() {
      return data.allItems.exp.map(x => x.getPercentage());
    },
    deleteItem: function(identifier, type) {
      var ids = data.allItems[type].map(curr => curr.id);
      var index = ids.indexOf(
        typeof identifier === "string" ? parseInt(identifier) : identifier
      );
      if (index > -1) data.allItems[type].splice(index, 1);
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
    keyPressEvent: "keypress",
    incomeContainer: ".income__list",
    expenseContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercentageLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };

  /**
   * + or - before number
   * always 2 levels of precision
   * comma separating thousands
   *
   * 99.999 -> 100.00
   * 2000 -> 2,000.00
   */
  var formatNumber = function(number, type) {
    var numSplit, int, dec, type;
    number = Math.abs(number);
    number = number.toFixed(2);
    numSplit = number.split("."); // Split into two parts, XXXX.YY
    int = numSplit[0];
    dec = numSplit[1];

    // https://stackoverflow.com/a/2901298 (todo: interesting solution!)
    int = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
  };
  /**
   *
   * @param {*} list
   * @param {*} callback
   */
  var nodeListForEach = function(list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
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
        value: parseFloat(value)
      };
    },
    addListItem: function(obj, type) {
      var html, newHtml, isIncome, element;
      isIncome = type === "inc";
      html =
        // Create HTML string with placeholder text
        isIncome
          ? '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
          : '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

      element = isIncome
        ? DOMStrings.incomeContainer
        : DOMStrings.expenseContainer;
      // Replace placeholder text w/ actual data
      newHtml = html
        .replace("%id%", obj.id)
        .replace("%value%", formatNumber(obj.value, type))
        .replace("%description%", obj.description);
      // Insert HTML into DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    deleteListItem: function(selectorId) {
      // Can only remove a child from the parent element
      var elementToRemove = document.getElementById(selectorId);
      elementToRemove.parentNode.removeChild(elementToRemove);
    },
    getDOMStrings: function() {
      return DOMStrings;
    },
    clearFields: function() {
      var fields;
      fields = document.querySelectorAll(
        DOMStrings.inputDescription + "," + DOMStrings.inputValue
      );
      var fieldsArray = Array.prototype.slice.call(fields); // Convert NodeList -> Array
      fieldsArray.forEach(function(curr, i, array) {
        // Loop over input fields, set to empty string
        curr.value = "";
      });
      fieldsArray[0].focus(); // return focus to the input for description
    },
    displayBudget: function(obj) {
      var type;
      type = obj.budget >= 0 ? "inc" : "exp";
      document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(
        obj.totalIncome,
        "inc"
      );
      document.querySelector(
        DOMStrings.expenseLabel
      ).textContent = formatNumber(obj.totalExpenses, "exp");
      document.querySelector(DOMStrings.percentageLabel).textContent =
        obj.percentage < 0 ? "---" : obj.percentage + "%";
    },
    displayPercentages: function(percentages) {
      console.log(percentages);
      var fields = document.querySelectorAll(
        DOMStrings.expensesPercentageLabel
      );
      nodeListForEach(fields, function(current, index) {
        current.textContent =
          percentages[index] > 0 ? percentages[index] + "%" : "---";
      });
    },
    displayDate: function() {
      var now, year, month;
      now = new Date();
      month = now.getMonth();
      months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      year = now.getFullYear();
      document.querySelector(DOMStrings.dateLabel).textContent =
        months[month] + " " + year;
    },
    changeType: function() {
      // change description
      // change value
      // change selector
      var fields = document.querySelectorAll(
        DOMStrings.inputType +
          "," +
          DOMStrings.inputDescription +
          "," +
          DOMStrings.inputValue
      );
      nodeListForEach(fields, function(curr) {
        curr.classList.toggle("red-focus");
      });
      // change button style
      document.querySelector(DOMStrings.inputButton).classList.toggle("red");
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

    // Adding event listener to parent html element of both income and expenses
    // Delegating responsibility of manipulating DOM to ctrlDeleteItem
    document
      .querySelector(DOM.container)
      .addEventListener(DOM.clickEvent, ctrlDeleteItem);

    document
      .querySelector(DOM.inputType)
      .addEventListener("change", UICtrl.changeType);
  };

  var updateBudget = () => {
    // Calculate budget
    budgetCtrl.calculateBudget();
    // Return budget
    var budget = budgetCtrl.getBudget();
    // Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  var updatePercentages = () => {
    // calculate percentages
    budgetCtrl.calculatePercentages();
    // read percentages from budget controller
    var percentages = budgetCtrl.getPercentages();
    // update UI with new percentages
    UICtrl.displayPercentages(percentages);
  };

  var ctrlAddItem = function() {
    var input, newItem;
    // Grab input data ✅
    var input = UICtrl.getInput();
    // Only add item if there is valid input
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // Add item to the budget controller
      newItem = budgetCtrl.pushItem(input);
      // Add the item to the UI
      UICtrl.addListItem(newItem, input.type);
      // Clear the fields
      UICtrl.clearFields();
      // Calculate and update budget
      updateBudget();
      // Calculate & update percentages
      updatePercentages();
    }
  };

  /**
   * Event bubbling to find if the user clicked on the delete icon
   * @param {*} event
   */
  var ctrlDeleteItem = event => {
    var itemID;
    // Not best practice, hard coding here
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      var splitID = itemID.split("-");
      var type = splitID[0];
      var id = splitID[1];

      // delete item from data structure in budget controller
      budgetCtrl.deleteItem(id, type);
      // delete item from ui
      UICtrl.deleteListItem(itemID);
      // update and show the new budget
      updateBudget();
      // Calculate and update percentages
      updatePercentages();
    }
    // Traverse from <i> (icon) element through parentNode X4
    // console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);
    // console.log(event);
    // if (event.target)
  };

  return {
    init: function() {
      console.log("Application has started!");
      UICtrl.displayBudget({
        budget: 0,
        percentage: -1,
        totalIncome: 0,
        totalExpenses: 0
      });
      UICtrl.displayDate();
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();
