let playBtn = document.querySelector('.playNow');
let expandingWhite = document.querySelector('.expandingWhite');

playBtn.addEventListener('click', () => {
    expandingWhite.classList.add('expand');
    setTimeout(() => {
        expandingWhite.classList.add('expanded');
        window.location.href = 'nameChooser/';
    }, 1000);
});