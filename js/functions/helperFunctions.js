export function search(container, input, className) {
    const filter = input.value.toLowerCase();
    const buttons = container.getElementsByClassName(className);

    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const textValue = button.textContent || button.innerText;
        const wcValue = button.dataset.wcValue || '';

        if (textValue.toLowerCase().includes(filter) || wcValue.toLowerCase().includes(filter)) {
            button.style.display = "";
        } else {
            button.style.display = "none";
        }
    }
}

export function formatTimeOnlyToPostgres(timeString) {
    const [timePart, modifier] = timeString.trim().split(' ');
    let [hours, minutes, seconds] = timePart.split(':').map(Number);

    seconds = seconds ?? 0; // Default to 0 if seconds aren't provided

    if (modifier.toLowerCase() === 'pm' && hours !== 12) {
        hours += 12;
    } else if (modifier.toLowerCase() === 'am' && hours === 12) {
        hours = 0;
    }

    const now = new Date();
    now.setHours(hours, minutes, seconds);

    const pad = n => n.toString().padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}


export function switchModals(hideId, showId) {
    const currentModal = bootstrap.Modal.getInstance(document.getElementById(hideId));
    const nextModalEl = document.getElementById(showId);
    const nextModal = new bootstrap.Modal(nextModalEl);

    if (currentModal) currentModal.hide();

    // Wait for the first modal to finish hiding before showing the next
    nextModalEl.addEventListener('hidden.bs.modal', function handler() {
        nextModal.show();
        // Remove listener to avoid firing multiple times
        nextModalEl.removeEventListener('hidden.bs.modal', handler);
    });
}

export function validateFields(fields) {
    let invalidFields = fields.filter(field => !field.value || field.value.trim() === "");

    if (invalidFields.length > 0) {
        Swal.fire({
            icon: 'error',
            title: 'Missing Fields',
            html: 'Please fill in the following fields:<br><b>' +
                  invalidFields.map(f => f.name).join('</b><br><b>') + '</b>',
        });
        return false; // validation failed
    }

    return true; // validation passed
} 

export function uploader(){
    let user = JSON.parse(localStorage.getItem("user"));
        let successCount = 0;
        let totalFiles = 0;
    
        const uppy = new Uppy({
            restrictions: {
                allowedFileTypes: ['.xlsx', '.xls', '.xlsm'] // Restrict to XLSX and XLS files
            },
            allowMultipleUploadBatches: true
        });
    
        uppy.setMeta({
            user_EmpNo: user['EmpNo'],
            section: user['Section'],
            
        });
    
        uppy
            .use(
                Dashboard, {    
                    inline: true, 
                    target: '#uppy-dashboard',
                    width: '300px',
                    height: '300px',
                    theme: 'dark',
                    showProgressDetails: false
                })
    
            .use(XHRUpload, {
                endpoint: '/homs/API/uploading/uploadPOL.php',
                formData: true,
                limit: 1
            });
    
        uppy.on('upload', () => {
            const files = uppy.getFiles();
            totalFiles = files.length;
            successCount = 0;

        
            files.forEach((file, index) => {
                uppy.setFileMeta(file.id, {
                    is_first_file: index === 0,
                });
            });
        });
    
        uppy.on('upload-success', (file, response) => {
            // Optional: Check for backend's confirmation of complete processing
            const backendStatus = response.body?.processingComplete ?? true;
    
            if (backendStatus) {
                successCount++;
            } else {
                alert(`Server did not confirm full processing for file ${file.name}`);
            }
    
            if (successCount === totalFiles) {
                window.location.href = '/homs/production/wc_selection';
            }
        });
        
        uppy.on('upload-error', (file, error, response) => {
            alert('Error uploading file: ' + file.name + '\n' + error.message);
        });
}

export function resetFields(fields)
{
    /* let selectors = [
        ".register-plant",
        "#register-item-code",
        "#register-sequence-no",
        "#register-item-text",

        "#register-new-st-sap",
        "#register-current-st-mh",
        "#register-st-default-flag",
        "#register-st-update-sign",

        "#register-new-tt-sap",
        "#register-current-tt-mh",
        "#register-tt-update-sign",
        "#register-delete-sign",

        ".register-section"
    ]; */
    
    fields.forEach(selector => {
        let $el = $(selector);
        if ($el.is("select")) {
            $el.prop("selectedIndex", 0); // Reset dropdown to first option
        } else {
            $el.val(""); // Clear input fields
        }
    });
}

export function formatTime(dateString) {
    const date = new Date(dateString);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; // Convert to 12-hour format
    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');

    return `${hours}:${minutes}:${seconds} ${ampm}`;
}

export function convertTo24Hour(timeStr) {
    // Example: "06:56:52 AM" => "06:56:52"
    let [time, modifier] = timeStr.split(' ');
    let [hours, minutes, seconds] = time.split(':');

    if (modifier === 'PM' && hours !== '12') {
        hours = String(parseInt(hours, 10) + 12);
    }
    if (modifier === 'AM' && hours === '12') {
        hours = '00';
    }

    return `${hours.padStart(2, '0')}:${minutes}:${seconds}`;
}

export function getTodayDateString() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}