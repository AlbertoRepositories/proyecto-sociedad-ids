import { Logger } from "../logger/logger";
import { fileURLToPath } from "node:url";
import path from "node:path";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);


const rootdir = path.resolve(__dirname, "../../");
const getRootDir = () => rootdir;
Logger.info(`Root directory resolved: ${rootdir}`);

export const ROUTES = Object.freeze({
    Auth: {
        '/login': `${getRootDir()}/app/pages/auth/login.tsx`,
        '/register': `${getRootDir()}/app/pages/auth/register.tsx`,
        // Temporal, this url could be changed
        '/logout': `${getRootDir()}/app/pages/auth/logout.tsx`, 
    },
    Main: {
        '/': `${getRootDir()}/app/pages/main/landpage.tsx`,
        '/about': `${getRootDir()}/app/pages/main/about.tsx`,
        '/foro': `${getRootDir()}/app/pages/main/foro.tsx`,
        'blog': `${getRootDir()}/app/pages/main/blog.tsx`,
    }
})
