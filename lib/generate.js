/**
 * @file 生成目录
 * @author donghualei
 */

const chalk = require('chalk');
const getOptions = require('./options');
const Metalsmith = require('metalsmith');
const handlebars = require('handlebars');
const async = require('async');
const match = require('minimatch');
const render = require('consolidate').handlebars.render;
const multimatch = require('multimatch');
const evaluate = require('./eval');
const path = require('path');
const ask = require('./ask');

/**
 * 生成模板
 *
 * @param {string} name
 */
module.exports = function generate(name, src, dest, done) {

    const opts = getOptions(name, src);

    const metalsmith = Metalsmith(path.join(src, 'template'));

    const data = Object.assign(metalsmith.metadata(), {
        destDirName: name,
        inPlace: dest === process.cwd(),
        noEscape: true
    });

    // 遍历目录下的所有文件，并经过一系列插件进行处理
    metalsmith
        .use(askQuestions(opts.prompts))
        // .use(filterFiles(opts.filters))
        .use(renderTemplateFiles(opts.skipInterpolation));


    metalsmith.clean(false).source('.').destination(dest).build((err, files) => {
        if (typeof opts.complete === 'function') {
            opts.complete(data, {chalk});
        }
        done(err);
    });
    return data;
};


function askQuestions (prompts) {
    return (files, metalsmith, done) => {
        ask(prompts, metalsmith.metadata(), done);
    }
}

function filterFiles (filters) {
    return (files, metalsmith, done) => {
        if (!filters) {
            return done();
        }
        const fileNames = Object.keys(files);
        Object.keys(filters).forEach(item => {
            fileNames.forEach(file => {
                if (match(file, item, {dot: true})) {
                    const condition = filters[item];
                    if (!evaluate(condition, metalsmith.metadata())) {
                        delete files[file];
                    }
                }
            });
        });
        done();
    };
}


function renderTemplateFiles (skipInterpolation) {
    skipInterpolation = typeof skipInterpolation === 'string'
        ? [skipInterpolation]
        : skipInterpolation;
    return (files, metalsmith, done) => {
        const keys = Object.keys(files);
        const metalsmithMetadata = metalsmith.metadata();

        async.each(keys, (file, next) => {
            if (skipInterpolation && multimatch([file], skipInterpolation, {dot: true}).length) {
                next();
            }
            const str = files[file].contents.toString();
            if (!/{{([^{}]+)}}/g.test(str)) {
                return next();
            }
            render(str, metalsmithMetadata, (err, res) => {
                if (err) {
                    err.message = `[${file} ${err.message}]`;
                    return next(err);
                }
                files[file].contents = new Buffer(res);
                next();
            })
        }, done);
    };
}

