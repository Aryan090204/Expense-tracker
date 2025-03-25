document.addEventListener("DOMContentLoaded", loadExpenses);

const form = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const ctx = document.getElementById("expense-chart").getContext("2d");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let chart;

form.addEventListener("submit", function (e) {
    e.preventDefault();

    let name = document.getElementById("expense-name").value;
    let amount = parseFloat(document.getElementById("expense-amount").value);
    let category = document.getElementById("expense-category").value;

    if (name && amount > 0) {
        let expense = { id: Date.now(), name, amount, category };
        expenses.push(expense);
        localStorage.setItem("expenses", JSON.stringify(expenses));
        renderExpenses();
        updateChart();
        provideFinancialAdvice();
    }
    form.reset();
});


function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenses();
    updateChart();
    provideFinancialAdvice();
}

function loadExpenses() {
    renderExpenses();
    updateChart();
}

function updateChart() {
    let categories = {};
    expenses.forEach(exp => categories[exp.category] = (categories[exp.category] || 0) + exp.amount);

    let labels = Object.keys(categories);
    let data = Object.values(categories);

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels,
            datasets: [{ data, backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"] }],
        },
    });
}

function provideFinancialAdvice() {
    let total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    let categorySpending = {};

    expenses.forEach(exp => {
        categorySpending[exp.category] = (categorySpending[exp.category] || 0) + exp.amount;
    });

    let advice = "Your spending is balanced!";
    if ((categorySpending["Entertainment"] || 0) > total * 0.4) {
        advice = "You are spending too much on entertainment! Consider reducing it.";
    } else if ((categorySpending["Shopping"] || 0) > total * 0.3) {
        advice = "Your shopping expenses are high. Try budgeting more carefully!";
    }

    let adviceBox = document.getElementById("ai-advice");
    adviceBox.textContent = advice;
    adviceBox.classList.remove("hidden");
}

function calculateTax() {
    let income = parseFloat(document.getElementById("income").value);
    let tax = income <= 250000 ? 0 : income <= 500000 ? income * 0.05 : income <= 1000000 ? income * 0.2 : income * 0.3;
    document.getElementById("tax-result").textContent = `Estimated Tax: ₹${tax}`;
}

function mockPayment() {
    alert("Payment Simulation: Transaction Successful!");
}
