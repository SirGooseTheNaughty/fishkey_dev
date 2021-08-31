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
        strokeWidth: 1,                             // толщина линии (в px)
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
        offset: 20,                                     // отступ от низа экрана (в % от высоты экрана)
        strokeWidth: 1                                  // толщина линии вырисовки в пикселях
    });
</script>


кнопка в кружок 
<script>
    buttonToCircle_init({
        selector: '[data-elem-id="123123"]',    // селектор кнопки
        minWidth: 1200                          // минимальная ширина экрана
    });
</script>


шум на фоне
<script>
    bgNoise_init({
        isNoiseDefault: true,           // использовать стандартный шум (true) или кастомный (false)
        selector: '#rec239137295',      // id блока, в котором лежит элемент с шумом (для кастомного)
        opacity: 15,                    // непрозрачность
        grain: '',                      // размер шума (можно оставить пустым) больше px -> больше зерна
        isCovering: true                // true, если шум поверх всего, иначе false
    });
</script>


горизонтальный скролл всей страницы
<script>
    fullPageHorScroll_init({
        blocks: '#rec123, #rec456, ...',    // id блоков
        menu: '#rec1234',                   // id меню
        hasDelay: true,                     // отставание (плавное перемещение) true - есть, false - нет
        delaySpeed: 1,                      // задержка отставания (0.1 - 5)
        minWidth: 1200,                     // минимальная ширина экрана для анимации
        blockWidth: 1200                    // ширина блоков
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
        hasDelay: true,             // отставание (плавное перемещение) true - есть, false - нет
        delaySpeed: 1               // задержка отставания (0.1 - 5)
    });
</script>


горизонтальный скролл нескольких блоков
<script>
    horScroll_init({
        blocks: '#rec123, #rec456, ...',        // id блоков
        speedCoeff: 2,                          // коэффициент ускорения скролла
        minWidth: 980,                          // минимальная ширина экрана для анимации
        hasDelay: true,                         // отставание (плавное перемещение) true - есть, false - нет
        delaySpeed: 1                           // задержка отставания (0.1 - 5)
    });
</script>


смена экранов по скроллу 
<script>
    screenChangeOnScroll_init({
        blocks: '#rec123, #rec456, ...',        // id блоков
        minWidth: 1200,                         // минимальная ширина экрана для анимации
        animTime: 0.8                           // время смены блока (в секундах)
    })
</script>


появление заголовков
<script>
    const txtAppear = textApp_init({
        selectors: '[data-elem-id="123"], [data-elem-id="456"]',     // селекторы заголовков
        trigger: 'scroll',                                  // триггер анимации ( scroll / hover )
        triggerBlocks: '[data-elem-id="789"], [data-elem-id="101"]',     // селекторы триггеров (если анимация по наведению на другие блоки)
        isHiddenByDefault: true,                            // спрятана ли надпись
        minWidth: 640,                                      // минимальная ширина экрана для анимации
        animSpeed: 400,                                     // скорость появления всего заголовка
        wordSpeed: 50,                                      // задержка между словами / символами / ...
        spacing: 5,                                         // пробелы между словами в px (можно оставить '')
        offsets: [50, 50],                                  // отступы от низа экрана для появления (в % от высоты экрана)
        divider: 'word'                                     // разделитель: 's' для появления по символу, 'w' по слову,  
    })                                                      // 'p' по предложению (через точку), 'l' по строке (через ;;)
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
        isRandom: true,                                 // рандомно или по порядку
        minWidth: 1200,                                 // минимальная ширина экрана для анимации
        offset: 50,                                     // отступ от низа экрана для анимации (в % от высоты экрана)
        delay: 0                                        // задержка появления (для появления без отступа)
    })
</script>


шрифт италиком
<script>
    italicLinks_init({
        selector: ''            // блок, в котором будут меняться ссылки (оставить пустым для всеей страницы)
    });
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
        selectors: '[data-elem-id="1599820091591"], [data-elem-id="1602152450564"]',    // кнопки
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
    twoSideButton_init({
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
        selectors: '[imgfield="tn_img_1602064595928"], ... ',     // селекторы элементов
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
        isTriggerCustom: true,                              // используется кастомный бургер (true) или стандартный (false)
        customOn: '[data-elem-id="1613749412521"]',         // селектор для кастомного бургера в закрытом состоянии
        customOff: '[data-elem-id="1613749404574"]',        // селектор для кастомного бургера в открытом состоянии
        burgerTime: 1,                                      // время появления бургера
        elementsTime: 0.5,                                  // время появления элементов меню
        verticalPosition: 'center',                         // положение по вертикали (top / center / bottom)
        horizontalPosition: 'center',                       // положение по горизонтали (left / center / right)
        burgerShape: 'circle',                              // форма выплывания (circle / square / rect)
        triggerLineHeight: 2,                               // толщина линий стандартной кнопки бургера
        openTriggerColor: '#000000',                        // цвет линий стандартной кнопки бургера в открытом состоянии
        closedTriggerColor: '#000000'                       // цвет линий стандартной кнопки бургера в закрытом состоянии
    });
</script>


вытесняющий бургер
<script>
    pushingBurger_init({
        burgerBlock: '#rec252049977',                   // id блока с меню
        triggerBlock: '#rec252376983',                  // id блока с кнопкой открытия/закрытия бургера (должен быть с прозрачным фоном)
        isTriggerCustom: true,                          // используется кастомный бургер (true) или стандартный (false)
        customOn: '[data-elem-id="1613749412521"]',     // селектор для кастомного бургера в закрытом состоянии
        customOff: '[data-elem-id="1613749404574"]',    // селектор для кастомного бургера в открытом состоянии
        burgerPosition: 'left',                         // положение меню (top / left / bottom / right)
        burgerWidth: 500,                               // ширина меню (для положения слева/справа)
        triggerLineHeight: 2,                           // толщина линий стандартной кнопки бургера
        openTriggerColor: '#000000',                    // цвет линий стандартной кнопки бургера в открытом состоянии
        closedTriggerColor: '#000000',                  // цвет линий стандартной кнопки бургера в закрытом состоянии
        easeTime: 0.8,                                  // время появления
        easeFunction: ''                                // кривая безье анимации появления (можно оставить пустым)
    })
</script>


видео в кружок
<script>
    videoCircle_init({
        videos: '[data-elem-id="1604157565601"], [data-elem-id="1604157998509"]',   // блоки с видео
        autoSize: false,                                                            // авторазмер кружков (true / false)
        circleDiams: ['200', '100'],                                                // размеры кружков (если авторазмер отключен)
        hasClick: false                                                             // реагирует ли на курсор (false - нет, true - да)
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
        newTab: true,                               // 'new' для открытия в новой вкладке
        minWidth: 1200                              // минимальная ширина экрана
    })
</script>


картинки за элементами
<script>
    bgPhotos_init({
        elements: [                                 // селекторы элементов
            '[data-elem-id="1601629312299"]',
            '[data-elem-id="1601629335350"]',
            '[data-elem-id="1601629345994"]'
        ],
        photos: [                                   // селекторы фото
            '[data-elem-id="1601629376674"]',
            '[data-elem-id="1601629440924"]',
            '[data-elem-id="1601629451776"]'
        ],
        delaySpeed: 0.01,                           // скорость перемещения фото (0.005 - 0.5)
        minWidth: 1200                              // минимальная ширина экрана
    })
</script>


замена курсора
<script>
    cursorChange_init({                         
        minWidth: 1200,                             // минимальная ширина экрана
        numStates: 2,                               // количество состояний курсора кроме основного
        hasNewNormalStyle: false,                   // заменять ли нормальное состояние (вместо курсора)
        mixBlendMode: false,                        // будет ли меняться цвет курсора на противоположный относительно того, что под ним (для белых элементов)
        isCursorHidden: true,                       // прятать ли стандартный курсор
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
        triggers: [                                 // элементы, активирующие дополнительные состояния
            '[data-elem-id="1609162301586"]',
            'img'
        ],       
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
        traceDelay: 5,              // задержка следа (1 - 25) [5]
        cursorStyle: {              // стиль курсора
            r: '20',                // радиус круга
            fill: 'none',           // цвет заливки ('none' для прозрачного круга)
            stroke: 'black',        // цвет обводки ('none' для прозрачной обводки)
            'stroke-width': '1',    // толщина линии обводки
            style: 'opacity: 1'     // дополнительные стили (смотри пункт css-стили)
        },
        traceStyle: {               // стиль следа
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
    cursorTail_init({
        color: 'red',               // цвет
        radius: 25,                 // радиус кружка
        numPoints: 50,              // количество точек в хвосте (влияет на длину и время перемещения)
        opacity: 0.2,               // непрозрачность
        tailDelay: 5,               // задержка хвоста (1 - 25) [5]
        minWidth: 1200              // минимальная ширина экрана
    })
</script>


появление фото из угла
<script>
    cornerPhotos_init({
        photos: '[data-elem-id="1599909480763"], ...',  // селекторы фото (в тильде ставить ФОНОМ ШЕЙПА, а не картинкой)
        transitionTime: 0.5,                            // время появления фото (в секундах)
        startPos: 'left-top',                           // откуда появляется фото (left-top, top, right-top, right, right-bottom, bottom, left-bottom, left)
        initialVisibility: 0,                           // начальный размер видимой части фото (в процентах)
        offsets: [20, ... ],                            // отступы от низа экрана для появления (в % от высоты экрана)
        minWidth: 1200,                                 // минимальная ширина экрана
        isHorScroll: false                              // true, если фото находятся в блоке с горизонтальным скроллом
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
        easeFunction: '',                                           // кривая безье анимации (можно оставить пустым)
        isBackgroundZoomable: true,                                 // зум картинок на фоне (true - есть, false - нет)
        minWidth: 1200                                              // минимальная ширина экрана
    })
</script>


зум фото при наведении
<script>
    photoZoom_init({
        photos: '#rec253415611, [data-elem-id="1615449419944"]',        // селекторы фото или контейнеров с ними
        easeTime: 0.4,                      // время анимации (в секундах)
        easeFunction: '',                   // кривая безье анимации (можно оставить пустым)
        scale: 1.1,                         // коэффициент увеличения
        minWidth: 1200                      // минимальная ширина экрана
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


перемещение элемента по пути
<script>
     moveAlongThePath_init({
         elem: '[data-elem-id="1470210224069"]',    // элемент, который будет передвигаться
         paths: {                                   // путb для движения для разных экранов
             "1200": 'M411.5 0.5C242.833 3 -72.3 30.7 16.5 121.5C127.5 235 443.5 115.5 421.5 210C399.5 304.5 172 233.5 164.5 311',
             "980": 'M200.5 1C22 60.5 -18 84 9.00002 112C36 140 205 139.5 164.5 178.5C124 217.5 24.5 257 27.5 313.5',
             "640": '',
             "480": 'M79.0141 1C48.0141 23.1667 -10.5859 76.4 3.0141 112C20.0141 156.5 105.514 174.5 95.5141 207.5C85.5141 240.5 37.5141 257.5 35.5141 300',
             "320": ''
         },
         isRotating: false,                         // будет ли элемент поворачиваться вдоль пути (true) или нет (false)
         isContinious: true,                        // движение привязано к скроллу (true) или происходит автоматически (false)
         easeTime: 0.5,                             // время анимации при автоматическом движении
         easeFunction: 'linear',                    // кривая безье при автоматическом движении
         offset: 50,                                // отступ от низа экрана для начала движения в % от высоты экрана
         activeHeight: 1000,                        // за какое расстояние скролла (в px) элемент проходит от 0 до 100% пути
         isSmooth: true,                            // сглаживать ли движение при его привязке к скроллу
         delaySpeed: 1,                             // скорость движения при задержке (0.05 - 5)
         minWidth: 1200                             // минимальная ширина экрана
     });
</script>


показ разных элементов для разных браузеров
<script>
    differOnBrowser_init({
        blocksToHide: '[data-elem-id="1470209944682"]',     // элементы или блоки, которые будут прятаться для указанных браузеров
        blocksToShow: '[data-elem-id="1614425367367"]',     // элементы или блоки, которые будут показаны только для указанных браузеров
        browsers: ['safari', 'explorer']                    // браузеры: chrome, safari, firefox, opera, explorer, edge, samsung
    });
</script>


круглый фон для кнопки
<script>
    circleBg_init({
        button: '[data-elem-id="1615480829678"]',   // селектор кнопки
        circleColor: '#FFFFFF',                     // заполняющий цвет
        textColor: '#000000',                       // цвет текста при заполнении
        easeTime: 0.5,                              // время анимации
        easeFunction: '',                           // кривая безье анимации
        minWidth: 1200                              // минимальная ширина экрана
    })
</script>


<script>
    mouseTrack_init({
        trackElement: '[data-elem-id="1616681324909"]', // селектор элемента
        mode: "shift",                                  // режим: shift - сдвиг, rotate - поворот
        maxElementShift: 20,                            // (для режима сдвиг) максимальный сдвиг относительно начального положения
        minWidth: 1200                                  // минимальная ширина экрана
    });
</script>


прелоудер
<script>
    preloader_init({
        block: '#rec306952176',     // id блока прелоудера
        isWaiting: true,            // дожидаться ли полной загрузки страницы
        delay: 0.5,                 // задержка прелоудера (если isWaiting: true - минимальное время видимости прелоудера, если false - все время видимости)
        animTime: 1,                // время анимации
        howToClose: 'go-up',        // принцип анимации (fade - исчезновение в прозрачность, go-up - слайд вверх, go-left - влево, go-down - вниз, go-right - вправо)
        animFunction: 'ease'        // кривая безье анимации
    })
</script>



обрезка текста
<script>
    textWrap_init({
        text: '[data-elem-id="1470210011265"]',     // селектор элемента с текстом
        trigger: '[data-elem-id="1619021953883"]',  // селектор триггера (пустые скобки или удалить строку, если триггер - сам текст)
        isTriggerMoving: true,                      // будет ли триггер двигаться вместе с обрезкой текста
        isTriggerFlipping: false,                   // будет ли триггер переворачиваться в разных состояниях
        numLines: {                                 // число видимых строк для разных экранов (если как на бОльшем экране - 0,
            "1200": 5,                              // если для всех экранов одинаково - можно заменить {...} на число)
            "980": 0,
            "640": 0,
            "480": 3,
            "320": 0
        },
        animTime: 0.8,                              // время анимации
        animFunction: 'ease',                       // кривая безье анимации
        minWidth: 0                                 // миинимальная ширина экрана
    })
</script>

объединение элементов
<script>
    joinElements({
        wrapperSelectors: [         // селекторы объединяющих элементов
            '[data-elem-id="1620057598399"]',
            '[data-elem-id="1621274020845"]'
        ],
        areBordersHidden: false     // прятать ли рамки объединяющих элементов (true - прятать, false - нет) [true]
    });
</script>

бегущая строка в кнопке
<script>
    runningLineBtn_init({
        btn: '[data-elem-id="1622379786844"]',  // селектор кнопки
        runningText: 'ОБОРМОТКА',               // бегущий текст (если не совпадает с текстом кнопки)
        textMargin: 15,                         // ширина промежутка между текстами в пикселях
        animTime: 1,                            // время анимации (больше время - медленнее движение)
        minWidth: 1200,                         // минимальная ширина экрана
        rotation: -10,                          // наклон бегущей строки в градусах
        runningTextStyle: {                     // дополнительные стили бегущего текста
            color: 'white',
            'font-style': 'italic',
        }
    });
</script>


заполнение текста цветом
<script>
    textColoring_init({
        selector: '[data-elem-id="1470209944682"]', // селектор элемента с текстом
        gradientDirection: 'to right',              // направление заполнения
        fillingColor: 'red',                        // заполняющий цвет
        animTime: 0.5,                              // время анимации
        colorsDiff: 20,                             // длина градиента в процентах
        snapBackwards: false,                       // будет ли двигаться назад
        minWidth: 1200                              // минимальная ширина экрана
    });
</script>


3д карточки
<script>
    poppingCards__init({
        cardsSelector: '.customCard',   // селектор объединяющего элемента
        itemsSelectors: [               // селекторы анимированных внутренних элементов карточки
            '.customCard-title',
            '.customCard-desc',
            '.customCard-img'
        ],
        zPositions: [                   // насколько будут выплывать вперед внутренние элементы
            60,
            70,
            55
        ],
        isCustom: true,                 // используются ли кастомные карточки
        coeff: 10,                      // коэффициент отклонения карточки (больше coeff - меньше отклоняется)
        animTime: 0.5,                  // время анимации (поворота карточки и выплывания элементов)
        easeFunction: 'ease',           // кривая анимации
        minWidth: 1200                  // минимальная ширина экрана
    });
</script>

стандартные
<script>
    poppingCards__std({
        coeff: 20,      // коэффициент отклонения карточки (больше coeff - меньше отклоняется)
        animTime: 1     // время анимации (поворота карточки и выплывания элементов)
    });
</script>


градиент вокруг курсора
<script>
    cursorHalo_init({
        color: '#FFFF00',       // цвет
        radius: 300,            // радиус
        flatRadius: 0,          // радиус круга сплошного цвета
        startOpacity: 50,       // максимальная непрозрачность (по центру) в процентах
        blur: 100,              // размытие (в пикселях)
        delaySpeed: 0.5         // задержка движения (оптимально 0.1 - 5) (0 - без задержки)
    });
</script>


курсор на canvas
<script>
    simpleCursor_init({
        activators: 'a, [data-elem-type="button"], .t-zoomable',    // селекторы активаторов
        mixBlend: true,                     // зависит ли цвет от фона (true / false)
        hideStd: false,                     // прятать ли стандартный курсор (true / false)            
        items: [                            // элементы курсора (для добавления новых нужно поставить запятую
            {                               // после } и добавить такой же блок {...})
                type: 'circle',             // форма (circle / rect / triangle)
                size: 5,                    // размер в пикселях
                stroke: '#ffffff',          // цвет контура (оставить '' чтобы не было контура)
                fill: '',                   // цвет заливки (оставить '' чтобы не было заливки)
                strokeWidth: 1,             // толщина контура
                opacity: 100,               // непрозрачность
                rotation: 0,                // угол поворота в градусах
                speed: 0.01,                // скорость движения за курсором (0 - без отставания)
                isAnimated: true,           // меняется ли состояние при наведении на активаторы
                activeStyle: {              // стили активного состояния
                    animationSpeed: 0.01,   // скорость анимации
                    size: 5,                // размер в активном состоянии
                    opacity: 100,           // непрозрачность в активном состоянии
                    rotation: 0             // угол поворота в активном состоянии
                }
            }
        ]
    });
</script>



*/


