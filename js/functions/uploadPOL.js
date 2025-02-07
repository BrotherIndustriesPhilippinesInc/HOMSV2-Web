import {
    Uppy,
    Dashboard,
    Url,
  } from 'https://releases.transloadit.com/uppy/v4.13.2/uppy.min.mjs'
  
$(function () {
    new Uppy()
    .use(
        Dashboard, {    
                        inline: true, 
                        target: '#uppy-dashboard',
                        width: '300px',
                        height: '300px',
                        theme: 'dark'
                    }
    )
    .use(FileInput, { });
    console.log("uploadPOL");
});