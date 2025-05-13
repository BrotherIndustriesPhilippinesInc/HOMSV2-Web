import dataTablesInitialization from './../dataTablesInitialization.js';
import apiCall from './../apiCall.js';

$(async function () {
    const section = JSON.parse(localStorage.getItem('user'))['Section']; 

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
        generateHO();
    })
    $(document).on("click", ".dpr-export", function(){
        generateDPR();
    })

    function generateHO(){
        window.location.href = '/homs/API/production/getHO.php';
    }

    function generateDPR(){
        window.location.href = '/homs/API/production/getDPR.php';
    }
});