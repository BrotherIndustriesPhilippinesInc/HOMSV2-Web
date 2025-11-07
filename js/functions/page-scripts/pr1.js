import apiCall from "../apiCall.js";
import dataTablesInitialization from "../dataTablesInitialization.js";
import {sendToWebView, receiveFromWebView} from "../WebViewInteraction.js";

$(async function () {
    /* === DATEPICKERS === */
    const dateSelect = flatpickr("#dateSelect", {
        mode: "range",
        dateFormat: "Y-m-d",
        disableMobile: true,
        allowInput: true,
        defaultDate: new Date(),
    });

    const finishedDateSelect = flatpickr("#finishedDateSelect", {
        mode: "range",
        dateFormat: "Y-m-d",
        disableMobile: true,
        allowInput: true,
        defaultDate: new Date(),
    });

    /* === INITIAL LOAD === */
    let inputData = await fetchInputData("Input");
    let finishedData = await fetchInputData("Finished");

    // Initialize tables
    let inputTable = dataTablesInitialization("#input-table", {
        data: inputData,
        columns: [
            { data: "prodLine" },
            { data: "po" },
            { data: "qty" },
            { data: "summary" },
            { data: "createdDateStr" },
        ],
        order: [],
    });

    let finishedTable = dataTablesInitialization("#finished-table", {
        data: finishedData,
        columns: [
            { data: "prodLine" },
            { data: "po" },
            { data: "qty" },
            { data: "summary" },
            { data: "createdDateStr" },
        ],
        order: [],
    });

    const params = {
        data: [],
        columns: [
            { data: "productionLine" },
            { data: "modelCode" },
            { data: "productionOrder" },
            { data: "target" },
            { data: "inputActual" },
            { data: "time" },
            { data: "status" },
            
        ],
    };

    let delaysTable = dataTablesInitialization("#delay-table", params);

    // Initialize charts (only visible rows)
    window.inputChart = renderChartFromTable("input-chart", inputTable, "Input");
    window.finishedChart = renderChartFromTable("finished-chart", finishedTable, "Finished");

    /* === EVENTS === */
    $("#dateSelect").on("change", async function () {
        const inputData = await fetchInputData("Input");
        inputTable.clear().rows.add(inputData).draw();
    });

    $("#finishedDateSelect").on("change", async function () {
        const finishedData = await fetchInputData("Finished");
        finishedTable.clear().rows.add(finishedData).draw();
    });

    // Sync chart when table is redrawn (search, paginate, sort, etc.)
    inputTable.on("draw", () => {
        updateChartFromTable(inputTable, window.inputChart);
    });
    finishedTable.on("draw", () => {
        updateChartFromTable(finishedTable, window.finishedChart);
    });

    /* === FUNCTIONS === */

    async function fetchInputData(type) {
        const dateRange = $("#dateSelect").val();
        const [dateFrom, dateTo] = dateRange.includes(" to ")
            ? dateRange.split(" to ")
            : [dateRange, dateRange];

        return await apiCall(
            `http://apbiphbpswb01:9876/api/PR1POL/with-pr1pol?type=${type}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
            "GET"
        );
    }

    function renderChartFromTable(canvasId, table, type) {
        const ctx = document.getElementById(canvasId);

        // Destroy existing chart instance if already created
        if (ctx.chartInstance) {
            ctx.chartInstance.destroy();
        }

        // Get only visible rows (respecting search, filter, pagination)
        const visibleData = table.rows({ search: 'applied', page: 'current' }).data().toArray();

        // Extract labels and datasets
        const labels = visibleData.map(row => row.createdDateStr);
        const summaryData = visibleData.map(row => Number(row.summary)); // Actual
        const qtyData = visibleData.map(row => Number(row.qty));         // Target

        // Create chart
        ctx.chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: type,
                        data: summaryData,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Target (Qty)',
                        data: qtyData,
                        type: 'line',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.3,
                        yAxisID: 'y'
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: { mode: 'index', intersect: false },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Value' }
                    },
                    x: {
                        title: { display: true, text: 'Created Date' }
                    }
                },
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Actual vs Target Chart' }
                }
            }
        });
    }

    function updateChartFromTable(table, chart) {
        if (!chart) return;

        const visibleData = table.rows({ search: "applied", page: "current" }).data().toArray();

        const labels = visibleData.map(row => row.createdDateStr);
        const quantities = visibleData.map(row => Number(row.qty));

        chart.data.labels = labels;
        chart.data.datasets[0].data = quantities;
        chart.update();
    }

    $(".checkDelayButton").on("click", function () {
        Swal.fire({
            title: "Checking for Delays...",
            text: "This may take a few moments. Please wait.",
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: () => {
                Swal.showLoading();
                
                //sendToWebView("checkDelayButtonClicked", {});

                setTimeout(() => {
                    Swal.close();
                    const delayResult = new bootstrap.Modal('#delayModal', {})
                    delayResult.show();
                }, 1000);

                // receiveFromWebView("delayResult", (data) => {

                // });
            }
        });
        
    });
});
