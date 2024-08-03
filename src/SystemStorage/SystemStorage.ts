import { Redis } from "ioredis";
import { ActionMode, IAction } from "../CommonInterfaces/IAction";


export class SystemStorage {
    private dbClient: Redis;

    constructor (dbClient: Redis) {
        this.dbClient = dbClient;
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

    // getCodeletsByIds (ids: Array<string>): Array<ICodelet> {

    // }

    // private getCodeletById (id: string): ICodelet {

    // }
}