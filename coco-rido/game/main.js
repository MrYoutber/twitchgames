let expandingWhite = document.querySelector('.expandingWhite');

window.addEventListener('load', () => {
    setTimeout(() => {
        expandingWhite.classList.add('unexpand');
        expandingWhite.classList.remove('expanded');
    }, 100);

    setTimeout(() => {
        expandingWhite.classList.remove('unexpand');
    }, 1100);
});