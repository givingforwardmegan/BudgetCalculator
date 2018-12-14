
//BUDGET CONTROLLER
var budgetController = (function() {

    //fn constructors so that all obj created through them will have these args.
    //each obj will inherit from prototype
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });

        data.totals[type] = sum;
    };

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
         percentage: -1
    };

    return {
        addItem: function(type, des, val) {
            var ID, newItem;

            if (data.allItems[type].length > 0) {
                //  Create new ID
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create new Item based on 'exp' or 'inc'
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // Push to data structure
            data.allItems[type].push(newItem);

            // Return new element
            return newItem;
        },

        calculateBudget: function() {

            // 1. Calc. total inc and exp
            calculateTotal('exp');
            calculateTotal('inc');

            // 2. Calc. the budget: inc - exp
            data.budget = data.totals.inc - data.totals.exp;

            // 3. Calc. the percentage of inc that has been spent
            if (data.totals.inc > 0 ) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            };
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function() {
            console.log(data);
        }
    };


})();


// UI CONTROLLER
var UIController = (function() {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    }


    return {
        getInput: function() {
            return {
                 type: document.querySelector(DOMstrings.inputType).value,  //either inc or exp
                 description: document.querySelector(DOMstrings.inputDescription).value,
                 value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {
            var html, newHTML, element;

            // Create HTML str with placeholder text
            if (type === 'inc') {

                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {

                element = DOMstrings.expenseContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            // Replace placeholder text with actual data - Rec'd from obj
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
        },

        clearFields: function() {
            var fields, fieldsArr;

            //returns a list
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            //create array from list
            fieldsArr = Array.prototype.slice.call(fields);

            //loop through array in order to clear fields
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },
        
        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            
            if (obj.percentage > 0 ) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        //expose DOMstrings obj to public
        getDOMStrings: function() {
            return DOMstrings;
        }
    };
})();


//GLOBAL APP CONTROLLER - to control all modules
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMStrings();

        //ADD button click handler
        document.querySelector(DOM.addButton).addEventListener('click', ctrlAddItem);

        //global on keypress event for enter key
        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
        }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
};

    var updateBudget = function() {

        //  1. calculate the budget total
        budgetController.calculateBudget();

        //  2. return the budget
        var budget = budgetCtrl.getBudget();

        //  3. display the budget total in UI
        UICtrl.displayBudget(budget);

    };

    var ctrlAddItem = function() {
        var input, newItem;

        //  1. get the field input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
        
            //  2. add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //  3. add the n ew item to the UI
            UICtrl.addListItem(newItem, input.type);
            
            //  4. Clear the fields
            UICtrl.clearFields();

            //  5. Calc. and update budget
            updateBudget();
        } 
    };

    var ctrlDeleteItem = function(event) {
        var itemId;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemId) {

        }
    };

    return {
        init: function() {
            console.log("starting up...");
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners(); 
        }
    };

 
})(budgetController, UIController);


controller.init();
