$(document).ready(function () {
    // 1. Let DataTables fetch and build the table for you!
    const table = $('#data-table').DataTable({
        ajax: {
            url: 'http://apbiphbpswb01:9876/api/POMESReasons/LeveledData',
            dataSrc: '', // Tells DataTables our API returns a flat array: [{...}, {...}]
            error: function (xhr, error, thrown) {
                console.error("DataTables AJAX error:", error);
                $('#data-table tbody').html('<tr><td colspan="5" class="text-center text-danger">Failed to load data.</td></tr>');
            }
        },
        columns: [
            { data: 'lineName', defaultContent: 'N/A' },
            { data: 'material', defaultContent: 'N/A' },
            { data: 'po', defaultContent: 'N/A' },
            {
                data: 'advanceReasons',
                className: 'text-center',
                render: function (data, type, row) {
                    return createBadgeHtml(data, 'Advance');
                }
            },
            {
                data: 'linestopReasons',
                className: 'text-center',
                render: function (data, type, row) {
                    return createBadgeHtml(data, 'Linestop');
                }
            }
        ]
    });

    // 2. Helper function to generate the button HTML
    function createBadgeHtml(reasonsData, typeTitle) {
        // Fallback: If you didn't fix the C# backend like I told you, it's a string. 
        // If you did fix it, it's already an array.
        let parsedReasons = typeof reasonsData === 'string' ? JSON.parse(reasonsData || "[]") : (reasonsData || []);

        if (!parsedReasons || parsedReasons.length === 0) {
            return `<span class="badge bg-secondary">0</span>`;
        }

        // Store data in HTML5 data-* attributes for event delegation
        const safeData = encodeURIComponent(JSON.stringify(parsedReasons));

        return `
            <button class="btn btn-sm btn-outline-danger view-reasons-btn" 
                    data-type="${typeTitle}" 
                    data-reasons="${safeData}">
                View ${parsedReasons.length}
            </button>
        `;
    }

    // 3. EVENT DELEGATION: Bind click to the table body, not the buttons directly!
    $('#data-table tbody').on('click', '.view-reasons-btn', function () {
        const btn = $(this);
        const typeTitle = btn.data('type');
        const encodedData = btn.data('reasons');
        const reasons = JSON.parse(decodeURIComponent(encodedData));

        const modalTitle = $('#reasonsModalLabel');
        const modalBody = $('#modal-body-content');

        modalTitle.text(`${typeTitle} Reasons`);
        modalBody.empty(); // Clear old content

        if (reasons.length === 0) {
            modalBody.html('<p class="text-muted">No reasons provided.</p>');
        } else {
            const ul = $('<ul class="list-group"></ul>');
            reasons.forEach(r => {
                ul.append(`
                    <li class="list-group-item">
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1 text-primary">${r.action_label || 'NO LABEL'}</h6>
                        </div>
                        <p class="mb-1 small"><strong>Reason:</strong> ${r.reason_label || 'None'}</p>
                        <small class="text-muted"><strong>Notes:</strong> ${r.action_notes || 'No notes left.'}</small>
                    </li>
                `);
            });
            modalBody.append(ul);
        }

        // Trigger the Bootstrap modal
        const modalElement = document.getElementById('reasonsModal');
        const bsModal = bootstrap.Modal.getOrCreateInstance(modalElement);
        bsModal.show();
    });
});