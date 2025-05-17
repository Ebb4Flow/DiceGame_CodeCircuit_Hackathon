document.addEventListener('mousemove', (e) => {
    const alert = document.querySelector('.Alert');
    if (!alert) return;

    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;

    const gradient = `
        radial-gradient(
            circle at ${x}% ${y}%,
            #f48fb1,
            #81d4fa,
            #aed581,
            #fff176,
            #ffab91,
            #ce93d8
        )
    `;

    alert.style.setProperty('--dynamic-bg', gradient);

    const styleEl = document.getElementById('alert-dynamic-style') || (() => {
        const s = document.createElement('style');
        s.id = 'alert-dynamic-style';
        document.head.appendChild(s);
        return s;
    })();

    styleEl.innerHTML = `
        .Alert::before {
            background: ${gradient};
        }
    `;
});
