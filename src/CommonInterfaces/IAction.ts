
interface IAction {
    id? : string;
    type : 'action';
    codelets? : Array<string>;
    mode?: ActionMode;
    text?: string;
    executeKeyboard? : Object;
    executeInlineKeyboard? : Object;
    attachment? : Array<File>;
}

enum ActionMode {
    EDIT = 'edit',
    REPLY = 'reply',
    NEW = 'new',
}