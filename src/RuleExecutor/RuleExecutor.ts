import { ActionExecutor } from "../ActionExecutor/ActionExecutor";
import { SystemStorage } from "../SystemStorage/SystemStorage";
import { Context } from "telegraf";


export class RuleExecutor {
    private storage: SystemStorage;
    private actionExecutor: ActionExecutor;

    constructor (storage: SystemStorage, actionExecutor: ActionExecutor) {
        this.storage = storage;
        this.actionExecutor = actionExecutor;
    }

    async executeRules (context: Context) {
        await this.executeCommonRules(context);
    }

    private async executeCommonRules (context: Context) {
        const commonRules = await this.storage.getCommonRules() 
        const actionIds = new Array<string>();
        commonRules.forEach(rule => {
            if (rule.actions){
                actionIds.push(...rule.actions);
            }
        });
        console.log(actionIds);
        this.actionExecutor.executeActions(context, actionIds);
    }
}