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

  const finalScorePanel = document.createElement('span')
  finalScorePanel.classList.add('final-score')
  questionnaireGroupDiv.appendChild(finalScorePanel)

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
  questionnaireGroupDiv.appendChild(startOverButton)

  nextQuestionButton.style.display = 'none'
  startOverButton.style.display = 'none'

  const questionTemplates = Array.from(questionnaireGroupDiv.querySelectorAll('template[is="question"]'))
  if (questionTemplates.length === 0) {
    throw new Error('<template is="questionnaire"> does not have any questions')
  }
  if (questionTemplates.some(template => !template.hasAttribute('data-right-answer'))) {
    throw new Error('all <template is="question"> must have attribute "data-right-answer"')
  }

  const panelWithQuestionNumbers = document.createElement('div')
  panelWithQuestionNumbers.classList.add('question-numbers-panel')
  questionnaireGroupDiv.appendChild(panelWithQuestionNumbers)

  const questionGroupDiv = document.createElement('div')
  questionGroupDiv.classList.add('group')
  questionnaireGroupDiv.insertBefore(
    questionGroupDiv, finalScorePanel
  )

  let shuffledQuestionTemplates
  let numberOfQuestions
  let numberOfCorrectAnswers = 0
  let questionNumberSpans

  function setupQuestionnaire () {
    panelWithQuestionNumbers.innerHTML = ''
    shuffledQuestionTemplates = shuffleArray(
      repeatQuestionsIfNeeded(questionTemplates)
    ).filter((qt) => {
        return !qt.hasAttribute('data-ignore')
      })
      .sort((qt1, qt2) => {
        if (qt1.hasAttribute('data-priority') && qt2.hasAttribute('data-priority')) {
          if ((qt1.getAttribute('data-priority') * 1) < (qt2.getAttribute('data-priority') * 1)) {
            return -1
          }
        }
        return 0
      })
    numberOfQuestions = shuffledQuestionTemplates.length

    questionNumberSpans = []
    for (let questionIndex = 0; questionIndex < numberOfQuestions; questionIndex++) {
      const questionNumberSpan = document.createElement('span')
      questionNumberSpan.classList.add('neutral-question-next-number')
      questionNumberSpan.innerText = `${questionIndex + 1}`
      questionNumberSpans.push(questionNumberSpan)
      panelWithQuestionNumbers.appendChild(questionNumberSpan)
    }
  }

  let currentQuestionIndex = 0

  function releaseNextQuestion () {
    pauseMidiPlayerIfNeeded()
    if (shuffledQuestionTemplates[currentQuestionIndex]) {
      questionGroupDiv.innerHTML = ''
      const questionTemplateNode = shuffledQuestionTemplates[currentQuestionIndex]
      const rightAnswer = questionTemplateNode.getAttribute('data-right-answer')
      const questionContentNode = document.importNode(questionTemplateNode.content, true)
      questionGroupDiv.setAttribute('data-right-answer', rightAnswer)
      questionGroupDiv.appendChild(questionContentNode)
      questionNumberSpans[currentQuestionIndex].classList.remove('neutral-question-next-number')
      questionNumberSpans[currentQuestionIndex].classList.add('neutral-question-number')
      questionNumberSpans[currentQuestionIndex].scrollIntoView({
        inline: 'center'
      })
      const questionTitle = document.querySelector('.question-title')
      if (questionGroupDiv) {
        questionTitle.innerHTML = `${questionTitle.innerHTML} (${currentQuestionIndex + 1}/${numberOfQuestions})`
      }
    }
  }

  function continueOrFinishQuestioneer (userAnswerIsCorrect) {
    if (userAnswerIsCorrect) {
      numberOfCorrectAnswers += 1
    }
    checkAnswerButton.style.display = 'none'
    if ((currentQuestionIndex + 1) === numberOfQuestions || (numberOfQuestions === 0)) {
      startOverButton.style.display = 'block'
      finalScorePanel.style.display = 'block'
      finalScorePanel.innerText = `Final Score: ${numberOfCorrectAnswers}/${numberOfQuestions}`
      numberOfCorrectAnswers = 0
    } else {
      nextQuestionButton.style.display = 'block'
    }
  }

  setupQuestionnaire()
  if (shuffledQuestionTemplates.length === 0) {
    continueOrFinishQuestioneer(false)
  } else {
    releaseNextQuestion()
  }

  checkAnswerButton.addEventListener('click', () => {
    const rightAnswer = questionGroupDiv.getAttribute('data-right-answer')
    const checkboxAnswers = Array.from(questionGroupDiv.querySelectorAll('input[type="checkbox"]'))
    const radioAnswers = Array.from(questionGroupDiv.querySelectorAll('input[type="radio"]'))
    const selectAnswer = questionGroupDiv.querySelector('select')
    const inputAnswer = questionGroupDiv.querySelector('input[type="text"]')
    let textareaAnswer
    if (questionGroupDiv.querySelectorAll('div').length > 0) {
      const shadowRoot = questionGroupDiv.querySelectorAll('div')[1].shadowRoot
      if (shadowRoot) {
        textareaAnswer = shadowRoot.querySelector('textarea')
      }
    }
    const questionHasCheckboxAnswers = checkboxAnswers.length > 0
    const questionHasRadioAnswers = radioAnswers.length > 0
    const questionHasSelectAnswer = selectAnswer !== undefined && selectAnswer !== null
    const questionHasInputAnswer = inputAnswer !== undefined && inputAnswer !== null
    const questionHasTextareaAnswer = textareaAnswer !== undefined && textareaAnswer !== null

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
      const renderIcon = textareaAnswer.parentNode.querySelector('.render-icon')
      const editIcon = textareaAnswer.parentNode.querySelector('.edit-icon')
      renderIcon.click()
      setTimeout(() => {
        const divWithRightAnswer = questionGroupDiv.querySelector(rightAnswer)
        const svgWithRightAnswer = divWithRightAnswer.querySelector('svg')
        const correctImgCheckmark = document.createElement('img')
        correctImgCheckmark.setAttribute('src', '/image/correct.svg')
        const correctLabel = document.createElement('label')
        correctLabel.setAttribute('data-correct', 'true')
        correctLabel.classList.add('block')
        correctLabel.prepend(correctImgCheckmark)
        divWithRightAnswer.prepend(correctLabel)
        divWithRightAnswer.style.display = 'block'
        const userAnswerContent = svgWithRightAnswer.innerHTML
        const rightAnswerContent = textareaAnswer.parentNode.querySelector('svg').innerHTML
        if (userAnswerContent === rightAnswerContent) {
          const correctImgCheckmark = document.createElement('img')
          correctImgCheckmark.setAttribute('src', '/image/correct.svg')
          const correctLabel = document.createElement('label')
          correctLabel.setAttribute('data-correct', 'true')
          correctLabel.classList.add('block')
          correctLabel.prepend(correctImgCheckmark)
          textareaAnswer.parentNode.prepend(correctLabel)
          editIcon.style.display = 'none'
          userAnswerIsCorrect = true
        } else {
          const wrongImgCheckmark = document.createElement('img')
          wrongImgCheckmark.setAttribute('src', '/image/wrong.svg')
          const wrongLabel = document.createElement('label')
          wrongLabel.setAttribute('data-correct', 'false')
          wrongLabel.classList.add('block')
          wrongLabel.prepend(wrongImgCheckmark)
          textareaAnswer.parentNode.prepend(wrongLabel)
          editIcon.style.display = 'none'
          userAnswerIsCorrect = false
        }
        questionNumberSpans[currentQuestionIndex].classList.add(
          userAnswerIsCorrect
            ? 'correct-question-number'
            : 'wrong-question-number'
        )
        continueOrFinishQuestioneer(userAnswerIsCorrect)
      }, 300)
    } else if (questionHasSelectAnswer) {
      if (selectAnswer.value === rightAnswer) {
        selectAnswer.style.border = '2px solid #009F6B'
        userAnswerIsCorrect = true
      } else {
        selectAnswer.style.border = '2px solid #C40233'
        userAnswerIsCorrect = false
      }
    } else if (questionHasInputAnswer) {
      if (inputAnswer.value === rightAnswer) {
        inputAnswer.style.border = '2px solid #009F6B'
        userAnswerIsCorrect = true
      } else {
        inputAnswer.style.border = '2px solid #C40233'
        userAnswerIsCorrect = false
      }
    } else {
      throw new Error('question does not have options to answer')
    }
    if (!questionHasTextareaAnswer) {
      questionNumberSpans[currentQuestionIndex].classList.add(
        userAnswerIsCorrect
          ? 'correct-question-number'
          : 'wrong-question-number'
      )
      continueOrFinishQuestioneer(userAnswerIsCorrect)
    }
  })

  nextQuestionButton.addEventListener('click', () => {
    currentQuestionIndex += 1
    releaseNextQuestion()
    checkAnswerButton.style.display = 'block'
    nextQuestionButton.style.display = 'none'
  })

  startOverButton.addEventListener('click', () => {
    currentQuestionIndex = 0
    setupQuestionnaire()
    if (shuffledQuestionTemplates.length === 0) {
      continueOrFinishQuestioneer(false)
    } else {
      releaseNextQuestion()
      checkAnswerButton.style.display = 'block'
      startOverButton.style.display = 'none'
      finalScorePanel.innerText = ''
      finalScorePanel.style.display = 'none'
    }
  })
}

///////////////////////////// FUNCTIONS /////////////////////////////

function shuffleArray (array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const aitmp = array[i]
    array[i] = array[j]
    array[j] = aitmp
  }
  return array
}

function repeatQuestionsIfNeeded (questionTemplates) {
  for (let i = 0; i < questionTemplates.length; i++) {
    if (questionTemplates[i].hasAttribute('data-repeat')) {
      const numberOfRepetitions = questionTemplates[i].getAttribute('data-repeat') * 1
      questionTemplates[i].removeAttribute('data-repeat')
      for (let n = 0; n < numberOfRepetitions; n++) {
        const repeatedQuestion = questionTemplates[i].cloneNode(true)
        questionTemplates.push(repeatedQuestion)
        questionTemplates[i].parentNode.appendChild(repeatedQuestion)
      }
    }
  }
  return questionTemplates
}

function pauseMidiPlayerIfNeeded () {
  const midiPlayer = document.querySelector('midi-player')
  if (midiPlayer) {
    const playButton = midiPlayer.shadowRoot.querySelector('button')
    if (playButton.parentElement.classList.contains('playing')) {
      playButton.click()
    }
  }
}
