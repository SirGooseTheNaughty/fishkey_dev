/* утилита для плавного расчета координат */
function initCoordTracking(obj, trigger, positioning, hasX, hasY, params) {
    let isIntSet = false;
    let coordInt = '';
    const framerate = params.framerate || 20;
    const speed = params.delaySpeed || 1;
    const tolerance = params.tolerance || 1;

    if (hasX) {
        obj.setAttribute('data-current-x', 0);
        obj.setAttribute('data-target-x', 0);
    }
    if (hasY) {
        obj.setAttribute('data-current-y', 0);
        obj.setAttribute('data-target-y', 0);
    }

    document.addEventListener(trigger, (e) => {
        if (!isIntSet) {
            coordInt = setInterval(() => {
                requestAnimationFrame(moveObj);
            }, framerate);
            isIntSet = true;
        }
    });

    function moveObj() {
        const curr = {
            x: null,
            y: null
        };
        const target = {
            x: null,
            y: null
        };
        const newCoord = {
            x: null,
            y: null
        };
        const translation = {
            x: 0,
            y: 0
        };
        let totalError = 0;
        if (hasX) {
            curr.x = +obj.getAttribute('data-current-x');
            target.x = +obj.getAttribute('data-target-x');
            newCoord.x = oneCoordChange(curr.x, target.x);
            obj.setAttribute('data-current-x', newCoord.x);
            if (positioning == 'abs') {
                obj.style.left = newCoord.x + 'px';
            } else {
                translation.x = newCoord.x + 'px';
            }
            totalError += Math.abs(target.x - curr.x);
        }
        if (hasY) {
            curr.y = +obj.getAttribute('data-current-y');
            target.y = +obj.getAttribute('data-target-y');
            newCoord.y = oneCoordChange(curr.y, target.y);
            obj.setAttribute('data-current-y', newCoord.y);
            if (positioning == 'abs') {
                obj.style.top = newCoord.y + 'px';
            } else {
                translation.y = newCoord.y + 'px';
            }
            totalError += Math.abs(target.y - curr.y);
        }
        if (positioning == 'rel') {
            obj.style.transform = `translate(${translation.x}, ${translation.y})`;
        }
        if (totalError < tolerance) {
            clearInterval(coordInt);
            isIntSet = false;
        }
    }
    
    function oneCoordChange(curr, target) {
        const leng = target - curr;
        const rise = 0.8*Math.sign(leng)*Math.cbrt(speed*Math.abs(leng)*Math.abs(leng));
        if (Math.abs(rise) < 1) {
            return target;
        }
        return curr + rise;
    }
}

/* вырисовка вектора */
function vectorDraw_init(params) {
    let { selectors, svgs, trigger, hoverTriggers, offsets } = params;
    const animFunction = params.animFunction || 'ease';
    const animTime = params.animTime || 0.5;
    const minWidth = params.minWidth || 0;
    const logoLengths = [], logoPaths = [], desiredWidths = [], coeffs = [];

    if ($(window).width() > minWidth) {
        (trigger != 'hover' && trigger !='scroll') ? trigger = 'scroll' : null;
        const vd_forSVG = document.querySelectorAll(selectors);
        offsets.forEach((offset, i) => {
            if (isNaN(offset)) {
                offsets[i] = 0;
            } else {
                offsets[i] = $(window).height()*offset/100;
            }
        });
        vd_forSVG.forEach((space, i) => {
            $(space).html(svgs[i]);
        });
        vd_forSVG.forEach((space, i) => {
            logoPaths[i] = space.querySelector('path');
            logoLengths[i] = logoPaths[i].getTotalLength();
            desiredWidths[i] = +space.getAttribute('data-field-width-value');
            coeffs[i] = desiredWidths[i]/(+space.querySelector('svg').getAttribute('width'));
            $(logoPaths[i]).css({
                'stroke-dasharray': logoLengths[i],
                'stroke-dashoffset': logoLengths[i],
                'animation-duration': animTime + 's',
                'animation-timing-function': animFunction
            });
            space.querySelector('svg').style.transform = `scale(${coeffs[i]})`;
            space.querySelector('svg').style.transformOrigin = 'top left';
        });
        
        if (trigger == 'hover') {
            const triggers = [];
            hoverTriggers.forEach((trigger, i) => triggers[i] = document.querySelector(trigger) );
            triggers.forEach((trigger, i) => {
                trigger.setAttribute('data-vectorNum', i);
                trigger.addEventListener('mouseenter', hoverDraw);
                trigger.addEventListener('mouseleave', hoverDraw);
            })
        } else {
            scrollDraw();
            document.addEventListener('scroll', scrollDraw);
        }
    }

    function hoverDraw() {
        const vector = this.getAttribute('data-vectorNum');
        logoPaths[vector].classList.toggle('draw-svg');
    }

    function scrollDraw() {
        const visible = logoPaths.map((vector, i) => $(vector).offset().top < $(window).scrollTop() + $(window).height() - offsets[i]);
        visible.forEach((isVisible, i) => {
            if (isVisible) {
                logoPaths[i].classList.add('draw-svg');
            }
        })
    }
}


/* вырисовка надписи вектором */
function vectorWrite_init(params) {
    let { selector, svg } = params;
    let logoPaths = [];
    let desiredWidth = 0;
    let coeff = 0;
    let strokeWidth = params.strokeWidth || 0.5;
    const offset = params.offset ? params.offset*$(window).height() : 0;
    const animTime = params.animTime || 0.5;
    const minWidth = params.minWidth || 0;

    if ($(window).width() > minWidth) {
        strokeWidth = strokeWidth ? strokeWidth + 'px' : '1px';
        const vd_forSVG = document.querySelector(selector);
        $(vd_forSVG).html(svg);
        
        desiredWidth = +vd_forSVG.getAttribute('data-field-width-value');
        coeff = desiredWidth/(+vd_forSVG.querySelector('svg').getAttribute('width'));

        $(vd_forSVG).css({
            height: desiredWidth + 'px'
        });
        vd_forSVG.querySelector('svg').style.transformOrigin = `left`;
        vd_forSVG.querySelector('svg').style.transform = `scale(${coeff})`;

        logoPaths = vd_forSVG.querySelectorAll('path');
        animTime = animTime/logoPaths.length;

        $(logoPaths).css({
            'animation-timing-function': 'linear',
            'stroke-width': strokeWidth,
            'fill-opacity': '0',
        });
        logoPaths.forEach((path, i) => {
            $(path).css({
                'stroke-dasharray': path.getTotalLength(),
                'stroke-dashoffset': path.getTotalLength(),
                stroke: path.getAttribute('fill'),
                'animation-duration': animTime + 's',
                'animation-delay': animTime*i + 's',
                transition: `fill-opacity ${animTime}s ease-in-out ${animTime*(i+0.5)}s`
            });
        });

        scrollInit();
        document.addEventListener('scroll', scrollInit);
    }

    function scrollInit() {
        const isVisible = $(window).scrollTop() + $(window).height() > $(logoPaths[0]).offset().top + offset;
        if (isVisible) {
            document.removeEventListener('scroll', scrollInit);
            scrollDraw();
        }
    }
    function scrollDraw() {
        logoPaths.forEach(path => {
            path.classList.add('draw-svg');
            $(path).css({
                'fill-opacity': '1'
            });
        })
    }
}


/* кнопка вжух в кружок */
function buttonToCircle_init(params) {
    const minWidth = params.minWidth || 1200;
    const buttonToCircle = document.querySelector(params.selector),
        buttonTextHolder = buttonToCircle.firstElementChild,
        buttonStyle = {
            'bgColor': $(buttonTextHolder).css('background-color'),
            'borderRadius': window.getComputedStyle(buttonTextHolder).borderStartEndRadius || window.getComputedStyle(buttonTextHolder).borderRadius,
            'width': buttonTextHolder.offsetWidth,
            'height': buttonTextHolder.offsetHeight
        };

    if ($(window).width() > minWidth) {
        const widthShift = 2*parseInt(buttonStyle.borderRadius, 10);
        $(buttonToCircle).prepend(`<div class='moving_bg'></div>`);
        const movingBg = $('.moving_bg');
        $(buttonTextHolder).html(`<p class='buttonToCircleTxt'>${$(buttonTextHolder).text()}</p>`);

        $(buttonTextHolder).css({
            'position': 'relative',
            'background': 'transparent',
            'transition': 'color 0.7s cubic-bezier(0.9, 0, 0.1, 1)',
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
            'transition': 'left 0.7s cubic-bezier(0.9, 0, 0.1, 1)',
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
        bgNoiser = bgNoiseBlock.querySelector('[data-elem-type="shape"]'),
        bgGrainer = bgNoiser.querySelector('.tn-atom'),
        grain = parameters.grain ? parameters.grain + 'px' : 'auto';
    bgNoiser.classList.add('bg-noise');
    bgNoiser.style.opacity = parameters.opacity/100 || 0.05;
    bgNoiseBlock.style.height = '0';
    bgNoiseBlock.style.overflow = 'hidden';
    bgGrainer.style.backgroundRepeat = 'repeat';
    bgGrainer.style.backgroundSize = `${grain}`;
}

/* горизонтальный скролл всей страницы */
function fullPageHorScroll_init(parameters) {
    const horScrollBlocks = document.querySelectorAll(parameters.blocks),
        horScrollMenu = parameters.menu ? document.querySelector(parameters.menu) : null,
        horScroll_minWidth = parameters.minWidth || 1200,
        horScroll_blockWidth = parameters.blockWidth || $(window).width(),
        hasDelay = parameters.hasDelay || false,
        delaySpeed = parameters.delaySpeed || 1;
        
    const horScrollwh = $(window).height(),
        horScrollBlocksNum = horScrollBlocks.length,
        horScrollTotalHeight = (horScrollBlocksNum-1)*horScroll_blockWidth + horScrollwh,
        horScrollMenuHeight = horScrollMenu ? $(horScrollMenu).height() : 0,
        horScrollBlockShifts = {};

    let horScrollContainer = {};

    if ($(window).width() > horScroll_minWidth) {
        $(horScrollBlocks).wrapAll('<div class="horScrollContainer"></div>');
        horScrollContainer = document.querySelector('.horScrollContainer');
        if (hasDelay) {
            initCoordTracking(horScrollContainer, 'scroll', 'rel', true, false, {delaySpeed, framerate: 15});
        }

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
        if (horScrollMenu) {
            $(horScrollMenu).css({'position': 'fixed', 'width': '100%', 'z-index': '999'});
        }
        $(horScrollContainer).css({'position': 'fixed', 'top': horScrollMenuHeight, 'left': '0'});
        $(horScrollContainer).wrap('<div class="horScrollStaticContainer"></div>');
        $('.horScrollStaticContainer').css({
            'position': 'relative', 
            'top': horScrollMenuHeight, 
            'overflow': 'hidden', 
            'height': `${horScrollTotalHeight}px`
        });

        if (hasDelay) {
            window.addEventListener('scroll', () => {
                horizontalScrollDelay();
            });
        } else {
            window.addEventListener('scroll', () => {
                horizontalScroll();
            });
        }

        $('a').on('click', (e) => {
            if ($(e.target).attr('href').substring(0,4) == '#rec') {
                const dn = horScrollBlockShifts[$(e.target).attr('href')];
                $('html, body').animate({scrollTop: dn}, 400);
            }
        });
    }
    function horizontalScroll() {
        const wt = $(window).scrollTop();
        let horScrollShift = +wt;
        if (horScrollShift < (horScrollBlocksNum-1)*horScroll_blockWidth) {
            horScrollContainer.style.transform = `translate(${-horScrollShift}px, 0)`;
        }
    }
    function horizontalScrollDelay() {
        const wt = $(window).scrollTop();
        let horScrollShift = +wt;
        if (horScrollShift < (horScrollBlocksNum-1)*horScroll_blockWidth) {
            horScrollContainer.setAttribute('data-target-x', -horScrollShift);
        }
    }
}


/* горизонтальный скролл элементов одного блока */
function horScrollBlock_init(parameters) {
    const horScrollBlock = document.querySelector(parameters.block),
        header = document.querySelector(parameters.header),
        minWidth = parameters.minWidth || 1200,
        totalShift = parameters.totalShift,
        blockHeight = parameters.blockHeight,
        hasDelay = parameters.hasDelay || false,
        delaySpeed = parameters.delaySpeed || 1;

    let headerTop = 0,
        horScrollContainer = {};
    
    if ($(window).width() > minWidth) {
        headerTop = $(header).offset().top;
        const children = $(horScrollBlock.querySelector('.t396__artboard')).children();

        $(children).wrapAll('<div class="horScrollContainer"></div>');
        horScrollContainer = document.querySelector('.horScrollContainer');

        if (hasDelay) {
            initCoordTracking(horScrollContainer, 'scroll', 'rel', true, true, {delaySpeed, framerate: 15});
        }

        $(horScrollContainer).css({top: '0', left: '0',});
        $(header).css({top: '0', left: '0', width: '100vw', 'z-index': '100'});
        horScrollBlock.style.height = totalShift + blockHeight + 'px';
        horScrollBlock.style.backgroundColor = window.getComputedStyle(horScrollBlock.querySelector('.t396__artboard')).backgroundColor;
        horScrollContainer.parentElement.style.overflow = 'visible';

        if (hasDelay) {
            window.addEventListener('scroll', () => {
                horScrollBlockDelay_handler();
            });
        } else {
            window.addEventListener('scroll', () => {
                horScrollBlock_handler();
            });
        }
    }

    function horScrollBlock_handler() {
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

    function horScrollBlockDelay_handler() {
        const wt = $(window).scrollTop(),
            horScrollShift = +wt - headerTop;
        if (wt < headerTop) {
            $(horScrollContainer).css({
                'position': 'relative'
            });
            horScrollContainer.setAttribute('data-target-x', 0);
            horScrollContainer.setAttribute('data-target-y', 0);
            horScrollContainer.setAttribute('data-current-y', 0);
            $(header).css({'position': 'relative'});
        } else if (horScrollShift < totalShift) {
            $(horScrollContainer).css({
                'position': 'fixed'
            });
            horScrollContainer.setAttribute('data-target-x', -horScrollShift);
            horScrollContainer.setAttribute('data-target-y', $(header).height());
            horScrollContainer.setAttribute('data-current-y', $(header).height());

            $(header).css({position: 'fixed', transform: 'translate(0)'});
            horScrollBlock.style.paddingBottom = `${$(header).height()}px`;
        } else {
            $(horScrollContainer).css({
                'position': 'relative',
                'padding-bottom': '0'
            });
            horScrollContainer.setAttribute('data-target-x', -totalShift);
            horScrollContainer.setAttribute('data-target-y', totalShift);
            horScrollContainer.setAttribute('data-current-y', totalShift);

            $(header).css({position: 'relative', transform: `translate(0, ${totalShift}px)`});
            horScrollBlock.style.paddingBottom = '0';
        }
    }
}


/* горизонтальный скролл нескольких блоков */
function horScroll_init(params) {
    const horScrollBlocks = document.querySelectorAll(params.blocks),
        horScrollMinWidth = params.minWidth || 1200,
        speedCoeff = params.speedCoeff || 1,
        hasDelay = params.hasDelay || false,
        delaySpeed = params.delaySpeed || 1,

        horScrollwh = $(window).height(),
        horScrollww = $(window).width(),
        horScrollBlocksNum = $(horScrollBlocks).length,
        horScrollTotalHeight = (horScrollBlocksNum-1)*horScrollww/speedCoeff + horScrollwh,
        horScrollBlockTop = $(horScrollBlocks[0]).offset().top,
        horScrollStop = (horScrollBlocksNum-1)*horScrollww/speedCoeff;
    let horScrollContainer = '';

    if ($(window).width() > horScrollMinWidth) {
        $(horScrollBlocks).wrapAll('<div class="horScrollContainer"></div>');
        horScrollContainer = document.querySelector('.horScrollContainer');
        if (hasDelay) {
            initCoordTracking(horScrollContainer, 'scroll', 'rel', true, true, {framerate: 15, delaySpeed});
        }
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
    
        if (hasDelay) {
            document.addEventListener('scroll', horizontalScrollDelay);
        } else {
            document.addEventListener('scroll', horizontalScroll);
        }
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

    function horizontalScrollDelay() {
        const wt = $(window).scrollTop();
        let horScrollShift = +wt - horScrollBlockTop;
        if (horScrollShift < 0) {
            $(horScrollContainer).css({
                position: 'relative'
            });
            horScrollContainer.setAttribute('data-target-x', 0);
            horScrollContainer.setAttribute('data-target-y', 0);
        } else if (horScrollShift < horScrollStop) {
            $(horScrollContainer).css({
                position: 'fixed'
            });
            horScrollContainer.setAttribute('data-target-x', -horScrollShift*speedCoeff);
            horScrollContainer.setAttribute('data-target-y', 0);
            horScrollContainer.setAttribute('data-current-y', 0);
        } else {
            $(horScrollContainer).css({
                position: 'relative'
            });
            horScrollContainer.setAttribute('data-current-y', horScrollStop);
            horScrollContainer.setAttribute('data-target-x', -horScrollStop*speedCoeff);
            horScrollContainer.setAttribute('data-target-y', horScrollStop);
        }
    }
}


/* смена экранов по скроллу */
function screenChangeOnScroll_init(params) {
    const pages = document.querySelectorAll(params.blocks);
    const minWidth = params.minWidth || 1200;
    const animTime = params.animTime || 0.8;
    let activePage = 0;

    if ($(window).width() > minWidth) {
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
            page.style.transition = `top ${animTime}s cubic-bezier(.75,0,.25,1)`;
        });
    
        document.addEventListener('wheel', pageChange);
    }
    
    function pageChange(event) {
        let delta = event.deltaY;
        if (delta >= 0) {
            nextPage(1);
        } else {
            nextPage(-1);
        }
    }

    function nextPage(direction) {
        const nexPage = activePage + direction;
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
            }, animTime*1000);
        }
    }
}


/* появление текста */
function textApp_init(parameters) {
    const { divider, trigger } = parameters;
    const txtAppConts = document.querySelectorAll(parameters.selectors);   // появляющийся текст
    const spacing = parameters.spacing ? parameters.spacing + 'px' : '5px';
    const minWidth = parameters.minWidth || 0;
    const animSpeed = parameters.animSpeed || 400;
    const wordSpeed = parameters.wordSpeed || 50;
    const offsets = parameters.offsets || null;
    const txtAppWordConts = [];
    offsets.forEach((offset, i) => {
        if (isNaN(offsets[i])) {
            offsets[i] = 0;
        } else {
            offsets[i] = $(window).height()*offset/100;
        }
    });

    function txtAppear(contNum) {
        let i = 0;
        const txtApp_interval = setInterval(() => {
            if (!txtAppWordConts[contNum][i]) {
                clearInterval(txtApp_interval);
            }
            else {
                txtAppWordConts[contNum][i].style.transition = `${animSpeed/1000}s ease`;
                txtAppWordConts[contNum][i].style.top = '0';
            }
            i++;
        }, wordSpeed);
    }

    function txtReappear(contNum) {
        txtAppWordConts[contNum].forEach(word => {
            word.style.transition = `none`;
            word.style.top = '2em';
        });
        txtAppear(contNum);
    }
    
    function scrollTrigger() {
        const appeared = txtAppWordConts.map((vector, i) => $(vector).offset().top < $(window).scrollTop() + $(window).height() - offsets[i]);
        appeared.forEach((isVisible, i) => {
            if (isVisible) {
                txtAppear(i);
            }
        })
    }

    if ($(window).width() > minWidth) {
        txtAppConts.forEach((txtAppCont, contNum) => {
            txtAppCont = txtAppCont.firstElementChild;
            const txtApp = txtAppCont.textContent;
            let txtAppWords = [];
            if (divider == 'w') {
                txtAppWords = txtApp.split(' ');
                txtAppCont.innerHTML = '';
                txtAppWords.forEach((word, i) => {
                    txtAppCont.innerHTML += `<p style='overflow: hidden; display: inline-block; padding: 0 ${spacing} 1rem 0; margin-bottom: -1rem'>
                                                <span class='txtAppWordCont${contNum}'>${word} </span>
                                            </p>`;
                });
            } else if (divider == 'p') {
                txtAppWords = txtApp.split('. ');
                txtAppCont.innerHTML = '';
                txtAppWords.forEach((word, i) => {
                    if (i == txtAppWords.length - 1) {
                        txtAppCont.innerHTML += `<p style='overflow: hidden; display: inline-block; padding-right: ${spacing}'>
                                                    <span class='txtAppWordCont${contNum}'>${word} </span>
                                                </p>`;
                    } else {
                        txtAppCont.innerHTML += `<p style='overflow: hidden; display: inline-block; padding: 0 ${spacing} 1rem 0; margin-bottom: -1rem'>
                                                    <span class='txtAppWordCont${contNum}'>${word}.</span>
                                                </p>`;
                    }
                });
            } else if (divider == 'l') {
                txtAppWords = txtApp.split(';;');
                txtAppCont.innerHTML = '';
                txtAppWords.forEach((word, i) => {
                    txtAppCont.innerHTML += `<p style='overflow: hidden; display: inline-block; padding: 0 ${spacing} 1rem 0; margin-bottom: -1rem'>
                                                <span class='txtAppWordCont${contNum}'>${word} </span>
                                            </p>`;
                });
            } else {
                txtAppWords = txtApp.split('');
                txtAppCont.innerHTML = '';
                txtAppWords.forEach((word, i) => {
                    if (word == ' ') {
                        txtAppCont.innerHTML += `<p style='overflow: hidden; display: inline-block; padding-right: ${spacing}'><span class='txtAppWordCont${contNum}'>${word} </span></p>`;
                    } else {
                        txtAppCont.innerHTML += `<p style='overflow: hidden; display: inline-block;'><span class='txtAppWordCont${contNum}'>${word} </span></p>`;
                    }
                });
            }

            txtAppWordConts[contNum] = document.querySelectorAll(`.txtAppWordCont${contNum}`);

            txtAppCont.style.paddingBottom = '0.15em';
            txtAppCont.style.overflow = 'hidden';

            $(txtAppWordConts[contNum]).css({
                position: 'relative'
            }); 
            if (trigger == 'scroll') {
                $(txtAppWordConts[contNum]).css({
                    top: '2em',
                }); 
            }
        });
        
        if (trigger == 'scroll') {
            document.addEventListener('DOMContentLoaded', () => {
                scrollTrigger();
                document.addEventListener('scroll', scrollTrigger);
            })
        } else {
            txtAppConts.forEach((cont, i) => {
                const contNum = i;
                function reapp() {
                    txtReappear(contNum);
                }
                cont.addEventListener('mouseenter', reapp);
            })
        }
    }
}


/* пишущая машинка */
function typeWriter_init(parameters) {
    const totalSpeed = parameters.totalSpeed || 2000;
    const minWidth = parameters.minWidth || 0;
    let offset = parameters.offset || 0;
    const tw_TextElem = document.querySelector(parameters.selector).firstElementChild,
        tw_Text = tw_TextElem.innerText.split("");

    if ($(window).width() > minWidth) {
        tw_TextElem.innerText = '';
    }

    offset = $(window).height()*offset/100;

    document.addEventListener('DOMContentLoaded', () => {
        tw_startWriting();
        document.addEventListener('scroll', tw_startWriting);
    })

    function tw_write() {
        const speed = totalSpeed / tw_Text.length;
        const tw_interval = setInterval(function() {
            if(!tw_Text[0]){
                    return clearInterval(tw_interval);
            }
            tw_TextElem.innerHTML += tw_Text.shift();
        }, speed);
        return false;
    }

    function tw_startWriting() {
        if ($(tw_TextElem).offset().top < $(window).scrollTop() + $(window).height() - offset) {
            tw_write();
            document.removeEventListener('scroll', tw_startWriting);
        }
    }
}


/* появление текста по букве */
function lettersAppear_init(params) {
    const letterSpeed = parameters.letterSpeed || 2;
    const totalSpeed = parameters.totalSpeed || 3;
    const minWidth = parameters.minWidth || 0;
    const delay = parameters.delay || 0;
    let offset = parameters.offset || 0;
    const textElem = document.querySelector(`${params.selector} .tn-atom`),
        text = textElem.innerText.split('');
    isNaN(offset) ? offset = 0 : offset = $(window).height()*offset/100;

    const maxDelay = totalSpeed - letterSpeed;

    if ($(window).width() > minWidth) {
        textElem.innerHTML = '';

        text.forEach(letter => {
            $(textElem).append(`<span style="opacity: 0; transition: opacity ${letterSpeed}s ease ${maxDelay*Math.random()}s">${letter}</span>`);
        });

        document.addEventListener('DOMContentLoaded', () => {
            document.addEventListener('scroll', appearOnScroll);
            appearOnScroll();
        });
    }

    function lettersAppear() {
        $(textElem).children('span').css('opacity', '1');
    }
    function appearOnScroll() {
        if ($(textElem).offset().top < $(window).scrollTop() + $(window).height() - offset ) {
            setTimeout(() => {
                lettersAppear();
            }, 1000*delay);
            document.removeEventListener('scroll', appearOnScroll)
        }
    }
}


/* ссылки италиком */
function italicLinks_init(params) {
    const selector = params.selector || '';
    if ($(window).width() > 1200) {
        const it_links = document.querySelectorAll(`${selector} a`);
        $(it_links).addClass('it-links');
    }
}


/* прилипание картинок */
function parallax_init(params) {
    const parallaxTargets = document.querySelectorAll(params.selectors),
        minWidth = params.minWidth || 1200;

    let parallaxTarget,
        parallaxRect = {},
        parallaxRectCenter = {x: 0, y: 0};

    if ($(window).width() > minWidth) {
        parallaxTargets.forEach(target => initCoordTracking(target, 'mousemove', 'rel', true, true));
        $(parallaxTargets).addClass('parallax');
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
            parallaxTarget.setAttribute('data-target-x', 0);
            parallaxTarget.setAttribute('data-target-y', 0);
        });
    }

    function listener(e) {
        parallaxTarget.setAttribute('data-target-x', (e.clientX - parallaxRectCenter.x)/4);
        parallaxTarget.setAttribute('data-target-y', (e.clientY - parallaxRectCenter.y)/4);
    }
}


/* односторонняя кнопка */
function oneSideButton_init(params) {
    const targetOneSideButtonsPars = document.querySelectorAll(params.selectors),  // кнопки (второй уровень)
        oneSideButtonStyle = {
            firstColor: params.firstColor || 'black',			    // код первого цвета
            secondColor: params.secondColor || 'white',		    // код второго цвета
            whereTo: params.whereTo || 'left',                // направление смещения: right / left / top / bottom
            firstTextColor: params.firstTextColor || 'white',         // код первого цвета текста
            secondTextColor: params.secondTextColor || 'black',         // код второго цвета текста
            animTime: params.animTime || 400                  // время анимации (в миллисекундах)
        },
        minWidth = params.minWidth || 1200;    // минимальная ширина экрана для анимации

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

    if ($(window).width() > minWidth) {
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
            firstColor: params.firstColor || 'black',			    // код первого цвета
            secondColor: params.secondColor || 'white',		    // код второго цвета
            whereTo: params.whereTo || 'left',                // направление смещения: right / left / top / bottom
            firstTextColor: params.firstTextColor || 'white',         // код первого цвета текста
            secondTextColor: params.secondTextColor || 'black',         // код второго цвета текста
            animTime: params.animTime || 400                  // время анимации (в миллисекундах)
        },
        minWidth = params.minWidth || 1200;    // минимальная ширина экрана для анимации

    if ($(window).width() > minWidth) {
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
    const hoverTextObjects = document.querySelectorAll(params.selectors),
        hoverTextCursor = document.querySelector(params.cursor),
        hoverTexts = params.texts,
        isCursorHidden = params.isCursorHidden || false,
        minWidth = params.minWidth || 1200;

    if ($(window).width() > minWidth) {
        hoverTextObjects.forEach((obj, i) => {
            obj.setAttribute('data-text', hoverTexts[i]);
            obj.classList.add('textHover');
        });

        if (isCursorHidden) {
            hiddenCursor = 'none';
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

        initCoordTracking(hoverTextCursor, 'mousemove', 'abs', true, true);
        document.addEventListener('mousemove', (e) => {
            hoverTextCursor.setAttribute('data-target-x', e.clientX);
            hoverTextCursor.setAttribute('data-target-y', e.clientY);
        });
    
        $(".textHover").mouseenter(function(event) {
                hoverTextCursor.firstElementChild.innerText = event.target.getAttribute('data-text');
                hoverTextCursor.style.transition = 'opacity 0.25s ease';
                hoverTextCursor.style.opacity = '1';
                document.documentElement.style.cursor = hiddenCursor;
            })
            .mouseleave(function(event) {
                hoverTextCursor.style.transition = 'opacity 0.1s ease';
                hoverTextCursor.style.opacity = '0';
                document.documentElement.style.cursor = 'auto';
            });
    } 
}


/* универсальный бургер */
function uniBurger_init(params) {
    const burgerBlock = document.querySelector(params.burgerBlock),
        triggerBlock = document.querySelector(params.triggerBlock),
        triggerElem = triggerBlock.querySelector('.tn-elem'),
        burgerTransTime = params.burgerTime || 1,
        burgerElemsTransTime = params.elementsTime || 0.4,
        startPos = [
            params.verticalPosition || 'top',
            params.horizontalPosition || 'left'
        ],
        burgerShape = params.burgerShape || 'circle',
        shownStyle = {'z-index': '99'},
        hiddenStyle = {
            'width': '0',
            'height': '0',
            'z-index': '0'
        },
        triggerLineHeight = params.triggerLineHeight || 4,
        triggerColor = params.triggerColor || 'white',
        triggerScaleMobile = params.triggerScaleMobile || 1,
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
    if ($(window).width() < 900) {
        burgerButton.style.transform = `scale(${triggerScaleMobile})`;
        $(burgerButton).children().css({
            height: triggerLineHeight/triggerScaleMobile
        });
    }
        

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


/* вытесняющий бургер */
function pushingBurger_init(params) {
    const burgerBlock = document.querySelector(params.burgerBlock),
        triggerBlock = document.querySelector(params.triggerBlock),
        burgerPosition = params.burgerPosition,
        burgerWidth = params.burgerWidth || $(window).width(),
        triggerLineHeight = params.triggerLineHeight || 4,
        triggerColor = params.triggerColor || 'black',
        easeTime = params.easeTime || 0.8,
        easeFunction = params.easeFunction || 'cubic-bezier(.8,0,.2,1)',
        triggerElem = triggerBlock.querySelector('.tn-elem'),
        burgerLinks = burgerBlock.querySelectorAll('a'),
        burgerArtboard = burgerBlock.querySelector('div').firstElementChild,
        burgerVh = burgerArtboard.getAttribute('data-artboard-height_vh'),
        burgerHeight = burgerVh ? +burgerVh*$(window).height()/100 : burgerArtboard.getAttribute('data-artboard-height');
    
    const allBlocks = document.querySelectorAll('[id ^= "rec"]'),
        allUsedBlocks = [...allBlocks].filter(block => !block.querySelector('.t-popup') && block != triggerBlock && block != burgerBlock);

    let pushingShiftX = 0,
        pushingShiftY = 0;
    
    $(allUsedBlocks).wrapAll('<div class="pushingBurger_blocksWrapper"></div>');
    const blocksWrapper = document.querySelector('.pushingBurger_blocksWrapper');
    $(blocksWrapper).css('transition', `transform ${easeTime}s ${easeFunction}`);

    $(burgerBlock).css({
        position: 'fixed',
        'z-index': '99',
        width: '100vw',
        height: burgerHeight + 'px',
        transition: `transform ${easeTime}s ${easeFunction}`,
        'background-color': window.getComputedStyle(burgerBlock.querySelector('.t396__artboard')).backgroundColor
    });
    $(burgerBlock).attr('data-burgeropened', 'false');

    switch (burgerPosition) {
        case 'top':
            $(burgerBlock).css({
                width: '100vw',
                top: `-${burgerHeight}px`,
                left: '0',
            });
            pushingShiftY = burgerHeight;
            break;
        case 'bottom':
            $(burgerBlock).css({
                width: '100vw',
                bottom: `${-burgerHeight}px`,
                left: '0',
            });
            pushingShiftY = -burgerHeight;
            break;
        case 'left':
            $(burgerBlock).css({
                width: burgerWidth + 'px',
                height: '100vh',
                top: '0',
                left: `${-burgerWidth}px`,
            });
            pushingShiftX = burgerWidth;
            $('body').css('overflowX', 'hidden');
            break;
        case 'right':
            $(burgerBlock).css({
                width: burgerWidth + 'px',
                height: '100vh',
                top: '0',
                right: `${-burgerWidth}px`,
            });
            pushingShiftX = -burgerWidth;
            $('body').css('overflowX', 'hidden');
            break;
        default:
            $(burgerBlock).css({
                width: '100vw',
                top: `-${burgerHeight}px`,
                left: '0',
            });
            pushingShiftY = burgerHeight;
            break;
    }

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
        height: triggerLineHeight + 'px',
        'background-color': triggerColor
    });
    // !!! инициализация триггера

    burgerButton.addEventListener('click', toggleBurger);
    $(burgerLinks).on('click', toggleBurger);
    if (params.addTriggers) {   // если надо добавить триггеры
        const addTriggers = document.querySelectorAll(params.addTriggers);
        $(addTriggers).on('click', toggleBurger);
        $(addTriggers).css('cursor', 'pointer');
    }

    function toggleBurger() {
        if ($(burgerBlock).attr('data-burgeropened') == 'false') {
            $(blocksWrapper).css('transform', `translate(${pushingShiftX}px, ${pushingShiftY}px)`);
            $(burgerBlock).css('transform', `translate(${pushingShiftX}px, ${pushingShiftY}px)`);
            $(burgerBlock).attr('data-burgeropened', 'true');
            burgerButton.classList.add('open');
        } else {
            $(blocksWrapper).css('transform', 'translate(0)');
            $(burgerBlock).css('transform', 'translate(0)');
            $(burgerBlock).attr('data-burgeropened', 'false');
            burgerButton.classList.remove('open');
        }
    }
}


/* видео в кружок */
function videoCircle_init(params) {
    const videoCircle = document.querySelectorAll(params.videos);
    const autoSize = params.autoSize == undefined ? true : params.autoSize;
    videoCircle.forEach((video, i) => {
        if (autoSize) {
            params.circleDiams[i] = Math.max(video.getAttribute('data-field-height-value'), video.getAttribute('data-field-width-value'));
        }
        video.style.clipPath = `circle(${params.circleDiams[i]/2}px at center)`;
        video.style.pointerEvents = 'none';
    });
}


/* замена курсора */
function cursorChange_init(params) {
    const triggers = params.triggers || null,
        hasNewNormalStyle = params.hasNewNormalStyle || false,
        isCursorHidden = params.isCursorHidden || false,
        sourceOfNormal = params.sourceOfNormal || 'external',
        minWidth = params.minWidth || 1200,
        numStates = params.numStates || 0,
        sourceOfStates = params.sourceOfStates || 'external',
        normalExternal = params.normalExternal || 
            `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle r="10" fill="#000000" cx="10" cy="10"></circle>
            </svg>`,
        normalInternal = params.normalInternal || null,
        statesExternal = params.statesExternal || null,
        statesInternal = params.statesInternal || null,
        hasDelay = params.hasDelay || false,
        delaySpeed = params.delaySpeed || 1,
        stateStyles = {},
        stateInners = [];
    let normalStyle = params.normalStyle;

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

        if (hasNewNormalStyle) {
            if (sourceOfNormal == "internal") {
                const gif = getGif(normalInternal);
                cursorNormal.backgroundImage = gif;
            } else {
                cursorNormal.innerHTML = normalExternal;
            }
            if (isCursorHidden) {
                document.documentElement.style.cursor = 'none';
            }
        } else {
            normalStyle = {opacity: '0'};
        }
        $(cursorBorder).css(normalStyle);

        for (let i = 0; i < numStates; i++) {
            stateStyles[i] = params.stateStyles[i];
            stateStyles[i].opacity = '1';
            $(cursor).append(`<div class="cursor-state-${i}"></div>`);
            stateInners[i] = document.querySelector(`.cursor-state-${i}`);
            stateInners[i].style.opacity = 0;
            if (sourceOfStates[i] == "internal") {
                const { gif, width, height} = getGif(statesInternal[i]);
                $(stateInners[i]).css({
                    backgroundImage: gif,
                    backgroundSize: "100%",
                    width: width + 'px',
                    height: height + "px"
                })
                stateInners[i].style.backgroundImage = gif;
                stateInners[i].style.backgroundSize = "100%";
            } else {
                stateInners[i].innerHTML = statesExternal[i];
            }
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

        if (hasDelay) {
            initCoordTracking(cursor, 'mousemove', 'abs', true, true, {delaySpeed, framerate: 15});
            document.addEventListener('mousemove', (e) => {
                cursor.setAttribute('data-target-x', e.clientX);
                cursor.setAttribute('data-target-y', e.clientY);
            });
        } else {
            document.addEventListener('mousemove', (event) => {
                $(cursor).css({
                    left: event.pageX,
                    top: event.pageY - $(window).scrollTop()
                });
            });
        }


        for (let i = 0; i < numStates; i++) {
            $(triggers[i]).css('cursor', 'none');
            $(triggers[i]).attr('data-makes-cursor-state', i);
            $(triggers[i]).mouseenter(turnCursorStateOn).mouseleave(turnCursorStateOff);
        }

        function turnCursorStateOn () {
            $(stateInners).css('opacity','0');
            stateInners.forEach(inner => inner.style.opacity = '0');
            const state = this.getAttribute('data-makes-cursor-state');
            $(cursorBorder).css(stateStyles[state]);
            cursorNormal.style.opacity = 0;
            stateInners[state].style.opacity = 1;
        }
        function turnCursorStateOff () {
            stateInners.forEach(inner => inner.style.opacity = '0');
            $(cursorBorder).css(normalStyle);
            cursorNormal.style.opacity = 1;
        }
        function getGif (selector) {
            const cont = document.querySelector(selector);
            const gif = cont.querySelector(`.tn-atom`).getAttribute('data-original');
            $(cont).remove();
            return {
                gif: `url(${gif})`,
                width: cont.getAttribute('data-field-width-value'),
                height: cont.getAttribute('data-field-height-value')
            }
        }
    }
}


/* переход на страницы по картинкам */
function photoLink(params) {
    const { photos } = params;
    if ($(window).width() > params.minWidth) {
        photos.forEach((photoSelector, i) => {
            const photo = document.querySelector(photoSelector);
            photo.setAttribute('data-imgLink', photo.querySelector('a').getAttribute('href'));
            photo.querySelector('a').removeAttribute('href');
            photo.style.cursor = 'pointer';
            photo.addEventListener('click', photoLinkOpener);
        });
    }

    function photoLinkOpener () {
        const link = this.getAttribute('data-imgLink');
        const newTab = params.newTab || false;
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
                if (newTab) {
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
        LP__photos[activeLink].setAttribute('data-target-x', (e.clientX - LP__linkCenters[activeLink].x));
        LP__photos[activeLink].setAttribute('data-target-y', (e.clientY - LP__linkCenters[activeLink].y));
    }

    if ($(window).width() > params.minWidth) {
        LP__photos.forEach(target => initCoordTracking(target, 'mousemove', 'rel', true, true, {framerate: 10, delaySpeed: 0.1, tolerance: 0.1}));
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
                'position': 'relative',
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
    const minWidth = params.minWidth || 1200,
        mt_numPoints = params.numPoints || 50,
        mt_overallOpacity = params.opacity || 0.2,
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

    if ($(window).width() > minWidth) {
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
function cursorTail_init(params) {
    const mt_color = params.color || 'red',
        mt_radius = params.radius || 10,
        mt_numPoints = params.numPoints || 50,
        mt_overallOpacity = params.opacity || 0.5;

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


/* появление фото из угла */
function cornerPhotos_init(params) {
    const cornerPhotos = document.querySelectorAll(params.photos),
        initialVisibility = params.initialVisibility || 0,
        transitionTime = params.transitionTime || 0.5,
        minWidth = params.minWidth || 0,
        offsets = [];

    cornerPhotos.forEach((photo, i) => {
        const offsetPercentage = params.offsets[i] || 0;
        offsets[i] = offsetPercentage*$(window).height()/100;
    });

    if ($(window).width() > minWidth) {
        cornerPhotos.forEach((photo, i) => {
            $(photo).append(`
                <svg style="width: 100%; height: 100%; position: absolute; left: 0;">
                    <defs>
                        <clipPath id="mask-${i}" style="transform: scale(${initialVisibility}); transition: transform ${transitionTime}s ease">
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
            if((wt + wh - offsets[i] > et) && (photo.getAttribute('data-clipped') == 'true')) {
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
    const hasDelay = params.hasDelay || false;
    const delaySpeed = params.delaySpeed || 1;

    let dragStartX = 0,
        dragObjStartX = 0,
        horDragMinLeft = 0,
        horDragMaxLeft = 0;

    if ($(window).width() > params.minWidth) {
        if (hasDelay) {
            initCoordTracking(horDragObj, 'mousemove', 'rel', true, false, {delaySpeed, framerate: 15});
        }
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

        if (hasDelay) {
            horDragObj.addEventListener('mousedown', function(event) {
                dragStartX = event.clientX;
                document.addEventListener('mousemove', horDragDelay);
            });
            document.addEventListener('mouseup', function(event) {
                document.removeEventListener('mousemove', horDragDelay);
                dragObjStartX = +horDragObj.getAttribute('data-target-x');
            });
        } else {
            horDragObj.addEventListener('mousedown', function(event) {
                dragStartX = event.clientX;
                document.addEventListener('mousemove', horDrag);
            });
            document.addEventListener('mouseup', function(event) {
                document.removeEventListener('mousemove', horDrag);
                dragObjStartX = +horDragObj.getAttribute('data-current-x');
            });
        }
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

    function horDragDelay(event) {
        const horDragShift = event.clientX - dragStartX,
            horDragNewPos = dragObjStartX + horDragShift;
        if (horDragNewPos < horDragMinLeft && horDragNewPos > horDragMaxLeft) {
            horDragObj.setAttribute('data-target-x', dragObjStartX + horDragShift);
        } else if (horDragNewPos > horDragMinLeft) {
            horDragObj.setAttribute('data-target-x', horDragMinLeft);
        } else if (horDragNewPos < horDragMaxLeft) {
            horDragObj.setAttribute('data-target-x', horDragMaxLeft);
        }
    }
}


/* Переключение страниц шторкой */
function curtainChange_init(params) {
    let activePage = 0;
    const pages = document.querySelectorAll(params.selectors),
        pagesBGs = [],
        wh = $(window).height(),
        ww = $(window).width(),
        numPages = pages.length,
        easeTime = params.easeTime || 0.8,
        easeFunction = params.easeFunction || 'ease',
        minWidth = params.minWidth || 0;


    if ($(window).width() > minWidth) {
        pages.forEach((page, i) => pagesBGs[i] = page.querySelector('.t-bgimg'));
        pagesBGs.forEach(page => page.style.transform = 'scale(1.2)');
        pagesBGs[0].style.transform = 'scale(1)';
    
        document.addEventListener('DOMContentLoaded', () => {
            $('body').append(`
                    <svg style="width: 100%; height: 100%">
                        <defs>
                            <clipPath id="page-mask">
                                <rect width="${ww + 17}" height="${wh}" style="transform: scaleY(1); transition: transform ${easeTime}s ${easeFunction}" fill="#FFFFFF"></rect>
                            </clipPath>
                        </defs>
                    </svg>
                `);
            pageMask = document.querySelector('#page-mask rect');
    
            pages.forEach((page, i) => {
                $(page).css({
                    position: 'fixed',
                    width: '100vw',
                    height: '100vh',
                    top: '0',
                    left: '0',
                    'z-index': '3',
                })
                if (i > 0) {
                    $(page).css({
                        'z-index': '1',
                        'pointer-events': 'none',
                    })
                }
            });
            
            document.addEventListener('wheel', pageChange); 
        });
    }
    

    function pageChange(event) {
        const direction = Math.sign(event.deltaY)*1;
        const nextPage = activePage + direction;
        if(nextPage < numPages && nextPage >= 0) {
            changePage(nextPage);
        }
    }

    function changePage(nextPage, animate = true) {
        document.removeEventListener('wheel', pageChange);
        pages[nextPage].style.zIndex = '2';
        pages[nextPage].style.pointerEvents = 'auto';

        pages[activePage].style.clipPath = `url(#page-mask)`;
    
        pagesBGs[nextPage].style.transition = `transform ${easeTime}s ease`;
        pagesBGs[nextPage].style.transform = 'scale(1)';
    
        pageMask.style.transition = `transform ${easeTime}s ease`;
        pageMask.style.transform = 'scaleY(0)';

        setTimeout(() => {
            pages[activePage].style.zIndex = '1';
            pages[activePage].style.pointerEvents = 'none';
            pages[nextPage].style.zIndex = '3';

            pages[activePage].style.clipPath = 'none';
    
            pageMask.style.transition = 'none';
            pageMask.style.transform = 'scaleY(1)';
    
            pagesBGs[activePage].style.transition = 'none';
            pagesBGs[activePage].style.transform = 'scale(1.2)';

            activePage = nextPage;
            document.addEventListener('wheel', pageChange);
        }, easeTime*1000);
    }
}
    

/* Зум фото */
function photoZoom_init(params) {
    const photos = document.querySelectorAll(params.photos),
        easeTime = params.easeTime || 0.4,
        scale = params.scale || 1.2,
        minWidth = params.minWidth || 1200,
        easeFunction = params.easeFunction || 'ease-in-out';

    if ($(window).width() > minWidth) {
        photos.forEach(photo => {
            photo.parentElement.style.overflow = 'hidden';
            photo.style.transition = `transform ${easeTime}s ${easeFunction}`;
            photo.addEventListener('mouseenter', function() {
                this.style.transform =` scale(${scale})`;
            });
            photo.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        })
    }
}


// Маска курсором
function cursorColorFilter_init(params) {
    const minWidth = params.minWidth || 1200,
        clipRadius = params.clipRadius || 100,
        maskingPages = document.querySelectorAll(params.maskingPage),
        originalPages = document.querySelectorAll(params.originalPage);

    if ($(window).width() > minWidth) {
        maskingPages.forEach((page, i) => {
            const originalPage = originalPages[i];
            page.style.position = 'absolute';
            page.style.width = window.getComputedStyle(originalPage).width;
            page.style.height = window.getComputedStyle(originalPage).height;
            page.style.top = $(originalPage).offset().top + 'px';
            page.style.clipPath = `circle(${clipRadius} at -100px -100px)`;
            page.style.zIndex = '50';
        });

        document.addEventListener('mousemove', (event) => {
            maskingPages.forEach(page => {
                page.style.clipPath = `circle(${clipRadius}px at ${event.pageX}px ${event.pageY - $(page).offset().top}px`;
            });
        });
    }
}


// смена фонов
function bgChange_init(params) {
    const { colors, breakpointBlocks } = params,
        minWidth = params.minWidth || 0,
        animTime = params.animTime || 0.5;
    const breakpoints = [],
        offsets = [];
    const body = document.querySelector('body');
    breakpointBlocks.forEach((block, i) => {
        breakpoints[i] = $(block).offset().top + offsets[i];
        offsets[i] = $(window).height()*params.offsets[i]/100 || 0;
    });

    if ($(window).width() > minWidth) {
        bgChange();
        setTimeout(() => {
            body.style.transition = `background-color ${animTime}s linear`;
        }, 50);
        document.addEventListener('scroll', bgChange);
    }

    function bgChange() {
        const scr = $(window).scrollTop();
        let currentColor = 0;
        breakpoints.forEach((breakpoint, i) => {
            if (scr > breakpoint) {
                currentColor = i + 1;
            }
        });
        body.style.backgroundColor = colors[currentColor];
    }
}
