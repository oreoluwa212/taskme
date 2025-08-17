// src/hooks/useModal.js
import { useEffect } from 'react';

export const useModal = (isOpen) => {
    useEffect(() => {
        if (isOpen) {
            // Store current scroll position
            const scrollY = window.scrollY;

            // Add modal-open class to body
            document.body.classList.add('modal-open');

            // Store scroll position as CSS variable
            document.body.style.top = `-${scrollY}px`;

            return () => {
                // Remove modal-open class
                document.body.classList.remove('modal-open');

                // Remove the top style
                document.body.style.top = '';

                // Restore scroll position
                window.scrollTo(0, scrollY);
            };
        }
    }, [isOpen]);
};

// Alternative utility functions if you prefer not using a hook
export const openModal = () => {
    const scrollY = window.scrollY;
    document.body.classList.add('modal-open');
    document.body.style.top = `-${scrollY}px`;
    document.body.setAttribute('data-scroll-y', scrollY);
};

export const closeModal = () => {
    const scrollY = document.body.getAttribute('data-scroll-y') || '0';
    document.body.classList.remove('modal-open');
    document.body.style.top = '';
    document.body.removeAttribute('data-scroll-y');
    window.scrollTo(0, parseInt(scrollY));
};