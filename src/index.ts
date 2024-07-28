import Settings from "../settings.json"
import { Loader } from "./Loader"


const settings = Settings as ISettings
const loader = new Loader(settings.watchDir);
Promise.resolve(loader.loadJsonFilesRecursively()).then(res => {
    console.log(JSON.stringify(res, null, 2));
});