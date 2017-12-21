/**
 * 判断是否为本地目录
 * @author from vue
 */

const path = require('path');

module.exports = {
    isLocalPath (templatePath) {
        return /^[./]|(^[a-zA-Z]:)/.test(templatePath);
    },

    getTemplatePath (templatePath) {
        return path.isAbsolute(templatePath)
            ? templatePath
            : path.normalize(path.join(process.cwd(), templatePath));
    }
}