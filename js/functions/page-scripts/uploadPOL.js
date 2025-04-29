import {
    Uppy,
    Dashboard,
    Url,
    XHRUpload
  } from 'https://releases.transloadit.com/uppy/v4.13.2/uppy.min.mjs'
  
$(function () {
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
    
        const forUpdate = $('#update_pol').is(':checked');
        const isMultipleFiles = totalFiles > 1;
    
        files.forEach((file, index) => {
            uppy.setFileMeta(file.id, {
                is_first_file: index === 0,
                for_update: forUpdate,
                is_multiple_files: isMultipleFiles
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
});