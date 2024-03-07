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
  checkAnswerButton.classList.add('questionnaire-button')
  checkAnswerButton.innerText = 'Check Answer'
  const nextQuestionButton = document.createElement('button')
  nextQuestionButton.classList.add('persist')
  nextQuestionButton.classList.add('questionnaire-button')
  nextQuestionButton.innerText = 'Next Question'
  const startOverButton = document.createElement('button')
  startOverButton.classList.add('questionnaire-button')
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

  const firstRightAnswer = firstQuestionTemplateNode.getAttribute('data-right-answer')
  const firstQuestionContentNode = document.importNode(firstQuestionTemplateNode.content, true)
  questionGroupDiv.setAttribute('data-right-answer', firstRightAnswer)
  questionGroupDiv.appendChild(firstQuestionContentNode)

  firstQuestionTemplateNode.parentNode.insertBefore(
    questionGroupDiv, checkAnswerButton
  )

  checkAnswerButton.addEventListener('click', () => {
    const rightAnswer = questionGroupDiv.getAttribute('data-right-answer')
    const checkboxAnswers = Array.from(questionGroupDiv.querySelectorAll('input[type="checkbox"]'))
    const radioAnswers = Array.from(questionGroupDiv.querySelectorAll('input[type="radio"]'))
    const selectAnswer = questionGroupDiv.querySelector('select')
    const textareaAnswer = questionGroupDiv.querySelector('textarea')
    const questionHasCheckboxAnswers = checkboxAnswers.length > 0
    const questionHasRadioAnswers = radioAnswers.length > 0
    const questionHasSelectAnswer = selectAnswer !== null
    const questionHasTextareaAnswer = textareaAnswer !== null
    let userAnswerIsCorrect = false
    if (questionHasCheckboxAnswers) {
      let userAnswer = []
      const rightAnswerParts = rightAnswer.split(',')
      for (let checkboxIndex = 0; checkboxIndex < checkboxAnswers.length; checkboxIndex++) {
        if (checkboxAnswers[checkboxIndex].checked) {
          userAnswer.push(checkboxAnswers[checkboxIndex].value)
          if (rightAnswerParts.indexOf(checkboxAnswers[checkboxIndex].value) !== -1) {
            const correctImgCheckmark = document.createElement('img')
            correctImgCheckmark.setAttribute('src', '/image/correct.svg')
            checkboxAnswers[checkboxIndex].parentNode.setAttribute('data-correct', 'true')
            checkboxAnswers[checkboxIndex].parentNode.replaceChild(
              correctImgCheckmark, checkboxAnswers[checkboxIndex]
            )
          } else {
            const wrongImgCheckmark = document.createElement('img')
            wrongImgCheckmark.setAttribute('src', '/image/wrong.svg')
            checkboxAnswers[checkboxIndex].parentNode.setAttribute('data-correct', 'false')
            checkboxAnswers[checkboxIndex].parentNode.replaceChild(
              wrongImgCheckmark, checkboxAnswers[checkboxIndex]
            )
          }
        } else if (rightAnswerParts.indexOf(checkboxAnswers[checkboxIndex].value) !== -1) {
          const correctImgCheckmark = document.createElement('img')
          correctImgCheckmark.setAttribute('src', '/image/correct.svg')
          checkboxAnswers[checkboxIndex].parentNode.setAttribute('data-correct', 'true')
          checkboxAnswers[checkboxIndex].parentNode.replaceChild(
            correctImgCheckmark, checkboxAnswers[checkboxIndex]
          )
        }
      }
      userAnswerIsCorrect = userAnswer.join(',') === rightAnswer
    } else if (questionHasRadioAnswers) {
      for (let radioIndex = 0; radioIndex < radioAnswers.length; radioIndex++) {
        if (radioAnswers[radioIndex].checked) {
          if (rightAnswer === radioAnswers[radioIndex].value) {
            const correctImgCheckmark = document.createElement('img')
            correctImgCheckmark.setAttribute('src', '/image/correct.svg')
            radioAnswers[radioIndex].parentNode.setAttribute('data-correct', 'true')
            radioAnswers[radioIndex].parentNode.replaceChild(
              correctImgCheckmark, radioAnswers[radioIndex]
            )
            userAnswerIsCorrect = true
          } else {
            const wrongImgCheckmark = document.createElement('img')
            wrongImgCheckmark.setAttribute('src', '/image/wrong.svg')
            radioAnswers[radioIndex].parentNode.setAttribute('data-correct', 'false')
            radioAnswers[radioIndex].parentNode.replaceChild(
              wrongImgCheckmark, radioAnswers[radioIndex]
            )
            userAnswerIsCorrect = false
          }
        } else if (rightAnswer === radioAnswers[radioIndex].value) {
          const correctImgCheckmark = document.createElement('img')
          correctImgCheckmark.setAttribute('src', '/image/correct.svg')
          radioAnswers[radioIndex].parentNode.setAttribute('data-correct', 'true')
          radioAnswers[radioIndex].parentNode.replaceChild(
            correctImgCheckmark, radioAnswers[radioIndex]
          )
          userAnswerIsCorrect = false
        }
      }
    } else if (questionHasTextareaAnswer) {
      
    }
    questionNumberSpans[currentQuestionIndex].classList.add(
      userAnswerIsCorrect
        ? 'correct-question-number'
        : 'wrong-question-number'
    )
    checkAnswerButton.style.display = 'none'
    if ((currentQuestionIndex + 1) === numberOfQuestions) {
      startOverButton.style.display = 'block'
    } else {
      nextQuestionButton.style.display = 'block'
    }
  })

  nextQuestionButton.addEventListener('click', () => {

  })

  startOverButton.addEventListener('click', () => {

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
