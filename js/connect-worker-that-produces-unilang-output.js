'use strict'

const workerThatProducesUnilangOutputs = new Worker('/js/worker-for-producing-unilang-output.bundle.min.js?v=1.0.0')

const actionOnResponseHandlers = {
  loadingFontsForRenderingSVGsFinished: () => {
    window.dispatchEvent(new CustomEvent('loadingFontsForRenderingSVGsFinished', { detail: true }))
  },
  unilangOutput: (output) => {
    window.dispatchEvent(new CustomEvent(`unilangOutputRetrievedFromWorker-${output.id}`, { detail: output }))
  }
}

workerThatProducesUnilangOutputs.addEventListener('message', (event) => {
  const actionOnResponse = event.data.actionOnResponse
  const output = event.data.output
  actionOnResponseHandlers[actionOnResponse](output)
})

window.loadFontsForRenderingSVGsViaWorker = (fonts) => {
  workerThatProducesUnilangOutputs.postMessage({ action: 'loadingFontsForRenderingSVGs', actionOnResponse: 'loadingFontsForRenderingSVGsFinished', input: fonts })
}

// id is for cases when we have multiple generation of unilang output on one page, so we can somehow distingush them
window.unilangOutputViaWorker = (unilangInputTexts = [''], applyHighlighting = false, generateSVG, generateMIDI = false, id = null) => {
  workerThatProducesUnilangOutputs.postMessage({ action: 'unilangOutput', actionOnResponse: 'unilangOutput', input: unilangInputTexts, applyHighlighting, generateSVG, generateMIDI, id })
}
