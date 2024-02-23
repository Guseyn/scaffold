window.copyText = (copyIcon) => {
  const textContainer = copyIcon.parentElement.parentElement
  let text
  const latexSpan = textContainer.querySelector('span[title]')
  if (latexSpan) {
    text = latexSpan.getAttribute('title')
  } else {
    text = textContainer.innerText
  }
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'absolute'
  textarea.style.top = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  copyIcon.setAttribute('src', '/image/done.svg?v=1.4.12')
  setTimeout(() => {
    copyIcon.setAttribute('src', '/image/copy.svg?v=1.4.12')
  }, 1500)
}

window.__ehtmlCustomElements__['unison-font-loader-template'] = (node) => {
  if (node.nodeName.toLowerCase() !== 'template') {
    throw new Error('node is not template')
  }
  const loadingFontsForRenderingSVGsFinishedEventListener = () => {
    node.parentNode.replaceChild(
      document.importNode(node.content, true), node
    )
    document.body.classList.toggle('progress-opacity')
    scrollToHash()
    window.removeEventListener('loadingFontsForRenderingSVGsFinished', loadingFontsForRenderingSVGsFinishedEventListener)
  }
  window.addEventListener('loadingFontsForRenderingSVGsFinished', loadingFontsForRenderingSVGsFinishedEventListener)
  if (node.hasAttribute('data-font-urls')) {
    const fontUrls = node.getAttribute('data-font-urls').split(',')
    document.body.classList.toggle('progress-opacity')
    window.loadFontsForRenderingSVGsViaWorker(fontUrls)
  } else {
    node.parentNode.replaceChild(
      document.importNode(node.content, true), node
    )
    scrollToHash()
  }
}
