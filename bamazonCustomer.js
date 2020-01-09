var mysql = require("mysql");
var inquirer = require("inquirer");
//Create connection information for SQL database
var connection = mysql.createConnection({
    host: "localhost",
    //Port (should be 3306)
    port: 3306,
    //Username 
    user: "root",
    //Password
    password: "",
    database: "bamazon"
});

//connect to the mysql server and sql database 
connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");
    //run start function after connection is made to prompt the user
    showItems();
});

function showItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("\n Item ID: " + res[i].item_id +
                " Product name: " + res[i].product_name +
                " Department: " + res[i].department_name +
                " Price: " + res[i].price +
                " In stock: " + res[i].stock_quantity);
        }
        selectID();
    });
};

//function selectID to prompt user for which ID they want to buy
function selectID() {
    inquirer.prompt([{
        name: "IDItemSearch",
        type: "userSearchInput",
        message: "What is the ID of the item you would like to buy?"
    }, 
    {
        name: "numberOfUnits",
        type: "userNumberInput",
        message: "How many units of the product would you like to buy?"
    }]).then(function (answers, res) {
            IDItemSearch = answers.item_id;
            numberOfUnits = answers.stock_quantity;
            var chosenItem;
            if (IDItemSearch > res) {
                    console.log("Item ID not found");
                    connection.end();
                }
            for (var i = 0; i < res; i++) {
                if (res[i].item_id === IDItemSearch) {
                    chosenItem = res[i];
                }
            }
            if (chosenItem.stock_quantity > numberOfUnits) {
                updateQuantity = chosenItem.stock_quantity - numberOfUnits;
                totalCost = chosenItem.price * numberOfUnits;

                connection.query(
                    "UPDATE products SET ? WHERE ?", 
                    [
                        {
                            stock_quantity: updateQuantity
                        },
                        {
                            item_id: IDItemSearch
                        }
                    ]
                )
                console.log("Total price is: $" + totalCost);
                connection.end();
            }
            else {
                console.log ("Insufficient quantity!");
                connection.end();
            }
        })
    };
            