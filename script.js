document.getElementById('expense-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const expenseName = document.getElementById('expense-name').value;
    const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
    const expenseCategory = document.getElementById('expense-category').value;

    if (expenseName && !isNaN(expenseAmount) && expenseCategory) {
        addExpense(expenseName, expenseAmount, expenseCategory);
        updateTotals();
        saveExpenses();
        document.getElementById('expense-form').reset();
    }
});

document.getElementById('clear-all').addEventListener('click', function() {
    confirmClearAll();
});

function addExpense(name, amount, category) {
    const expenseList = document.getElementById(`${category.toLowerCase().replace(/ /g, '-')}-list`);
    const expenseItem = document.createElement('li');
    expenseItem.textContent = `${name}: $${amount.toFixed(2)}`;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.classList.add('remove-btn');
    removeButton.onclick = function() {
        expenseList.removeChild(expenseItem);
        updateTotals();
        saveExpenses();
    };

    expenseItem.appendChild(removeButton);
    expenseList.appendChild(expenseItem);
}

function updateTotals() {
    const categories = ['fast-food', 'groceries', 'other-purchases'];
    let grandTotal = 0;

    categories.forEach(category => {
        const expenseItems = document.querySelectorAll(`#${category}-list li`);
        let categoryTotal = 0;

        expenseItems.forEach(item => {
            const amount = parseFloat(item.textContent.split('$')[1]);
            categoryTotal += amount;
        });

        document.getElementById(`${category}-total`).textContent = categoryTotal.toFixed(2);
        grandTotal += categoryTotal;
    });

    document.getElementById('total-amount').textContent = grandTotal.toFixed(2);
}

function saveExpenses() {
    const expenseItems = document.querySelectorAll('ul li');
    const expenses = [];

    expenseItems.forEach(item => {
        const [name, amount] = item.textContent.split(': $');
        const category = item.parentElement.id.replace('-list', '').replace(/-/g, ' ');
        expenses.push({ name, amount: parseFloat(amount), category });
    });

    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function loadExpenses() {
    const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    savedExpenses.forEach(expense => addExpense(expense.name, expense.amount, expense.category));
    updateTotals();
}

function confirmClearAll() {
    const clearAllBtn = document.getElementById('clear-all');
    clearAllBtn.textContent = 'Are you sure?';
    clearAllBtn.onclick = function() {
        clearAllExpenses();
    };
}

function clearAllExpenses() {
    const categories = ['fast-food', 'groceries', 'other-purchases'];

    categories.forEach(category => {
        const expenseList = document.getElementById(`${category}-list`);
        while (expenseList.firstChild) {
            expenseList.removeChild(expenseList.firstChild);
        }
        document.getElementById(`${category}-total`).textContent = '0.00';
    });

    document.getElementById('total-amount').textContent = '0.00';
    localStorage.removeItem('expenses');
    document.getElementById('clear-all').textContent = 'Clear All';
    document.getElementById('clear-all').onclick = confirmClearAll;
}

// Load expenses when the page is loaded
window.onload = loadExpenses;
