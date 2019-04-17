#!/usr/bin/env node
/*
 Copyright (c) Innovative Thinkrs LLC 2019. All Rights Reserved.
 This project is licensed under the MIT License, full text below.

Author: Jamil Spain  <jamilhassanspain@gmail.com> http://www.jamilspain.com

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
const machine       = require('lbmesh-os').profile();
const path  	    = require('path');
const chalk         = require('chalk');
const debug         = require('debug')('app:cli:postuninstall');
// const system        = require('./files');
// const fs            = require('fs');
const LOG           = console.log;
 

const sh            = require('shelljs');
// const writeFile     = require('write');


LOG();
LOG( chalk.blue("STARTING POST UNINSTALL TASKS: "))
LOG();


sh.rm('-rf', path.join(machine.homedir, '.lbmesh.io') );
