//Classes
class Monster{
    constructor(id, name, maxHp, atk, def, actions) {
        this.id = id
        this.name = name
        this.maxHp = maxHp
        this.currentHp = maxHp
        this.atk = atk
        this.def = def
        this.actions = actions
    }
}

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

const targetTypes = {
    OneEnemy: "OneEnemy",
    AllEnemies: "AllEnemies",
    Itself: "Itself"
}

//DOM
const playerDiv = document.querySelector('#playerDiv')
const enemyDiv = document.querySelector('#enemyDiv')
const textDiv = document.querySelector('#textDiv')
const actionsDiv = document.querySelector('#actionsDiv')

//Stats/Inventaires
const allyMonsters = [
    new Monster(1, "aled", 20, 10, 5, [
        {
            name: "Attaque simple",
            targetType: targetTypes.OneEnemy,
            effect: (enemy, monster) => {
                enemy.currentHp -= (monster.atk - enemy.def < 1 ? 1 : monster.atk - enemy.def)
            }
        },
        {
            name: "Attaque de zone",
            targetType: targetTypes.AllEnemies,
            effect:
                (enemies, monster) => {
                    enemies.forEach(enemy => {
                        monster.atk = Math.floor(monster.atk / 2)
                        enemy.currentHp -= (monster.atk - enemy.def < 1 ? 1 : monster.atk - enemy.def)
                    })
                }
        }
]),
    new Monster(2, "vincent", 20, 10, 5, [
        {
            name: "Attaque simple",
            targetType: targetTypes.OneEnemy,
            effect: (enemy, monster) => {
                enemy.currentHp -= (monster.atk - enemy.def < 1 ? 1 : monster.atk - enemy.def)
            }
        },
        {
            name: "Attaque de zone",
            targetType: targetTypes.AllEnemies,
            effect:
                (enemies, monster) => {
                    enemies.forEach(enemy => {
                        monster.atk = Math.floor(monster.atk / 2)
                        enemy.currentHp -= (monster.atk - enemy.def < 1 ? 1 : monster.atk - enemy.def)
                    })
                }
        }
    ]),
]

const enemyMonsters = [
    new Monster(3, "aled", 20, 10, 5, [
        {
            name: "Attaque simple",
            targetType: targetTypes.OneEnemy,
            effect: (enemy, monster) => {
                enemy.currentHp -= (monster.atk - enemy.def < 1 ? 1 : monster.atk - enemy.def)
            }
        },
        {
            name: "Attaque de zone",
            targetType: targetTypes.AllEnemies,
            effect:
                (enemies, monster) => {
                    enemies.forEach(enemy => {
                        monster.atk = Math.floor(monster.atk / 2)
                        enemy.currentHp -= (monster.atk - enemy.def < 1 ? 1 : monster.atk - enemy.def)
                    })
                }
        }
    ]),
    new Monster(4, "vincent", 20, 10, 5, [
        {
            name: "Attaque simple",
            targetType: targetTypes.OneEnemy,
            effect: (enemy, monster) => {
                enemy.currentHp -= (monster.atk - enemy.def < 1 ? 1 : monster.atk - enemy.def)
            }
        },
        {
            name: "Attaque de zone",
            targetType: targetTypes.AllEnemies,
            effect:
                (enemies, monster) => {
                    enemies.forEach(enemy => {
                        monster.atk = Math.floor(monster.atk / 2)
                        enemy.currentHp -= (monster.atk - enemy.def < 1 ? 1 : monster.atk - enemy.def)
                    })
                }
        }
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
            ChooseAction(0)
            break

        case states.SECONDCHOICE:
            ChooseAction(1)
            break

        case states.ENEMYCHOICE:
            state = states.ATTACKS
            StartOfTurn()
            break

        case states.ATTACKS:
            actionQueue.forEach(action => {
                action.action.effect(action.target, action.performer)
            })
            RefreshUI()
            break

        case states.WIN:
            break

        case states.LOSE:
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
                performer: allyMonsters[id],
                action: action
            })
            switch(action.targetType){
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

function ChooseTarget(){
    textDiv.innerHTML = "<p>Sur quel cible ?</p>"
    actionsDiv.innerHTML = ""
    enemyMonsters.forEach(enemy => {
        const button = document.createElement('button')
        button.innerText = enemy.name
        button.addEventListener('click', ()=>{
            Object.assign(actionQueue[actionQueue.length - 1], {target: enemy})
            if (state === states.FIRSTCHOICE)
                state = states.SECONDCHOICE
            else
                state = states.ENEMYCHOICE
            StartOfTurn()
        })
        actionsDiv.appendChild(button)
    })
}



StartOfTurn()