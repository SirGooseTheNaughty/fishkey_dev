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
        
    const vectorDraw = vectorDraw_init(vd_forSVG, vd_svgs);  // инициализация
</script>

вызывается по
vectorDraw(вектор), где 'вектор' - номер рисующегося вектора с нуля


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


горизонтальный скролл нескольких блоков
<script>
    horScroll_init({
        selectors: '#rec123, #rec456, ...,      // id блоков
        minWidth: 980                           // минимальная ширина экрана для анимации
    });
</script>


появление заголовков
<script>
    const txtAppear = textApp_init({
        selectors: '.tn-elem__123, .tn-elem__456, ...',     // селекторы заголовков
        minWidth: 640,                                      // минимальная ширина экрана для анимации
        animSpeed: 400,                                     // скорость появления всего заголовка
        wordSpeed: 50,                                      // задержка между словами / символами / ...
        divider: 'word'                                     // разделитель: 'symbol' для появления по символу, 'word' по слову,  
    })                                                      // 'phrase' по предложению (через точку), 'line' по строке (через ;;)
</script>

вызывается по
txtAppear(заголовок), где 'заголовок' - номер появляющегося заголовка с нуля


пишущая машинка
<script>
    const tw_startWriting = typeWriter_init({
        selector: '[field="tn_text_1470210011265"]',    // селектор
        totalSpeed: '4000',                             // время появления всего текста
        minWidth: '1200',                               // минимальная ширина экрана для анимации
    });
</script>

вызывается по
tw_startWriting()


шрифт италиком
<script>
    italicLinks_init('selector')    // блок, в котором будут меняться ссылки (оставить пустым для всеей страницы)
</script>


прилипание элементов
<script>
    parallaxInit({
        selector: '#rec123 img',        // любой селектор прилипающих элементов
        minWidth: 1200                  // минимальная ширина экрана для анимации
    })
</script>


односторонняя кнопка
<script>
    oneSideButton_init({
        selectors: '[data-elem-id="1599820091591"], [data-elem-id="1602152450564"]',    // кнопки (второй уровень)
        firstColor: 'red',              // основной цвет фона
        secondColor: 'blue',            // второй цвет фона
        whereTo: 'left',                // направление смены цвета
        firstTextColor: 'blue',         // основной цвет текста
        secondTextColor: 'red',         // второй цвет текста
        animTime: 400,                  // время анимации (в миллисекундах)
        minWidth: 1200                  // минимальная ширина экрана для анимации
    });
</script>


двухсторонняя кнопка
<script>
    oneSideButton_init({
        selectors: '[data-elem-id="1599820096839"]',    // кнопки (второй уровень)
        firstColor: 'red',              // основной цвет фона
        secondColor: 'blue',            // второй цвет фона
        whereTo: 'left',                // направление смены цвета
        firstTextColor: 'blue',         // основной цвет текста
        secondTextColor: 'red',         // второй цвет текста
        animTime: 400,                  // время анимации (в миллисекундах)
        minWidth: 1200                  // минимальная ширина экрана для анимации
    });
</script>




*/


