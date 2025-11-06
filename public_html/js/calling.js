const btn = document.querySelectorAll('.popButton')
const popViews = document.querySelectorAll('.popViews')
const closePop = document.querySelectorAll('.closePop')

btn.forEach(item => {
    item.addEventListener('click', () => {
        const dataView = item.getAttribute('data-view')
        popViews.forEach(item => {
            item.classList.remove('active')
            if(item.getAttribute('data-view') === dataView){
                item.classList.add('active')
            }
        })
    })
})

closePop.forEach(item => {
    item.addEventListener('click', () => {
        popViews.forEach(item => {
            item.classList.remove('active')
        })
    })
})
