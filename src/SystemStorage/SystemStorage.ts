import { Redis } from "ioredis";
import { ActionMode, IAction } from "../CommonInterfaces/IAction";


export class SystemStorage {
    private dbClient: Redis;

    constructor (dbClient: Redis) {
        this.dbClient = dbClient;
    }

    async storeRules (ruleArr: Array<IRule>) {
        for(const rule of ruleArr) {
            await this.storeRule(rule);
        }
    }

    async storeRule (rule: IRule) {
        await this.dbClient.hset(rule.id, rule);
        await this.indexRule(rule);
    }

    async storeActions (actionsArr: Array<IAction>) {
        for(const action of actionsArr) {
            await this.storeAction(action);
        }
    }

    async storeAction (action: IAction) {
        await this.dbClient.hset(action.id, action);
        await this.indexAction(action);
    }
    
    async getCommonRules (): Promise<IRule[]> {
        const dataIds = await this.dbClient.smembers('rule:users:all');
        const res = new Array<IRule>();
        for (const dataId of dataIds) {
            const data = await this.dbClient.hgetall(dataId);

            if (Object.keys(data).length != 0) {
                res.push({
                    id: dataId,
                    type: 'rule',
                    actions: data.actions.split(','),
                    callbackFunction: data.callbackFunction,
                    inputRegExp: data.inputRegExp? new RegExp(data.inputRegExp) : undefined,
                    users : '*'
                })
            }
        }
        return res;
    }

    async getActionsByIds (ids: Array<string>): Promise<IAction[]> {
        const res = new Array();
        for (const id of ids) {
            const action = await this.getActionById(id);
            if (action) {
                res.push(action);
            }
        }
        return res
    }

    private async getActionById (id: string): Promise<IAction | null> {
        const data = await this.dbClient.hgetall(id);
        if (Object.keys(data).length != 0) {
            if (data.type != 'action') throw Error(`${id}: not action id`)
            else {
                return {
                    id: id,
                    type: "action",
                    codelets : data.codelets? data.codelets.split(','): undefined,
                    mode: ActionMode.new, 
                    text: data.text,
                    // executeKeyboard? : Object;
                    // executeInlineKeyboard? : Object;
                    attachment : data.attachment? data.attachment.split(','): undefined,
                }
            }
        }
        return null;
    }

    private async indexRule (rule: IRule) {
        if (rule.users == '*') {
            await this.dbClient.sadd('rule:users:all', rule.id);
        } else {
            await this.dbClient.srem('rule:users:all', rule.id);
        }

        if (rule.inputRegExp) {
            await this.dbClient.sadd('rule:inputRegExp', rule.id);
        } else {
            await this.dbClient.srem('rule:inputRegExp', rule.id);
        }

        if (rule.callbackFunction) {
            await this.dbClient.sadd('rule:callbackFunction', rule.id);
        } else {
            await this.dbClient.srem('rule:callbackFunction', rule.id);
        }

        await this.dbClient.sadd('rule:collection', rule.id);
    }

    private async indexAction (action: IAction) {
        await this.dbClient.sadd('rule:collection', action.id);
    }

    // getCodeletsByIds (ids: Array<string>): Array<ICodelet> {

    // }

    // private getCodeletById (id: string): ICodelet {

    // }
}