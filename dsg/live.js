/* UIcockpit live preview — the bridge.
 *
 * Put this one line in your app's <head>, then open uicockpit.com/generator,
 * choose "Your app" and paste the address your app runs on. Every value you
 * turn there lands HERE as the kit's own variables, in one <style> element,
 * exactly the way it lands in the generator's own screens.
 *
 * It does nothing else. No network, no storage, no tracking: it only listens
 * for messages from the generator while this page is framed by it, and it is
 * inert everywhere else. Remove the line when you are done.
 */
(function () {
  if (window.parent === window) return
  var ALLOW = /^https:\/\/(www\.)?uicockpit\.com$|^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/
  var root = document.documentElement
  var OUR_ATTRS = ['data-theme', 'data-bs-theme', 'data-mantine-color-scheme', 'data-accent-color', 'data-gray-color', 'data-radius', 'data-scaling']
  var OUR_CLASSES = ['dark', 'light', 'dark-theme', 'light-theme']

  function sheet() {
    var s = document.getElementById('uicockpit-live')
    if (!s) { s = document.createElement('style'); s.id = 'uicockpit-live'; (document.head || root).appendChild(s) }
    return s
  }

  /* Which of the nine this page runs on, read from the page itself: the
     variables a kit publishes, the elements it registers, the classes it
     writes. Nothing is assumed; an unrecognised page reports null and the
     generator says so. */
  function detect() {
    var cs = getComputedStyle(root)
    var has = function (v) { return cs.getPropertyValue(v).trim() !== '' }
    if (document.querySelector('md-filled-button,md-outlined-button,md-text-button,md-filled-text-field,md-outlined-text-field')) return 'material'
    if (document.querySelector('.ant-btn,.ant-layout,.ant-input,.ant-menu')) return 'antd'
    if (root.hasAttribute('data-mantine-color-scheme') || document.querySelector('[class*="mantine-"]')) return 'mantine'
    if (document.querySelector('.radix-themes')) return 'radix'
    if (has('--bs-primary') || has('--bs-body-bg')) return 'bootstrap'
    if (has('--color-base-100') && has('--color-primary-content')) return 'daisyui'
    if (has('--primary') && has('--card') && has('--radius')) return 'shadcn'
    if (has('--surface-1') && has('--size-3')) return 'openprops'
    if (has('--spacing') && has('--font-sans')) return 'tailwind'
    return null
  }

  function apply(m) {
    sheet().textContent = typeof m.css === 'string' ? m.css : ''
    var i
    for (i = 0; i < OUR_CLASSES.length; i++) root.classList.remove(OUR_CLASSES[i])
    for (i = 0; i < OUR_ATTRS.length; i++) if (!m.keep || m.keep.indexOf(OUR_ATTRS[i]) < 0) root.removeAttribute(OUR_ATTRS[i])
    var rt = m.root || {}
    var classes = rt.classes || []
    for (i = 0; i < classes.length; i++) if (classes[i]) root.classList.add(classes[i])
    var attrs = rt.attrs || {}
    for (var a in attrs) if (Object.prototype.hasOwnProperty.call(attrs, a)) root.setAttribute(a, attrs[a])
    root.style.colorScheme = m.scheme === 'dark' ? 'dark' : 'light'
    var fonts = m.fonts || []
    for (i = 0; i < fonts.length; i++) {
      if (document.querySelector('link[href="' + fonts[i] + '"]')) continue
      var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = fonts[i]
      ;(document.head || root).appendChild(l)
    }
  }

  function hello() {
    parent.postMessage({ type: 'uicockpit:ready', kit: detect(), title: document.title, href: location.href }, '*')
  }

  addEventListener('message', function (e) {
    if (!ALLOW.test(e.origin) || !e.data) return
    if (e.data.type === 'uicockpit:theme') apply(e.data)
    else if (e.data.type === 'uicockpit:hello') hello()
  })
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', hello)
  else hello()
})()
