// DetDev Terminal Shell Logic

document.addEventListener('DOMContentLoaded', () => {
    initTerminalTabs();
});

// Terminal Navigation Tabs
function initTerminalTabs() {
    const tabs = document.querySelectorAll('.term-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Active Tab ScrollSpy
    const sections = document.querySelectorAll('.term-section');
    window.addEventListener('scroll', () => {
        let currentSection = '';
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 150;
            if (window.scrollY >= secTop) {
                currentSection = sec.getAttribute('id');
            }
        });

        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('href') === `#${currentSection}`) {
                tab.classList.add('active');
            }
        });
    });
}

// Copy Contact Function
function copyContact(textToCopy) {
    navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`COPIED: ${textToCopy}`);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Terminal Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (!toast || !toastMsg) return;

    toastMsg.innerText = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}
