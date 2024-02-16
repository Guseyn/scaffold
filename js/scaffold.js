window.copyText = (copyIcon) => {
  const text = copyIcon.parentElement.innerText
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