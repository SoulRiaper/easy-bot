import * as fs from 'fs';
import * as path from 'path';

interface JsonFile {
    path: string;
    content: unknown;
}

export class Loader {
    private ruleDir: string;
    private codeletDir: string;

    constructor(ruleDir: string, codeletDir: string) {
        this.ruleDir = ruleDir;
        this.codeletDir = codeletDir;
    }


    public readRules(): JsonFile[] {
        return this.loadJsonFilesFromDirectory(this.ruleDir);
    }

    private readJson(filePath: string): unknown {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent);
    }

    private loadJsonFilesFromDirectory(dir: string): JsonFile[] {
        let results: JsonFile[] = [];

        const list = fs.readdirSync(dir);
        list.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat && stat.isDirectory()) {
                results = results.concat(this.loadJsonFilesFromDirectory(filePath));
            } else if (path.extname(file) === '.json') {
                try {
                    const jsonData = this.readJson(filePath);
                    results.push({ path: filePath, content: jsonData });
                } catch (error) {
                    console.error(`Failed to parse JSON from file: ${filePath}`, error);
                }
            }
        });

        return results;
    }
}