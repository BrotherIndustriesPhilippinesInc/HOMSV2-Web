export default function dataTablesInitialization(selector, params = {responsive: true,}) {
    
    const defaultOptions = {
        responsive: true,
        fixedHeader: true,
    };

    let table = $(selector).DataTable({
        ...defaultOptions,
        ...params
    });

    return table;
}
