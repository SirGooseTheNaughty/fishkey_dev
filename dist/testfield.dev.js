"use strict";

// --------- BUTTON BACKGROUND --------- //
var targetButtons = $('.tilda_bullshit_vzhuh');
$(targetButtons).addClass('notActive');
$(targetButtons).addClass('button_style');
$(targetButtons).css("background-position", "left bottom");
$(targetButtons).hover(function () {
  var target = {
    elem: this,
    disact: function disact() {
      $(target.elem).css("transition", "none");
      $(target.elem).toggleClass('active');
      $(target.elem).toggleClass('notActive');
      $(target.elem).css("background-position", "left bottom");
    }
  };
  $(this).css("transition", "0.25s ease");
  $(this).css("background-position", "right bottom");
  setTimeout(function () {
    target.disact();
  }, 250);
}); // ------------------------------------- //
// --------- ПРОСТОЙ ВЖУХ --------- //

var simpleButton = $('.tilda_simple_vzhuh'); // '[data-elem-id=" "] div'

var vzhukhStyle = {
  firstColor: 'red',
  // код первого цвета
  secondColor: 'blue',
  // код второго цвета
  firstPosition: 'left',
  // right/left для горизонтальной смены или top/bottom для вертикальной
  secondPosition: 'right' // left/right для горизонтальной смены или bottom/top для вертикальной

};
vzhukhStyle.backgroundSize = vzhukhStyle.firstPosition == 'left' || vzhukhStyle.firstPosition == 'right' ? '200% 100%' : '100% 200%';
vzhukhStyle.whereTo = vzhukhStyle.firstPosition == 'left' || vzhukhStyle.firstPosition == 'right' ? 'to right' : 'to bottom';
var vzhukhButtonStyle = {
  'background': "linear-gradient(".concat(vzhukhStyle.whereTo, ", ").concat(vzhukhStyle.firstColor, " 50%, ").concat(vzhukhStyle.secondColor, " 50%)"),
  'background-position': vzhukhStyle.firstPosition,
  'background-size': vzhukhStyle.backgroundSize,
  'transition': '0.25s ease'
};
$(simpleButton).css(vzhukhButtonStyle);
$(simpleButton).hover(function () {
  $(simpleButton).css("background-position", vzhukhStyle.secondPosition);
}, function () {
  $(simpleButton).css("background-position", vzhukhStyle.firstPosition);
}); // -------------------------------- //

/* ----- ЗАМЕНА КУРСОРА ----- */

$("body").prepend('<div class="cursor"></div>');
$(document).mousemove(function (e) {
  $('.cursor').css({
    "left": e.pageX,
    "top": e.pageY - $(window).scrollTop()
  });
});
$(".parallax").mouseenter(function () {
  $('.cursor').addClass('hover');
}).mouseleave(function () {
  $('.cursor').removeClass('hover');
});
/* -------------------------- */

/* ----- ПОЯВЛЕНИЕ ФОТО ИЗ УГЛА ----- ДЛЯ ОДНОГО ФОТО */

/*const cornerPhoto = $('.tilda_img_wrapper img');    // imgfield="tn_img_1599909480763"
    $(cornerPhoto).wrap('<div class="photoWrapper"></div>');
const cornerPhotoWrapper = $('.photoWrapper'),
    wrapperSize = {
        width: 0,
        height: 0
    };

$(cornerPhoto).css("opacity", "0");

setTimeout(function() {
    wrapperSize.width = $(cornerPhotoWrapper).css('width');
    wrapperSize.height = $(cornerPhotoWrapper).css('height');
    $(cornerPhotoWrapper).css({'width': '0', 'height': '0', 'overflow': 'hidden', 'transition': '0.4s ease-in'});
    $(cornerPhoto).css({"opacity": "1", 'width': wrapperSize.width, 'height': wrapperSize.height});
    $(window)[0].addEventListener('scroll', showOnScroll);
}, 1000);

function showOnScroll() {
	const wt = $(window).scrollTop(),
        wh = $(window).height();
    let et = $(cornerPhotoWrapper).offset().top;

    if(wt+wh/2 > et) {
        $(cornerPhotoWrapper).css({'width': wrapperSize.width, 'height': wrapperSize.height});
    } else {
        $(cornerPhotoWrapper).css({'width': '0', 'height': '0'});
    }
}*/

/* ---------------------------------- */

/* ----- ПОЯВЛЕНИЕ ФОТО ИЗ УГЛА ----- */

var cornerPhotos = $('.tilda_img_wrapper img'); // imgfield="tn_img_1599909480763"

$(cornerPhotos).wrap('<div class="photoWrapper"></div>');
var cornerPhotoWrappers = $('.photoWrapper');
$(cornerPhotos).css("opacity", "0");
setTimeout(function () {
  for (var i = 0; i < cornerPhotoWrappers.length; i++) {
    $(cornerPhotoWrappers[i]).attr('trueWidth', $(cornerPhotoWrappers[i]).css('width'));
    $(cornerPhotoWrappers[i]).attr('trueHeight', $(cornerPhotoWrappers[i]).css('height'));
    $(cornerPhotoWrappers[i]).css({
      'width': '0',
      'height': '0',
      'overflow': 'hidden',
      'transition': '0.4s ease-in'
    });
    $(cornerPhotoWrappers[i]).children().css({
      "opacity": "1",
      'width': $(cornerPhotoWrappers[i]).attr('trueWidth'),
      'height': $(cornerPhotoWrappers[i]).attr('trueHeight')
    });
    $(window)[0].addEventListener('scroll', showOnScroll);
  }
}, 1000);

function showOnScroll() {
  var wt = $(window).scrollTop(),
      wh = $(window).height();
  var et = $(cornerPhotoWrappers[0]).offset().top;

  for (var i = 0; i < cornerPhotoWrappers.length; i++) {
    et = $(cornerPhotoWrappers[0]).offset().top;

    if (wt + wh / 2 > et) {
      $(cornerPhotoWrappers[i]).css({
        'width': $(cornerPhotoWrappers[i]).attr('trueWidth'),
        'height': $(cornerPhotoWrappers[i]).attr('trueHeight')
      });
    } else {
      $(cornerPhotoWrappers[i]).css({
        'width': '0',
        'height': '0'
      });
    }
  }
}
/* ---------------------------------- */
// /* ----- ВЫПЛЫВАНИЕ БУРГЕРА КРУЖКОМ ----- */
// const burgerMenuButton = $('.t280__burger'),        // класс кнопки для открывания бургера
//     burgerMenuWrapper = $('.t280__menu__wrapper'),  // класс обертки меню
//     burgerMenuBackground = $('.t280__menu__bg'),    // класс элемента с фоном
//     maxBurgerDims = 1.5*window.innerWidth;
// $(burgerMenuButton).on('click', burgerCircleToggle);
// $(burgerMenuWrapper).children().wrapAll('<div class="burgerCircleWrapper"></div>');
// const burgerCircleWrapper = $('.burgerCircleWrapper');
// $(burgerCircleWrapper).children().css({'height': '100vh', 'width': '100vw', 'position': 'fixed', 'left': '0'});
// $(burgerMenuWrapper).css({'display': 'grid', 'place-items': 'center', 'padding': '0'});
// $(burgerCircleWrapper).css({
//     'background-color': $(burgerMenuBackground).css('background-color'),
//     'position': 'fixed',
//     'border-radius': '50%',
//     'overflow': 'hidden',
//     'width': '0',
//     'height': '0',
//     'transition': '0.3s linear',
//     'opacity': '1',
//     'display': 'grid',
//     'place-items': 'center'
// });
// $(burgerMenuBackground).remove();
// $(burgerCircleWrapper).attr('shown','');
// function burgerCircleToggle() {
//     if($(burgerCircleWrapper).attr('shown')) {
//         $(burgerCircleWrapper).css({
//             'width': '0',
//             'height': '0'
//         });
//         $(burgerCircleWrapper).attr('shown','');
//     } else {
//         $(burgerCircleWrapper).css('width', maxBurgerDims);
//         $(burgerCircleWrapper).css('height', maxBurgerDims);
//         $(burgerCircleWrapper).attr('shown','true');
//     }
// }
// /* -------------------------------------- */

/* ----- ВЫПЛЫВАНИЕ БУРГЕРА СНИХУ ----- */


var burgerMenuButton = $('.t280__burger'),
    // класс кнопки для открывания бургера
burgerMenuWrapper = $('.t280__menu__wrapper'),
    // класс обертки меню
burgerMenuBackground = $('.t280__menu__bg'),
    // класс элемента с фоном
maxBurgerDims = window.innerWidth;
$(burgerMenuButton).on('click', burgerCircleToggle);
$(burgerMenuWrapper).children().wrapAll('<div class="burgerCubicWrapper"></div>');
var burgerCubicWrapper = $('.burgerCubicWrapper');
$(burgerCubicWrapper).children().css({
  'height': '100vh',
  'width': '100vw',
  'position': 'fixed',
  'left': '0',
  'top': '0',
  'opacity': '0',
  'transition': '0.1s linear'
});
$(burgerMenuWrapper).css({
  'display': 'grid',
  'place-items': 'center',
  'padding': '0'
});
$(burgerCubicWrapper).css({
  'background-color': $(burgerMenuBackground).css('background-color'),
  'position': 'fixed',
  'top': '100vh',
  'width': '80vw',
  'height': '0',
  'margin': '0 auto',
  'overflow': 'hidden',
  'transition': '0.5s cubic-bezier(.85,0,.55,1)',
  'opacity': '1',
  'display': 'grid',
  'place-items': 'center'
});
$(burgerMenuBackground).remove();
$(burgerCubicWrapper).attr('shown', '');

function burgerCircleToggle() {
  if ($(burgerCubicWrapper).attr('shown')) {
    $(burgerCubicWrapper).css({
      'top': '100vh',
      'width': '80vw',
      'height': '0'
    });
    $(burgerCubicWrapper).children().css('opacity', '0');
    $(burgerCubicWrapper).attr('shown', '');
  } else {
    $(burgerCubicWrapper).css({
      'top': '0',
      'width': '100vw',
      'height': '100vh'
    });
    setTimeout(function () {
      $(burgerCubicWrapper).children().css('opacity', '1');
    }, 500);
    $(burgerCubicWrapper).attr('shown', 'true');
  }
}
/* -------------------------------------- */

/* ----- ГОРИЗОНТАЛЬНЫЙ СКРОЛЛ ----- */

/*const horScrollBlocks = $('#rec230994202, #rec231009936, #rec231009942'),   // сюда id блоков
    horScrollMinWidth = 980;                                                // сюда минимальную ширину экрана, для которой будет анимация
$(horScrollBlocks).wrapAll('<div class="horScrollContainer"></div>');
const horScrollContainer = $('.horScrollContainer'),
    wh = +$(window).height(),
    ww = +$(window).width(),
    horScrollBlocksNum = +horScrollBlocks.length,
    horScrollTotalHeight = +(horScrollBlocksNum-1)*ww+wh;
$(horScrollContainer).wrap('<div class="horScrollStaticContainer"></div>');
$('.horScrollStaticContainer').css({'position': 'relative', 'overflow': 'hidden', 'height': `${horScrollTotalHeight}px`});
const horScrollBlockTop = +$('.horScrollStaticContainer').offset().top;
$(horScrollContainer).css({'position': 'relative', 'top': '0', 'left': '0'});
for(let i=0; i<horScrollBlocks.length; i++) {
    $(horScrollBlocks[i]).css({
        'position': 'absolute',
        'width': '100vw',
        'height': '100vh',
        'top': '0',
        'left': i*ww+'px'
    });
}
if (+ww > horScrollMinWidth) {
    $(window)[0].addEventListener('scroll', horizontalScroll);
} else {
    $('.horScrollStaticContainer').css('display', 'none');
}

function horizontalScroll() {
    const wt = $(window).scrollTop(),
        horScrollStop = (horScrollBlocksNum-1)*ww;
    let horScrollShift = +wt - horScrollBlockTop;
    if (wt < horScrollBlockTop) {
        $(horScrollContainer).css({
            'position': 'absolute',
            'top': `0px`
        });
    } else if (horScrollShift < horScrollStop) {
        $(horScrollContainer).css({
            'position': 'fixed',
            'top': `0px`,
            'left': `${-horScrollShift}px`
        });
    } else {
        $(horScrollContainer).css({
            'position': 'absolute',
            'top': `${horScrollStop}px`
        });
    }
}

$(window).resize(function() {
    if (+ww > horScrollMinWidth) {
        $('.horScrollStaticContainer').css('display', 'block');
    } else {
        $('.horScrollStaticContainer').css('display', 'none');
    }
});*/

/* --------------------------------- */