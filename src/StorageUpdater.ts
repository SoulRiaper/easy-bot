import { Redis } from "ioredis";
import { IAction } from "./CommonInterfaces/IAction";


export class StorageUpdater {
    private dbClient: Redis

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

    async indexRule (rule: IRule) {
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

    async storeActions (actionsArr: Array<IAction>) {
        for(const action of actionsArr) {
            await this.storeAction(action);
        }
    }

    async storeAction (action: IAction) {
        await this.dbClient.hset(action.id, action);
        await this.indexAction(action);
    }

    async indexAction (action: IAction) {
        await this.dbClient.sadd('rule:collection', action.id);
    }
}