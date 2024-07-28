import { Context } from "telegraf";
import { SystemStorage } from "../SystemStorage/SystemStorage";

export class ActionExecutor {
    private storage: SystemStorage;
    constructor (storage: SystemStorage) {
        this.storage = storage;
    }

    executeActions (context: Context, actionIds: Array<string>) {
        const actionsToExecute = this.storage.getActionsByIds(actionIds);
        actionsToExecute.forEach(action => {
            
        });
    }

    executeAction (context: Context, action: IAction) {
        if (action.text) {
            if (action.mode == ActionMode.NEW) {
                if (context.chat?.id) {
                    context.telegram.sendMessage(context.chat.id, action.text);
                } else {
                    throw Error('Bad context: message context must contain chat id');
                }
            } else if (action.mode == ActionMode.REPLY) {
                if (context.chat?.id) {
                    context.reply(action.text);
                } else {
                    throw Error('Bad context: message context must contain chat id');
                }
            }
        }
        if (action.codelets) {
            this.executeCodelets(context, action.codelets);
        }
    }

    executeCodelets (context: Context, codeletIds: Array<string>) {
        
    }

    executeCodelet (codeletId: string, extra: Object) {

    }
}