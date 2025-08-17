// src/hooks/useScrollAnimation.js
import { useEffect, useRef, useState } from 'react';

export const useScrollAnimation = (options = {}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);
    const elementRef = useRef(null);

    const {
        threshold = 0.1,
        rootMargin = '0px',
        triggerOnce = true,
        delay = 0,
    } = options;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && (!triggerOnce || !hasAnimated)) {
                    setTimeout(() => {
                        setIsVisible(true);
                        setHasAnimated(true);
                    }, delay);
                } else if (!triggerOnce && !entry.isIntersecting) {
                    setIsVisible(false);
                }
            },
            {
                threshold,
                rootMargin,
            }
        );

        const currentElement = elementRef.current;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, [threshold, rootMargin, triggerOnce, delay, hasAnimated]);

    return [elementRef, isVisible];
};

// Utility hook for staggered animations
export const useStaggeredAnimation = (itemsCount, baseDelay = 100) => {
    const [visibleItems, setVisibleItems] = useState(new Set());
    const elementRefs = useRef([]);

    useEffect(() => {
        const observers = [];

        elementRefs.current.forEach((ref, index) => {
            if (ref) {
                const observer = new IntersectionObserver(
                    ([entry]) => {
                        if (entry.isIntersecting) {
                            setTimeout(() => {
                                setVisibleItems(prev => new Set([...prev, index]));
                            }, index * baseDelay);
                        }
                    },
                    { threshold: 0.1 }
                );

                observer.observe(ref);
                observers.push(observer);
            }
        });

        return () => {
            observers.forEach(observer => observer.disconnect());
        };
    }, [baseDelay]);

    const setRef = (index) => (el) => {
        elementRefs.current[index] = el;
    };

    return [setRef, visibleItems];
};

// Hook for parallax scrolling effect
export const useParallax = (speed = 0.5) => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setOffset(window.pageYOffset * speed);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [speed]);

    return offset;
};

// Hook for scroll direction
export const useScrollDirection = () => {
    const [scrollDirection, setScrollDirection] = useState('up');
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.pageYOffset;

            if (currentScrollY > scrollPosition) {
                setScrollDirection('down');
            } else if (currentScrollY < scrollPosition) {
                setScrollDirection('up');
            }

            setScrollPosition(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrollPosition]);

    return { scrollDirection, scrollPosition };
};