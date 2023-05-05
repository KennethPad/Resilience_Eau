const navItems = document.querySelectorAll('.side-nav__item');

navItems.forEach(eachItem => {
    eachItem.addEventListener('click', () => {
        navItems.forEach(eachItem => {
            eachItem.classList.remove('side-nav__item-active');
        });
        eachItem.classList.add('side-nav__item-active');
    });
});