document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('./users.json');
        const users = await response.json();

        for (const element of users) {
            const data = {
                employeeNumber: element.employeeNumber,
                systemID: 64,
                systemName: "Hourly Output Monitoring System",
                approverNumber: 0
            };

            console.log("Sending:", data);

            const res = await fetch('http://apbiphbpswb01:80/PortalAPI/api/SystemApproverLists/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                console.error('Failed:', res.status, res.statusText);
            } else {
                console.log('Success:', await res.text());
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
