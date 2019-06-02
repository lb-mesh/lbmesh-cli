/*
 Copyright (c) Innovative Thinkrs LLC. 2019. All Rights Reserved.
 This project is licensed under the MIT License, full text below.

 --------

 MIT license

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

'use strict'
const path      = require('path');
const machine   = require('lbmesh-os').profile();
const Base      = require(path.join(machine.node.globalPath,'lbmesh-cli','classes','base') );
const chalk     = require('chalk');
const LOG       = console.log;
const ejs       = require('ejs');
const fs        = require('fs');

const sh        = require('shelljs');
const table     = require('markdown-table');
const _         = require('underscore');


class Gui extends Base{
    constructor(){
        super();
    }

    isInstalled(){
        return this.machineInstall.gui.installed;
    }

    updateStatus(){
        this.machineInstall.gui.installed = true;
        this.writeGlobalConfigWithObject( this.machineInstall);
    }

};

module.exports = Gui;