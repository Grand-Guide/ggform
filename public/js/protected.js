document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-item a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = document.querySelector(this.getAttribute('href'));

            sections.forEach(section => section.classList.add('hidden'));

            if (targetSection) {
                targetSection.classList.remove('hidden');
            } else {
                console.warn('Seção alvo não encontrada:', this.getAttribute('href'));
            }
        });

        link.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                this.click();
            }
        });
    });
});