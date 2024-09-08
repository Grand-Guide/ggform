document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-item a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = document.querySelector(this.getAttribute('href'));

            // Hide all sections
            sections.forEach(section => section.classList.add('hidden'));

            // Show the target section
            if (targetSection) {
                targetSection.classList.remove('hidden');
            }
        });
    });
});