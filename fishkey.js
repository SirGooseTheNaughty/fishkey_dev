/* утилита для получения значений размеров на разной ширине экрана */
function getElemDim (elem, dim) {
    const tildaBreakpoints = [1200, 980, 640, 480, 320];
    const ww = $(window).width();
    let currentBreakpoint;
    let result = null;
    const queries = [
        `data-field-${dim}-value`,
        `data-field-${dim}-res-960-value`,
        `data-field-${dim}-res-640-value`,
        `data-field-${dim}-res-480-value`,
        `data-field-${dim}-res-320-value`
    ];
    for(let i = 0; i < tildaBreakpoints.length; i++) {
        if (ww > tildaBreakpoints[i]) {
            currentBreakpoint = i;
            break;
        }
    }
    for(let i = currentBreakpoint; i >= 0; i--) {
        result = elem.getAttribute(queries[i]);
        if (result) {
            return result;
        }
    }
}

/* утилита для плавного расчета координат */
function initCoordTracking(obj, trigger, positioning, hasX, hasY, params) {
    let isIntSet = false;
    let coordInt = '';
    const framerate = params.framerate || 20;
    const speed = params.delaySpeed || 1;
    const tolerance = params.tolerance || 1;
    const oneCoordChange = params.customFunction || smoothChange;

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
    
    function smoothChange(curr, target) {
        const leng = target - curr;
        const rise = 0.8*Math.sign(leng)*Math.cbrt(speed*Math.abs(leng)*Math.abs(leng));
        if (Math.abs(rise) < tolerance) {
            return target;
        }
        return curr + rise;
    }
}

/* утилита для включения блоков от и до */
function getBlockList(firstId, lastId) {
    const blocks = [];
    let isIncluding = false;
    document.querySelectorAll('[id^="rec"]').forEach(page => {
        if (page.id == firstId) {
            isIncluding = true;
        } else if (page.id == lastId) {
            isIncluding = false;
            blocks.push(page);
        }
        if (isIncluding) {
            blocks.push(page);
        }
    });
    return blocks;
}

/* утилита для настройки иконки бургера */
function setBurgerTrigger(isTriggerCustom, triggerBlock, triggerElems, toggleFunction) {
    $(triggerBlock).css({
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        top: '0',
        left: '0',
        'z-index': '999999999',
        'pointer-events': 'none'
    });

    if (isTriggerCustom) {
        triggerElems.customOn.addEventListener("click", () => {
            toggleFunction();
            triggerElems.customOn.style.display = "none";
            triggerElems.customOff.style.display = "flex";
        });
        triggerElems.customOff.addEventListener("click", () => {
            toggleFunction();
            triggerElems.customOn.style.display = "flex";
            triggerElems.customOff.style.display = "none";
        });
        triggerElems.customOff.style.display = "none";
        triggerElems.customOn.style.pointerEvents = "auto";
        triggerElems.customOff.style.pointerEvents = "auto";
        triggerElems.customOn.classList.add("burgerToggler", "burgerButton");
        triggerElems.customOff.classList.add("burgerToggler", "burgerButton");
    } else {
        const triggerElem = triggerBlock.querySelector('.tn-elem');
        triggerElem.innerHTML = `
            <div id="nav-icon">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        const burgerButton = triggerBlock.querySelector('#nav-icon');
        burgerButton.style.width = getElemDim(triggerElem, "width") + 'px';
        burgerButton.style.height = getElemDim(triggerElem, "height") + 'px';
        burgerButton.style.pointerEvents = 'auto';
        $(burgerButton).children().css({
            height: triggerElems.triggerLineHeight,
            'background-color': triggerElems.closedTriggerColor
        });
        burgerButton.addEventListener('click', () => {
            toggleFunction();
            burgerButton.classList.toggle('open');
            if (burgerButton.classList.contains('open')) {
                $(burgerButton).children('span').css('background-color', triggerElems.openTriggerColor);
            } else {
                $(burgerButton).children('span').css('background-color', triggerElems.closedTriggerColor);
            }
        });
    }

}

/* вырисовка вектора */
function vectorDraw_init(params) {
    let { selectors, svgs, trigger, hoverTriggers, offsets } = params;
    const animFunction = params.animFunction || 'ease';
    const animTime = params.animTime || 0.5;
    const minWidth = params.minWidth || 0;
    const logoLengths = [], logoPaths = [];

    if ($(window).width() > minWidth) {
        (trigger != 'hover' && trigger !='scroll') ? trigger = 'scroll' : null;
        const vd_forSVG = document.querySelectorAll(selectors);
        vd_forSVG.forEach((space, i) => {
            $(space).html(svgs[i]);
            if (isNaN(offsets[i])) {
                offsets[i] = 0;
            } else {
                offsets[i] = $(window).height()*offsets[i]/100;
            }
        });
        vd_forSVG.forEach((space, i) => {
            logoPaths[i] = space.querySelector('path');
            logoLengths[i] = logoPaths[i].getTotalLength();
            $(logoPaths[i]).css({
                'stroke-dasharray': logoLengths[i],
                'stroke-dashoffset': logoLengths[i],
                'animation-duration': animTime + 's',
                'animation-timing-function': animFunction
            });
            const desiredWidth = getElemDim(space, "width");
            const coeff = desiredWidth/(+space.querySelector('svg').getAttribute('width'));
            space.querySelector('svg').style.transform = `scale(${coeff})`;
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
    const offset = params.offset ? params.offset*$(window).height()/100 : 0;
    let animTime = params.animTime || 0.5;
    const minWidth = params.minWidth || 0;

    if ($(window).width() > minWidth) {
        strokeWidth = strokeWidth ? strokeWidth + 'px' : '1px';
        const vd_forSVG = document.querySelector(selector);
        $(vd_forSVG).html(svg);

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
        
        desiredWidth = getElemDim(vd_forSVG, "width");
        coeff = desiredWidth/(+vd_forSVG.querySelector('svg').getAttribute('width'));

        vd_forSVG.querySelector('svg').style.transformOrigin = `left`;
        vd_forSVG.querySelector('svg').style.transform = `scale(${coeff})`;

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
        const widthShift = buttonStyle.height;
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
        grain = parameters.grain ? parameters.grain + 'px' : 'auto',
        zIndex = parameters.isCovering ? 999999999 : 0;
    bgNoiser.classList.add('bg-noise');
    bgNoiser.style.opacity = parameters.opacity/100 || 0.05;
    bgNoiser.style.zIndex = zIndex;
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
        header = parameters.header ? document.querySelector(parameters.header) : null,
        minWidth = parameters.minWidth || 1200,
        totalShift = parameters.totalShift,
        blockHeight = parameters.blockHeight,
        hasDelay = parameters.hasDelay || false,
        delaySpeed = parameters.delaySpeed || 1;

    let headerTop = 0,
        headerHeight = 0,
        horScrollContainer = {};
    
    if ($(window).width() > minWidth) {
        const children = $(horScrollBlock.querySelector('.t396__artboard')).children();

        $(children).wrapAll('<div class="horScrollContainer"></div>');
        horScrollContainer = document.querySelector('.horScrollContainer');

        if (header) {
            headerTop = $(header).offset().top;
            headerHeight = $(header).height();
        } else {
            headerTop = $(horScrollContainer).offset().top;
        }

        if (hasDelay) {
            initCoordTracking(horScrollContainer, 'scroll', 'rel', true, true, {delaySpeed, framerate: 15});
        }

        $(horScrollContainer).css({top: '0', left: '0',});
        header ? $(header).css({top: '0', left: '0', width: '100vw', 'z-index': '100'}) : false;
        $(horScrollBlock).css({
            height: totalShift + blockHeight + 'px',
            backgroundColor: window.getComputedStyle(horScrollBlock.querySelector('.t396__artboard')).backgroundColor,
            overflow: 'hidden'
        });
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
            header ? $(header).css({'position': 'relative'}) : false;
        } else if (horScrollShift < totalShift) {
            $(horScrollContainer).css({
                'position': 'fixed',
                transform: `translate(-${horScrollShift}px, ${headerHeight}px)`
            });
            header ? $(header).css({position: 'fixed', transform: 'translate(0)'}) : false;
            horScrollBlock.style.paddingBottom = `${headerHeight}px`;
        } else {
            $(horScrollContainer).css({
                'position': 'relative',
                'padding-bottom': '0',
                transform: `translate(-${totalShift}px, ${totalShift}px)`
            });
            header ? $(header).css({position: 'relative', transform: `translate(0, ${totalShift}px)`}) : false;
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
            header ? $(header).css({'position': 'relative'}) : false;
        } else if (horScrollShift < totalShift) {
            $(horScrollContainer).css({
                'position': 'fixed'
            });
            horScrollContainer.setAttribute('data-target-x', -horScrollShift);
            horScrollContainer.setAttribute('data-target-y', headerHeight);
            horScrollContainer.setAttribute('data-current-y', headerHeight);

            header ? $(header).css({position: 'fixed', transform: 'translate(0)'}) : false;
            horScrollBlock.style.paddingBottom = `${headerHeight}px`;
        } else {
            $(horScrollContainer).css({
                'position': 'relative',
                'padding-bottom': '0'
            });
            horScrollContainer.setAttribute('data-target-x', -totalShift);
            horScrollContainer.setAttribute('data-target-y', totalShift);
            horScrollContainer.setAttribute('data-current-y', totalShift);

            header ? $(header).css({position: 'relative', transform: `translate(0, ${totalShift}px)`}) : false;
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
function lettersAppear_init(parameters) {
    const letterSpeed = parameters.letterSpeed || 2;
    const totalSpeed = parameters.totalSpeed || 3;
    const minWidth = parameters.minWidth || 0;
    const delay = parameters.delay || 0;
    const isRandom = parameters.isRandom || false;
    let offset = parameters.offset || 0;
    const textElem = document.querySelector(`${parameters.selector} .tn-atom`),
        text = textElem.innerText.split(''),
        numLetters = text.length;
    isNaN(offset) ? offset = 0 : offset = $(window).height()*offset/100;

    const maxDelay = totalSpeed - letterSpeed;
    let tag = 'span';
    if (textElem.querySelector('em')) {
        tag = 'em';
    }

    if ($(window).width() > minWidth) {
        textElem.innerHTML = '';

        if (isRandom) {
            text.forEach(letter => {
                $(textElem).append(`<${tag} style="opacity: 0; transition: opacity ${letterSpeed}s ease ${maxDelay*Math.random()}s">${letter}</${tag}>`);
            });
        } else {
            text.forEach((letter, i) => {
                $(textElem).append(`<${tag} style="opacity: 0; transition: opacity ${letterSpeed}s ease ${maxDelay*(i/numLetters)}s">${letter}</${tag}>`);
            });
        }

        document.addEventListener('DOMContentLoaded', () => {
            document.addEventListener('scroll', appearOnScroll);
            appearOnScroll();
        });
    }

    function lettersAppear() {
        $(textElem).children(tag).css('opacity', '1');
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
        parallaxTargets.forEach(target => initCoordTracking(target, 'mousemove', 'rel', true, true, {}));
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
        } else {
            hiddenCursor = 'auto';
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

        initCoordTracking(hoverTextCursor, 'mousemove', 'abs', true, true, {});
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
        isTriggerCustom = params.isTriggerCustom || false,
        triggerElems = {
            std: {},
            customOn: {},
            customOff: {},
            triggerLineHeight: 1,
            openTriggerColor: 'black',
            openTriggerColor: 'black'
        },
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
        burgerLinks = burgerBlock.querySelectorAll('a');

    if (isTriggerCustom) {
        triggerElems.customOn = document.querySelector(params.customOn);
        triggerElems.customOff = document.querySelector(params.customOff);
    } else {
        triggerElems.triggerLineHeight = params.triggerLineHeight || 2;
        triggerElems.openTriggerColor = params.openTriggerColor || 'black';
        triggerElems.closedTriggerColor = params.closedTriggerColor || 'black';
    }

    // инициализация триггера
    setBurgerTrigger(isTriggerCustom, triggerBlock, triggerElems, toggleBurger);

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
        document.documentElement.style.pointerEvents = 'none';
        if (burgerBlock.classList.contains('burgerHidden')) {
            document.documentElement.style.overflowY = 'hidden';
            $(burgerWrapper).css(shownStyle);
            setTimeout(() => {
                // burgerBlock.classList.remove('burgerHidden');
                // burgerBlock.classList.add('burgerShown');
                // document.documentElement.style.pointerEvents = 'auto';
                afterTimeout();
            }, 1000*burgerTransTime);
        } else {
            burgerBlock.classList.add('burgerHidden');
            burgerBlock.classList.remove('burgerShown');
            setTimeout(() => {
                // document.documentElement.style.overflowY = 'auto';
                // $(burgerWrapper).css(hiddenStyle);
                // document.documentElement.style.pointerEvents = 'auto';
                afterTimeout();
            }, 1000*burgerElemsTransTime);
        }
    }

    function afterTimeout() {
        if (burgerBlock.classList.contains('burgerHidden')) {
            burgerBlock.classList.remove('burgerHidden');
            burgerBlock.classList.add('burgerShown');
            document.documentElement.style.pointerEvents = 'auto';
        } else {
            document.documentElement.style.overflowY = 'auto';
            $(burgerWrapper).css(hiddenStyle);
            document.documentElement.style.pointerEvents = 'auto';
        }
    }

    burgerLinks.forEach(burgerLink => burgerLink.addEventListener('click', toggleBurger));

    window.onresize = burgerReshape;
}


/* вытесняющий бургер */
function pushingBurger_init(params) {
    const burgerBlock = document.querySelector(params.burgerBlock),
        triggerBlock = document.querySelector(params.triggerBlock),
        isTriggerCustom = params.isTriggerCustom || false,
        triggerElems = {
            std: {},
            customOn: {},
            customOff: {},
            triggerLineHeight: 1,
            openTriggerColor: 'black',
            closedTriggerColor: 'black'
        },
        burgerPosition = params.burgerPosition,
        burgerWidth = params.burgerWidth || $(window).width(),
        easeTime = params.easeTime || 0.8,
        easeFunction = params.easeFunction || 'cubic-bezier(.8,0,.2,1)',
        burgerLinks = burgerBlock.querySelectorAll('a'),
        burgerArtboard = burgerBlock.querySelector('div').firstElementChild,
        burgerVh = burgerArtboard.getAttribute('data-artboard-height_vh'),
        burgerHeight = burgerVh ? +burgerVh*$(window).height()/100 : burgerArtboard.getAttribute('data-artboard-height');
    
    const allBlocks = document.querySelectorAll('[id ^= "rec"]'),
        allUsedBlocks = [...allBlocks].filter(block => !block.querySelector('.t-popup') && block != triggerBlock && block != burgerBlock);

    if (isTriggerCustom) {
        triggerElems.customOn = document.querySelector(params.customOn);
        triggerElems.customOff = document.querySelector(params.customOff);
    } else {
        triggerElems.triggerLineHeight = params.triggerLineHeight || 2;
        triggerElems.openTriggerColor = params.openTriggerColor || 'black';
        triggerElems.closedTriggerColor = params.closedTriggerColor || 'black';
    }
    
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
    setBurgerTrigger(isTriggerCustom, triggerBlock, triggerElems, toggleBurger);

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
        } else {
            $(blocksWrapper).css('transform', 'translate(0)');
            $(burgerBlock).css('transform', 'translate(0)');
            $(burgerBlock).attr('data-burgeropened', 'false');
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
        video.style.pointerEvents = params.hasClick ? 'auto' : 'none';
    });
}


/* замена курсора */
function cursorChange_init(params) {
    const triggers = params.triggers || null,
        hasNewNormalStyle = params.hasNewNormalStyle || false,
        isCursorHidden = params.isCursorHidden || false,
        enableMixBlendMode = params.mixBlendMode || false,
        sourceOfNormal = params.sourceOfNormal || 'external',
        minWidth = params.minWidth || 1200,
        numStates = params.numStates || 0,
        sourceOfStates = params.sourceOfStates || 'external',
        normalExternal = params.normalExternal || '',
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
            'pointer-events': 'none',
            'mix-blend-mode': enableMixBlendMode ? 'difference' : 'normal'
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
                stateInners[i].innerHTML = statesExternal ? statesExternal[i] : "";
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
function photoLink_init(params) {
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
    const elemSelectors = params.elements,
        photoSelectors = params.photos,
        delaySpeed = params.delaySpeed || 0.1,
        elems = [],
        photos = [];

    elemSelectors.forEach((selector, i) => {
        elems.push(document.querySelector(selector));
        photos.push(document.querySelector(photoSelectors[i]));
    })

    let currentRect;
    let currentCenter;

    function LP__mousemove(e) {
        photos[activeLink].setAttribute('data-target-x', (e.clientX - currentCenter.x));
        photos[activeLink].setAttribute('data-target-y', (e.clientY - currentCenter.y));
    }

    if ($(window).width() > params.minWidth) {
        photos.forEach(target => initCoordTracking(target, 'mousemove', 'rel', true, true, {framerate: 10, delaySpeed, tolerance: 0.1}));
        elems.forEach((elem, i) => {
            $(elem).attr('assocWith', i);
            elem.parentElement.style.zIndex = 5;
            const newPadding = (parseInt(window.getComputedStyle(elem).width, 10) - parseInt(window.getComputedStyle(elem).height, 10))/2 + 'px';
            elem.style.padding = `${newPadding} 0 ${newPadding} 0`;
            elem.style.marginTop = '-' + newPadding;
            elem.style.borderRadius = '50%';
        });
        photos.forEach((photo, i) => {
            $(photo).attr('assocWith', i);
            $(photo).css({
                'z-index': '1',
                'opacity': '0',
                'transition': 'opacity 0.25s ease, transform 0.1s linear'
            });
        });
    
        $(elems).on('mouseenter', function (e) {
            activeLink = $(this).attr('assocWith');
            photos[activeLink].style.opacity = 1;
            photos[activeLink].style.transition = 'opacity 0.25s ease, transform 0s';
            currentRect = elems[activeLink].getBoundingClientRect();
            currentCenter = {
                x: currentRect.x + currentRect.width/2,
                y: currentRect.y + currentRect.height/2
            };
            photos[activeLink].setAttribute('data-current-x', (e.clientX - currentCenter.x));
            photos[activeLink].setAttribute('data-current-y', (e.clientY - currentCenter.y));
            document.addEventListener('mousemove', LP__mousemove);
        })
        .on('mouseleave', function () {
            document.removeEventListener('mousemove', LP__mousemove);
            photos[activeLink].style.transition = 'opacity 0.25s ease, transform 0.25s linear';
            photos[activeLink].style.opacity = 0;
            photos[activeLink].setAttribute('data-target-x', 0);
            photos[activeLink].setAttribute('data-target-y', 0);
        });
    }
}


/* след курсора */
function cursorTrace_init(params) {
    const minWidth = params.minWidth || 1200,
        mt_numPoints = params.numPoints || 50,
        mt_overallOpacity = params.opacity || 0.2,
        traceDelay = params.traceDelay || 5,
        mt_cursorStyle = params.cursorStyle,
        mt_trailStyle = params.traceStyle,
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

        for (let i = 0; i < mt_numPoints; i++) {
            trailCoords.x[i] = 0;
            trailCoords.y[i] = 0;
        }
        
        document.addEventListener('mousemove', function(event) {
            mouseX = event.clientX;
            mouseY = event.clientY;
            if (!isRefreshing) {
                mt_refreshInt = setInterval(trailCoordsRefresh, traceDelay);
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
        mt_overallOpacity = params.opacity || 0.5,
        tailDelay = params.tailDelay || 5;

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
    
        setInterval(trailCoordsRefresh, tailDelay);
    
        document.addEventListener('mousemove', function(event) {
            mouseX = event.clientX;
            mouseY = event.clientY;
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
        startPos = params.startPos || 'left-top',
        transitionTime = params.transitionTime || 0.5,
        isHorScroll = params.isHorScroll || false,
        minWidth = params.minWidth || 0,
        offsets = [];
    let showingRule;
    const ww = $(window).width(),
        wh = $(window).height();

    if ($(window).width() > minWidth) {
        let clipPath = '';
        switch (startPos) {
            case 'left-top':
                clipPath = `polygon(0 0, ${initialVisibility}% 0, ${initialVisibility}% ${initialVisibility}%, 0 ${initialVisibility}%)`;
                break;
            case 'top':
                clipPath = `polygon(0 0, 100% 0, 100% ${initialVisibility}%, 0 ${initialVisibility}%)`;
                break;
            case 'right-top':
                clipPath = `polygon(${100 - initialVisibility}% 0, 100% 0, 100% ${initialVisibility}%, ${100 - initialVisibility}% ${initialVisibility}%)`;
                break;
            case 'right':
                clipPath = `polygon(${100 - initialVisibility}% 0, 100% 0, 100% 100%, ${100 - initialVisibility}% 100%)`;
                break;
            case 'right-bottom':
                clipPath = `polygon(${100 - initialVisibility}% ${100 - initialVisibility}%, 100% ${100 - initialVisibility}%, 100% 100%, ${100 - initialVisibility}% 100%)`;
                break;
            case 'bottom':
                clipPath = `polygon(0 ${100 - initialVisibility}%, 100% ${100 - initialVisibility}%, 100% 100%, 0 100%)`;
                break;
            case 'left-bottom':
                clipPath = `polygon(0 ${100 - initialVisibility}%, ${initialVisibility}% ${100 - initialVisibility}%, ${initialVisibility}% 100%, 0 100%)`;
                break;
            case 'left':
                clipPath = `polygon(0 0, ${initialVisibility}% 0, ${initialVisibility}% 100%, 0 100%)`;
                break;
            default:
                clipPath = `polygon(0 0, ${initialVisibility}% 0, ${initialVisibility}% ${initialVisibility}%, 0 ${initialVisibility}%)`;
                break;
        }

        cornerPhotos.forEach((photo, i) => {
            const offsetPercentage = params.offsets[i] || 0;
            if (isHorScroll) {
                offsets[i] = offsetPercentage*$(window).width()/100;
                showingRule = function (photo, i) {
                    const et = $(photo).offset().left;
                    return (ww - offsets[i] > et)
                };
            } else {
                offsets[i] = offsetPercentage*$(window).height()/100;
                showingRule = function (photo, i) {
                    const et = $(photo).offset().top;
                    return ($(window).scrollTop() + wh - offsets[i] > et)
                };
            }

            $(photo).css({
                'clip-path': clipPath,
                transition: `${transitionTime}s ease`
            });

            photo.setAttribute('data-clipping', i);
            photo.setAttribute('data-clipped', 'true');
        });
    
        document.addEventListener('scroll', showOnScroll);
    }
    
    function showOnScroll() {
        cornerPhotos.forEach((photo, i) => {
            if(showingRule(photo, i) && (photo.getAttribute('data-clipped') == 'true')) {
                $(photo).css('clip-path', 'polygon(0 0, 100% 0, 100% 100%, 0 100%)');
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
    const minWidth = params.minWidth || 0;

    let dragStartX = 0,
        dragObjStartX = 0,
        horDragMinLeft = 0,
        horDragMaxLeft = 0;

    if ($(window).width() > minWidth) {
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
            document.addEventListener('mouseup', function() {
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
        const start = event.clientX || event.touches[0].clientX;
        const horDragShift = start - dragStartX,
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
    let touchStartPos = [0, 0];

    const pages = document.querySelectorAll(params.selectors),
        numPages = pages.length,
        easeTime = params.easeTime || 1,
        easeFunction = params.easeFunction || 'ease-in-out',
        isBackgroundZoomable = params.isBackgroundZoomable || false,
        minWidth = params.minWidth || 0;
    const curtainBGs = [];
    
    if ($(window).width() > minWidth) {
        document.addEventListener('DOMContentLoaded', initPages);
    
        document.addEventListener('touchstart', (e) => {
            touchStartPos = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
        });
    }

    function initPages () {
        document.querySelector('body').style.overflow = 'hidden';
        pages.forEach((page, i) => {
            page.classList.add('curtainPage');
            page.style.zIndex = numPages - i;
            page.style.transition = `height ${easeTime}s ${easeFunction}`;
            page.style.height = '100vh';
            page.querySelector('.t396__artboard').style.height = '100vh';
            page.querySelector('.t-bgimg') ? curtainBGs.push(page.querySelector('.t-bgimg')) : curtainBGs.push(null);
        });
        document.addEventListener('wheel', desctopScroller);
        document.addEventListener('touchend', mobileScroller);
        scaleBGs(0);
        curtainBGs.forEach(bg => bg.style.transition = `transform ${easeTime}s`);
    }

    function scaleBGs(ind) {
        if (!isBackgroundZoomable) {
            return;
        }
        if (curtainBGs[ind]) {
            curtainBGs[ind].style.transition = `transform ${easeTime}s ${easeFunction}`;
            curtainBGs[ind].style.transform = "scale(1)";
        }
        setTimeout(function() {
            curtainBGs.forEach((bg, i) => {
                if (i != ind && curtainBGs[i]) {
                    bg.style.transition = `none`;
                    bg.style.transform = "scale(1.1)";
                }
            });
        }, easeTime*1000);
    };

    function desctopScroller(event) {
        const direction = Math.sign(event.deltaY);
        const nextPage = activePage + direction;
        pageChange(nextPage)
    }

    function mobileScroller(e) {
        const touchEndPos = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
        let direction = 0;
        if ((touchStartPos[1] > touchEndPos[1] + 25) || (isPageWithVideos && (touchStartPos[0] > touchEndPos[0] + 25))) {
            direction = 1;
        } else if ((touchStartPos[1] < touchEndPos[1] - 25) || (isPageWithVideos && (touchStartPos[0] < touchEndPos[0] - 25))) {
            direction = -1;
        } else {
            direction = 0;
        }
        const nextPage = activePage + direction;
        if(direction !== 0) {
            pageChange(nextPage);
        }
    }
    
    function pageChange(nextPage) {
        if (nextPage < numPages && nextPage >= 0) {
            document.removeEventListener('wheel', desctopScroller);  
            document.removeEventListener('touchend', mobileScroller); 
            pages.forEach((page, i) => {
                if (i < nextPage) {
                    page.style.height = '0';
                } else {
                    page.style.height = '100vh';
                }
            });
            scaleBGs(nextPage);
        
            setTimeout(() => {
                document.addEventListener('wheel', desctopScroller);
                document.addEventListener('touchend', mobileScroller);
                activePage = nextPage;
            }, easeTime < 1.5 ? 1500 : easeTime*1000);
        }
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
function cursorMask_init(params) {
    const minWidth = params.minWidth || 1200,
        clipRadius = params.clipRadius || 100,
        maskingPages = document.querySelectorAll(params.maskingPages),
        originalPages = document.querySelectorAll(params.originalPages);

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

    if ($(window).width() > minWidth) {
        bgChange();
        setTimeout(() => {
            body.style.transition = `background-color ${animTime}s linear`;
            breakpointBlocks.forEach((block, i) => {
                offsets[i] = $(window).height()*params.offsets[i]/100 || 0;
                breakpoints[i] = $(block).offset().top + offsets[i];
            });
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
