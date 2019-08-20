const inquirer = require('inquirer');
const mysql = require('mysql');

var connection = mysql.createConnection({
    host:'localhost',
    port: 3306,
    user:'root',
    password:'030102Car*',
    database:'bamazon'
});

connection.connect(function(err){
    if (err) throw err;
    console.log('Succcessful connection!');
    displayItems();
})

function displayItems() {
    connection.query('SELECT * FROM products', function(err, res) {
        for (let i = 0; i < res.length; i++) {
            console.log(res[i].item_id + ' | ' + res[i].product_name + ' | ' + res[i].department_name + ' | $' + res[i].price + ' | ' + res[i].stock_quantity+'\n')
        }
        runSearch(res);
    })
}

    function runSearch(res) {
        inquirer.prompt([{
            type: 'input',
            name: 'choice',
            message: 'What item would you like to buy?'
        }]).then(function(answer) {
            var correct=false;
            for (let i = 0; i < res.length; i++){
                if (res[i].product_name == answer.choice) {
                    correct=true;
                    var product=answer.choice;
                    var id=i;
                    inquirer.prompt({
                        type: 'input',
                        name: 'quantity',
                        message: 'Enter quantity to purchase:',
                        validate: function(value) {
                            if (isNaN(value) == false) {
                                return true; 
                            } else {
                                return false;
                            }
                        }
                    }).then(function(answer) {
                        if((res[id].stock_quantity-answer.quantity) > 0) {
                            connection.query('UPDATE products SET stock_quantity="'+ (res[id].stock_quantity-answer.quantity)+'" WHERE product_name = "' + product + '"', function(err, res2) {
                                console.log('Thank you for your purchase! Total cost is $' + answer.quantity * res[id].price +'.');
                                displayItems();
                            })
                        } else {
                            console.log('Insufficient quantity, try again.');
                            runSearch(res);
                        }
                    })
                }
            }
        })
    }



