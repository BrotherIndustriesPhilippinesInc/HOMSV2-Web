import apiCall from "./../apiCall.js";

let chart = null; // ✅ Global chart instance

$(function () {
    // ✅ Auto-refresh every 3 second
    setInterval(updateGraph, 3000);

    // ✅ Initial load
    updateGraph();
});

async function updateGraph() {
    try {
        const data = await apiCall("/homs/API/graphs/GetInitialGraph.php", "GET", null, false);

        // ✅ Get current timestamp
        const now = new Date();
        const oneMinuteAgo = new Date(now.getTime() - 60000); // 60 seconds ago

        // ✅ Separate Line A and Line B data
        const lineAData = data.filter(row => row.line === "Line A" && new Date(row.time) >= oneMinuteAgo);
        const lineBData = data.filter(row => row.line === "Line B" && new Date(row.time) >= oneMinuteAgo);

        // ✅ Initialize second-wise count for the last 60 seconds
        const secondCountsA = {};
        const secondCountsB = {};
        for (let i = 0; i < 60; i++) {
            const secondKey = new Date(now.getTime() - (i * 1000)).toISOString().slice(0, 19);
            secondCountsA[secondKey] = 0;
            secondCountsB[secondKey] = 0;
        }

        // ✅ Aggregate counts per second
        lineAData.forEach(row => {
            const secondKey = new Date(row.time).toISOString().slice(0, 19);
            if (secondCountsA[secondKey] !== undefined) {
                secondCountsA[secondKey]++;
            }
        });

        lineBData.forEach(row => {
            const secondKey = new Date(row.time).toISOString().slice(0, 19);
            if (secondCountsB[secondKey] !== undefined) {
                secondCountsB[secondKey]++;
            }
        });

        // ✅ Convert to Chart.js format
        const chartDataA = Object.keys(secondCountsA).map(second => ({
            x: new Date(second),
            y: secondCountsA[second]
        })).reverse();

        const chartDataB = Object.keys(secondCountsB).map(second => ({
            x: new Date(second),
            y: secondCountsB[second]
        })).reverse();

        // ✅ Update or Create Chart
        if (chart) {
            chart.data.datasets[0].data = chartDataA;
            chart.data.datasets[1].data = chartDataB;
            chart.update();
        } else {
            chart = new Chart(document.getElementById('initial-graph'), {
                type: 'line',
                data: {
                    datasets: [
                        {
                            label: 'Line A (Events Per Second)',
                            data: chartDataA,
                            borderColor: 'skyblue',
                            fill: false
                        },
                        {
                            label: 'Line B (Events Per Second)',
                            data: chartDataB,
                            borderColor: 'yellowgreen',
                            fill: false
                        }
                    ]
                },
                options: {
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'second',
                                tooltipFormat: 'HH:mm:ss'
                            },
                            title: {
                                display: true,
                                text: 'Time (Last 60 Seconds)'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Count'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });
        }

    } catch (error) {
        console.error("Caught API Error:", error);
        alert("API Error: " + error.message);
    }
}
