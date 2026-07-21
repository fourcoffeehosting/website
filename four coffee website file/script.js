/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Navigation & Mobile Menu ---
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navItems = navLinks.querySelectorAll('a');

    const backToTop = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        // Show back-to-top button after scrolling 400px
        if (backToTop) {
            if (window.scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
        highlightActiveLink();
    });

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.querySelector('i').classList.toggle('fa-times');
        hamburger.querySelector('i').classList.toggle('fa-bars');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.querySelector('i').classList.add('fa-bars');
            hamburger.querySelector('i').classList.remove('fa-times');
        });
    });

    // --- Active Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('section, header');
    
    function highlightActiveLink() {
        let scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            let sectionId = current.getAttribute('id');
            
            // Fixed the logic here to prevent error if a nav link was removed (e.g. Contact)
            let navLink = document.querySelector('.nav-links a[href*=' + sectionId + ']');
            
            if(navLink) {
                if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }

    // --- Scroll Reveal Animations (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));

    // --- Menu Filtering & Search ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-card');
    const searchInput = document.getElementById('menuSearch');
    const noResults = document.getElementById('no-results');

    function filterMenu(category, searchTerm) {
        let hasVisibleItems = false;
        const term = searchTerm.toLowerCase().trim();

        menuItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            const itemName = item.querySelector('h3').innerText.toLowerCase();
            const itemDesc = item.querySelector('p').innerText.toLowerCase();
            
            const categoryMatch = category === 'all' || itemCategory === category;
            const searchMatch = term === '' || itemName.includes(term) || itemDesc.includes(term);

            if (categoryMatch && searchMatch) {
                item.style.display = 'block';
                // Trigger reflow for animation
                void item.offsetWidth; 
                item.classList.add('active');
                hasVisibleItems = true;
            } else {
                item.style.display = 'none';
                item.classList.remove('active');
            }
        });

        if (!hasVisibleItems) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
        }
    }

    let currentCategory = 'all';

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active class on buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentCategory = btn.getAttribute('data-filter');
            filterMenu(currentCategory, searchInput.value);
        });
    });

    searchInput.addEventListener('input', (e) => {
        filterMenu(currentCategory, e.target.value);
    });

    // --- Favorite Buttons ---
    const favBtns = document.querySelectorAll('.fav-btn');
    favBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            btn.classList.toggle('active');
            const icon = btn.querySelector('i');
            if(btn.classList.contains('active')){
                icon.classList.remove('far');
                icon.classList.add('fas');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        });
    });

    // --- Testimonial Slider ---
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('prevReview');
    const nextBtn = document.getElementById('nextReview');
    let currentIndex = 0;
    const cards = document.querySelectorAll('.testimonial-card');
    const totalCards = cards.length;

    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalCards - 1) {
            currentIndex++;
        } else {
            currentIndex = 0; // Loop back
        }
        updateSlider();
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = totalCards - 1; // Loop end
        }
        updateSlider();
    });

    // Auto slide
    setInterval(() => {
        if (currentIndex < totalCards - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateSlider();
    }, 5000);

    // --- Locations Tabs & Map Switcher ---
    const locationCards = document.querySelectorAll('.location-list .location-card');
    const locationMap = document.getElementById('locationMap');
    
    locationCards.forEach(card => {
        card.addEventListener('click', () => {
            locationCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            const newMapUrl = card.getAttribute('data-map');
            if (newMapUrl && locationMap) {
                locationMap.src = newMapUrl;
            }
        });
    });

    // --- Gallery Lightbox ---
    const lightbox      = document.getElementById('galleryLightbox');
    const lbBackdrop    = document.getElementById('lightboxBackdrop');
    const lbClose       = document.getElementById('lightboxClose');
    const lbImg         = document.getElementById('lightboxImg');
    const lbVideo       = document.getElementById('lightboxVideo');
    const lbVideoSource = lbVideo ? lbVideo.querySelector('source') : null;

    function openLightbox(type, src, alt) {
        if (!lightbox) return;
        lbImg.classList.remove('active');
        lbVideo.classList.remove('active');
        lbVideo.pause();
        if (type === 'video') {
            lbVideoSource.src = src;
            lbVideo.load();
            lbVideo.classList.add('active');
            lbVideo.play();
        } else {
            lbImg.src = src;
            lbImg.alt = alt || '';
            lbImg.classList.add('active');
        }
        lightbox.classList.add('open');
        document.body.classList.add('lightbox-active');
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('open');
        document.body.classList.remove('lightbox-active');
        lbVideo.pause();
        lbVideo.currentTime = 0;
        lbImg.src = '';
    }

    // Attach click to every masonry item
    document.querySelectorAll('.masonry-item').forEach(item => {
        item.addEventListener('click', () => {
            const video = item.querySelector('video');
            const img   = item.querySelector('img');
            if (video) {
                const src = video.querySelector('source') ? video.querySelector('source').src : video.src;
                openLightbox('video', src, '');
            } else if (img) {
                openLightbox('image', img.src, img.alt);
            }
        });
    });

    // Close via X button
    if (lbClose) lbClose.addEventListener('click', closeLightbox);

    // Close via backdrop click
    if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);

    // Close via Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeLightbox();
    });

});
