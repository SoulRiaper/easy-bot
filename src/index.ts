import Settings from "../settings.json"
import { Loader } from "./Loader"

const settings = Settings as ISettings
const loader = new Loader(settings.ruleDir, settings.codeletDir);
console.log(loader.readRules());