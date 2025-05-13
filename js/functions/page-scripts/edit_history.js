import dataTablesInitialization from '../dataTablesInitialization.js';
import apiCall from '../apiCall.js';

$(async function () {
    const section = JSON.parse(localStorage.getItem('user'))['Section']; 

    const params = {
        ajax: {
            url: `/homs/api/production/getEditHistory.php?section=${section}`, // your endpoint
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
            { data: "creator"},
            { data: "time_created"},
            { data: "old_data"},
            { data: "new_data"},
            {
                data: null,
                title: "Actions",
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-primary edit-st" data-st_id="${row.id}" data-bs-toggle="modal" data-bs-target="#stEditModal">Edit</button>
                        <button class="btn danger delete-st" data-st_id="${row.id}">Delete</button>
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

    
}); 