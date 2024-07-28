import { ActionExecutor } from "../ActionExecutor/ActionExecutor";
import { SystemStorage } from "../SystemStorage/SystemStorage";
import { Context } from "telegraf";


export class RuleExecutor {
    private storage: SystemStorage;
    private commonRules: Array<IRule>
    private actionExecutor: ActionExecutor;

    constructor (storage: SystemStorage, actionExecutor: ActionExecutor) {
        this.storage = storage;
        this.actionExecutor = actionExecutor;
        this.commonRules = this.storage.getCommonRules();
    }

    executeRules (context: Context) {
        this.executeCommonRules(context);
    }

    private executeCommonRules (context: Context) {
        const actionIds = new Array<string>();
        this.commonRules.forEach(rule => {
            actionIds.push(...rule.actions);
        });
        this.actionExecutor.executeActions(context, actionIds);
    }
}