let selectedCat = null;

document.querySelectorAll('.cat-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.cat-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        selectedCat = {
            name: option.dataset.cat,
            img: option.dataset.img
        };
        document.getElementById('selectCatBtn').disabled = false;
    });
});