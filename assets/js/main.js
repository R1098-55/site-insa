document.addEventListener('DOMContentLoaded', () => {
    const waToggleBtn = document.getElementById('waToggleBtn');
    const waMenu = document.getElementById('waMenu');

    if (waToggleBtn && waMenu) {
        waToggleBtn.addEventListener('click', () => {
            waMenu.classList.toggle('active');
        });
    }
});