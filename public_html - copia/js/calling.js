const ppp = document.querySelectorAll('.fetchbtn')

ppp.forEach(itemP => {
    itemP.addEventListener('click', () => {
        // ppp.forEach(itemP => {
        //     itemP.classList.remove('selected')
        // })
        // itemP.classList.add('selected')
        const referencia = itemP.getAttribute('referencia')
        fetch(`${referencia}.html`)
            .then(response => response.text())
            .then(data => {
                document.querySelector('.fetch-container').innerHTML = data
            })
    })
})