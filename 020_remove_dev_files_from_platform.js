#!/usr/bin/env node

/**
 * Created by lizhi on 17/7/19.
 * After prepare, files are copied to the platforms/ios and platforms/android folders.
 * Lets clean up some of those files that arent needed with this hook when publish release.
 */

var fs = require('fs');
var path = require('path');

/**
 * 删除指定目录下除了排除在外的所有文件和文件夹
 * @param removePath {string}    需要删除的目录
 * @param excludePaths {Array} 需要排除的目录
 * @param excludeFiles {Array} 需要排除的文件
 */
var deleteFolderRecursive = function(removePath, excludePaths, excludeFiles) {

    // 如果传进来的不是list,通过转换成空list忽略处理
    excludePaths = Array.isArray(excludePaths) ? excludePaths : [];
    excludeFiles = Array.isArray(excludeFiles) ? excludeFiles : [];

    if( fs.existsSync(removePath) ) {
        fs.readdirSync(removePath).forEach(function(file, index){
            var curPath = path.join(removePath, file);
            // 如果是目录
            if(fs.lstatSync(curPath).isDirectory()) {
                // 如果不是排除在外的目录,递归调用,否则忽略
                excludePaths.indexOf(file) === -1 && deleteFolderRecursive(curPath, excludePaths, excludeFiles);
            } else {
                // 如果是文件,并且不是排除在外的文件,删除文件,否则忽略
                excludeFiles.indexOf(file) === -1 && fs.unlinkSync(curPath, excludePaths, excludeFiles);
            }
        });
        try {
            // 删除空目录
            fs.rmdirSync(removePath);
        } catch (err) {
            // 如果不是空目录会报错,暂时忽略
            //console.log(err);
        }

    }
};

var iosBaseDir = path.resolve(__dirname, "../../platforms/ios/www/");
var androidBaseDir = path.resolve(__dirname, "../../platforms/android/assets/www/");
var ionicSassDir = "/lib/ionic";
var fontAwesomeDir = "/lib/font-awesome";
var libDir = "/lib";
var devJSDir = "/scripts";
var devCSSDir = "/css";
// lib 下 ionic的文件目录
var iosIonicDir = iosBaseDir + ionicSassDir;
var androidIonicDir = androidBaseDir + ionicSassDir;
// lib 下 font-awesome的文件目录
var iosFontAwesomeDir = iosBaseDir + fontAwesomeDir;
var androidFontAwesomeDir = androidBaseDir + fontAwesomeDir;
// lib
var iosLibDir = iosBaseDir + libDir;
var androidLibDir = androidBaseDir + libDir;
// dev js
var iosDevJSDir = iosBaseDir + devJSDir;
var androidDevJSDir = androidBaseDir + devJSDir;
// dev css
var iosDevCSSDir = iosBaseDir + devCSSDir;
var androidDevCSSDir = androidBaseDir + devCSSDir;
// assets 报表文件目录
var iosAssetsDir = iosBaseDir + "/assets";
var androidAssetsDir = androidBaseDir + "/assets";

var cliCommand = process.env.CORDOVA_CMDLINE;
var isCompress = (cliCommand.indexOf('--compress') > -1);

if(isCompress) {
    deleteFolderRecursive(iosIonicDir, ["fonts"], ["ionic.min.css", "ionic.bundle.min.js"]);
    deleteFolderRecursive(androidIonicDir, ["fonts"], ["ionic.min.css", "ionic.bundle.min.js"]);
    deleteFolderRecursive(iosFontAwesomeDir, ["fonts"], ["font-awesome.min.css"]);
    deleteFolderRecursive(androidFontAwesomeDir, ["fonts"], ["font-awesome.min.css"]);
    deleteFolderRecursive(iosLibDir, ["ionic", "font-awesome"], []);
    deleteFolderRecursive(androidLibDir, ["ionic", "font-awesome"], []);
    deleteFolderRecursive(iosDevJSDir, [], ["app.join.js", "vendor.js"]);
    deleteFolderRecursive(androidDevJSDir, [], ["app.join.js", "vendor.js"]);
    deleteFolderRecursive(iosDevCSSDir, [], ["app.css"]);
    deleteFolderRecursive(androidDevCSSDir, [], ["app.css"]);
    deleteFolderRecursive(iosAssetsDir, [], []);
    deleteFolderRecursive(androidAssetsDir, [], []);
}
