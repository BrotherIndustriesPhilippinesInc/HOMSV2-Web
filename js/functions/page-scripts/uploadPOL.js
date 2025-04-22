import {
    Uppy,
    Dashboard,
    Url,
    XHRUpload
  } from 'https://releases.transloadit.com/uppy/v4.13.2/uppy.min.mjs'
  
$(function () {
    let user = JSON.parse(localStorage.getItem("user"));

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
        });

    uppy.on("upload", () => {
        const files = uppy.getFiles();
        const isAdditional = files.length > 1 ? true : $('#add_pol').is(':checked');
        uppy.setMeta({ is_additional: isAdditional });
    });

    uppy.on('upload-success', (file, response) => {
        window.location.href = '/homs/production/wc_selection';
    });

    uppy.on('upload-error', (file, error, response) => {
        alert('Error: ' + error.message);
    });
});