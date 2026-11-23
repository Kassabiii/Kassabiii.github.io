// Shared behaviour: light/dark toggle, and the Work / Education tabs on the hub.
// The saved theme is applied earlier by a tiny inline script in <head>, so there is no flash.

(function () {
    var root = document.documentElement;
    var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function currentTheme() {
        return root.dataset.theme || (darkQuery.matches ? 'dark' : 'light');
    }

    function updateToggleLabel(button) {
        var next = currentTheme() === 'dark' ? 'light' : 'dark';
        button.setAttribute('aria-label', 'Switch to ' + next + ' theme');
    }

    document.querySelectorAll('.theme-toggle').forEach(function (button) {
        updateToggleLabel(button);
        button.addEventListener('click', function () {
            var next = currentTheme() === 'dark' ? 'light' : 'dark';
            root.dataset.theme = next;
            try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
            updateToggleLabel(button);
        });
    });

    // Screenshots: open the full-size image in a dialog. Without JavaScript the link opens the image itself.
    var zoomLinks = document.querySelectorAll('a.zoom');
    if (zoomLinks.length && typeof HTMLDialogElement === 'function') {
        var lightbox = document.createElement('dialog');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = '<button type="button" class="icon-button lightbox-close" aria-label="Close">' +
            '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
            '</button><img alt="">';
        document.body.appendChild(lightbox);
        var big = lightbox.querySelector('img');

        zoomLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                if (e.ctrlKey || e.metaKey || e.shiftKey) return; // let "open in new tab" work
                e.preventDefault();
                var thumb = link.querySelector('img');
                big.src = link.href;
                big.alt = thumb ? thumb.alt : '';
                lightbox.showModal();
            });
        });

        // Anything except the image itself closes it: the backdrop, the close button. Esc is built in.
        lightbox.addEventListener('click', function (e) {
            if (e.target !== big) lightbox.close();
        });
        lightbox.addEventListener('close', function () { big.removeAttribute('src'); });
    }

    // Email links: a mailto: link does nothing when the visitor has no mail app set up.
    // On click, also copy the address and say so. The link still opens a mail app where there is one.
    var mailLinks = document.querySelectorAll('a[href^="mailto:"]');
    if (mailLinks.length) {
        var toast = document.createElement('div');
        toast.className = 'toast';
        toast.setAttribute('role', 'status');
        document.body.appendChild(toast);
        var toastTimer;

        function showToast(text) {
            toast.textContent = text;
            toast.classList.add('show');
            clearTimeout(toastTimer);
            toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 3500);
        }

        mailLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                if (e.ctrlKey || e.metaKey || e.shiftKey) return;
                var address = link.getAttribute('href').replace(/^mailto:/, '').split('?')[0];
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(address).then(
                        function () { showToast('Email address copied: ' + address); },
                        function () { showToast('My email: ' + address); }
                    );
                } else {
                    showToast('My email: ' + address);
                }
            });
        });
    }

    // Tabs: click to switch, arrow keys move between tabs (WAI-ARIA tabs pattern).
    document.querySelectorAll('[role="tablist"]').forEach(function (list) {
        var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));

        function select(tab) {
            tabs.forEach(function (t) {
                var on = t === tab;
                t.setAttribute('aria-selected', on);
                t.tabIndex = on ? 0 : -1;
                document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
            });
        }

        tabs.forEach(function (tab, i) {
            tab.addEventListener('click', function () { select(tab); });
            tab.addEventListener('keydown', function (e) {
                var step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
                if (!step) return;
                var next = tabs[(i + step + tabs.length) % tabs.length];
                select(next);
                next.focus();
            });
        });
    });
})();
