export class SystemStorage {
    private rules: {[key: string]: IRule} = {};
    private actons: {[key: string]: IAction} = {};
    private codelets: {[key: string]: ICodelet} = {};


    constructor (rules: Array<IRule>, actions: Array<IAction>, codelets: Array<ICodelet>) {
        rules.forEach(rule => {
            if (rule.id) {
                this.rules[rule.id] = rule;
            }
        })

        actions.forEach(action => {
            if (action.id) {
                this.actons[action.id] = action;
            }
        });

        codelets.forEach(codelet => {
            if (codelet.id) {
                this.codelets[codelet.id] = codelet;
            }
        });
    }

    storeRules (rules: Array<IRule>) {
        rules.forEach(rule => {
            if (rule.id) {
                this.rules[rule.id] = rule;
            }
        });
    }

    getCommonRules () {
        return Object.values(this.rules).filter( rule => {
            return rule.users == "*" && !rule.inputRegExp;
        })
    }

    getActionsByIds (ids: Array<string>): Array<IAction> {
        return ids.map(id => {
            return this.getActionById(id);
        })
    }

    private getActionById (id: string): IAction {
        return this.actons[id];
    }

    getCodeletsByIds (ids: Array<string>): Array<ICodelet> {
        return ids.map(id => {
            return this.getCodeletById(id);
        })
    }

    private getCodeletById (id: string): ICodelet {
        return this.codelets[id];
    }
}