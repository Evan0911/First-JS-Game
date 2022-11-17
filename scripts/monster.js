const statusType = {
    Alive: "Alive",
    Dead: "Dead",
    //autre status (ex : paralisie, etc)
}

class Monster{
    constructor(id, name, maxHp, atk, def, status, actions) {
        this.id = id
        this.name = name
        this.maxHp = maxHp
        this.currentHp = maxHp
        this.atk = atk
        this.def = def
        this.actions = actions
        this.status = status
    }

    LoseHp(damage) {
        if (this.currentHp - damage <= 0) {
            this.currentHp = 0
            this.status = statusType.Dead
        } else {
            this.currentHp -= damage
        }
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
        let damage
        if (userMonster.atk <= targetMonster.def)
            damage = 1
        else
            damage = userMonster.atk - targetMonster.def
        targetMonster.LoseHp(damage)
    }

    AreaAttack(userMonster, targetMonsters) {
        targetMonsters.forEach(monster => {
            if (monster.status != statusType.Dead) {
                let damage
                if ((userMonster.atk - monster.def) / 2 < 1)
                    damage = 1
                else
                    damage = Math.floor((userMonster.atk - monster.def) / 2)
                monster.LoseHp(damage)
            }
        })
    }

    Heal(userMonster) {
        if (userMonster.currentHp + (userMonster.maxHp/3) > userMonster.maxHp)
            userMonster.currentHp = userMonster.maxHp
        else
            userMonster.currentHp += Math.floor(userMonster.maxHp/3)
    }
}