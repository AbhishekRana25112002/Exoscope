
document.addEventListener('DOMContentLoaded', function() {
    // CNN Radar Chart
    const cnnCtx = document.getElementById('cnnRadarChart').getContext('2d');
    new Chart(cnnCtx, {
        type: 'radar',
        data: {
            labels: ['Accuracy', 'Precision', 'Recall', 'F1 Score', 'ROC AUC'],
            datasets: [{
                label: 'CNN Performance',
                data: [0.9965, 0.7143, 1.0, 0.8333, 0.9986],
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: '#3498db',
                borderWidth: 2,
                pointBackgroundColor: '#3498db',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    angleLines: { display: true },
                    suggestedMin: 0,
                    suggestedMax: 1,
                    ticks: { stepSize: 0.2 }
                }
            },
            plugins: {
                legend: { position: 'top' }
            }
        }
    });
    
    // ANN Bar Chart
    const annCtx = document.getElementById('annBarChart').getContext('2d');
    new Chart(annCtx, {
        type: 'bar',
        data: {
            labels: ['Accuracy', 'Precision', 'Recall', 'F1 Score', 'ROC AUC'],
            datasets: [{
                label: 'ANN Metrics',
                data: [0.9847, 0.9707, 0.9988, 0.9845, 0.9904],
                backgroundColor: [
                    'rgba(39, 174, 96, 0.7)',
                    'rgba(39, 174, 96, 0.7)',
                    'rgba(39, 174, 96, 0.7)',
                    'rgba(39, 174, 96, 0.7)',
                    'rgba(39, 174, 96, 0.7)'
                ],
                borderColor: [
                    'rgba(39, 174, 96, 1)',
                    'rgba(39, 174, 96, 1)',
                    'rgba(39, 174, 96, 1)',
                    'rgba(39, 174, 96, 1)',
                    'rgba(39, 174, 96, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1.0
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
    
    // Traditional ML Pie Chart
    const traditionalCtx = document.getElementById('traditionalPieChart').getContext('2d');
    new Chart(traditionalCtx, {
        type: 'pie',
        data: {
            labels: ['KNN', 'Decision Tree', 'Logistic Regression'],
            datasets: [{
                data: [0.9823, 0.9339, 0.7531],
                backgroundColor: [
                    'rgba(52, 152, 219, 0.7)',
                    'rgba(155, 89, 182, 0.7)',
                    'rgba(231, 76, 60, 0.7)'
                ],
                borderColor: [
                    'rgba(52, 152, 219, 1)',
                    'rgba(155, 89, 182, 1)',
                    'rgba(231, 76, 60, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'right' },
                title: {
                    display: true,
                    text: 'Accuracy Comparison'
                }
            }
        }
    });
    
    // Comparison Bar Chart
    const comparisonCtx = document.getElementById('comparisonBarChart').getContext('2d');
    new Chart(comparisonCtx, {
        type: 'bar',
        data: {
            labels: ['CNN', 'ANN', 'KNN', 'Decision Tree', 'Logistic Reg'],
            datasets: [
                {
                    label: 'Accuracy',
                    data: [0.9965, 0.9847, 0.9823, 0.9339, 0.7531],
                    backgroundColor: 'rgba(52, 152, 219, 0.7)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 1
                },
                {
                    label: 'F1 Score',
                    data: [0.8333, 0.9845, 0.98, 0.94, 0.76],
                    backgroundColor: 'rgba(230, 126, 34, 0.7)',
                    borderColor: 'rgba(230, 126, 34, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1.0
                }
            },
            plugins: {
                legend: { position: 'top' }
            }
        }
    });
    
    // Trade-off Chart
    const tradeoffCtx = document.getElementById('tradeoffChart').getContext('2d');
    new Chart(tradeoffCtx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'CNN',
                    data: [{x: 0.7143, y: 1.0}],
                    backgroundColor: 'rgba(52, 152, 219, 1)',
                    pointRadius: 10
                },
                {
                    label: 'ANN',
                    data: [{x: 0.9707, y: 0.9988}],
                    backgroundColor: 'rgba(39, 174, 96, 1)',
                    pointRadius: 10
                },
                {
                    label: 'KNN',
                    data: [{x: 0.96, y: 1.0}],
                    backgroundColor: 'rgba(155, 89, 182, 1)',
                    pointRadius: 10
                },
                {
                    label: 'Decision Tree',
                    data: [{x: 0.90, y: 0.98}],
                    backgroundColor: 'rgba(231, 76, 60, 1)',
                    pointRadius: 10
                },
                {
                    label: 'Logistic Reg',
                    data: [{x: 0.71, y: 0.82}],
                    backgroundColor: 'rgba(241, 196, 15, 1)',
                    pointRadius: 10
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: { display: true, text: 'Precision' },
                    min: 0.6,
                    max: 1.0
                },
                y: {
                    title: { display: true, text: 'Recall' },
                    min: 0.6,
                    max: 1.0
                }
            },
            plugins: {
                legend: { position: 'right' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: Precision=${context.parsed.x.toFixed(2)}, Recall=${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
    
    // Animate progress bars on tab show
    document.querySelectorAll('[data-bs-toggle="pill"]').forEach(tab => {
        tab.addEventListener('shown.bs.tab', function() {
            document.querySelectorAll('.progress-bar').forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
        });
    });
});
