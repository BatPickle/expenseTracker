document.getElementById('expense-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const expenseName = document.getElementById('expense-name').value;
    const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
    const expenseCategory = document.getElementById('expense-category').value;

    if (expenseName && !isNaN(expenseAmount) && expenseCategory) {
        await addExpense(expenseName, expenseAmount, expenseCategory);
        updateTotals();
        document.getElementById('expense-form').reset();
    }
});

document.getElementById('clear-all').addEventListener('click', function() {
    confirmClearAll();
});

async function addExpense(name, amount, category) {
    const expenseList = document.getElementById(`${category.toLowerCase().replace(/ /g, '-')}-list`);
    const expenseItem = document.createElement('li');
    expenseItem.textContent = `${name}: $${amount.toFixed(2)}`;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.classList.add('remove-btn');
    removeButton.onclick = async function() {
        expenseList.removeChild(expenseItem);
        updateTotals();
    };

    expenseItem.appendChild(removeButton);
    expenseList.appendChild(expenseItem);
}

async function updateTotals() {
    const categories = ['fast-food', 'groceries', 'other-purchases', 'restaurant'];
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

async function confirmClearAll() {
    const clearAllBtn = document.getElementById('clear-all');
    clearAllBtn.textContent = 'Are you sure?';
    clearAllBtn.onclick = async function() {
        await clearAllExpenses();
        clearAllBtn.textContent = 'Clear All';
        clearAllBtn.onclick = confirmClearAll;
    };
}

async function clearAllExpenses() {
    const categories = ['fast-food', 'groceries', 'other-purchases', 'restaurant'];

    categories.forEach(category => {
        const expenseList = document.getElementById(`${category}-list`);
        while (expenseList.firstChild) {
            expenseList.removeChild(expenseList.firstChild);
        }
        document.getElementById(`${category}-total`).textContent = '0.00';
    });

    document.getElementById('total-amount').textContent = '0.00';
}

// Load expenses when the page is loaded
window.onload = updateTotals;
