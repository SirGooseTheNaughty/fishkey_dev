function curtainPageChange_init(params) {
    const elems = document.querySelectorAll(params.elements);
    if (!elems || !elems.length) {
        return console.error('Неправильно заданы селекторы элементов');
    }
    const curtain = document.querySelector('.curtain-change__curtain');
    if (!curtain) {
        return console.error('Не добавлена "шторка"');
    }
    const { animTime = 1, appearFrom = 'right', useAsPreloader = false } = params;
    try {
        if (!useInitial && useAsPreloader) {
            console.error('Невозможно использовать шторку как прелоудер, потому что установлен флаг "useInitial = false"');
        }
    } catch(e) {}
    localStorage.curtain = 'false';

    setTimeout(() => {
        $('#curtain-helper').remove();
    }, animTime * 1000);
    if (useAsPreloader) {
        window.onload = () => {
            setTimeout(() => curtain.classList.add('hidden'));
            window.onload = null;
        };
    } else {
        setTimeout(() => curtain.classList.add('hidden'));
    }

    const links = [...elems].map(elem => {
        if (elem.tagName === 'A') {
            return elem;
        }
        const link = elem.querySelector('a');
        if (link.tagName === 'A') {
            return link;
        }
        console.warn('Этот элемент не содержит ссылки', elem);
    });
    links.forEach(link => {
        link.addEventListener('click', goToLink);
    });

    function changeMovementClass() {
        const classes = [...curtain.classList];
        classes.forEach(className => {
            if (className.includes('to-')) {
                curtain.classList.remove(className);
            }
        });
        curtain.classList.add(`to-${appearFrom}`);
    }

    function goToLink(e) {
        e.preventDefault();
        localStorage.curtain = 'true';
        curtain.classList.remove('animate');
        changeMovementClass();
        const href = this.getAttribute('href');
        $('head').append(`<link rel="prefetch" href="${href}">`);
        setTimeout(() => {
            curtain.classList.add('animate');
            curtain.classList.remove('hidden');
        });
        setTimeout(() => {
            window.location = href;
        }, animTime * 1000);
    }
}