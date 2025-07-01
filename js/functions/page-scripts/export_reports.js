import dataTablesInitialization from './../dataTablesInitialization.js';
import apiCall from './../apiCall.js';
import { receiveFromWebView, sendToWebView } from '../WebViewInteraction.js';



$(async function () {
    const section = JSON.parse(localStorage.getItem('user'))['Section'];
    const userId = JSON.parse(localStorage.getItem('user'))["EmpNo"];
    const work_center = localStorage.getItem('wc');
    
    const params = {
        ajax: {
            url: `/homs/api/production/getHistory.php?section=${section}`, // your endpoint
            method: "GET",
            dataSrc: function (json) {
                return json.data; // extract the data array from your JSON
            }
        },
        layout: {
            topStart: {
                buttons: ['colvis']
            },
            topEnd: ['search', 'pageLength'],
        },
        columns: [
            { data: "time_created"},
            { data: "work_center"},
            {
                data: null,
                title: "Actions",
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-primary dpr-export" data-reason_id="${row.work_center}+${row.time_created}">DPR</button>
                        <button class="btn btn-primary ho-export" data-reason_id="${row.work_center}+${row.time_created}">HO</button>
                    `;
                }
            }
        ],
        createdRow: function(row, data, dataIndex) {
            $(row).addClass('reason-row');
            $(row).attr('data-reason-id', data["id"]);
        }
    };
    
    let table = dataTablesInitialization("#data-table", params);

    $(document).on("click", ".ho-export", function(){
        let wc = $(this).data("reason_id").split("+")[0];
        let date = $(this).data("reason_id").split("+")[1];
        generateHO(wc, date);
    });

    $(document).on("click", ".dpr-export", function(){
        let wc = $(this).data("reason_id").split("+")[0];
        let date = $(this).data("reason_id").split("+")[1];
        generateDPR(wc, date);
    });

    receiveFromWebView((data) => {

        if (data.generatedFilePath) {
            window.location.href = `http://apbiphbpsts01:8080/homs/resources/DPR/Generated/${data.generatedFilePath}`;
            Swal.fire({
                title: 'Success!',
                text: 'DPR has been generated.',
                icon: 'success',
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false
            })
        }
    });

    function generateHO(wc, date){
        apiCall(`/homs/API/production/getHO.php?wc=${wc}&date=${date}&section=${section}&user_id=${userId}`, 'GET').then((result) => {
            Swal.fire({
                title: 'Success!',
                text: 'HO has been generated.',
                icon: 'success',
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false
            })
        });
    }

    function generateDPR(wc, date){

        apiCall(`/homs/API/production/getDPRDetails.php?wc=${wc}&date=${date}&section=${section}&user_id=${userId}`, 'GET').then((result) => {
            sendToWebView("generateDPR", result.data);
        });

        /* LOADING */
        Swal.fire({
            title: 'Generating DPR...',
            showConfirmButton: false
        })
    }
});