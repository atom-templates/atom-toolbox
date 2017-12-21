/**
 * @file 获取options
 * @author
 */

const path = require('path');
const exists = require('fs').existsSync;
const metadata = require('read-metadata');
const validateName = require('validate-npm-package-name');
const getGitUser = require('./git-user');

module.exports = function options (name, dir) {
    const opts = getMetadata(dir);

    // 设置项目名称的默认值
    setDefault(opts, 'name', name);

    setValidateName(opts);

    const author = getGitUser();

    if (author) {
        setDefault(opts, 'author', author);
    }
    return opts;
};


/**
 * 获取metadata从meta.json或者meta.js文件
 *
 * @param {string} dir 目录
 */
function getMetadata (dir) {
    if (exists(path.join(dir, 'meta.json'))) {
        return metadata.sync(json);
    }
    else if (exists(path.join(dir, 'meta.js'))) {
        const req = require(path.resolve(path.join(dir, 'meta.js')));
        if (req !== Object(req)) {
            throw new Error('meta.js需要返回一个对象');
        }
        return req;
    }
}

/**
 * 设置默认值
 *
 * @param {Object} opts
 */
function setDefault(opts, key, val) {

    const prompts = opts.prompts || (opts.prompts = {});
    if (!prompts[key] || typeof prompts[key] !== 'object') {
        prompts[key] = {
            'type': 'string',
            'default': val
        }
    }
    else {
        prompts[key]['default'] = val;
    }
}

function setValidateName (opts) {
    const name = opts.prompts.name;

    const customValidate = name.validate;
    name.validate = name => {
        const its = validateName(name);
        if (!its.validForNewPackages) {
            const errors = (its.errors || []).concat(its.warnings || []);
            return 'Sorry, ' + errors.join(' and ') + '.';
        }
        if (typeof customValidate === 'function') {
            return customValidate(name);
        }
        return true;
    }
}
