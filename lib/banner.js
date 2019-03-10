#!/usr/bin/env node
/*
 Copyright (c) IBM Corp. 2013,2017. All Rights Reserved.
 This project is licensed under the MIT License, full text below.

Author: Jamil Spain, jamilhassanspain@gmail.com

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
'use strict';

const chalk = require('chalk');
const figlet = require('figlet');
const LOG = console.log;


exports.display = () => {
 
    LOG(figlet.textSync('        LB Mesh  ', {
        font: 'Standard',
    }));

};

exports.interactive = () => {
 
    LOG(figlet.textSync(' INTERACTIVE', {
        font: 'Standard',
    }));

};

exports.create = () => {
 
    LOG(figlet.textSync('       CREATE   ', {
        font: 'Standard',
    }));

};

exports.projects = () => {
 
    LOG(figlet.textSync('     PROJECTS   ', {
        font: 'Standard',
    }));

};

exports.runhelp = () => {
 
    LOG();
    LOG('--- RUN HELP ---');
    LOG();
};

exports.runtime = () => {
 
    LOG(figlet.textSync('      RUNTIME   ', {
        font: 'Standard',
    }));

};

exports.build = () => {
 
    LOG(figlet.textSync('          BUILD   ', {
        font: 'Standard',
    }));

};

 