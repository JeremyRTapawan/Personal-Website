document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const hamburger = document.querySelector('.hamburger');
    const listGroup = document.querySelector('.list-group');
    
    // Add ARIA attributes to hamburger button
    hamburger.setAttribute('role', 'button');
    hamburger.setAttribute('aria-label', 'Open menu');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'mobile-menu');
    hamburger.setAttribute('tabindex', '0');
    
    // Add ID to the menu for ARIA controls
    listGroup.id = 'mobile-menu';
    listGroup.setAttribute('role', 'menu');
    
    // Add tabindex and role to menu items
    const menuItems = document.querySelectorAll('.list-group-item');
    menuItems.forEach(item => {
        item.setAttribute('role', 'menuitem');
        item.setAttribute('tabindex', '-1'); // Will be set to 0 when menu is open
    });
    
    // Toggle dropdown when hamburger is clicked
    hamburger.addEventListener('click', toggleMenu);
    
    // Allow keyboard activation of hamburger
    hamburger.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleMenu();
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!hamburger.contains(event.target) && !listGroup.contains(event.target)) {
            closeMenu();
        }
    });
    
    // Handle keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (!listGroup.classList.contains('active')) return;
        
        const focusableItems = Array.from(menuItems);
        const firstItem = focusableItems[0];
        const lastItem = focusableItems[focusableItems.length - 1];
        const currentIndex = focusableItems.indexOf(document.activeElement);
        
        // Close menu on Escape
        if (event.key === 'Escape') {
            closeMenu();
            hamburger.focus();
            return;
        }
        
        // Handle arrow key navigation
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (currentIndex < 0 || currentIndex === focusableItems.length - 1) {
                firstItem.focus();
            } else {
                focusableItems[currentIndex + 1].focus();
            }
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (currentIndex <= 0) {
                lastItem.focus();
            } else {
                focusableItems[currentIndex - 1].focus();
            }
        } else if (event.key === 'Home') {
            event.preventDefault();
            firstItem.focus();
        } else if (event.key === 'End') {
            event.preventDefault();
            lastItem.focus();
        } else if (event.key === 'Tab') {
            // Trap focus within the menu
            if (event.shiftKey && document.activeElement === firstItem) {
                event.preventDefault();
                lastItem.focus();
            } else if (!event.shiftKey && document.activeElement === lastItem) {
                event.preventDefault();
                firstItem.focus();
            }
        }
    });
    
    // Add click event to menu items
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            closeMenu();
            // Add navigation logic here if needed
            // Example: window.location.href = this.getAttribute('data-href');
        });
        
        // Allow activation with Enter key
        item.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
        });
    });
    
    // Function to toggle menu
    function toggleMenu() {
        const isExpanded = listGroup.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
        
        if (isExpanded) {
            hamburger.setAttribute('aria-label', 'Close menu');
            // Make menu items focusable when menu is open
            menuItems.forEach(item => item.setAttribute('tabindex', '0'));
            // Focus the first menu item
            setTimeout(() => menuItems[0].focus(), 100);
        } else {
            hamburger.setAttribute('aria-label', 'Open menu');
            // Make menu items not focusable when menu is closed
            menuItems.forEach(item => item.setAttribute('tabindex', '-1'));
        }
    }
    
    // Function to close menu
    function closeMenu() {
        if (listGroup.classList.contains('active')) {
            listGroup.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Open menu');
            menuItems.forEach(item => item.setAttribute('tabindex', '-1'));
        }
    }
});