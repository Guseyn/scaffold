'use strict'

const PERCEPTION_TIME = 0.005
const PRECISION = 0.0001
const itIsMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

window.attachHighliterToMidiPlayer = (midiPlayer, svgParent, customStyles) => {
  const highlighColor = '#C40233'
  const midiProgressBar = midiPlayer.shadowRoot.querySelector('.seek-bar')
  const currentTimeLabel = midiPlayer.shadowRoot.querySelector('.current-time')
  const totalTimeLabel = midiPlayer.shadowRoot.querySelector('.total-time')
  const playButton = midiPlayer.shadowRoot.querySelector('button')

  const progressChangeEvent = (event) => {
    const originalFontColor = customStyles.fontColor || '#121212'
    if (event.type === 'input' || event.type === 'change' || event.type === 'stop') {
      const refElms = svgParent.querySelectorAll(`[fill="${highlighColor}"]`)
      refElms.forEach((refElm) => {
        refElm.setAttribute('fill', originalFontColor)
      })
      midiPlayer.progressInterruptedFlowOfNoteEvents = true
      return
    }

    let thisIsFirstNoteEventAfterFlowInterrupted = false
    if (event.type === 'note' && midiPlayer.progressInterruptedFlowOfNoteEvents) {
      midiPlayer.progressInterruptedFlowOfNoteEvents = false
      thisIsFirstNoteEventAfterFlowInterrupted = true
    }

    const closestTimeStampMappedWithRefsOnForCurrentNote = []
    for (let error = -PERCEPTION_TIME; error <= PERCEPTION_TIME; error += PRECISION) {
      const closestTimeStampMappedWithRefsOnForCurrentNoteForCurrentError = midiPlayer.timeStampsMappedWithRefsOn[(event.detail.note.startTime + error).toFixed(4) * 1]
      if (closestTimeStampMappedWithRefsOnForCurrentNoteForCurrentError !== undefined) {
        closestTimeStampMappedWithRefsOnForCurrentNote.push(
          ...closestTimeStampMappedWithRefsOnForCurrentNoteForCurrentError
        )
      }
    }

    closestTimeStampMappedWithRefsOnForCurrentNote.forEach((refToHighlight, refToHighlightIndex) => {
      const refElms = svgParent.querySelectorAll(`[ref-ids*="${refToHighlight.refId}"]`)
      refElms.forEach((refElm) => {
        refElm.querySelectorAll('path').forEach((pathElm) => {
          pathElm.setAttribute('fill', highlighColor)
        })
      })
      const unhighlightNoteTimeout = setTimeout(() => {
        refElms.forEach((refElm) => {
          refElm.querySelectorAll('path').forEach((pathElm) => {
            pathElm.setAttribute('fill', originalFontColor)
          })
        })
        clearTimeout(unhighlightNoteTimeout)
        const midiProgressBarMaxValue = midiProgressBar.getAttribute('max') * 1
        if ((event.detail.note.startTime + refToHighlight.duration) >= midiProgressBarMaxValue) {
          midiProgressBar.value = midiProgressBarMaxValue
          if (playButton.parentElement.classList.contains('playing')) {
            currentTimeLabel.innerText = totalTimeLabel.innerText
            playButton.click()
          }
        }
      }, refToHighlight.duration * 1000)
    })

  }

  midiPlayer.addEventListener('note', progressChangeEvent)
  midiPlayer.addEventListener('stop', progressChangeEvent)
  midiProgressBar.addEventListener('change', progressChangeEvent)
  midiProgressBar.addEventListener('input', progressChangeEvent)

  midiProgressBar.addEventListener('change', () => {
    if (playButton.parentElement.classList.contains('playing')) {
      playButton.click()
      playButton.click()
    }
  })

  svgParent.addEventListener('click', (event) => {
    if (event.target.tagName !== 'path') {
      return
    }
    if (!event.target.parentNode) {
      return
    }
    let refIds
    const refDataName = event.target.parentNode.getAttribute('data-name')
    if (refDataName === 'noteBody') {
      refIds = event.target.parentNode.getAttribute('ref-ids')
    }
    if (refDataName === 'rest') {
      refIds = event.target.parentNode.getAttribute('ref-ids')
    }
    if (refDataName === 'simileStrokes') {
      refIds = event.target.parentNode.parentNode.parentNode.getAttribute('ref-ids')
    }
    if (!refIds) {
      return
    }
    const splittedRefIds = refIds.split(',')
    const theOnlyPageIndex = 0
    if (midiPlayer.refsOnMappedWithTimeStamps[theOnlyPageIndex] === undefined) {
      return
    }
    for (const refIdIndex in splittedRefIds) {
      const refId = splittedRefIds[refIdIndex]
      if (midiPlayer.refsOnMappedWithTimeStamps[theOnlyPageIndex][refId] !== undefined) {
        midiProgressBar.value = midiPlayer.refsOnMappedWithTimeStamps[theOnlyPageIndex][refId]
        midiProgressBar.dispatchEvent(new CustomEvent('change'))
        break
      }
    }
  })
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

window.__ehtmlCustomElements__['unison-svg-midi-template'] = (node) => {
  if (node.nodeName.toLowerCase() !== 'template') {
    throw new Error('node is not template')
  }
  if (!node.hasAttribute('id')) {
    throw new Error('<template is="unison-svg-midi"> must have id attribute')
  }
  const id = node.getAttribute('id')
  const contentNode = document.importNode(node.content, true)
  const unilangText = contentNode.textContent
  const unilangOutputRetrievedEvent = (event) => {
    console.log(event.detail)
    const svgString = event.detail.unilangOutputsForEachPage[0].svg
    const customStyles = event.detail.unilangOutputsForEachPage[0].customStyles
    const midiForAllPages = event.detail.midiForAllPages
    const midiDataSrc = midiForAllPages.dataSrc
    const domParser = new DOMParser()
    const svg = domParser.parseFromString(svgString, 'image/svg+xml').documentElement
    svg.setAttribute('title', unilangText)
    node.parentNode.style.backgroundColor = customStyles.backgroundColor || '#FDF5E6'
    const midiPlayer = document.createElement('midi-player')
    midiPlayer.setAttribute('id', `midi-player-${id}`)
    midiPlayer.setAttribute('sound-font', 'https://cdn.unisonofficial.com/magenta-soundfonts/SGM')
    midiPlayer.setAttribute('visualizer', '#myVisualizer')
    midiPlayer.setAttribute(
      'src',
      midiForAllPages.dataSrc
    )
    midiPlayer.timeStampsMappedWithRefsOn = midiForAllPages.timeStampsMappedWithRefsOn
    midiPlayer.refsOnMappedWithTimeStamps = midiForAllPages.refsOnMappedWithTimeStamps
    node.parentNode.replaceChild(
      svg, node
    )
    svg.parentNode.appendChild(midiPlayer)
    window.attachHighliterToMidiPlayer(midiPlayer, svg.parentNode, customStyles)
    window.removeEventListener(`unilangOutputRetrievedFromWorker-${id}`, unilangOutputRetrievedEvent)
  }
  window.addEventListener(`unilangOutputRetrievedFromWorker-${id}`, unilangOutputRetrievedEvent)
  window.unilangOutputViaWorker([ unilangText ], false, true, true, id)
}

