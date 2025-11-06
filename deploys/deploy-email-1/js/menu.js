const menuToggle = document.querySelector('.menuToggle');
const menuFloat = document.querySelector('.menuFloat');
const close = document.querySelector('.close');

menuToggle.addEventListener('click', () => {
    menuFloat.classList.toggle('active');
});

close.addEventListener('click', () => {
    menuFloat.classList.toggle('active');
});
