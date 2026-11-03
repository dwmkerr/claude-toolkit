/*
 * Dev-only copy editing for any page, served by live_edit_server.py.
 * Press `e`, click any text, type, then click away or press Esc. Each change is
 * queued for an agent, which edits the source; the badge counts what is still waiting.
 * The server injects this script, so the shipped page never contains it.
 */
(function () {
  var on = false, active = null, original = '', hovered = null;

  var style = document.createElement('style');
  style.textContent =
    'html[data-live-edit] [data-live-edit-hover]{outline:1px dashed #bc4c00;outline-offset:2px;cursor:text}' +
    'html[data-live-edit] [contenteditable]{outline:2px solid #bc4c00 !important;outline-offset:2px}' +
    '#live-edit-badge{position:fixed;bottom:12px;left:50%;transform:translateX(-50%);z-index:9999;padding:6px 12px;' +
    'border-radius:999px;background:#bc4c00;color:#fff;font:500 12px -apple-system,BlinkMacSystemFont,sans-serif;display:none}';
  document.head.appendChild(style);
  var badge = document.createElement('div');
  badge.id = 'live-edit-badge';
  badge.setAttribute('data-live-edit-ui', '');
  document.body.appendChild(badge);

  function isTyping(t) {
    return t instanceof HTMLElement && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].indexOf(t.tagName) >= 0);
  }
  function isOurs(t) { return t instanceof Element && !!t.closest('[data-live-edit-ui]'); }

  var queued = 0;
  function showBadge() {
    badge.style.display = on ? 'block' : 'none';
    badge.textContent = 'Editing copy · ' + (queued > 0 ? queued + ' waiting' : 'all applied') + ' · e / Esc to exit';
  }
  function refresh() {
    fetch('/api/dev/live-edit').then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d) { queued = d.queued; showBadge(); } }).catch(function () {});
  }

  function commit() {
    if (!active) return;
    var el = active;
    active = null;
    el.removeAttribute('contenteditable');
    el.removeEventListener('blur', commit);
    var next = el.innerText;
    if (next.trim() === original.trim()) return;
    var bound = el.closest('[data-text]');
    fetch('/api/dev/live-edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        oldText: original,
        newText: next,
        // Text set from script data has no literal copy in the markup, so name its binding
        binding: bound ? bound.getAttribute('data-text') : null,
        page: location.pathname + location.hash,
        tag: el.tagName.toLowerCase(),
        parentText: el.parentElement ? el.parentElement.innerText.slice(0, 300) : ''
      })
    }).then(function (r) { if (r.ok) refresh(); });
  }

  function onOver(e) {
    if (hovered) hovered.removeAttribute('data-live-edit-hover');
    hovered = e.target instanceof Element && !isOurs(e.target) ? e.target : null;
    if (hovered) hovered.setAttribute('data-live-edit-hover', '');
  }
  function onDown(e) {
    if (isOurs(e.target) || !(e.target instanceof HTMLElement)) return;
    e.stopPropagation();
    if (active && active.contains(e.target)) return;
    commit();
    var el = e.target;
    if (!el.innerText.trim()) return;
    active = el;
    original = el.innerText;
    // plaintext-only stops pasted markup leaking into the queued copy
    el.setAttribute('contenteditable', 'plaintext-only');
    el.addEventListener('blur', commit);
    requestAnimationFrame(function () { if (document.activeElement !== el) el.focus(); });
  }
  // Capture phase runs before the page's own click handlers, so carousels or steps don't change mid-edit
  function swallow(e) {
    if (isOurs(e.target)) return;
    e.stopPropagation();
    if (e.type === 'click') e.preventDefault();
  }
  function onEditKey(e) {
    if (!active) return;
    var save = e.key === 's' && (e.metaKey || e.ctrlKey);
    if (e.key === 'Escape' || save) { e.preventDefault(); e.stopPropagation(); active.blur(); }
    else e.stopPropagation();
  }

  var poll = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    var ev = [['mouseover', onOver], ['mousedown', onDown], ['pointerdown', swallow], ['click', swallow], ['keydown', onEditKey]];
    if (on) {
      document.documentElement.setAttribute('data-live-edit', '');
      ev.forEach(function (p) { window.addEventListener(p[0], p[1], true); });
      refresh();
      poll = setInterval(refresh, 2000);
    } else {
      commit();
      document.documentElement.removeAttribute('data-live-edit');
      if (hovered) hovered.removeAttribute('data-live-edit-hover');
      ev.forEach(function (p) { window.removeEventListener(p[0], p[1], true); });
      clearInterval(poll);
    }
    showBadge();
  }

  window.addEventListener('keydown', function (e) {
    if (e.key === 'e' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      if (isTyping(e.target)) return;
      setOn(!on);
    } else if (e.key === 'Escape' && !isTyping(e.target)) {
      setOn(false);
    }
  });
})();
