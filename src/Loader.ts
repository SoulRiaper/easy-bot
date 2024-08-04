import * as fs from 'fs';
import * as path from 'path';
import { IAction } from './CommonInterfaces/IAction';


export class Loader {
    private watchDir: string;

    constructor(watchDir: string) {
        this.watchDir = watchDir;
    }

    async loadJsonFilesRecursively(): Promise<{ action: IAction[], rule: IRule[], codelet: ICodelet[] }> {
        const directory = this.watchDir;
        type JsonObject = [IAction | IRule | ICodelet];
        const objectsByType: { action: IAction[], rule: IRule[], codelet: ICodelet[] } = { action: [], rule: [], codelet: [] };

        async function loadJsonFromDirectory(dirPath: string): Promise<void> {
            const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dirPath, entry.name);

                if (entry.isFile() && entry.name.endsWith('.json')) {
                    const rawData = await fs.promises.readFile(fullPath, 'utf-8');
                    let data: JsonObject = JSON.parse(rawData);
                    if (!Array.isArray(data)) {
                        data = [data];
                    }
                    for (const item of data) {
                        switch (item.type) {
                            case 'action':
                                objectsByType.action.push(item);
                                break;
                            case 'rule':
                                objectsByType.rule.push(item);
                                break;
                            case 'codelet':
                                objectsByType.codelet.push(item);
                                break;
                        }
                    }

                } else if (entry.isDirectory()) {
                    await loadJsonFromDirectory(fullPath);
                }
            }
        }

        await loadJsonFromDirectory(directory);
        return objectsByType;
    }
}