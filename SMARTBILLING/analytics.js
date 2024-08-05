const salesData = new Array(12).fill(0);
const expensesData = new Array(12).fill(0);
const incomeData = new Array(12).fill(0);

document.getElementById('addEntryButton').addEventListener('click', function() {
    const name = document.getElementById('entryName').value.trim();
    const salesAmount = parseFloat(document.getElementById('salesAmount').value);
    const expensesAmount = parseFloat(document.getElementById('expensesAmount').value);
    const incomeAmount = parseFloat(document.getElementById('incomeAmount').value);
    const month = parseInt(document.getElementById('entryMonth').value);

    if (!name || isNaN(salesAmount) || isNaN(expensesAmount) || isNaN(incomeAmount) || isNaN(month)) {
        alert('Please enter a valid name, amounts, and month.');
        return;
    }

    addEntry(salesAmount, expensesAmount, incomeAmount, month);
    updateChart();
    clearForm();
});

function addEntry(salesAmount, expensesAmount, incomeAmount, month) {
    salesData[month] += salesAmount;
    expensesData[month] += expensesAmount;
    incomeData[month] += incomeAmount;
}

function clearForm() {
    document.getElementById('entryName').value = '';
    document.getElementById('salesAmount').value = '';
    document.getElementById('expensesAmount').value = '';
    document.getElementById('incomeAmount').value = '';
    document.getElementById('entryMonth').selectedIndex = 0;
}

const ctx = document.getElementById('reportChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
            {
                label: 'Sales',
                data: salesData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Expenses',
                data: expensesData,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: 'Income',
                data: incomeData,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }
        ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

function updateChart() {
    chart.update();
}
