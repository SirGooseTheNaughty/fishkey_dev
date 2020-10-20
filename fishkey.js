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
}