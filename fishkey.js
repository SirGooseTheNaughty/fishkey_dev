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


/* горизонтальный скролл нескольких блоков */
function horScroll_init(params) {
    const horScrollBlocks = document.querySelectorAll(params.selectors),
        horScrollMinWidth = params.minWidth,
        speedCoeff = params.speedCoeff,

        horScrollwh = $(window).height(),
        horScrollww = $(window).width(),
        horScrollBlocksNum = $(horScrollBlocks).length,
        horScrollTotalHeight = (horScrollBlocksNum-1)*horScrollww/speedCoeff + horScrollwh,
        horScrollBlockTop = $(horScrollBlocks[0]).offset().top,
        horScrollStop = (horScrollBlocksNum-1)*horScrollww/speedCoeff;
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
                transform: `translate(${-horScrollShift*speedCoeff}px, 0)`
            });
        } else {
            $(horScrollContainer).css({
                position: 'relative',
                transform: `translate(${-horScrollStop*speedCoeff}px, ${horScrollStop}px)`
            });
        }
    }
}


/* смена экранов по скроллу */
function screenChangeOnScroll_init(params) {
    const pages = document.querySelectorAll(params.blocks);
    let activePage = 0;

    if ($(window).width() > params.minWidth) {
        $(pages).css({
            'position': 'fixed',
            'width': '100vw',
            'height': '100vh',
            'top': '100vh',
            'left': '0',
        });
        pages[0].style.top = '0';
        pages.forEach(page => {
            page.style.backgroundColor = window.getComputedStyle(page.querySelector('div').querySelector('div')).backgroundColor;
            page.style.transition = `top ${params.changeTime}s cubic-bezier(.75,0,.25,1)`;
        });
    
        document.addEventListener('wheel', pageChange);
    }
    
    function pageChange(event) {
        console.log(event);
        let delta = event.deltaY;
        if (delta >= 0) {
            nextPage(1);
        } else {
            nextPage(-1);
        }
    }

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
            }, params.changeTime*1000);
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


/* текст над элементами */
function hoverText_init(params) {
    const hoverTextObjects = document.querySelectorAll(params.objects),
        hoverTextCursor = document.querySelector(params.cursor),
        hoverTexts = params.texts,
        isCursorHidden = params.isCursorHidden,
        minWidth = params.minWidth;

    if ($(window).width() > minWidth) {
        hoverTextObjects.forEach((obj, i) => {
            obj.setAttribute('data-text', hoverTexts[i]);
            obj.classList.add('textHover');
        });

        let hiddenCursor = 'auto',
            transitionStyle = 'opacity 0.25s ease, left 0.4s linear, top 0.4s linear';
        if (isCursorHidden) {
            hiddenCursor = 'none';
            transitionStyle = 'opacity 0.25s ease';
        }
    
        $(hoverTextCursor).css({
            transform: 'translate(-50%, -50%)',
            opacity: '0',
            position: 'fixed',
            top: '0',
            left: '0',
            'z-index': '9999',
            'pointer-events': 'none'
        });
    
        $(document).mousemove(function (e) {
            $(hoverTextCursor).css({
                "left": e.pageX,
                "top": e.pageY - $(window).scrollTop()
            });
        });
    
        $(".textHover").mouseenter(function(event) {
                hoverTextCursor.firstElementChild.innerText = event.target.getAttribute('data-text');
                hoverTextCursor.style.transition = transitionStyle;
                hoverTextCursor.style.opacity = '1';
                document.documentElement.style.cursor= hiddenCursor;
            })
            .mouseleave(function(event) {
                hoverTextCursor.style.transition = 'opacity 0.1s ease';
                hoverTextCursor.style.opacity = '0';
                document.documentElement.style.cursor= 'auto';
            });
    } 
}


/* универсальный бургер */
function uniBurger_init(params) {
    const burgerBlock = document.querySelector(params.burgerBlock),
        triggerBlock = document.querySelector(params.triggerBlock),
        triggerElem = triggerBlock.querySelector('.tn-elem'),
        burgerTransTime = params.burgerTime,
        burgerElemsTransTime = params.elementsTime,
        startPos = [
            params.verticalPosition,
            params.horizontalPosition
        ],
        burgerShape = params.burgerShape,
        shownStyle = {'z-index': '99'},
        hiddenStyle = {
            'width': '0',
            'height': '0',
            'z-index': '0'
        },
        triggerLineHeight = params.triggerLineHeight,
        triggerColor = params.triggerColor,
        burgerLinks = burgerBlock.querySelectorAll('a');

    // инициализация триггера
    $(triggerBlock).css({
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        top: '0',
        left: '0',
        'z-index': '100',
        'pointer-events': 'none'
    });
    triggerElem.innerHTML = `
        <div id="nav-icon">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    const burgerButton = triggerBlock.querySelector('#nav-icon');
    burgerButton.style.width = triggerElem.getAttribute('data-field-width-value') + 'px';
    burgerButton.style.height = triggerElem.getAttribute('data-field-height-value') + 'px';
    burgerButton.style.pointerEvents = 'auto';
    $(burgerButton).children().css({
        height: triggerLineHeight,
        'background-color': triggerColor
    });
        

    $(burgerBlock).wrap('<div class="burgerWrapper"></div>');
    const burgerWrapper = document.querySelector('.burgerWrapper');

    function burgerReshape() {
        const ww = $(window).width() + 17,
            wh = $(window).height(),
            maxDim = Math.max(ww, wh);

        switch (burgerShape) {
            case 'rect': 
                shownStyle.width = '100vw';
                shownStyle.height = '100vh';
                if (startPos[0] == 'center') {
                    hiddenStyle.top = '50%';
                    shownStyle.top = '0';
                } else if (startPos[0] == 'bottom') {
                    hiddenStyle.top = '100%';
                    shownStyle.top = '0';
                } else {
                    hiddenStyle[startPos[0]] = '0';
                }
                if (startPos[1] == 'center') {
                    hiddenStyle.left = '50%';
                    shownStyle.left = '0';
                } else {
                    hiddenStyle[startPos[1]] = '0';
                }
                break;
            case 'square': 
                shownStyle.width = maxDim;
                shownStyle.height = maxDim;
                if (startPos[0] == 'center') {
                    hiddenStyle.top = '50%';
                    shownStyle.top = (wh - ww)/2 + 'px';
                } else if (startPos[0] == 'bottom') {
                    hiddenStyle.top = '100%';
                    shownStyle.top = (wh - ww) + 'px';
                } else {
                    hiddenStyle[startPos[0]] = '0';
                }
                if (startPos[1] == 'center') {
                    hiddenStyle.left = '50%';
                    shownStyle.left = '0';
                } else {
                    hiddenStyle[startPos[1]] = '0';
                }
                break;
            case 'circle': 
                $(burgerWrapper).css('border-radius', '50%');
                let diameter = 2*Math.sqrt(ww*ww/4 + wh*wh/4);
                if ((startPos[0] != 'center') || (startPos[1] != 'center')) {
                    diameter = 2*Math.sqrt(ww*ww + wh*wh);
                }
                if (startPos[0] == 'center') {
                    hiddenStyle.top = '50%';
                    shownStyle.top = -(diameter - wh)/2 + 'px';
                } else if (startPos[0] == 'bottom') {
                    hiddenStyle.top = '100%';
                    shownStyle.top = -(diameter/2 - wh) + 'px';
                } else if (startPos[0] == 'top') {
                    hiddenStyle.top = '0';
                    shownStyle.top = -diameter/2 + 'px';
                }
                if (startPos[1] == 'center') {
                    hiddenStyle.left = '50%';
                    shownStyle.left = -(diameter - ww)/2 + 'px';
                } else if (startPos[1] == 'right') {
                    hiddenStyle.right = '0';
                    shownStyle.right = -diameter/2 + 'px';
                } else if (startPos[1] == 'left') {
                    hiddenStyle.left = '0';
                    shownStyle.left = -diameter/2 + 'px';
                }
                shownStyle.width = diameter;
                shownStyle.height = diameter;
                break;
        }
    }

    (function burgerInit() {
        const burgerBGColor = $(burgerBlock).children('div').children('div').css('background-color');
        $(burgerBlock).children('div').children('div').css('background-color', 'none');
        burgerBlock.classList.add('burgerBlock', 'burgerHidden');
        
        burgerReshape();

        $(burgerWrapper).css({
            'background-color': burgerBGColor,
            'width': '0',
            'height': '0',
            'transition': `${burgerTransTime}s ease`,
            'z-index': '9998'
        });
    })();

    $(burgerWrapper).css(hiddenStyle);

    $(burgerBlock).css('transition', `opacity ${burgerElemsTransTime}s ease`);

    function toggleBurger() {
        this.classList.toggle('open');

        if (burgerBlock.classList.contains('burgerHidden')) {
            document.documentElement.style.overflowY = 'burgerHidden';
            $(burgerWrapper).css(shownStyle);
            setTimeout(() => {
                burgerBlock.classList.remove('burgerHidden');
                burgerBlock.classList.add('burgerShown');
            }, 1000*burgerTransTime);
        } else {
            burgerBlock.classList.add('burgerHidden');
            burgerBlock.classList.remove('burgerShown');
            setTimeout(() => {
                document.documentElement.style.overflowY = 'auto';
                $(burgerWrapper).css(hiddenStyle);
            }, 1000*burgerElemsTransTime);
            
        }
    }

    burgerButton.addEventListener('click', toggleBurger);
    burgerLinks.forEach(burgerLink => burgerLink.addEventListener('click', toggleBurger));

    window.onresize = burgerReshape;
}


/* видео в кружок */
function videoCircle_init(params) {
    const videoCircle = document.querySelectorAll(params.videos);
    videoCircle.forEach((video, i) => {
        if (params.autoSize) {
            params.circleDiams[i] = Math.max(video.getAttribute('data-field-height-value'), video.getAttribute('data-field-width-value'));
        }
        video.style.clipPath = `circle(${params.circleDiams[i]/2}px at center)`;
        video.style.pointerEvents = 'none';
    });
}


/* замена курсора */
function cursorChange_init(params) {
    const minWidth = params.minWidth,
        numStates = params.numStates,
        normalStyle = params.normalStyle,
        stateStyles = {},
        stateInners = [];

    if ($(window).width() > minWidth) {
        cursorChange_add();
    }

    function cursorChange_add() {
        $("body").prepend(`
            <div class="cursor-changed">
                <div class="cursor-border"></div>
                <div class="cursor-normalStyle"></div>
            </div>`
        );
        const cursor = document.querySelector('.cursor-changed'),
            cursorBorder = cursor.querySelector('.cursor-border'),
            cursorNormal = cursor.querySelector('.cursor-normalStyle');
        $(cursor).css({
            position: 'fixed',
            left: '-100px',
            top: '0',
            overflow: 'visible',
            'z-index': '10000000000',
            'pointer-events': 'none'
        });
        $(cursorBorder).css(normalStyle);

        cursorNormal.innerHTML = params.normalInner;
        for (let i = 0; i < numStates; i++) {
            stateStyles[i] = params.stateStyles[i];
            $(cursor).append(`<div class="cursor-state-${i}"></div>`);
            stateInners[i] = document.querySelector(`.cursor-state-${i}`);
            stateInners[i].innerHTML = params.stateInners[i];
            stateInners[i].style.opacity = 0;
        }

        $(cursor).children().css({
            display: 'grid',
            'place-items': 'center',
            transform: 'translate(-50%, -50%)',
            position: 'absolute',
            top: '0',
            left: '0',
            transition: '0.25s ease'
        });

        document.documentElement.style.cursor = 'none';

        document.addEventListener('mousemove', (event) => {
            $(cursor).css({
                left: event.pageX,
                top: event.pageY - $(window).scrollTop()
            });
        });


        for (let i = 0; i < numStates; i++) {
            params.triggers[i].style.cursor = 'none';
            $(params.triggers[i]).attr('data-makes-cursor-state', i);
            $(params.triggers[i]).mouseenter(turnCursorStateOn).mouseleave(turnCursorStateOff);
        }

        function turnCursorStateOn (e) {
            $(stateInners).css('opacity','0');
            stateInners.forEach(inner => inner.style.opacity = '0');
            const state = this.getAttribute('data-makes-cursor-state');
            $(cursorBorder).css(stateStyles[state]);
            cursorNormal.style.opacity = 0;
            stateInners[state].style.opacity = 1;
        }
        function turnCursorStateOff (e) {
            console.log('unhovered ' + this.tagName);
            stateInners.forEach(inner => inner.style.opacity = '0');
            $(cursorBorder).css(normalStyle);
            cursorNormal.style.opacity = 1;
        }
    }
}


/* переход на страницы по картинкам */
function photoLink(params) {
    if ($(window).width() > params.minWidth) {
        for (let i = 0; i < params.photos.length; i++) {
            const photo = document.querySelector(params.photos[i]);
            photo.setAttribute('data-imgLink', params.links[i]);
            photo.style.cursor = 'pointer';
            photo.addEventListener('click', photoLinkOpener);
        }
    }

    function photoLinkOpener () {
        const link = this.getAttribute('data-imgLink');
        $(this).clone().insertBefore(this);
        const clone = this.previousSibling;
        $(clone).css({
            position: 'fixed',
            top: this.getBoundingClientRect().top + 'px',
            left: this.getBoundingClientRect().left + 'px',
            'z-index': '999999'
        });
        setTimeout(() => {
            $(clone).css({
                transition: '1s ease',
                top: '0',
                left: '0',
                width: '100vw'
            });
            setTimeout(() => {
                setTimeout(() => clone.remove(), 250);
                if (params.tab == 'new') {
                    window.open(link, '_blank');
                } else {
                    document.location.href = link;
                }
            }, 1000);
        }, 100);
    }
}


/* фото за элементами */
function bgPhotos_init(params) {
    const LP__links = document.querySelectorAll(params.elements),
        LP__photos = document.querySelectorAll(params.photos),
        LP__linkCenters = {};
    let activeLink = 0;

    LP__links.forEach((LP__link, i) => {
        const LP__linkRect = LP__link.getBoundingClientRect();
        LP__linkCenters[i] = {
            x: LP__linkRect.x + LP__linkRect.width/2,
            y: LP__linkRect.y + LP__linkRect.height/2
        };
    });

    function LP__mousemove(e) {
        function LP__moveImage() {
            const LP__photoCenterPosition = {
                x: LP_mouseCoordinates.x - LP__linkCenters[activeLink].x,
                y: LP_mouseCoordinates.y - LP__linkCenters[activeLink].y
            };
            LP__photos[activeLink].style.transform = `translate(${LP__photoCenterPosition.x}px, ${LP__photoCenterPosition.y}px)`;
        }
        const LP_mouseCoordinates = {
            x: e.clientX,
            y: e.clientY
        };
        window.requestAnimationFrame(LP__moveImage);
    }

    if ($(window).width() > params.minWidth) {
        LP__links.forEach((link, i) => {
            $(link).attr('assocWith', i);
            link.parentElement.style.zIndex = 5;
            link.parentElement.style.cursor = 'pointer';
            const newPadding = (parseInt(window.getComputedStyle(link).width, 10) - parseInt(window.getComputedStyle(link).height, 10))/2 + 'px';
            link.style.padding = `${newPadding} 0 ${newPadding} 0`;
            link.style.marginTop = '-' + newPadding;
            link.style.borderRadius = '50%';
        });
        LP__photos.forEach((photo, i) => {
            $(photo).attr('assocWith', i);
            $(photo).css({
                'position': 'absolute',
                'z-index': '1',
                'opacity': '0',
                'transition': 'opacity 0.25s ease, transform 0.1s linear'
            });
        });
    
        $(LP__links).on('mouseenter', function () {
            activeLink = $(this).attr('assocWith');
            LP__photos[activeLink].style.opacity = 1;
            LP__photos[activeLink].style.transition = 'opacity 0.25s ease, transform 0s';
            document.addEventListener('mousemove', LP__mousemove);
        })
        .on('mouseleave', function () {
            document.removeEventListener('mousemove', LP__mousemove);
            LP__photos[activeLink].style.opacity = 0;
            LP__photos[activeLink].style.transform = `translate(0)`;
            LP__photos[activeLink].style.transition = 'opacity 0.25s ease, transform 0.25s linear';
        });
    }
}


/* след курсора */
function cursorTrace_init(params) {
    const mt_numPoints = params.numPoints,
        mt_overallOpacity = params.opacity,
        mt_cursorStyle = params.cursorStyle,
        mt_trailStyle = params.trailStyle,
        trailCoords = {
            x: [],
            y: []
        };

    let mouseX = 0,
        mouseY= 0,
        mt_refreshInt = '',
        isRefreshing = false,
        mt_circles = '';

    if ($(window).width() > params.minWidth) {
        $('body').prepend(
            `<svg id="mouseTail" xmlns="http://www.w3.org/2000/svg" 
            width="100vw" height="100vh" viewBox="0 0 100% 100%" 
            style="position: fixed; top: 0; left: 0; z-index: 99999"></svg>`
        );

        const svgns = "http://www.w3.org/2000/svg",
            svg = document.querySelector("#mouseTail");

        let newCircle = {};
        
        for(let i = mt_numPoints; i > 0; i--) {
            newCircle = document.createElementNS(svgns, "circle");
            newCircle.style.opacity = mt_overallOpacity*(i/mt_numPoints)/Math.sqrt(mt_numPoints);
            svg.appendChild(newCircle);
        }
        svg.style.pointerEvents = 'none';
        mt_circles = document.querySelectorAll('#mouseTail circle');
        $(mt_circles).attr(mt_trailStyle);
        $(mt_circles[0]).attr(mt_cursorStyle);

        for (let i = 0; i < 100; i++) {
            trailCoords.x[i] = 0;
            trailCoords.y[i] = 0;
        }
        
        document.addEventListener('mousemove', function(event) {
            mouseX = event.pageX;
            mouseY = event.pageY;
            if (!isRefreshing) {
                mt_refreshInt = setInterval(trailCoordsRefresh, 1);
                isRefreshing = true;
            }
        });
    }

    function trailCoordsRefresh() {
        trailCoords.x.unshift(mouseX);
        trailCoords.y.unshift(mouseY);
        trailCoords.x.pop();
        trailCoords.y.pop();

        mt_circles.forEach((circle, i) => {
            circle.setAttribute("transform", `matrix(1, 0, 0, 1, ${trailCoords.x[i]}, ${trailCoords.y[i]})`);
        });

        if ((mt_circles[0].getAttribute("transform") === mt_circles[98].getAttribute("transform"))) {
            clearInterval(mt_refreshInt);
            isRefreshing = false;
        }
    }
}


/* хвост курсора */
function cursorTail (params) {
    const mt_color = params.color,
        mt_radius = params.radius,
        mt_numPoints = params.numPoints,
        mt_overallOpacity = params.opacity;

    let mt_circles = '',
        mouseX = 0,
        mouseY= 0;

    if ($(window).width() > params.minWidth) {
        $('body').prepend(
            `<svg id="mouseTail" xmlns="http://www.w3.org/2000/svg" 
            width="100vw" height="100vh" viewBox="0 0 100% 100%" 
            style="position: fixed; top: 0; left: 0; z-index: 99999"></svg>`
        );

        const svgns = "http://www.w3.org/2000/svg",
            svg = document.querySelector("#mouseTail");
    
        let newCircle = {};
        
        for (let i = mt_numPoints; i > 0; i--) {
            newCircle = document.createElementNS(svgns, "circle");
            newCircle.style.opacity = mt_overallOpacity*(i/mt_numPoints)/Math.sqrt(mt_numPoints);
            svg.appendChild(newCircle);
        }
        svg.style.pointerEvents = 'none';
        mt_circles = document.querySelectorAll('#mouseTail circle');
        $(mt_circles).attr({
            transform: 'matrix(1, 0, 0, 1, 0, 0)',
            r: mt_radius,
            fill: mt_color
        });
    
        setInterval(trailCoordsRefresh, 1);
    
        document.addEventListener('mousemove', function(event) {
            mouseX = event.pageX;
            mouseY = event.pageY;
        });
    }

    function trailCoordsRefresh() {
        let circleX = 0, circleY = 0, circleNewX = 0, circleNewY = 0, speed = 10;

        mt_circles.forEach((circle, i) => {
            circleX = circle.getAttribute('transform').split(', ')[4];
            circleY = circle.getAttribute('transform').split(', ')[5];
            circleY = circleY.substr(0, circleY.length-1);
            circleNewX = +circleX + (mouseX - circleX)/(i + 1);
            circleNewY = +circleY + (mouseY - circleY)/(i + 1);
            circle.setAttribute("transform", `matrix(1, 0, 0, 1, ${circleNewX}, ${circleNewY})`);
        });
    }
}


/* появление фото из угла */ // НЕ РАБОТАЕТ
function cornerPhotos_init(params) {
    const cornerPhotos = document.querySelectorAll(params.photos),
        transitionTime = params.transitionTime;

    if ($(window).width() > params.minWidth) {
        cornerPhotos.forEach((photo, i) => {
            $(photo).append(`
                <svg style="width: 100%; height: 100%; position: absolute; left: 0;">
                    <defs>
                        <clipPath id="mask-${i}" style="transform: scale(0); transition: transform ${transitionTime}s ease">
                            <rect width="100%" height="100%" fill="#FFFFFF"></rect>
                        </clipPath>
                    </defs>
                </svg>
            `);
            photo.style.clipPath = `url(#mask-${i})`;
            photo.setAttribute('data-clipped', 'true');
        });
    
        document.addEventListener('scroll', showOnScroll);
    }
    
    function showOnScroll() {
        const wt = $(window).scrollTop(),
            wh = $(window).height();

        cornerPhotos.forEach((photo, i) => {
            const et = $(photo).offset().top;
            if((wt+wh/2 > et) && (photo.getAttribute('data-clipped') == 'true')) {
                document.querySelector(`#mask-${i}`).style.transform = 'scale(1)';
                photo.setAttribute('data-clipped', 'false');
            }
        });
    }
}


/* перетаскивалка */
function horDrag_init(params) {
    const horDragGallery = document.querySelector(params.block),
        horDragObj = horDragGallery.querySelector('div').firstElementChild;

    let dragStartX = 0,
        dragObjStartX = 0,
        horDragMinLeft = 0,
        horDragMaxLeft = 0;

    if ($(window).width() > params.minWidth) {
        horDragObj.style.overflow = 'visible';
        horDragObj.style.cursor = 'pointer';
        document.body.style.overflowX = 'hidden';

        const elements = horDragObj.querySelectorAll('.tn-elem'),
            lefts = [],
            widths = [];

        elements.forEach((el, i) => {
            lefts[i] = +el.getBoundingClientRect().x;
            widths[i] = +el.getAttribute('data-field-width-value');
        });

        const offsetLeft = Math.min.apply(Math, lefts),
            maxRight = Math.max.apply(Math, lefts),
            rightCorner = offsetLeft + maxRight + widths[lefts.indexOf(maxRight)];

        $(horDragObj).css({
            position: 'relative',
            top: '0',
            left: '0',
            width: rightCorner + 'px'
        });

        horDragMaxLeft = $(window).width() - $(horDragObj).width();

        horDragObj.addEventListener('mousedown', function(event) {
            dragStartX = event.clientX;
            document.addEventListener('mousemove', horDrag);
        });
        document.addEventListener('mouseup', function(event) {
            document.removeEventListener('mousemove', horDrag);
            dragObjStartX = +horDragObj.getAttribute('data-current-x');
        });
    }

    function horDrag(event) {
        const horDragShift = event.clientX - dragStartX,
            horDragNewPos = dragObjStartX + horDragShift;
        if (horDragNewPos < horDragMinLeft && horDragNewPos > horDragMaxLeft) {
            horDragObj.style.transform = `translate(${dragObjStartX + horDragShift}px, 0)`;
            horDragObj.setAttribute('data-current-x', dragObjStartX + horDragShift);
        } else if (horDragNewPos > horDragMinLeft) {
            horDragObj.style.transform = `translate(${horDragMinLeft}px, 0)`;
            horDragObj.setAttribute('data-current-x', horDragMinLeft);
        } else if (horDragNewPos < horDragMaxLeft) {
            horDragObj.style.transform = `translate(${horDragMaxLeft}px, 0)`;
            horDragObj.setAttribute('data-current-x', horDragMaxLeft);
        }
    }
}




    


