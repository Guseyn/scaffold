'use strict'

const workerThatProducesUnilangOutputs = new Worker('/js/worker-for-producing-unilang-output.bundle.min.js?v=1.5.116')

const actionOnResponseHandlers = {
  loadingFontsForRenderingSVGsFinishedForSingleProject: () => {
    const projectBox = document.querySelector('#project-box')
    projectBox.style.display = 'block'
    const editor = document.createElement('e-html')
    editor.setAttribute('data-src', '/../html/editor.html')
    projectBox.appendChild(editor)
  },
  loadingFontsForRenderingSVGsFinishedForListOfProjects: () => {
    const templateWithListOfProjects = document.querySelector('#list-of-projects')
    if (templateWithListOfProjects) {
      window.releaseTemplate(templateWithListOfProjects)
    }
  },
  loadingFontsForRenderingSVGsFinishedForListOfDeletedProjects: () => {
    const templateWithListOfProjects = document.querySelector('#list-of-deleted-projects')
    if (templateWithListOfProjects) {
      window.releaseTemplate(templateWithListOfProjects)
    }
  },
  unilangOutput: (output) => {
    window.dispatchEvent(new CustomEvent('unilangOutputRetrievedFromWorker', { detail: output }))
  }
}

workerThatProducesUnilangOutputs.addEventListener('message', (event) => {
  const actionOnResponse = event.data.actionOnResponse
  const output = event.data.output
  actionOnResponseHandlers[actionOnResponse](output)
})

window.loadFontsViaWorkerThatProducesUnilangOutputForSingleProject = () => {
  workerThatProducesUnilangOutputs.postMessage({ action: 'loadingFontsForRenderingSVGs', actionOnResponse: 'loadingFontsForRenderingSVGsFinishedForSingleProject' })
}

window.loadFontsViaWorkerThatProducesUnilangOutputForListOfProjects = () => {
  workerThatProducesUnilangOutputs.postMessage({ action: 'loadingFontsForRenderingSVGs', actionOnResponse: 'loadingFontsForRenderingSVGsFinishedForListOfProjects' })
}

window.loadFontsViaWorkerThatProducesUnilangOutputForListOfDeletedProjects = () => {
  workerThatProducesUnilangOutputs.postMessage({ action: 'loadingFontsForRenderingSVGs', actionOnResponse: 'loadingFontsForRenderingSVGsFinishedForListOfDeletedProjects' })
}

// id is for cases when we have multiple generation of unilang output on one page, so we can somehow distingush them
window.unilangOutputViaWorker = (unilangInputTexts = [''], generateMIDI = false, id = null) => {
  workerThatProducesUnilangOutputs.postMessage({ action: 'unilangOutput', actionOnResponse: 'unilangOutput', input: unilangInputTexts, generateMIDI, id })
}
