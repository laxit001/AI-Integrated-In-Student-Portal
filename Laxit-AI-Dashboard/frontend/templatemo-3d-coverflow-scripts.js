

// JavaScript Document

// Coverflow functionality
const items = document.querySelectorAll('.coverflow-item');
const dotsContainer = document.getElementById('dots');
const currentTitle = document.getElementById('current-title');
const currentDescription = document.getElementById('current-description');
const container = document.querySelector('.coverflow-container');
const menuToggle = document.getElementById('menuToggle');
const mainMenu = document.getElementById('mainMenu');
let currentIndex = 3;
let isAnimating = false;

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mainMenu.classList.toggle('active');
});

// Close mobile menu when clicking on menu items (except external links)
document.querySelectorAll('.menu-item:not(.external)').forEach(item => {
    item.addEventListener('click', (e) => {
        menuToggle.classList.remove('active');
        mainMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !mainMenu.contains(e.target)) {
        menuToggle.classList.remove('active');
        mainMenu.classList.remove('active');
    }
});

// Image data with titles and descriptions
const imageData = [
    {
        title: "Web Technology",
        description: "Study of building interactive websites using frontend and backend technologies."
    },
    {
        title: "Artifical Intelligence",
        description: "Systems that enable machines to think and act intelligently"
    },
    {
        title: "Computer Vision",
        description: "AI that enables computers to understand and interpret images and videos."
    },
    {
        title: "Genrative Ai For Building Application",
        description: "Creating apps using AI models that generate text, images, or code."
    },
    {
        title: "Machine Learning",
        description: "Algorithms that learn patterns from data to make predictions or decisions"
    },
    {
        title: "Computer networks",
        description: "Communication systems that connect computers to share data and resources."
    },
    {
        title: "Aptitude Development",
        description: "Training to improve logical thinking, problem-solving, and reasoning skills."
    }
];

// Create dots
items.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.onclick = () => goToIndex(index);
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');
let autoplayInterval = null;
let isPlaying = true;
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');

function updateCoverflow() {
    if (isAnimating) return;
    isAnimating = true;

    items.forEach((item, index) => {
        let offset = index - currentIndex;

        if (offset > items.length / 2) {
            offset = offset - items.length;
        }
        else if (offset < -items.length / 2) {
            offset = offset + items.length;
        }

        const absOffset = Math.abs(offset);
        const sign = Math.sign(offset);

        let translateX = offset * 220;
        let translateZ = -absOffset * 200;
        let rotateY = -sign * Math.min(absOffset * 60, 60);
        let opacity = 1 - (absOffset * 0.2);
        let scale = 1 - (absOffset * 0.1);

        if (absOffset > 3) {
            opacity = 0;

            translateX = sign * 800;
        }

        item.style.transform = `
                    translateX(${translateX}px) 
                    translateZ(${translateZ}px) 
                    rotateY(${rotateY}deg)
                    scale(${scale})
                `;
        item.style.opacity = opacity;
        item.style.zIndex = 100 - absOffset;

        item.classList.toggle('active', index === currentIndex);
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });

    const currentData = imageData[currentIndex];
    currentTitle.textContent = currentData.title;
    currentDescription.textContent = currentData.description;

    currentTitle.style.animation = 'none';
    currentDescription.style.animation = 'none';
    setTimeout(() => {
        currentTitle.style.animation = 'fadeIn 0.6s forwards';
        currentDescription.style.animation = 'fadeIn 0.6s forwards';
    }, 10);

    setTimeout(() => {
        isAnimating = false;
    }, 600);
}

function navigate(direction) {
    if (isAnimating) return;

    currentIndex = currentIndex + direction;

    if (currentIndex < 0) {
        currentIndex = items.length - 1;
    } else if (currentIndex >= items.length) {
        currentIndex = 0;
    }

    updateCoverflow();
}

function goToIndex(index) {
    if (isAnimating || index === currentIndex) return;
    currentIndex = index;
    updateCoverflow();
}

// Keyboard navigation
container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
});

// Click on items to select
items.forEach((item, index) => {
    item.addEventListener('click', () => goToIndex(index));
});

// Touch/swipe support
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
let isSwiping = false;

container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    isSwiping = true;
}, { passive: true });

container.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;

    const currentX = e.changedTouches[0].screenX;
    const diff = currentX - touchStartX;

    if (Math.abs(diff) > 10) {
        e.preventDefault();
    }
}, { passive: false });

container.addEventListener('touchend', (e) => {
    if (!isSwiping) return;

    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
    isSwiping = false;
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 30;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
        handleUserInteraction();

        if (diffX > 0) {
            navigate(1);
        } else {
            navigate(-1);
        }
    }
}

// Initialize images and reflections
items.forEach((item, index) => {
    const img = item.querySelector('img');
    const reflection = item.querySelector('.reflection');

    img.onload = function () {

        this.parentElement.classList.remove('image-loading');
        reflection.style.setProperty('--bg-image', `url(${this.src})`);
        reflection.style.backgroundImage = `url(${this.src})`;
        reflection.style.backgroundSize = 'cover';
        reflection.style.backgroundPosition = 'center';
    };

    img.onerror = function () {
        this.parentElement.classList.add('image-loading');
    };
});

// Autoplay functionality
function startAutoplay() {
    autoplayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCoverflow();
    }, 4000);
    isPlaying = true;
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
}

function stopAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    }
    isPlaying = false;
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
}

function toggleAutoplay() {
    if (isPlaying) {
        stopAutoplay();
    } else {
        startAutoplay();
    }
}

function handleUserInteraction() {
    stopAutoplay();
}

// Add event listeners to stop autoplay on manual navigation
items.forEach((item) => {
    item.addEventListener('click', handleUserInteraction);
});

document.querySelector('.nav-button.prev').addEventListener('click', handleUserInteraction);
document.querySelector('.nav-button.next').addEventListener('click', handleUserInteraction);

dots.forEach((dot) => {
    dot.addEventListener('click', handleUserInteraction);
});

container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        handleUserInteraction();
    }
});

// Smooth scrolling and active menu item
const sections = document.querySelectorAll('.section');
const menuItems = document.querySelectorAll('.menu-item');
const header = document.getElementById('header');
const scrollToTopBtn = document.getElementById('scrollToTop');

// Update active menu item on scroll
function updateActiveMenuItem() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            menuItems.forEach(item => {
                if (!item.classList.contains('external')) {
                    item.classList.remove('active');
                }
            });
            if (menuItems[index] && !menuItems[index].classList.contains('external')) {
                menuItems[index].classList.add('active');
            }
        }
    });

    // Header background on scroll
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Show/hide scroll to top button
    if (window.scrollY > 500) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
}

window.addEventListener('scroll', updateActiveMenuItem);

// Smooth scroll to section
menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const targetId = item.getAttribute('href');

        // Check if it's an internal link (starts with #)
        if (targetId && targetId.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
        // External links will open normally in new tab
    });
});

// Logo click to scroll to top
document.querySelector('.logo-container').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Scroll to top button
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Form submission
function handleSubmit(event) {
    event.preventDefault();
    alert('Thank you for your message! We\'ll get back to you soon.');
    event.target.reset();
}

// Initialize
updateCoverflow();
container.focus();
startAutoplay();


// ==============================
// CONTACT FORM CHATBOT (Standalone)
// ==============================

// Reuse the existing CONTACT_CHAT_ENDPOINT constant already present.
// If not present, keep the original: const CONTACT_CHAT_ENDPOINT = "http://127.0.0.1:8000/chat/";
const CONTACT_CHAT_ENDPOINT = "http://127.0.0.1:8000/chat/";

/* ========== Chat UI helpers (ADDED) ========== */

function formatMessage(text) {
    // 1. Escape HTML first to prevent XSS
    let safeText = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    // 2. Code blocks (triple backticks)
    safeText = safeText.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // 3. Inline code (single backtick)
    safeText = safeText.replace(/`([^`]+)`/g, '<code>$1</code>');

    // 4. Bold (**text**)
    safeText = safeText.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // 5. Italic (*text*)
    safeText = safeText.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // 6. Headings (### Text)
    safeText = safeText.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    safeText = safeText.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    safeText = safeText.replace(/^# (.*$)/gm, '<h1>$1</h1>');

    // 7. Lists (- item)
    // Basic support: bold the bullet point or just let pre-wrap handle the layout
    // We'll replace "- " at start of line with a bullet character for better visuals
    safeText = safeText.replace(/^- (.*$)/gm, '• $1');

    return safeText;
}

function appendChatMessage(text, who = 'bot', time = new Date()) {
    const out = document.getElementById("chat-output");
    if (!out) return;

    const msg = document.createElement("div");
    msg.className = "chat-msg " + (who === "user" ? "chat-user" : "chat-bot");

    // Use formatMessage instead of just escapeHtml
    // And add style="white-space: pre-wrap" explicitly as requested (though class handles it too)
    msg.innerHTML = `<div class="chat-text" style="white-space: pre-wrap; word-wrap: break-word;">${formatMessage(text)}</div>
                   <span class="chat-meta">${time.toLocaleTimeString()}</span>`;

    out.appendChild(msg);
    out.scrollTop = out.scrollHeight;
}

function showTypingIndicator(show) {
    const t = document.getElementById("typingIndicator");
    if (!t) return;
    t.hidden = !show;
    // keep chat-output scrolled to bottom while typing
    const out = document.getElementById("chat-output");
    if (out) out.scrollTop = out.scrollHeight;
}

// escapeHtml is now integrated into formatMessage, but we keep it if needed elsewhere or remove it.
// The previous code used escapeHtml inside appendChatMessage. 
// We can remove the standalone escapeHtml if it's not used elsewhere.
// Searching the file, escapeHtml was only used in appendChatMessage.
// So we can replace the whole block including escapeHtml definition if we want, or just keep it for safety.
// I will remove the standalone escapeHtml function since I inlined it in formatMessage to avoid confusion.

// Copy & download utilities
document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "btnCopyConversation") {
        const out = document.getElementById("chat-output");
        navigator.clipboard.writeText(out ? out.innerText : "").then(() => {
            e.target.innerText = "Copied";
            setTimeout(() => e.target.innerText = "Copy", 1200);
        });
    }
    if (e.target && e.target.id === "btnDownloadConversation") {
        const out = document.getElementById("chat-output");
        const blob = new Blob([out ? out.innerText : ""], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "conversation.txt";
        a.click();
        URL.revokeObjectURL(a.href);
    }
    if (e.target && e.target.id === "btnClearConversation") {
        const out = document.getElementById("chat-output");
        if (out) out.innerHTML = "";
    }
});

// Update the existing handleContactChat to use the new output UI while preserving original fetch flow.
async function handleContactChat(event) {
    event.preventDefault();
    // Get message from the form's textarea
    const form = event.target;
    const input = form.querySelector('textarea[name="message"]');
    const prompt = input.value.trim();

    if (!prompt) return;

    // append user message to new output panel
    appendChatMessage(prompt, "user");

    input.value = "";

    try {
        showTypingIndicator(true);

        const res = await fetch(CONTACT_CHAT_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
        });

        showTypingIndicator(false);

        if (!res.ok) {
            const text = await res.text();
            appendChatMessage("❌ Error: " + text, "bot");
            return;
        }

        const data = await res.json();
        const reply = data.reply || "No reply received";

        // Append reply to new output panel
        appendChatMessage(reply, "bot");
    } catch (err) {
        showTypingIndicator(false);
        appendChatMessage("❌ Network error. Make sure backend is running.", "bot");
        console.error(err);
    }
}

// Remove legacy binding if present and attach new one
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.removeEventListener('submit', handleContactChat);
    contactForm.addEventListener('submit', handleContactChat);

    // Enter key to send
    const textarea = contactForm.querySelector('textarea[name="message"]');
    if (textarea) {
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                if (submitBtn) submitBtn.click();
            }
        });
    }
}

