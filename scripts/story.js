const speeds = {
    pause: 500,
    slow: 120,
    normal: 30,
    fast: 10
}

//Array story, contient tous les évènements de dialogue du jeu, chaque index est un objet composé des paramètres textLines qui sont les lignes de dialogues,
//et qui sont elles même des objets avec comme paramètres le dialogue et sa vitesse d'affichage
//ainsi que le paramètre speed qui défini la vitesse d'affichage du texte
//chaque objet de story possède également une endAction, l'action qui s'effectue à la fin du dialogue
const story = [
    {
        textLines: [
            {
                string: "Vous vous réveillez dans une pièce totalement sombre, à l'exception d'une faible lueur passant aux travers de barreaux",
                speed: speeds.normal,
                classes: ["fst-italic"]
            },
            {
                string: "??? : Allez debout là-dedans ! On se bouge !",
                speed: speeds.fast
            },
            {
                string: "Vous êtes entrainé dehors.",
                speed: speeds.normal,
                classes: ["fst-italic"]
            },
            {
                string: "??? : Que le combat commence !",
                speed: speeds.normal
            }
        ],
        endAction: StartOfTurn
    },
]

const dialogueText = document.createElement('p')
let currentDialogue
const characters = []

function StartDialogue() {
    //On récupère le premier élément de story tout en le retirant
    currentDialogue = story.splice(0,1)[0]
    PrintNextLine()
}

//Affiche la ligne suivante
function PrintNextLine() {
    textDiv.innerHTML = ""
    dialogueText.innerHTML = ""
    textDiv.appendChild(dialogueText)
    //récupère la ligne suivante et l'enlève de currentDialogue
    let currentLine = currentDialogue.textLines.splice(0, 1)[0]
    //créer une span invisible pour chaque caractère qui est "affiché" et les met toutes dans la array characters
    currentLine.string.split("").forEach(character => {
        const characterSpan = document.createElement('span')
        characterSpan.className = "opacity-0"
        characterSpan.textContent = character
        dialogueText.appendChild(characterSpan)
        characters.push({
            span: characterSpan,
            isSpace: character === " ",
            delayAfter: currentLine.speed,
            classes: currentLine.classes || []
        })
    })
    RevealOneCharacter(characters)
}

function RevealOneCharacter(list){
    const next = list.splice(0, 1)[0]
    next.span.className = ""
    next.classes.forEach(c => {
        next.span.classList.add(c)
    })

    const delay = next.isSpace ? 0 : next.delayAfter

    if (list.length > 0){
        setTimeout(function () {
            RevealOneCharacter(list)
        }, delay)
    }
    else
    {
        if (currentDialogue.textLines.length === 0) {
            const button = document.createElement('button')
            button.addEventListener('click', ()=>{EndDialogue(currentDialogue.endAction)})
            button.innerText = "Continuer"
            textDiv.appendChild(button)
        }
        else
        {
            const button = document.createElement('button')
            button.addEventListener('click', PrintNextLine)
            button.innerText = "Continuer"
            textDiv.appendChild(button)
        }
    }
}

function EndDialogue(action){
    console.log(action)
    dialogueText.remove()
    action()
}

StartDialogue()
console.log(currentDialogue)