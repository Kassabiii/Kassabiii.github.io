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
