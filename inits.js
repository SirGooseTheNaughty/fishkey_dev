/* вырисовка вектора */
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

setTimeout(() => {
    vectorDraw(logoPaths, 0);   // вместо цифры - номер появляющегося вектора
}, 1500);



