//Utilitaires
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

//Classes

//Etat
const states = {
    START: "START",
    FIRSTCHOICE: "FIRSTCHOICE",
    SECONDCHOICE: "SECONDCHOICE",
    ENEMYCHOICE : "ENEMYCHOICE",
    ATTACKS: "ATTACKS",
    WIN: "WIN",
    LOSE: "LOSE"
}
let state = states.START
let actionQueue = []

//DOM
const playerDiv = document.querySelector('#playerDiv')
const enemyDiv = document.querySelector('#enemyDiv')
const textDiv = document.querySelector('#textDiv')
const actionsDiv = document.querySelector('#actionsDiv')

//Stats/Inventaires
const allyMonsters = [
    new Monster(1, "aled", 20, 10, 5, statusType.Alive, [
        new Action("Attaque simple", targetTypes.OneEnemy, actionTypes.SimpleAttack),
        new Action("Attaque de zone", targetTypes.AllEnemies, actionTypes.AreaAttack),
]),
    new Monster(2, "vincent", 20, 10, 5, statusType.Alive, [
        new Action("Attaque simple", targetTypes.OneEnemy, actionTypes.SimpleAttack),
        new Action("Soin", targetTypes.Itself, actionTypes.Heal),
    ]),
]

const enemyMonsters = [
    new Monster(3, "Gerard", 20, 10, 5, statusType.Alive, [
        new Action("Attaque simple", targetTypes.OneEnemy, actionTypes.SimpleAttack),
        new Action("Attaque de zone", targetTypes.AllEnemies, actionTypes.AreaAttack),
    ]),
    new Monster(4, "LixLeVrai", 20, 10, 5, statusType.Alive, [
        new Action("Attaque simple", targetTypes.OneEnemy, actionTypes.SimpleAttack),
        new Action("Soin", targetTypes.Itself, actionTypes.Heal),
    ]),
]

//Fonctions
function StartOfTurn() {
    textDiv.innerHTML = ""
    actionsDiv.innerHTML = ""
    switch (state) {
        case states.START:
            SetupUI()
            state = states.FIRSTCHOICE
            StartOfTurn()
            break

        case states.FIRSTCHOICE:
            if (allyMonsters[0].status === statusType.Dead) {
                state = states.SECONDCHOICE
                StartOfTurn()
            }
            else
                ChooseAction(0)
            break

        case states.SECONDCHOICE:
            if (allyMonsters[1].status === statusType.Dead) {
                state = states.ENEMYCHOICE
                StartOfTurn()
            }
            else
                ChooseAction(1)
            break

        case states.ENEMYCHOICE:
            EnemyChoseAction()
            break

        case states.ATTACKS:
            actionQueue.forEach(action => {
                if (action.user.status !== statusType.Dead)
                    action.action.actionType(action.user, action.target)
            })
            RefreshUI()
            actionQueue = []
            let doesWin = true
            let doesLose = false
            allyMonsters.forEach(monster => {
                if (monster.status !== statusType.Dead)
                    doesLose = false
            })
            enemyMonsters.forEach(monster => {
                if (monster.status !== statusType.Dead)
                    doesWin = false
            })
            if (doesLose){
                state = states.LOSE
                StartOfTurn()
                return
            }
            if (doesWin){
                state = states.WIN
                StartOfTurn()
                return
            }
            state = states.FIRSTCHOICE
            StartOfTurn()
            break

        case states.WIN:
            ShowWinText()
            break

        case states.LOSE:
            ShowLoseText()
            break
    }
}

function SetupUI(){
    allyMonsters.forEach(monster => {
        const nameDom = document.createElement('h3')
        nameDom.innerText = monster.name
        playerDiv.appendChild(nameDom)

        const currentHpDom = document.createElement('span')
        currentHpDom.innerText = monster.currentHp
        currentHpDom.id = "CurrentHp" + monster.id
        playerDiv.appendChild(currentHpDom)

        const maxHpDom = document.createElement('span')
        maxHpDom.innerText = "/" + monster.maxHp + "PV"
        playerDiv.appendChild(maxHpDom)
    })
    enemyMonsters.forEach(monster => {
        const nameDom = document.createElement('h3')
        nameDom.innerText = monster.name
        enemyDiv.appendChild(nameDom)

        const currentHpDom = document.createElement('span')
        currentHpDom.innerText = monster.currentHp
        currentHpDom.id = "CurrentHp" + monster.id
        enemyDiv.appendChild(currentHpDom)

        const maxHpDom = document.createElement('span')
        maxHpDom.innerText = "/" + monster.maxHp + "PV"
        enemyDiv.appendChild(maxHpDom)
    })
}

function RefreshUI(){
    allyMonsters.forEach(monster => {
        const temp = document.querySelector('#' + 'CurrentHp' + monster.id)
        temp.textContent = monster.currentHp
    })

    enemyMonsters.forEach(monster => {
        const temp = document.querySelector('#' + 'CurrentHp' + monster.id)
        temp.textContent = monster.currentHp
    })
}

function ChooseAction(id){
    textDiv.innerHTML = "<p>Que dois faire " + allyMonsters[id].name + " ?</p>"
    allyMonsters[id].actions.forEach(action => {
        const buttonAction = document.createElement('button')
        buttonAction.innerText = action.name
        buttonAction.addEventListener('click', ()=>{
            actionQueue.push({
                user: allyMonsters[id],
                action: action
            })
            switch(action.target){
                case targetTypes.OneEnemy:
                    ChooseTarget()
                    break
                case targetTypes.AllEnemies:
                    Object.assign(actionQueue[actionQueue.length-1], {target: enemyMonsters})
                    if (state === states.FIRSTCHOICE)
                        state = states.SECONDCHOICE
                    else
                        state = states.ENEMYCHOICE
                    StartOfTurn()
                    break
                case targetTypes.Itself:
                    Object.assign(actionQueue[actionQueue.length-1], {target: allyMonsters[0]})
                    if (state === states.FIRSTCHOICE)
                        state = states.SECONDCHOICE
                    else
                        state = states.ENEMYCHOICE
                    StartOfTurn()
                    break
            }
        })
        actionsDiv.appendChild(buttonAction)
    })
}

function ChooseTarget() {
    textDiv.innerHTML = "<p>Sur quelle cible ?</p>"
    actionsDiv.innerHTML = ""
    enemyMonsters.forEach(enemy => {
        if (enemy.status !== statusType.Dead) {
            const button = document.createElement('button')
            button.innerText = enemy.name
            button.addEventListener('click', () => {
                Object.assign(actionQueue[actionQueue.length - 1], {target: enemy})
                if (state === states.FIRSTCHOICE)
                    state = states.SECONDCHOICE
                else
                    state = states.ENEMYCHOICE
                StartOfTurn()
            })
            actionsDiv.appendChild(button)
        }
    })
}

function EnemyChoseAction() {
    enemyMonsters.forEach(monster => {
        if (monster.status !== statusType.Dead) {
            let isTheLast = false
            if (monster === enemyMonsters[enemyMonsters.length - 1])
                isTheLast = true
            const actionPerformed = monster.actions[getRandomInt(monster.actions.length)]
            switch (actionPerformed.target) {
                case targetTypes.OneEnemy:
                    const targetSelected = allyMonsters[getRandomInt(allyMonsters.length)]
                    actionQueue.push({
                        user: monster,
                        action: actionPerformed,
                        target: targetSelected
                    })
                    if (isTheLast) {
                        state = states.ATTACKS
                        StartOfTurn()
                    }
                    break
                case targetTypes.AllEnemies:
                    actionQueue.push({
                        user: monster,
                        action: actionPerformed,
                        target: allyMonsters
                    })
                    if (isTheLast) {
                        state = states.ATTACKS
                        StartOfTurn()
                    }
                    break
                case targetTypes.Itself:
                    actionQueue.push({
                        user: monster,
                        action: actionPerformed,
                        target: monster
                    })
                    if (isTheLast) {
                        state = states.ATTACKS
                        StartOfTurn()
                    }
                    break
            }
        }
    })
}

function ShowWinText(){
    const winText = document.createElement('p')
    winText.innerText = "Tu as gangé !"
    textDiv.appendChild(winText)
    const retryButton = document.createElement('button')
    retryButton.innerText = "Recommencer"
    retryButton.addEventListener('click', () => {
        location.reload()
    })
    actionsDiv.appendChild(retryButton)
}

function ShowLoseText(){
    const loseText = document.createElement('p')
    loseText.innerText = "Tu as perdu !"
    textDiv.appendChild(loseText)
    const retryButton = document.createElement('button')
    retryButton.innerText = "Recommencer"
    retryButton.addEventListener('click', () => {
        location.reload()
    })
    actionsDiv.appendChild(retryButton)
}