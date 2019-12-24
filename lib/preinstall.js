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

const sh            = require('shelljs');
const LOG           = console.log;


/**
 * check for Docker
 * https://www.docker.com/products/docker-desktop/
 */
if( !sh.which('docker') ){
    LOG()
    LOG("   -  Docker is not installed, please visit the following URL below on install.")
    LOG("      https://www.docker.com/products/docker-desktop/");
    LOG();
    LOG();
    process.exitCode = 1;
  }


/**
 * check for Docker-Compose
 * https://docs.docker.com/compose/install/
 */
if( !sh.which('docker-compose') ){
    LOG()
    LOG("   -  Docker-Compose  not installed, please visit the following URL below on install.")
    LOG("      https://docs.docker.com/compose/install/");
    LOG();
    LOG();
    process.exitCode = 1;
  }