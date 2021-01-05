/* 
prod
<script type="text/javascript" src="https://sirgoosethenaughty.github.io/fishkey/fishkey.js"></script>
<link rel="stylesheet" type="text/css" href="https://sirgoosethenaughty.github.io/fishkey/fishkey.css"/>

dev
<script type="text/javascript" src="https://sirgoosethenaughty.github.io/fishkey_dev/fishkey.js"></script>
<link rel="stylesheet" type="text/css" href="https://sirgoosethenaughty.github.io/fishkey_dev/fishkey.css"/>


вырисовка вектора 
<script>
    vectorDraw_init({
        selectors: '[data-elem-id="1606915054502"], [data-elem-id="1606917547773"]',            // селекторы элементов для векторов
        svgs: [                                                                                 // векторы
            `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M99.5 50C99.5 77.3381 77.3381 99.5 50 99.5C22.6619 99.5 0.5 77.3381 0.5 50C0.5 22.6619 22.6619 0.5 50 0.5C77.3381 0.5 99.5 22.6619 99.5 50Z" stroke="black"/>
            </svg>`,                                                                     // svg
            `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M99.5 50C99.5 77.3381 77.3381 99.5 50 99.5C22.6619 99.5 0.5 77.3381 0.5 50C0.5 22.6619 22.6619 0.5 50 0.5C77.3381 0.5 99.5 22.6619 99.5 50Z" stroke="black"/>
            </svg>`,
        ],
        animTime: 0.5,                              // время анимации
        animFunction: 'ease',                       // кривая безье анимации (можно оставить пустым)
        minWidth: 1200,                             // минимальная ширина экрана для анимации
        trigger: 'scroll',                          // триггер (scroll / hover)
        hoverTriggers: [                            // селекторы триггеров (если hover)
            '[data-elem-id="1606915059508"]',
            '[data-elem-id="1606917547804"]',
        ],
        offsets: [                                  // отступы от низа экрана (если scroll) (в % от высоты экрана)
            20, 20
        ]
    });
</script>


вырисовка надписи вектором
<script>
    vectorWrite_init({
        selector: `[data-elem-id="1606811783003"]`,     // куда вставлять надпись
        svg: ``,                                        // код svg-изображения
        animTime: 2,                                    // время анимации
        minWidth: 1200,                                 // минимальная ширина экрана для анимации
        offset: 20,                                    // отступ от низа экрана (в % от высоты экрана)
        strokeWidth: 1                                  // толщина линии вырисовки в пикселях
    });
</script>


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
        hasDelay: true,
        delaySpeed: 1,
        minWidth: 1200,                      // минимальная ширина экрана для анимации
        blockWidth: '',
        hasDelay: true,             
        delaySpeed: 1
    })
</script>


горизонтальный скролл элементов в блоке
<script>
    horScrollBlock_init({
        block: '#rec123',           // id блока
        header: '#rec456',          // id заголовка
        minWidth: 1200,             // минимальная ширина экрана для анимации
        totalShift: 1800,           // максимальное смещение блоков
        blockHeight: 530,           // высота блока со скроллом
        hasDelay: true,             
        delaySpeed: 1
    });
</script>


горизонтальный скролл нескольких блоков
<script>
    horScroll_init({
        selectors: '#rec123, #rec456, ...',     // id блоков
        speedCoeff: 2,                          // коэффициент ускорения скролла
        minWidth: 980,                          // минимальная ширина экрана для анимации
        hasDelay: true,             
        delaySpeed: 1
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
        selectors: '[data-elem-id="123"], [data-elem-id="456"], ...',     // селекторы заголовков
        minWidth: 640,                                      // минимальная ширина экрана для анимации
        animSpeed: 400,                                     // скорость появления всего заголовка
        wordSpeed: 50,                                      // задержка между словами / символами / ...
        spacing: '5px',                                     // пробелы между словами в px (можно оставить '')
        trigger: 'scroll',                                  // триггер анимации ( scroll / hover )
        offsets: [50, 50, ...],                             // отступы от низа экрана для появления (в % от высоты экрана)
        divider: 'word'                                     // разделитель: 'symbol' для появления по символу, 'word' по слову,  
    })                                                      // 'phrase' по предложению (через точку), 'line' по строке (через ;;)
</script>


пишущая машинка
<script>
    typeWriter_init({
        selector: '[data-elem-id="1470210011265"]',     // селектор
        totalSpeed: '4000',                             // время появления всего текста
        minWidth: '1200',                               // минимальная ширина экрана для анимации
        offset: 40                                      // отступ от низа экрана для анимации (в % от высоты экрана)
    });
</script>


появление текста по букве
<script>
    lettersAppear_init({
        selector: '[data-elem-id="1470209944682"]',     // селектор
        letterSpeed: 2,                                 // время появления буквы
        totalSpeed: 3,                                  // время всей анимации
        minWidth: 1200,                                 // минимальная ширина экрана для анимации
        offset: 50,                                    // отступ от низа экрана для анимации (в % от высоты экрана)
        delay: 0                                        // задержка появления (для появления без отступа)
    })
</script>


шрифт италиком
<script>
    italicLinks_init('selector')    // блок, в котором будут меняться ссылки (оставить пустым для всеей страницы)
</script>


прилипание элементов
<script>
    parallax_init({
        selectors: '#rec123 img',       // любые селекторы прилипающих элементов
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
        burgerPosition: 'left',                 // положение меню (top / left / bottom / right)
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
        hasNewNormalStyle: false,                   // заменять ли нормальное состояние (вместо курсора)
        hasDelay: true,                             // отставание (плавное перемещение) true - есть, false - нет (опц)
        delaySpeed: 1,                              // задержка отставания (0.1 - 5) (опц)
        sourceOfNormal: "external",                 // источник нормального состояния (external - вставить код, internal - селектор элемента в тильде)
        sourceOfStates: [                           // источники дополнительных состояний
            "internal",
            "external"
        ],
        normalStyle: {                              // стиль основного состояния
            width: '32px',
            height: '32px',
            'border': '1px solid #4F4F4F',
            'border-radius': '50%'
        },
        normalExternal:                             // код основного состояния (если external)
            `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle r="3" fill="#4F4F4F" cx="16" cy="16"></circle>
            </svg>`,
        normalInternal: '',                         // селектор для основного состояния (если internal)
        triggers: ['[data-elem-id="1609162301586"]', 'img'],       // элементы, активирующие дополнительные состояния
        stateStyles: [                              // стили дополнительных состояний (в количестве как в numStates)
            {
                width: '50px',
                height: '50px',
                'border': '1px solid #78ACCD',
                'border-radius': '50%'
            },
            {
                width: '50px',
                height: '50px',
                'border': '1px solid #78ACCD',
                'border-radius': '50%'
            }
        ],
        statesExternal: [                           // коды дополнительных состояний (если external) (в количестве как в numStates)
            ``,                                     // здесь пропущено, так как первый sourceOfStates - internal
            `<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle r="4" fill="#78ACCD" cx="25" cy="25"></circle>
            </svg>`
        ],
        statesInternal: [                           // коды дополнительных состояний (если internal) (в количестве как в numStates)
            '[data-elem-id="1609352398417"]',
            ''                                      // здесь пропущено, так как второй sourceOfStates - external
        ]
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
        photos: '[data-elem-id="1599909480763"], ...',  // селекторы фото (в тильде ставить ФОНОМ ШЕЙПА, а не картинкой)
        transitionTime: 0.5,                            // время появления фото (в секундах)
        initialVisibility: 0,                           // начальный размер видимой части фото (в процентах)
        minWidth: 1200                                  // минимальная ширина экрана
    })
</script>


горизонтальная перетаскивалка
<script>
    horDrag_init({
        block: '#rec236537294',         // перетаскиваемый блок
        minWidth: 1200,                 // минимальная ширина экрана
        hasDelay: true,                 // плавная прокрутка (опц)
        delaySpeed: 1                   // скорость при отставании (0.1 - 5) (опц)
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


зум фото при наведении
<script>
    photoZoom_init({
        photos: '#rec253415611 img',        // селекторы фото
        minWidth: 1200,                     // минимальная ширина экрана
        easeTime: 0.4,                      // время анимации (в секундах)
        easeFunction: '',                   // кривая безье анимации (можно оставить пустым)
        scale: 1.1                          // коэффициент увеличения
    })
</script>


маска курсором
<script>
    cursorColorFilter_init({
        originalPages: '#rec257385079, #rec257696327',      // показываемые блоки
        maskingPages: '#rec257675244, #rec257696345',       // скрытые блоки
        clipRadius: 50,                                     // радиус круга для маски
        minWidth: 1200                                      // минимальная ширина экрана
    })
</script>


смена фонов
<script>
   bgChange_init({
       colors: [                    // коды цветов
            'red',
            'blue',
            'green'
        ],
        breakpointBlocks: [         // блоки, при появлении которых будут сменяться цвета
            '#rec265281254',
            '#rec265281255',
            '#rec265281258'
        ],
        offsets: [                  // отступы от веръа экрана для смены цвета (в % от высоты экрана)
            10,
            20,
            30
        ],
        animTime: 0.5,              // время анимации
        minWidth: 0                 // минимальная ширина экрана
   })
</script>

*/


