/*
 Copyright (c) Innovative Thinkrs LLC 2019. All Rights Reserved.
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
'use script'
var path = require('path');
const DB_URL = process.env.DB_URL;
const databank_paths = require('./classes/restapi-databank.json');
const messenger_paths = require('./classes/restapi-messenger.json');

module.exports =  {
  "localstorage": {
    "name": "localstorage",
    "connector": "loopback-component-storage",
    "provider": "filesystem",
    "root": path.join(__dirname, 'storage')
  },
  "datastore": {
      "host": "",
      "port": null,
      "url": DB_URL,
      "database": "",
      "useNewUrlParser":"true",
      "name": "datasource",
      "connector": "mongodb"
  },
  "localmessenger": {
    "name":"localmessenger",
    "baseURL":"http://" + process.env.MESSENGER_HOST + ":" + process.env.MESSENGER_PORT,
    "crud":false,
    "connector":"rest",
    "operations": databank_paths
  },
  "localdatabank": {
    "name":"localdatabank",
    "baseURL":"http://" + process.env.DATABANK_HOST + ":" + process.env.DATABANK_PORT,
    "crud":false,
    "connector":"rest",
    "operations": messenger_paths
  }
};