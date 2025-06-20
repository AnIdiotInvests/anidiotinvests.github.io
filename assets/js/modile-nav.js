function navToggle() {

    let ele = document.getElementById('toggle-nav');

    if (!ele) return;

    if (ele.classList.contains('nav-visible')) {

        ele.classList.remove('nav-visible');

        ele.classList.add('nav-not-visible');

    } else {

        ele.classList.remove('nav-not-visible');

        ele.classList.add('nav-visible');
    }
}