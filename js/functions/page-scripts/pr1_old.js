
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

    const delayResult = new bootstrap.Modal('#delayModal', {});
    const delayDetailsResult = new bootstrap.Modal('#delayDetailsModal', {});

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
            { data: "productionOrder" },
            { data: "modelCode" },
            { data: "target" },
            { data: "inputActual" },
            { data: "cummTarget" },
            { data: "cummActual" },
            { data: "time" },
            { data: "productionLine" },
            { data: "status" },
            {
            title: "Actions",
            data: "productionOrder",
            render: function (data) {
                return `<button class="btn btn-sm btn-primary detailsButton" data-po="${data}">
                            Details
                        </button>`;
            },
            orderable: false
        }

        ],
        order: [[8, "asc"]], // sort by status
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
            didOpen: async() => {
                Swal.showLoading();
                
                //sendToWebView("checkDelayButtonClicked", {});
                let data = await apiCall(
                    `http://apbiphbpswb01:9876/api/POStatus/DelayStatusFullTimeline`,
                    "GET"
                ).then((data) => {
                    Swal.hideLoading();

                    Swal.close();
                    
                    delayResult.show();
            
                    let dataTableData = datatablesDataBuilder(data);


                    delaysTable.clear().rows.add(dataTableData).draw();
                });
            }
        });
        
    });

    $("#refreshBtn").on("click", async function () {
        Swal.fire({
            title: "Refreshing Delay Data...",
            text: "This may take a few moments. Please wait.",
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: async() => {
                Swal.showLoading();
                let data = await apiCall(
                    `http://apbiphbpswb01:9876/api/POStatus/DelayStatusFullTimeline`,
                    "GET"
                ).then((data) => {
                    Swal.hideLoading();
                    Swal.close();

                    let dataTableData = datatablesDataBuilder(data);

                    delaysTable.clear().rows.add(dataTableData).draw();
                });
            }
        });
    });

    $('#delay-table').on('click', '.detailsButton', function () {
        const po = $(this).data('po');

        //console.log("Selected PO:", po);
        getPODetails(po);
    });
    
    $("#refreshDetailsBtn").on("click", function () {
        const po = $("#detailsPONumber").text();
        getPODetails(po);
    });

    function buildDelayDetailsHTML(data) {

        const d = data[0];
        if (!d) return "<p>No data found.</p>";

        const { poStatus, target, output, taktTime } = d;

        let hourlyRows = "";

        const targetHourly = target.hourly;
        const targetCumulative = target.cumulative;

        const outputHourly = output.hourlyOutput;
        const outputCumulative = output.hourlyOutputCommulative;

        // Build dynamic rows
        // Build dynamic rows
        hourlyRows = "";

        // Build aligned & sorted timeline from keys
            const timeline = Object.keys({
                ...targetHourly,
                ...outputHourly
            }).sort((a, b) => new Date(a) - new Date(b));

            // Generate row per timeline entry
            for (const time of timeline) {

                const t  = targetHourly[time] ?? 0;
                const tc = targetCumulative[time] ?? 0;

                const o  = outputHourly[time] ?? 0;
                const oc = outputCumulative[time] ?? 0;

                const variance = oc - tc;

                hourlyRows += `
                    <tr>
                        <td>${time}</td>
                        <td>${t}</td>
                        <td>${tc}</td>
                        <td>${o}</td>
                        <td>${oc}</td>
                        <td class="${variance < 0 ? "text-danger fw-bold" : "text-success fw-bold"}">
                            ${variance}
                        </td>
                    </tr>
                `;
        }




        return `
        <div class="container-fluid">

            <div class="mb-3">
                <h5>PO Information</h5>
                <table class="table table-sm table-bordered">
                    <tbody>
                        <tr><th>PO</th><td id="detailsPONumber">${poStatus.po}</td></tr>
                        <tr><th>PO Type</th><td>${poStatus.poType}</td></tr>
                        <tr><th>Model Code</th><td>${poStatus.modelCode}</td></tr>
                        <tr><th>Production Line</th><td>${poStatus.prodLine}</td></tr>
                        <tr><th>Status</th>
                            <td class="${d.status === "Delayed" ? "text-danger fw-bold" : "text-success fw-bold"}">
                                ${d.status}
                            </td>
                        </tr>
                        <tr><th>Planned Qty</th><td>${poStatus.plannedQty}</td></tr>
                        <tr><th>Produced Qty</th><td>${poStatus.producedQty}</td></tr>
                        <tr><th>Finished Qty</th><td>${poStatus.finishedQty}</td></tr>
                        <tr><th>Actual Start</th><td>${poStatus.actualStart}</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="mb-3">
                <h5>Hourly Target vs Actual Output</h5>
                <table class="table table-bordered table-sm">
                    <thead class="table-light">
                        <tr>
                            <th>Time</th>
                            <th>Target</th>
                            <th>Cumulative Target</th>
                            <th>Actual Output</th>
                            <th>Cumulative Output</th>
                            <th>Variance</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${hourlyRows}
                    </tbody>
                </table>
            </div>

            <div>
                <h5>Takt Time</h5>
                <p><strong>${taktTime} seconds</strong> per unit</p>
            </div>

        </div>`;
    }

    function getPODetails(po) {
        Swal.fire({
            title: "Checking for Details...",
            text: "This may take a few moments. Please wait.",
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didOpen: async() => {
                Swal.showLoading();
                
                //sendToWebView("checkDelayButtonClicked", {});
                let data = await apiCall(
                    `http://apbiphbpswb01:9876/api/POStatus/DelayStatusFullTimeline?po=${po}`,
                    "GET"
                ).then((data) => {
                    Swal.hideLoading();

                    Swal.close();

                    const detailsHTML = buildDelayDetailsHTML(data);

                    $("#delayDetailsModal .modal-body").html(detailsHTML);

                    

                    $("#delayModal").modal("hide");
                    $("#delayDetailsModal").modal("show");
                });
            }
        });
    }
    
    function datatablesDataBuilder(data) {
        return data
            .filter(item => item.status !== "Completed")
            .map(item => {
                const parseDate = str => {
                    // Convert "2025-11-21 11 AM" to "2025-11-21 11:00:00" for reliable parsing
                    const [datePart, hourPart, meridian] = str.split(/[\s:]+/);
                    let hour = parseInt(hourPart, 10);
                    if (meridian === "PM" && hour !== 12) hour += 12;
                    if (meridian === "AM" && hour === 12) hour = 0;
                    return new Date(`${datePart}T${hour.toString().padStart(2, "0")}:00:00`);
                };

                const actualKeys = Object.keys(item.output.hourlyOutputCommulative);
                const latestActualKey = actualKeys.length ? actualKeys[actualKeys.length - 1] : null;

                let hourlyTarget = 0;
                let cumulativeTarget = 0;

                if (latestActualKey) {
                    const actualDate = parseDate(latestActualKey);

                    // Hourly target
                    const pastHourlyKeys = Object.keys(item.target.hourly)
                        .filter(k => parseDate(k) <= actualDate)
                        .sort((a, b) => parseDate(a) - parseDate(b));
                    if (pastHourlyKeys.length) {
                        const closestHour = pastHourlyKeys[pastHourlyKeys.length - 1];
                        hourlyTarget = item.target.hourly[closestHour] ?? 0;
                    }

                    // Cumulative target
                    const pastCumulativeKeys = Object.keys(item.target.cumulative)
                        .filter(k => parseDate(k) <= actualDate)
                        .sort((a, b) => parseDate(a) - parseDate(b));
                    if (pastCumulativeKeys.length) {
                        const closestCum = pastCumulativeKeys[pastCumulativeKeys.length - 1];
                        cumulativeTarget = item.target.cumulative[closestCum] ?? 0;
                    }
                }

                return {
                    productionOrder: item.poStatus.po,
                    modelCode: item.poStatus.modelCode,
                    target: hourlyTarget,
                    cummTarget: cumulativeTarget,
                    inputActual: latestActualKey ? (item.output.hourlyOutput[latestActualKey] ?? 0) : 0,
                    cummActual: latestActualKey ? (item.output.hourlyOutputCommulative[latestActualKey] ?? 0) : 0,
                    time: latestActualKey ?? "-",
                    productionLine: item.poStatus.prodLine,
                    status: item.status
                };
            });
    }
});
