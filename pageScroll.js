/* ----- СМЕНА ЭКРАНОВ ПО СКРОЛЛУ ----- */
document.addEventListener('wheel', pageChange);

function pageChange(event) {
    console.log(event);
    let delta = event.deltaY;
    if (delta >= 0) {
        nextPage(1);
    } else {
        nextPage(-1);
    }
}

let activePage = 0;
const pages = $('#rec232182146, #rec232182383, #rec232182463');
$(pages[0]).css({
    'position': 'fixed',
    'width': '100vw',
    'height': '100vh',
    'top': '0',
    'left': '0',
    'z-index': '200',
    'transition': '0.4 ease-in-out !important'
});
for(let i=1; i<pages.length; i++) {
    $(pages[i]).css({
        'position': 'fixed',
        'width': '80vw',
        'height': '100vh',
        'top': '100vh',
        'left': '0',
        'z-index': '1',
        'transition': '0.4 ease-in-out !important'
    });
}

function nextPage(direction) {
    const nexPage = activePage+direction;
    if(nexPage < pages.length && nexPage >= 0) {
        document.removeEventListener('wheel', pageChange);
        $(pages[nexPage]).css({
            'width': '100vw',
            'top': '0',
            'z-index': '200'
        });
        $(pages[activePage]).css('z-index', '1');
        setTimeout(() => {
            $(pages[activePage]).css({
                'width': '80vw',
                'top': '100vh',
                'z-index': '1'
            });
            activePage = activePage + direction;
            document.addEventListener('wheel', pageChange);
        }, 400);
    }
}