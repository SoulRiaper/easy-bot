interface ICodelet {
    id: string;
    type: 'codelet';
    filePath: string;
    [x: string]: any;
}