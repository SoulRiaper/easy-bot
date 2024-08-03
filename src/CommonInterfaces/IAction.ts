
export interface IAction {
    id : string;
    type : 'action';
    codelets? : Array<string>;
    mode: ActionMode;
    text?: string;
    executeKeyboard? : Object;
    executeInlineKeyboard? : Object;
    attachment? : Array<string>;
}
export enum ActionMode {
    edit = 'edit',
    reply = 'reply',
    new = 'new',
}