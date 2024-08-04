import { Redis } from "ioredis";
import Settings from "../settings.json"
import { Loader } from "./Loader"
import { SystemStorage } from "./SystemStorage/SystemStorage";
import { Telegraf } from "telegraf";
import { RuleExecutor } from "./RuleExecutor/RuleExecutor";
import { ActionExecutor } from "./ActionExecutor/ActionExecutor";


const settings = Settings as ISettings;
const loader = new Loader(settings.watchDir);
const systemDb = new Redis();
const mainStorage = new SystemStorage(systemDb);
Promise.resolve(loader.loadJsonFilesRecursively()).then(async (sysObjects) => {
    await mainStorage.storeActions(sysObjects.action);
    await mainStorage.storeRules(sysObjects.rule);
    const actionExecutor = new ActionExecutor(mainStorage);
    const ruleExecutor = new RuleExecutor(mainStorage, actionExecutor);
    const bot = new Telegraf(settings.token);
    bot.on('message', async (ctx) => {
        await ruleExecutor.executeRules(ctx);
    });
    
    bot.launch();
});