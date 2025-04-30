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
    let [hours, minutes] = timePart.split(':').map(Number);

    if (modifier.toLowerCase() === 'pm' && hours !== 12) {
        hours += 12;
    } else if (modifier.toLowerCase() === 'am' && hours === 12) {
        hours = 0;
    }

    const now = new Date();
    now.setHours(hours, minutes, 0);

    const pad = n => n.toString().padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(hours)}:${pad(minutes)}:00`;
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