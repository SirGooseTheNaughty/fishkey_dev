/* вырисовка вектора */
function vectorDraw_init(vd_SelectorsForSVG, vd_svgs) {
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
    return logoPaths;
}

function vectorDraw(logoPaths, vector) {
    logoPaths[vector].classList.add('draw-svg');
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

        window.addEventListener('scroll', horizontalScroll);

        function horizontalScroll() {
            const wt = $(window).scrollTop();
            let horScrollShift = +wt;
            if (horScrollShift < (horScrollBlocksNum-1)*horScroll_blockWidth) {
                horScrollContainer.style.transform = `translate(${-horScrollShift}px, 0)`;
            }
        }

        $('a').on('click', (e) => {
            if ($(e.target).attr('href').substring(0,4) == '#rec') {
                const dn = horScrollBlockShifts[$(e.target).attr('href')];
                $('html, body').animate({scrollTop: dn}, 400);
            }
        });
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

        window.addEventListener('scroll', horScrollBlock_handler);
        
        return {
            headerTop,
            horScrollContainer,
            header,
            horScrollBlock,
            totalShift
        };
    } else {
        return null;
    }
}

function horScrollBlock_handler() {
    const headerTop = horScrollBlock_parameters.headerTop,
        horScrollContainer = horScrollBlock_parameters.horScrollContainer,
        header = horScrollBlock_parameters.header,
        horScrollBlock = horScrollBlock_parameters.horScrollBlock,
        totalShift = horScrollBlock_parameters.totalShift;

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