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

const Base      = require('./Base');
const chalk     = require('chalk');
const LOG       = console.log;
const ejs       = require('ejs');
const fs        = require('fs');
const path      = require('path');
const sh        = require('shelljs');
const table     = require('markdown-table');
const _         = require('underscore');

class Integ extends Base{
    constructor(){
        super();
    }

    retrievePorts(){
        let selected = {
            "table": "",
            "sourceData": {}
        };
        let myDBStack = [];
            myDBStack.push(['Integ','Admin Port','Data Port','Image']);
        let DBList = ['datapower','mqlight','iib','mq','rabbitmq','acemq'];
            // mq, acemqserver, iib
        this.portsList = this.readGlobalConfig();
        
        _.each( DBList, (data) =>{
            myDBStack.push([data.toUpperCase(),this.portsList.integStack[data].port.admin,this.portsList.integStack[data].port.data,this.portsList.integStack[data].image])
        });

        selected.table = table(myDBStack,{ start: '  |'});
        selected.sourceData = this.portsList.integStack;
           
        return selected;
         
    }

}

module.exports = Integ;
