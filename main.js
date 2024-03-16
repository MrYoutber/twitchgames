let openAll = document.getElementById('openAll');

openAll.addEventListener('click', function() {
    let links = document.querySelectorAll('.link');
    links.forEach((link, index) => {
        setTimeout(() => {
            link.click();
        }, index * 10);
    });
});