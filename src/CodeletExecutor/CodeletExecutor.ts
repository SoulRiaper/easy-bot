import { Context } from "telegraf";
import { SystemStorage } from "../SystemStorage/SystemStorage";
import path from "path";


export class CodeletExecutor {
    private storage: SystemStorage;
    private codeletsDirectory: string;
    constructor(storage: SystemStorage, codeletsDirectory: string) {
        this.storage = storage;
        this.codeletsDirectory = codeletsDirectory;
    }

    async executeCodelets(context: Context, codeletIds: Array<string>, extra: any) {
        const codeletsToExecute = await this.storage.getCodeletsByIds(codeletIds);
        console.log(codeletsToExecute);
        for (const codelet of codeletsToExecute) {
            await this.executeCodelet(context, codelet, extra);
        }
    }

    async executeCodelet(context: Context ,codelet: ICodelet, extra: any) {
        const functionName = codelet.functionName ? codelet.functionName : 'codelet';
        const filePath = path.resolve(this.codeletsDirectory, codelet.filePath)
        try {
            await this.executeFunction(filePath , functionName, context, extra)
        } catch (e: any) {
            console.log(`Error on handling codelet: ${codelet.id}, on filepath: ${filePath};\nErrorMessage: ${e.message}`);
        }
    }

    async executeFunction(path: string, functionName: string, ...args: any[]) {
        const module = await import(path);
        const functionToRun = module[functionName];

        if (typeof functionToRun === 'function') {
            return functionToRun(...args);
        } else {
            throw new Error(`No such function "${functionName}" in module "${path}"`);
        }
    }

}