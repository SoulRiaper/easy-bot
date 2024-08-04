import { Context } from "telegraf";
import { SystemStorage } from "../SystemStorage/SystemStorage";
import { ActionMode, IAction } from "../CommonInterfaces/IAction";
import { CodeletExecutor } from "../CodeletExecutor/CodeletExecutor";

export class ActionExecutor {
    private storage: SystemStorage;
    private codeletExecutor: CodeletExecutor;
    constructor (storage: SystemStorage, codeletExecutor: CodeletExecutor) {
        this.storage = storage;
        this.codeletExecutor = codeletExecutor;
    }

    async executeActions (context: Context, actionIds: Array<string>) {
        const actionsToExecute = await this.storage.getActionsByIds(actionIds);
        for (const action of actionsToExecute) {
            await this.executeAction(context, action);
        }
    }

    async executeAction (context: Context, action: IAction) {
        if (action.text) {
            if (!action.mode) throw new Error(`${action.id} action bad mode`);
            if (action.mode == ActionMode.new) {
                if (context.chat?.id) {
                    await context.telegram.sendMessage(context.chat.id, action.text);
                } else {
                    throw Error('Bad context: message context must contain chat id');
                }
            } else if (action.mode == ActionMode.reply) {
                if (context.chat?.id) {
                    const messageId = context.message?.message_id;
                    if (messageId) {
                        await context.reply(action.text, {reply_parameters: {
                            chat_id: context.chat.id, message_id: messageId
                        }});
                    } else {
                        await context.reply(action.text);
                    }
                } else {
                    throw Error('Bad context: message context must contain chat id');
                }
            }
        }
        if (action.codelets) {
            await this.codeletExecutor.executeCodelets(context, action.codelets, undefined);
        }
    }
}