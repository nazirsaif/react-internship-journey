document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const shell = document.querySelector('.dashboard-shell');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const topbar = document.getElementById('topbar');
    const mainWrapper = document.querySelector('.main-wrapper');
    const navItems = document.querySelectorAll('.nav-item');
    const navLinks = document.querySelectorAll('.nav-link');

    // Desktop: Sidebar collapse/expand toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            shell.classList.toggle('collapsed');
        });
    }

    // Mobile: Drawer open/close logic
    function openMobileSidebar() {
        sidebar.classList.add('open');
        sidebarOverlay.classList.add('active');
        // Prevent body scroll when sidebar is open
        document.body.style.overflow = 'hidden';
    }

    function closeMobileSidebar() {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
        // Restore body scroll
        document.body.style.overflow = '';
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', openMobileSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeMobileSidebar);
    }

    // Close mobile sidebar if a nav link is clicked (useful for mobile UX)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMobileSidebar();
            }
        });
    });

    // Topbar: Scroll-triggered shadow
    if (mainWrapper && topbar) {
        mainWrapper.addEventListener('scroll', () => {
            if (mainWrapper.scrollTop > 10) {
                topbar.classList.add('scrolled');
            } else {
                topbar.classList.remove('scrolled');
            }
        });
    }

    // Nav: Active item switcher
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Remove 'active' from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add 'active' to the clicked item
            item.classList.add('active');
        });
    });
});
