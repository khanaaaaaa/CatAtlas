document.getElementById('newCatBtn').addEventListener('click', async () => {
    const btn = document.getElementById('newCatBtn');
    const img = document.getElementById('catImage');

    btn.disabled = true;
    btn.textContent = '...LOADING....';
    img.classList.add('loading');

    try {
        const res = await fetch('https://api.thecatapi.com/v1/images/search');
        const data = await res.json();
        img.src = data[0].url;
        img.onload = () => img.classList.remove('loading');
    } catch (e) {
        alert('ERROR: CAT NOT FOUND');
    } finally {
        btn.disabled = false;
        btn.textContent = '▶ NEW CAT';
    }
});