'use strict';


import "@babel/polyfill";
import 'nodelist-foreach-polyfill';
import elementClosest from 'element-closest';
elementClosest(window);
import "append";

import contacts from './contacts';

//start contacts
contacts.init();