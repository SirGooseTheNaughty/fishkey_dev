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
        selectors: '#rec123, #rec456, ...',     // id блоков
        speedCoeff: 2,                          // коэффициент ускорения скролла
        minWidth: 980                           // минимальная ширина экрана для анимации
    });
</script>


смена экранов по скроллу 
<script>
    screenChangeOnScroll_init({
        blocks: '#rec123, #rec456, ...',        // id блоков
        changeTime: 0.8                         // время смены блока (в секундах)
    })
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


текст над элементами
<script>
    hoverText_init({
        objects: '[imgfield="tn_img_1602064595928"], ... ',     // селекторы элементов
        cursor: '[data-elem-id="1602066288503"]',               // селектор текста (нужно создать отдельный текстовый элемент)
        texts: [                                                // подписи для соответствующих элементов
            'Енто Егор',
            'Дас ист Игорь',
            'Це мы милуемся!'
            ],
        isCursorHidden: false,                                  // будет ли исчезать стандартный курсор
        minWidth: 1200                                          // минимальная ширина экрана для анимации
    })
</script>


универсальный бургер
<script>
    uniBurger_init({
        burgerBlock: '#rec234988686',                       // id блока с меню
        triggerBlock: '#rec234988778',                      // id блока с кнопкой открытия/закрытия бургера (должен быть с прозрачным фоном)
        burgerTime: 1,                                      // время появления бургера
        elementsTime: 0.5,                                  // время появления элементов меню
        verticalPosition: 'center',                         // положение по вертикали (top / center / bottom)
        horizontalPosition: 'center',                       // положение по горизонтали (left / center / right)
        burgerShape: 'circle',                              // форма выплывания (circle / square / rect)
        triggerLineHeight: 4,                               // толщина линий кнопки бургера
        triggerColor: 'black'                               // цвет кнопки бургера
    });
</script>


вытесняющий бургер
<script>
    pushingBurger_init({
        burgerBlock: '#rec252049977',           // id блока с меню
        triggerBlock: '#rec252376983',          // id блока с кнопкой открытия/закрытия бургера (должен быть с прозрачным фоном)
        burgerPosition: 'left',                 // положение меню
        burgerWidth: 500,                       // ширина меню (для положения слева/справа)
        triggerLineHeight: 4,                   // толщина линий кнопки бургера
        triggerColor: 'black',                  // цвет кнопки бургера
        easeFunction: ''                        // кривая безье анимации появления (можно оставить пустым)
    })
</script>


видео в кружок
<script>
    videoCircle_init({
        videos: '[data-elem-id="1604157565601"], [data-elem-id="1604157998509"]',   // блоки с видео
        autoSize: false,                                                            // авторазмер кружков (true / false)
        circleDiams: ['200', '100']                                                 // размеры кружков (если авторазмер отключен)
    });
</script>


замена курсора ХУЕВАЯ
<script>
    cursorChange_init({
        minWidth: 1200,                         // минимальная ширина экрана
        hoverElements: 'img',                   // (1) селекторы элементов, над которыми курсор будет менять состояние
        isCursorHiddenEverywhere: false,        // (2) виден ли стандартный курсор везде (true / false)
        isCursorHiddenOnElements: true,         // если (2) не true, виден ли стандартный курсор при наведении на (1) (true / false)
        activeStyle: {                          // стили курсора в обычном состоянии
            width: '15px',
            height: '15px',
            background: '#e0644c',
            border: '1px solid #ecede8',
            'border-radius': '50%'
        },
        disactiveStyle: {                       // стили курсора в наведенном состоянии
            width: '50px',
            height: '50px',
            background: '#78accd',
            border: '1px solid #ecede8',
            'border-radius': '50%',
            'background-size': '100%',
            'background-position': '50%',
            'background-repeat': 'no-repeat',
            'background-image': 'url("https://revistaelduende.com/wp-content/themes/elduende/img/ojos.gif")',
            'background-blend-mode': 'screen'
        }
    });
</script>


переход на страницы по картинкам
<script>
    photoLink({
        photos: [                                   // селекторы для картинок
            '[data-elem-id="1597517665515"]', 
            '[data-elem-id="1597517538462"]', 
            '[data-elem-id="1597517563533"]', 
            '[data-elem-id="1597517554689"]', 
            '[data-elem-id="1597517468000"]', 
            '[data-elem-id="1597517662940"]'
        ],
        links: [                                    // соответствующие ссылки
            'http://vozmitevvogue.tilda.ws/',
            'http://sashailchuk.tilda.ws/',
            'http://your.kinokurs.com/new',
            'http://cell0fun.tilda.ws/',
            'http://dianardo.tilda.ws/',
            'http://augustagency.co.uk/'
        ],
        tab: 'new',                                 // 'new' для открытия в новой вкладке
        minWidth: 1200                              // минимальная ширина экрана
    })
</script>


картинки за элементами
<script>
    bgPhotos_init({
        elements: '[data-elem-id="1601629312299"], ...',        // селекторы элементов
        photos: '[data-elem-id="1601629376674"], ...',          // селекторы фото
        minWidth: 1200                                          // минимальная ширина экрана
    })
</script>


замена курсора
<script>
    cursorChange_init({                         
        minWidth: 1200,                             // минимальная ширина экрана
        numStates: 2,                               // количество состояний курсора кроме основного
        normalStyle: {                              // стили основного состояния
            width: '32px',
            height: '32px',
            'border': '1px solid #4F4F4F',
            'border-radius': '50%'
        },
        triggers: ['a', '#rec228688983 img'],       // элементы, активирующие дополнительные состояния
        stateStyles: {                              // стили дополнительных состояний
            '0': {
                width: '50px',
                height: '50px',
                'border': '1px solid #78ACCD',
                'border-radius': '50%'
            },
            '1': {
                width: '50px',
                height: '50px',
                'border': '1px solid #78ACCD',
                'border-radius': '50%'
            }
        },
        normalInner:                                // внутренний элемент основного состояний (можно оставить '')
            `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle r="3" fill="#4F4F4F" cx="16" cy="16"></circle>
            </svg>`,
        stateInners: {                              // внутренние элементы дополнительных состояний  (можно оставить '')
            '0': `<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle r="4" fill="#78ACCD" cx="25" cy="25"></circle>
                </svg>`,
            '1': `<svg width="27" height="11" viewBox="0 0 27 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="14" cy="5" r="4" fill="#78ACCD"/>
                    <path d="M1 6C5.16667 2.22688 16 -3.05548 26 6" stroke="#78ACCD" stroke-linecap="round"/>
                    <path d="M1 6.00002C5.16667 9.33336 16 14 26 6.00002" stroke="#78ACCD" stroke-width="0.6" stroke-linecap="round"/>
                </svg>`
        }
    })
    
</script>


след курсора
<script>
    cursorTrace_init({
        numPoints: 50,              // количество точек в следе (влияет на длину и время перемещения)
        opacity: 0.2,               // непрозрачность
        cursorStyle: {              // стиль курсора
            r: '20',
            fill: 'none',
            stroke: 'black',
            'stroke-width': '1',
            style: 'opacity: 1'
        },
        trailStyle: {               // стиль следа
            r: '10',
            fill: 'red',
            stroke: 'none',
            'stroke-width': '0'
        },
        minWidth: 1200              // минимальная ширина экрана
    })
</script>


хвост курсора
<script>
    cursorTail({
        color: 'red',               // цвет
        radius: 25,                 // радиус кружка
        numPoints: 50,              // количество точек в хвосте (влияет на длину и время перемещения)
        opacity: 0.2,               // непрозрачность
        minWidth: 1200              // минимальная ширина экрана
    })
</script>


появление фото из угла
<script>
    cornerPhotos_init({
        photos: '[data-elem-id="1599909480763"], ...',  // селекторы фото
        transitionTime: 0.5,                            // время появления фото (в секундах)
        minWidth: 1200                                  // минимальная ширина экрана
    })
</script>


горизонтальная перетаскивалка
<script>
    horDrag_init({
        block: '#rec236537294',         // перетаскиваемый блок
        minWidth: 1200                  // минимальная ширина экрана
    })
</script>


переключение страниц шторкой
<script>
    curtainChange_init({
        selectors: '#rec253401070, #rec253401673, #rec253401517',   // активные блоки
        easeTime: 0.8,                                              // время переключения (в секундах)
        minWidth: 1200,                                             // минимальная ширина экрана
        easeFunction: ''                                            // кривая безье анимации (можно оставить пустым)
    })
</script>


*/


