'use strict'

window.__ehtmlCustomElements__['questionnaire-template'] = (node) => {
  if (node.nodeName.toLowerCase() !== 'template') {
    throw new Error('node is not template')
  }
  const questionnaireContentNode = document.importNode(node.content, true)
  const parentNode = node.parentNode
  const questionnaireGroupDiv = document.createElement('div')
  questionnaireGroupDiv.classList.add('group')
  questionnaireGroupDiv.appendChild(questionnaireContentNode)
  parentNode.replaceChild(
    questionnaireGroupDiv, node
  )

  const checkAnswerButton = document.createElement('button')
  checkAnswerButton.classList.add('download')
  checkAnswerButton.innerText = 'Check Answer'
  const nextQuestionButton = document.createElement('button')
  nextQuestionButton.classList.add('persist')
  nextQuestionButton.innerText = 'Next Question'
  const startOverButton = document.createElement('button')
  startOverButton.innerText = 'Start Over'

  questionnaireGroupDiv.appendChild(checkAnswerButton)
  questionnaireGroupDiv.appendChild(nextQuestionButton)
  questionnaireGroupDiv.appendChild(nextQuestionButton)

  nextQuestionButton.style.display = 'none'
  startOverButton.style.display = 'none'

  const questionTemplates = Array.from(questionnaireGroupDiv.querySelectorAll('template[is="question"]'))
  if (questionTemplates.length === 0) {
    throw new Error('<template is="questionnaire"> does not have any questions')
  }
  if (questionTemplates.some(template => !template.hasAttribute('data-right-answer'))) {
    throw new Error('all <template is="question"> must have attribute "data-right-answer"')
  }

  const shuffledQuestionTemplates = shuffleArray(questionTemplates)
  const numberOfQuestions = shuffledQuestionTemplates.length

  const panelWithQuestionNumbers = document.createElement('div')
  panelWithQuestionNumbers.classList.add('question-numbers-panel')
  const questionNumberSpans = []
  for (let questionIndex = 0; questionIndex < numberOfQuestions; questionIndex++) {
    const questionNumberSpan = document.createElement('span')
    questionNumberSpan.classList.add(
      questionIndex === 0
        ? 'neutral-question-number'
        : 'neutral-question-next-number'
    )
    questionNumberSpan.innerText = `${questionIndex + 1}`
    questionNumberSpans.push(questionNumberSpan)
    panelWithQuestionNumbers.appendChild(questionNumberSpan)
  }
  questionnaireGroupDiv.prepend(panelWithQuestionNumbers)

  let currentQuestionIndex = 0
  const firstQuestionTemplateNode = shuffledQuestionTemplates[currentQuestionIndex]

  const questionGroupDiv = document.createElement('div')
  questionGroupDiv.classList.add('group')

  const firstQuestionContentNode = document.importNode(firstQuestionTemplateNode.content, true)
  questionGroupDiv.appendChild(firstQuestionContentNode)

  firstQuestionTemplateNode.parentNode.replaceChild(
    questionGroupDiv, firstQuestionTemplateNode
  )

  checkAnswerButton.addEventListener('click', () => {

  })
}

///////////////////////////// FUNCTIONS /////////////////////////////

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const aitmp = array[i]
    array[i] = array[j]
    array[j] = aitmp
  }
  return array
}
