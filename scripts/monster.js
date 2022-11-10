class Monster{
    constructor(id, name, maxHp, atk, def, actions) {
        this.id = id
        this.name = name
        this.maxHp = maxHp
        this.currentHp = 10
        this.atk = atk
        this.def = def
        this.actions = actions
    }
}

const targetTypes = {
    OneEnemy: "OneEnemy",
    AllEnemies: "AllEnemies",
    Itself: "Itself"
}
const actionTypes = {
    SimpleAttack: "SimpleAttack",
    AreaAttack: "AreaAttack",
    Heal: "Heal",
}
class Action{

    constructor(name, target, actionType) {
        this.name = name
        this.target = target
        switch (actionType) {
            case actionTypes.SimpleAttack:
                this.actionType = this.SimpleAttack
                break
            case actionTypes.AreaAttack:
                this.actionType = this.AreaAttack
                break
            case actionTypes.Heal:
                this.actionType = this.Heal
                break
        }
    }

    SimpleAttack(userMonster, targetMonster) {
        targetMonster.currentHp -= (userMonster.atk - targetMonster.def < 1 ? 1 : userMonster.atk - targetMonster.def)
    }

    AreaAttack(userMonster, targetMonsters) {
        targetMonsters.forEach(monster => {
            let damage
            if ((userMonster.atk - monster.def) / 2 < 1)
                damage = 1
            else
                damage = Math.floor((userMonster.atk - monster.def) / 2)
            monster.currentHp -= damage
        })
    }

    Heal(userMonster) {
        if (userMonster.currentHp + (userMonster.maxHp/3) > userMonster.maxHp)
            userMonster.currentHp = userMonster.maxHp
        else
            userMonster.currentHp += Math.floor(userMonster.maxHp/3)
    }
}