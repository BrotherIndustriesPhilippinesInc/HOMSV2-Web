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