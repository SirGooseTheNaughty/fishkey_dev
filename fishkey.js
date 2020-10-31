/* вырисовка вектора */
function vectorDraw_init(vd_SelectorsForSVG, vd_svgs) {
    function vectorDraw(vector) {
        logoPaths[vector].classList.add('draw-svg');
    }
    const vd_forSVG = document.querySelectorAll(vd_SelectorsForSVG);
    vd_forSVG.forEach((space, i) => {
        $(space).html(vd_svgs[i]);
    });
    const logoLengths = [], logoPaths = [], desiredWidths = [], coeffs = [];
    vd_forSVG.forEach((space, i) => {
        logoPaths[i] = space.querySelector('path');
        logoLengths[i] = logoPaths[i].getTotalLength();
        desiredWidths[i] = +space.getAttribute('data-field-width-value');
        coeffs[i] = desiredWidths[i]/(+space.querySelector('svg').getAttribute('width'));
        $(logoPaths[i]).css({
            'stroke-dasharray': logoLengths[i],
            'stroke-dashoffset': logoLengths[i]
        });
        $(space).css({
            height: desiredWidths[i] + 'px',
            display: 'grid',
            'place-items': 'center'
        });
        space.querySelector('svg').style.transform = `scale(${coeffs[i]})`;
    });
    return vectorDraw;
}

/* кнопка вжух в кружок */
function buttonToCircle_init(selector, minWidth) {
    const buttonToCircle = $(selector),
        buttonTextHolder = $(buttonToCircle).children(),
        buttonStyle = {
            'bgColor': $(buttonTextHolder).css('background-color'),
            'borderRadius': getComputedStyle(buttonTextHolder[0]).borderStartEndRadius,
            'width': buttonTextHolder[0].offsetWidth,
            'height': buttonTextHolder[0].offsetHeight
        };

    if ($(window).width() > minWidth) {
        const widthShift = 2*parseInt(buttonStyle.borderRadius, 10);
        $(buttonToCircle).prepend(`<div class='moving_bg'></div>`);
        const movingBg = $('.moving_bg');
        $(buttonTextHolder).html(`<p class='buttonToCircleTxt'>${$(buttonTextHolder).text()}</p>`);

        $(buttonTextHolder).css({
            'position': 'relative',
            'background': 'transparent',
            'transition': '0.7s cubic-bezier(0.9, 0, 0.1, 1)',
            'z-index': 100,
            'border': '1px solid ' + buttonStyle.bgColor
        });
        $(buttonToCircle).css({
            'overflow': 'hidden',
            'width': buttonStyle.width,
            'height': buttonStyle.height
        });
        $(movingBg).css({
            'width': buttonStyle.width,
            'height': buttonStyle.height,
            'position': 'absolute',
            'z-index': 99,
            'background': buttonStyle.bgColor,
            'border-radius': buttonStyle.borderRadius,
            'transition': '0.7s cubic-bezier(0.9, 0, 0.1, 1)',
            'right': '0'
        });
        $('.buttonToCircleTxt').css({
            'position': 'relative',
            'transition': '0.7s cubic-bezier(0.9, 0, 0.1, 1)',
            'left': '0'
        });

        $(buttonToCircle).hover(function() {
            $(movingBg).css('width', widthShift);
            $(buttonTextHolder).css('color', buttonStyle.bgColor);
            $('.buttonToCircleTxt').css('left', `-${widthShift/3}px`);
        },
        function() {
            $(movingBg).css('width', buttonStyle.width);
            $(buttonTextHolder).css('color', 'white');
            $('.buttonToCircleTxt').css('left', `0`);
        });
    }
}

/* шум на фоне */
function bgNoise_init(parameters) {
    const bgNoiseBlock = document.querySelector(parameters.selector),
        bgNoiser = bgNoiseBlock.querySelector('[data-elem-type="shape"]').querySelector('.tn-atom');
    parameters.grain = (parameters.grain) ? parameters.grain + 'px' : 'auto';
    bgNoiser.classList.add('bg-noise');
    bgNoiser.style.opacity = parameters.opacity/100;
    bgNoiser.style.backgroundSize = `${parameters.grain}`;
    bgNoiseBlock.style.height = '0';
    bgNoiseBlock.style.overflow = 'hidden';
}

/* горизонтальный скролл всей страницы */
function fullPageHorScroll_init(parameters) {
    const horScrollBlocks = document.querySelectorAll(parameters.blocks),
        horScrollMenu = document.querySelector(parameters.menu),
        horScroll_minWidth = parameters.minWidth;
    let horScroll_blockWidth = parameters.blockWidth;
        
    horScroll_blockWidth = horScroll_blockWidth ? horScroll_blockWidth : $(window).width();
    const horScrollwh = $(window).height(),
        horScrollBlocksNum = horScrollBlocks.length,
        horScrollTotalHeight = (horScrollBlocksNum-1)*horScroll_blockWidth + horScrollwh,
        horScrollMenuHeight = $(horScrollMenu).height(),
        horScrollBlockShifts = {};

    if ($(window).width() > horScroll_minWidth) {
        $(horScrollBlocks).wrapAll('<div class="horScrollContainer"></div>');
        const horScrollContainer = document.querySelector('.horScrollContainer');

        $(horScrollBlocks).css({
            'position': 'absolute',
            'width': horScroll_blockWidth+'px',
            'height': '100vh',
            'top': '0'
        });
        horScrollBlocks.forEach((block, i) => {
            block.style.left = `${i*horScroll_blockWidth}px`;
            horScrollBlockShifts['#'+block.getAttribute('id')] = `${i*horScroll_blockWidth}`;
        });
        $(horScrollMenu).css({'position': 'fixed', 'width': '100%', 'z-index': '999'});
        $(horScrollContainer).css({'position': 'fixed', 'top': horScrollMenuHeight, 'left': '0'});
        $(horScrollContainer).wrap('<div class="horScrollStaticContainer"></div>');
        $('.horScrollStaticContainer').css({
            'position': 'relative', 
            'top': horScrollMenuHeight, 
            'overflow': 'hidden', 
            'height': `${horScrollTotalHeight}px`
        });

        window.addEventListener('scroll', () => {
            horizontalScroll(horScrollBlocksNum, horScroll_blockWidth, horScrollContainer);
        });

        $('a').on('click', (e) => {
            if ($(e.target).attr('href').substring(0,4) == '#rec') {
                const dn = horScrollBlockShifts[$(e.target).attr('href')];
                $('html, body').animate({scrollTop: dn}, 400);
            }
        });
    }
}
function horizontalScroll(horScrollBlocksNum, horScroll_blockWidth, horScrollContainer) {
    const wt = $(window).scrollTop();
    let horScrollShift = +wt;
    if (horScrollShift < (horScrollBlocksNum-1)*horScroll_blockWidth) {
        horScrollContainer.style.transform = `translate(${-horScrollShift}px, 0)`;
    }
}


/* горизонтальный скролл элементов одного блока */
function horScrollBlock_init(parameters) {
    const horScrollBlock = document.querySelector(parameters.block),
        header = document.querySelector(parameters.header),
        minWidth = parameters.minWidth,
        totalShift = parameters.totalShift,
        blockHeight = parameters.blockHeight;
    
    if ($(window).width() > minWidth) {
        const headerTop = $(header).offset().top;
        const children = $(horScrollBlock.querySelector('.t396__artboard')).children();

        $(children).wrapAll('<div class="horScrollContainer"></div>');
        const horScrollContainer = document.querySelector('.horScrollContainer');

        $(horScrollContainer).css({top: '0', left: '0',});
        $(header).css({top: '0', left: '0', width: '100vw', 'z-index': '100'});
        horScrollBlock.style.height = totalShift + blockHeight + 'px';
        horScrollBlock.style.backgroundColor = window.getComputedStyle(horScrollBlock.querySelector('.t396__artboard')).backgroundColor;
        horScrollContainer.parentElement.style.overflow = 'visible';

        window.addEventListener('scroll', () => {
            horScrollBlock_handler(headerTop, horScrollContainer, header, horScrollBlock, totalShift);
        });
    }
}
function horScrollBlock_handler(headerTop, horScrollContainer, header, horScrollBlock, totalShift) {
    const wt = $(window).scrollTop(),
        horScrollShift = +wt - headerTop;
    if (wt < headerTop) {
        $(horScrollContainer).css({
            'position': 'relative',
            transform: 'translate(0)'
        });
        $(header).css({'position': 'relative'});
    } else if (horScrollShift < totalShift) {
        $(horScrollContainer).css({
            'position': 'fixed',
            transform: `translate(-${horScrollShift}px, ${$(header).height()}px)`
        });
        $(header).css({position: 'fixed', transform: 'translate(0)'});
        horScrollBlock.style.paddingBottom = `${$(header).height()}px`;
    } else {
        $(horScrollContainer).css({
            'position': 'relative',
            'padding-bottom': '0',
            transform: `translate(-${totalShift}px, ${totalShift}px)`
        });
        $(header).css({position: 'relative', transform: `translate(0, ${totalShift}px)`});
        horScrollBlock.style.paddingBottom = '0';
    }
}


/* ----- ГОРИЗОНТАЛЬНЫЙ СКРОЛЛ ----- */
function horScroll_init(params) {
    const horScrollBlocks = document.querySelectorAll(params.selectors),
        horScrollMinWidth = params.minWidth,

        horScrollwh = $(window).height(),
        horScrollww = $(window).width(),
        horScrollBlocksNum = $(horScrollBlocks).length,
        horScrollTotalHeight = (horScrollBlocksNum-1)*horScrollww+horScrollwh,
        horScrollBlockTop = $(horScrollBlocks[0]).offset().top,
        horScrollStop = (horScrollBlocksNum-1)*horScrollww;
    let horScrollContainer = '';

    if ($(window).width() > horScrollMinWidth) {
        $(horScrollBlocks).wrapAll('<div class="horScrollContainer"></div>');
        horScrollContainer = $('.horScrollContainer');  
        $(horScrollContainer).wrap('<div class="horScrollStaticContainer"></div>');
        $('.horScrollStaticContainer').css({
            'background-color': horScrollBlocks[0].querySelector('.t396__artboard').style.backgroundColor, 
            'position': 'relative', 
            'overflow': 'hidden', 
            'height': `${horScrollTotalHeight}px`
        });
        $(horScrollContainer).css({'position': 'relative', 'top': '0', 'left': '0'});
        $(horScrollBlocks).css({
            'position': 'absolute',
            'width': '100vw',
            'height': '100vh',
            'top': '0'
        });
        horScrollBlocks.forEach((block, i) => {
            block.style.left = i*horScrollww+'px';
        });
    
        document.addEventListener('scroll', horizontalScroll);
    }

    function horizontalScroll() {
        const wt = $(window).scrollTop();
        let horScrollShift = +wt - horScrollBlockTop;
        if (horScrollShift < 0) {
            $(horScrollContainer).css({
                position: 'relative',
                transform: 'translate(0)'
            });
        } else if (horScrollShift < horScrollStop) {
            $(horScrollContainer).css({
                position: 'fixed',
                transform: `translate(${-horScrollShift}px, 0)`
            });
        } else {
            $(horScrollContainer).css({
                position: 'relative',
                transform: `translate(${-horScrollStop}px, ${horScrollStop}px)`
            });
        }
    }
}


/* появление текста */
function textApp_init(parameters) {
    const txtAppConts = document.querySelectorAll(parameters.selectors),   // появляющийся текст
        txtApp_MinWidth = parameters.minWidth,             // минимальная ширина экрана для анимации
        txtApp_AnimSpeed = parameters.animSpeed,             // скорость появления слов (в миллимекундах)
        txtApp_WordSpeed = parameters.wordSpeed,              // задержка между словами (в миллимекундах)
        txtApp_divider = parameters.divider,            // 'symbol' для появления по символу, 'word' по слову, 'phrase' по предложению (через точку), 'line' по строке (через ;;)
        txtAppWordConts = {};

    function txtAppear(contNum) {
        let i = 0;
        const txtApp_interval = setInterval(() => {
            if (!txtAppWordConts[contNum][i]) {
                clearInterval(txtApp_interval);
            }
            else {
                txtAppWordConts[contNum][i].style.transition = `${txtApp_AnimSpeed/1000}s ease`;
                txtAppWordConts[contNum][i].style.top = '0';
            }
            i++;
        }, txtApp_WordSpeed);
    }

    if ($(window).width() > txtApp_MinWidth) {
        txtAppConts.forEach((txtAppCont, contNum) => {
            txtAppCont = txtAppCont.firstElementChild;
            const txtApp = txtAppCont.textContent;
            let txtAppWords = [];
            if (txtApp_divider == 'word') {
                txtAppWords = txtApp.split(' ');
                txtAppCont.innerHTML = '';
                txtAppWords.forEach((word, i) => {
                    txtAppCont.innerHTML += `<p style='overflow: hidden; display: inline-block; padding: 0 1rem 1rem 0; margin-bottom: -1rem'>
                                                <span class='txtAppWordCont${contNum}'>${word} </span>
                                            </p>`;
                });
            } else if (txtApp_divider == 'phrase') {
                txtAppWords = txtApp.split('. ');
                txtAppCont.innerHTML = '';
                txtAppWords.forEach((word, i) => {
                    if (i == txtAppWords.length - 1) {
                        txtAppCont.innerHTML += `<p style='overflow: hidden; display: inline-block; padding-right: 1rem'>
                                                    <span class='txtAppWordCont${contNum}'>${word} </span>
                                                </p>`;
                    } else {
                        txtAppCont.innerHTML += `<p style='overflow: hidden; display: inline-block; padding: 0 1rem 1rem 0; margin-bottom: -1rem'>
                                                    <span class='txtAppWordCont${contNum}'>${word}.</span>
                                                </p>`;
                    }
                });
            } else if (txtApp_divider == 'line') {
                txtAppWords = txtApp.split(';;');
                txtAppCont.innerHTML = '';
                txtAppWords.forEach((word, i) => {
                    txtAppCont.innerHTML += `<p style='overflow: hidden; display: inline-block; padding: 0 1rem 1rem 0; margin-bottom: -1rem'>
                                                <span class='txtAppWordCont${contNum}'>${word} </span>
                                            </p>`;
                });
            } else {
                txtAppWords = txtApp.split('');
                txtAppCont.innerHTML = '';
                txtAppWords.forEach((word, i) => {
                    if (word == ' ') {
                        txtAppCont.innerHTML += `<p style='overflow: hidden; display: inline-block; padding-right: 1rem'><span class='txtAppWordCont${contNum}'>${word} </span></p>`;
                    } else {
                        txtAppCont.innerHTML += `<p style='overflow: hidden; display: inline-block;'><span class='txtAppWordCont${contNum}'>${word} </span></p>`;
                    }
                });
            }

            txtAppWordConts[contNum] = document.querySelectorAll(`.txtAppWordCont${contNum}`);

            txtAppCont.style.paddingBottom = '0.15em';
            $(txtAppWordConts[contNum]).css({
                position: 'relative',
                top: '1.5em',
            }); 
        });
        return txtAppear;
    } else {
        return null;
    }
}


/* пишущая машинка */
function typeWriter_init(parameters) {
    function tw_write() {
        const speed = tw_totalSpeed / tw_Text.length;
        const tw_interval = setInterval(function() {
            if(!tw_Text[0]){
                    return clearInterval(tw_interval);
            }
            tw_TextElem.innerHTML += tw_Text.shift();
        }, speed);
        return false;
    }
    function tw_startWriting() {
        if (tw_isAnimated) {
            tw_write();
            tw_isAnimated = false;
        }
    }
    const tw_TextElem = document.querySelector(parameters.selector),
        tw_totalSpeed = parameters.totalSpeed,
        tw_MinWidth = parameters.minWidth,
        tw_Text = tw_TextElem.innerText.split("");

    let tw_isAnimated = false;
    if ($(window).width() > tw_MinWidth) {
        tw_TextElem.innerText = '';
        tw_isAnimated = true;
    }
    return tw_startWriting;
}


/* ссылки италиком */
function italicLinks_init(selector = '') {
    if ($(window).width() > 1200) {
        const it_links = document.querySelectorAll(`${selector} [href ^= "#rec"], ${selector} [href ^= "http"]`);
        $(it_links).addClass('it-links');
    }
}


/* прилипание картинок */
function parallaxInit(params) {
    function listener(e) {
        const coordinatesDiff = {
            x: (e.clientX - parallaxRectCenter.x)/4,
            y: (e.clientY - parallaxRectCenter.y)/4
        };
        parallaxTarget.style.transform = `translate(${coordinatesDiff.x}px, ${coordinatesDiff.y}px)`;
    }

    const parallaxTargets = document.querySelectorAll(params.selector),
        parallaxMinScreenWidth = params.minWidth;

    let parallaxTarget,
        parallaxRect = {},
        parallaxRectCenter = {x: 0, y: 0};

    if (document.documentElement.clientWidth > parallaxMinScreenWidth) {
        $(parallaxTargets).addClass('parallax');
        $(parallaxTargets).css('transition', '0.4s ease-out');
        $(parallaxTargets).on('mouseenter', function () {
            parallaxTarget = this;
            parallaxRect = parallaxTarget.getBoundingClientRect();
            parallaxRectCenter = {
                x: parallaxRect.x + parallaxRect.width/2,
                y: parallaxRect.y + parallaxRect.height/2
            };
            $(this).attr('parallax', true);
            document.addEventListener('mousemove', listener);
        })
        .on('mouseleave', function () {
            document.removeEventListener('mousemove', listener);
            $(this).attr('parallax', false);
            parallaxTarget.style.transform = 'translate(0)';
        });
    }
}


/* односторонняя кнопка */
function oneSideButton_init(params) {
    const targetOneSideButtonsPars = document.querySelectorAll(params.selectors),  // кнопки (второй уровень)
        oneSideButtonStyle = {
            firstColor: params.firstColor,			    // код первого цвета
            secondColor: params.secondColor,		    // код второго цвета
            whereTo: params.whereTo,                // направление смещения: right / left / top / bottom
            firstTextColor: params.firstTextColor,         // код первого цвета текста
            secondTextColor: params.secondTextColor,         // код второго цвета текста
            animTime: params.animTime                  // время анимации (в миллисекундах)
        },
        buttonBackgroundMinWidth = params.minWidth;    // минимальная ширина экрана для анимации

    let animTimeout = '';
    function changeOneSideButton(firstColor, secondColor, button) {
        button.setAttribute('isAnimEnded', false);
        $(button).css({
            "transition": `${oneSideButtonStyle.animTime/1000}s ease`,
            "background-position": oneSideButtonStyle.secondPosition
        });
        animTimeout = setTimeout(function(){
            $(button).css({
                'transition': 'none',
                'background': `linear-gradient(${oneSideButtonStyle.whereTo}, ${secondColor} 50%, ${firstColor} 50%)`,
                'background-position': oneSideButtonStyle.firstPosition,
                'background-size': oneSideButtonStyle.backgroundSize
            });
            button.setAttribute('isAnimEnded', true);
        }, oneSideButtonStyle.animTime);
    }

    if ($(window).width() > buttonBackgroundMinWidth) {
        const targetButtons = [];
        targetOneSideButtonsPars.forEach((button, i) => {
            targetButtons[i] = button.firstElementChild;
        });
        oneSideButtonStyle.backgroundSize = (oneSideButtonStyle.whereTo == 'left' || oneSideButtonStyle.whereTo == 'right') ? '200% 100%' : '100% 200%';
        if (oneSideButtonStyle.whereTo == 'left') {
            oneSideButtonStyle.firstPosition = 'left bottom';
            oneSideButtonStyle.secondPosition = 'right bottom';
        } else if (oneSideButtonStyle.whereTo == 'right') {
            oneSideButtonStyle.firstPosition = 'right bottom';
            oneSideButtonStyle.secondPosition = 'left bottom';
        } else if (oneSideButtonStyle.whereTo == 'top') {
            oneSideButtonStyle.firstPosition = 'left top';
            oneSideButtonStyle.secondPosition = 'left bottom';
        } else if (oneSideButtonStyle.whereTo == 'bottom') {
            oneSideButtonStyle.firstPosition = 'left bottom';
            oneSideButtonStyle.secondPosition = 'left top';
        }  
        oneSideButtonStyle.whereTo = 'to ' + oneSideButtonStyle.whereTo;  
        $(targetButtons).css({
            'background': `linear-gradient(${oneSideButtonStyle.whereTo}, ${oneSideButtonStyle.secondColor} 50%, ${oneSideButtonStyle.firstColor} 50%)`,
            'background-position': oneSideButtonStyle.firstPosition,
            'background-size': oneSideButtonStyle.backgroundSize,
            'color': oneSideButtonStyle.firstTextColor
        });

        

        $(targetButtons).attr('isAnimEnded', true);
        
        $(targetButtons).on('mouseenter', function() {
                if (this.getAttribute('isAnimEnded') == 'true') {
                    changeOneSideButton(oneSideButtonStyle.secondColor, oneSideButtonStyle.firstColor, this);
                } else {
                    clearTimeout(animTimeout);
                    $(this).css({"background-position": oneSideButtonStyle.firstPosition});
                    this.setAttribute('isAnimEnded', true);
                }
                $(this).css('color', oneSideButtonStyle.secondTextColor);
            })
            .on('mouseleave', function() {
                if (this.getAttribute('isAnimEnded') == 'true') {
                    changeOneSideButton(oneSideButtonStyle.firstColor, oneSideButtonStyle.secondColor, this);
                } else {
                    clearTimeout(animTimeout);
                    $(this).css({"background-position": oneSideButtonStyle.firstPosition});
                    this.setAttribute('isAnimEnded', true);
                }
                $(this).css('color', oneSideButtonStyle.firstTextColor);
            });
    }
}


/* двухсторонняя кнопка */
function twoSideButton_init(params) {
    const targetTwoSideButtonsPar = document.querySelectorAll(params.selectors),  // кнопки
        twoSideButtonStyle = {
            firstColor: params.firstColor,			    // код первого цвета
            secondColor: params.secondColor,		    // код второго цвета
            whereTo: params.whereTo,                // направление смещения: right / left / top / bottom
            firstTextColor: params.firstTextColor,
            secondTextColor: params.secondTextColor,
            animTime: params.animTime
        },
        twoSideButtonBackgroundMinWidth = params.minWidth;    // минимальная ширина экрана для анимации

    if ($(window).width() > twoSideButtonBackgroundMinWidth) {
        const targetTwoSideButtons= [];
        targetTwoSideButtonsPar.forEach((button, i) => {
            targetTwoSideButtons[i] = button.firstElementChild;
        });
        twoSideButtonStyle.backgroundSize = (twoSideButtonStyle.whereTo == 'left' || twoSideButtonStyle.whereTo == 'right') ? '200% 100%' : '100% 200%';
        if (twoSideButtonStyle.whereTo == 'left') {
            twoSideButtonStyle.firstPosition = 'left bottom';
            twoSideButtonStyle.secondPosition = 'right bottom';
        } else if (twoSideButtonStyle.whereTo == 'right') {
            twoSideButtonStyle.firstPosition = 'right bottom';
            twoSideButtonStyle.secondPosition = 'left bottom';
        } else if (twoSideButtonStyle.whereTo == 'top') {
            twoSideButtonStyle.firstPosition = 'left top';
            twoSideButtonStyle.secondPosition = 'left bottom';
        } else if (twoSideButtonStyle.whereTo == 'bottom') {
            twoSideButtonStyle.firstPosition = 'left bottom';
            twoSideButtonStyle.secondPosition = 'left top';
        }  
        twoSideButtonStyle.whereTo = 'to ' + twoSideButtonStyle.whereTo;

        $(targetTwoSideButtons).css({
            'background': `linear-gradient(${twoSideButtonStyle.whereTo}, ${twoSideButtonStyle.secondColor} 50%, ${twoSideButtonStyle.firstColor} 50%)`,
            'background-position': twoSideButtonStyle.firstPosition,
            'background-size': twoSideButtonStyle.backgroundSize,
            'transition': `${twoSideButtonStyle.animTime/1000}s ease`,
            'color': twoSideButtonStyle.firstTextColor
        });
        $(targetTwoSideButtons).hover(function() {
            $(this).css({
                "background-position": twoSideButtonStyle.secondPosition,
                'color': twoSideButtonStyle.secondTextColor
            });
        },
        function() {
            $(this).css({
                "background-position": twoSideButtonStyle.firstPosition,
                'color': twoSideButtonStyle.firstTextColor
            });
        });
    }
}


/* появление фото из угла */ // НЕ РАБОТАЕТ
function cornerPhoto_init(params) {

}


    const cornerPhotos = document.querySelectorAll('[data-elem-id="1599909480763"], [data-elem-id="1599915620519"]');    // imgfield="tn_img_1599909480763"

    $(cornerPhotos).wrap('<div class="photoWrapper"></div>');
    const cornerPhotoWrappers = document.querySelectorAll('.photoWrapper');

    const tempint = setInterval(() => {
        if (window.getComputedStyle(cornerPhotos[0]).height != '0px') {
            clearInterval(tempint);
            cornerPhotoWrappers.forEach((wrapper, i) => {
                wrapper.setAttribute('trueWidth', cornerPhotos[i].getAttribute('data-field-width-value'));
                wrapper.setAttribute('trueHeight', window.getComputedStyle(cornerPhotos[i]).height);
                $(wrapper).css({'width': '0', 'height': '0', 'overflow': 'hidden', 'transition': '0.4s ease-in'});
                wrapper.firstElementChild.style.width = wrapper.getAttribute('trueWidth');
                wrapper.firstElementChild.style.height = wrapper.getAttribute('trueHeight');
            });

            document.addEventListener('scroll', showOnScroll);
        }
    }, 50);


    function showOnScroll() {
        const wt = $(window).scrollTop(),
            wh = $(window).height();

        for(let i=0; i<cornerPhotoWrappers.length; i++) {
            const et = $(cornerPhotoWrappers[i]).offset().top;
            if(wt+wh/2 > et) {
                $(cornerPhotoWrappers[i]).css({
                    'width': cornerPhotoWrappers[i].getAttribute('trueWidth'), 
                    'height': cornerPhotoWrappers[i].getAttribute('trueHeight'), 
                });
            } else {
                $(cornerPhotoWrappers[i]).css({'width': '0', 'height': '0'});
            }
        }
    }

