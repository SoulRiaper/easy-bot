
interface IRule {
    id? : string;
    type: 'rule';
    callbackFunction?: string;
    inputRegExp?: RegExp;
    users? : Array<string> | string;
    actions : Array<string>;
}