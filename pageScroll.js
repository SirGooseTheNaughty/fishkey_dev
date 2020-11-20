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
const pages = document.querySelectorAll('#rec246755730, #rec246756036, #rec246756063');
$(pages).css({
    'position': 'fixed',
    'width': '100vw',
    'height': '100vh',
    'top': '100vh',
    'left': '0',
    'transition': '0.4s ease-in-out'
});
pages[0].style.top = '0';
pages[1].querySelector('div').style.transition = 'transform 0.1s linear';

function nextPage(direction) {
    const nexPage = activePage+direction;
    if(nexPage < pages.length && nexPage >= 0) {
        document.removeEventListener('wheel', pageChange);
        pages[nexPage].style.top = '0';
        
        if (direction > 0) {
            pages[activePage].style.top = '-100vh';
        } else {
            pages[activePage].style.top = '100vh';
        }
        setTimeout(() => {
            activePage = activePage + direction;
            document.addEventListener('wheel', pageChange);
        }, 400);
    }
}