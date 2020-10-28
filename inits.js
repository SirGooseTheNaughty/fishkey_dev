/* 
<script type="text/javascript" src="https://sirgoosethenaughty.github.io/fishkey/fishkey.js"></script>
<link rel="stylesheet" type="text/css" href="https://sirgoosethenaughty.github.io/fishkey/fishkey.css"/>


вырисовка вектора 
<script>
    const vd_forSVG = '[data-elem-id="1602680224542"], [data-elem-id="1602764093911"]', // селекторы для вставки векторов
        vd_svgs = [                                                                     // svg
            `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M99.5 50C99.5 77.3381 77.3381 99.5 50 99.5C22.6619 99.5 0.5 77.3381 0.5 50C0.5 22.6619 22.6619 0.5 50 0.5C77.3381 0.5 99.5 22.6619 99.5 50Z" stroke="black"/>
            </svg>`,
            `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M99.5 50C99.5 77.3381 77.3381 99.5 50 99.5C22.6619 99.5 0.5 77.3381 0.5 50C0.5 22.6619 22.6619 0.5 50 0.5C77.3381 0.5 99.5 22.6619 99.5 50Z" stroke="black"/>
            </svg>`
        ];
        
    const logoPaths = vectorDraw_init(vd_forSVG, vd_svgs);  // инициализация
</script>

setTimeout(() => {
    vectorDraw(logoPaths, 0);   // вместо цифры - номер появляющегося вектора
}, 1500);


кнопка в кружок 
<script>
    buttonToCircle_init('селектор', минимальная ширина);
</script>


шум на фоне
<script>
    bgNoise_init({
        selector: '#rec239137295',    // id блока, в котором лежит элемент с шумом
        opacity: 15,                  // непрозрачность
        grain: ''                     // размер шума (можно оставить пустым) больше px -> больше зерна
    });
</script>


горизонтальный скролл всей страницы
<script>
    fullPageHorScroll_init({
        blocks: '#rec123, #rec456, ...',    // id блоков
        menu: '#rec1234',                   // id меню
        minWidth: 1200,                      // минимальная ширина экрана для анимации
        blockWidth: ''
    })
</script>


горизонтальный скролл элементов в блоке
<script>
    horScrollBlock_init({
        block: '#rec123',           // id блока
        header: '#rec456',          // id заголовка
        minWidth: 1200,             // минимальная ширина экрана для анимации
        totalShift: 1800,           // максимальное смещение блоков
        blockHeight: 530            // высота блока со скроллом
    });
</script>


пишущая машинка
const tw_params = typeWriter_init({
    selector: '[field="tn_text_1603118393520"]',    // селектор
    totalSpeed: '4000',                             // время появления всего текста
    minWidth: '1200',                               // минимальная ширина экрана для анимации
});

document.addEventListener('scroll', () => {
    if ($(window).scrollTop() + $(window).height() > $('#rec240809256').offset().top) {
        tw_startWriting(tw_params);
    }
})







*/


