!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=93)}([function(t,e,n){var r=n(11),o="object"==typeof self&&self&&self.Object===Object&&self,i=r||o||Function("return this")();t.exports=i},function(t,e){t.exports=function(t){return null!=t&&"object"==typeof t}},function(t,e,n){var r=n(7)(Object,"create");t.exports=r},function(t,e,n){var r=n(63);t.exports=function(t,e){for(var n=t.length;n--;)if(r(t[n][0],e))return n;return-1}},function(t,e,n){var r=n(69);t.exports=function(t,e){var n=t.__data__;return r(e)?n["string"==typeof e?"string":"hash"]:n.map}},function(t,e){t.exports=function(t,e){for(var n=-1,r=null==t?0:t.length,o=Array(r);++n<r;)o[n]=e(t[n],n,t);return o}},function(t,e,n){var r=n(10),o=n(33),i=n(34),a="[object Null]",s="[object Undefined]",c=r?r.toStringTag:void 0;t.exports=function(t){return null==t?void 0===t?s:a:c&&c in Object(t)?o(t):i(t)}},function(t,e,n){var r=n(51),o=n(55);t.exports=function(t,e){var n=o(t,e);return r(n)?n:void 0}},function(t,e,n){"use strict";(function(t){function r(t,e){let n=t.map_stats[e.map];return n||(n=t.map_stats["All Maps"]),n.map(t=>t.roles.sort())}function o(e,n,r){const o={};let i=100,a=0;for(const t in e.heroes){const n=e.heroes[t];i=Math.min(i,n.win_percent),a=Math.max(a,n.win_percent)}const s=a-i,{icyVeins:c,tenTon:u}=e.tiers;for(const a of Object.keys(e.heroes)){const f=e.heroes[a];let l=0;l=c[f.icy_veins_tier]*r.icyVeinsTiers+u[f.ten_ton_tier]*r.tenTonTiers,l+=(f.win_percent-i)/s*100*r.winPercent,f.maps.strong.includes(n.map)?l+=50*r.strongMaps:f.maps.weak.includes(n.map)&&(l-=50*r.weakMaps),Number.isNaN(l)&&(console.log(`NaN precalculated for ${a}`),console.log(`Icy Veins tier: ${c[f.icy_veins_tier]}`),console.log(`Ten Ton tier: ${u[f.ten_ton_tier]}`),console.log(`Win Percent: ${f.win_percent}`),console.log(f),t.exit(1)),o[a]={preCalculated:l,role:f.role,subrole:f.subrole,synergies:f.synergies,countered_by:f.countered_by}}return o}n.d(e,"a",function(){return r}),n.d(e,"b",function(){return o})}).call(this,n(92))},function(t,e,n){var r=n(23);t.exports=function(t){var e=t.length;return e?t[r(0,e-1)]:void 0}},function(t,e,n){var r=n(0).Symbol;t.exports=r},function(t,e,n){(function(e){var n="object"==typeof e&&e&&e.Object===Object&&e;t.exports=n}).call(this,n(32))},function(t,e){var n=Array.isArray;t.exports=n},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t}},function(t,e){var n=9007199254740991;t.exports=function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=n}},function(t,e){t.exports=function(t){return function(e){return t(e)}}},function(t,e,n){var r=n(17),o=n(14);t.exports=function(t){return null!=t&&o(t.length)&&!r(t)}},function(t,e,n){var r=n(6),o=n(18),i="[object AsyncFunction]",a="[object Function]",s="[object GeneratorFunction]",c="[object Proxy]";t.exports=function(t){if(!o(t))return!1;var e=r(t);return e==a||e==s||e==i||e==c}},function(t,e){t.exports=function(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}},function(t,e){t.exports=function(t){return t}},function(module,exports,__webpack_require__){var Genetic=Genetic||function(){"use strict";var Serialization={stringify:function(t){return JSON.stringify(t,function(t,e){return e instanceof Function||"function"==typeof e?"__func__:"+e.toString():e instanceof RegExp?"__regex__:"+e:e})},parse:function(str){return JSON.parse(str,function(key,value){return"string"!=typeof value?value:0===value.lastIndexOf("__func__:",0)?eval("("+value.slice(9)+")"):0===value.lastIndexOf("__regex__:",0)?eval("("+value.slice(10)+")"):value})}},Clone=function(t){return null==t||"object"!=typeof t?t:JSON.parse(JSON.stringify(t))},Optimize={Maximize:function(t,e){return t>=e},Minimize:function(t,e){return t<e}},Select1={Tournament2:function(t){var e=t.length,n=t[Math.floor(Math.random()*e)],r=t[Math.floor(Math.random()*e)];return this.optimize(n.fitness,r.fitness)?n.entity:r.entity},Tournament3:function(t){var e=t.length,n=t[Math.floor(Math.random()*e)],r=t[Math.floor(Math.random()*e)],o=t[Math.floor(Math.random()*e)],i=this.optimize(n.fitness,r.fitness)?n:r;return(i=this.optimize(i.fitness,o.fitness)?i:o).entity},Fittest:function(t){return t[0].entity},Random:function(t){return t[Math.floor(Math.random()*t.length)].entity},RandomLinearRank:function(t){return this.internalGenState.rlr=this.internalGenState.rlr||0,t[Math.floor(Math.random()*Math.min(t.length,this.internalGenState.rlr++))].entity},Sequential:function(t){return this.internalGenState.seq=this.internalGenState.seq||0,t[this.internalGenState.seq++%t.length].entity}},Select2={Tournament2:function(t){return[Select1.Tournament2.call(this,t),Select1.Tournament2.call(this,t)]},Tournament3:function(t){return[Select1.Tournament3.call(this,t),Select1.Tournament3.call(this,t)]},Random:function(t){return[Select1.Random.call(this,t),Select1.Random.call(this,t)]},RandomLinearRank:function(t){return[Select1.RandomLinearRank.call(this,t),Select1.RandomLinearRank.call(this,t)]},Sequential:function(t){return[Select1.Sequential.call(this,t),Select1.Sequential.call(this,t)]},FittestRandom:function(t){return[Select1.Fittest.call(this,t),Select1.Random.call(this,t)]}};function Genetic(){this.fitness=null,this.seed=null,this.mutate=null,this.crossover=null,this.select1=null,this.select2=null,this.optimize=null,this.generation=null,this.notification=null,this.configuration={size:250,crossover:.9,mutation:.2,iterations:100,fittestAlwaysSurvives:!0,maxResults:100,webWorkers:!0,skip:0},this.userData={},this.internalGenState={},this.entities=[],this.usingWebWorker=!1,this.start=function(){var t;for(t=0;t<this.configuration.size;++t)this.entities.push(this.seed());this.loop(0)},this.loop=function(t){var e=this;function n(t){return Math.random()<=e.configuration.mutation&&e.mutate?e.mutate(t):t}this.internalGenState={};var r=this.entities.map(function(t){return{fitness:e.fitness(t),entity:t}}).sort(function(t,n){return e.optimize(t.fitness,n.fitness)?-1:1}),o=r.reduce(function(t,e){return t+e.fitness},0)/r.length,i=Math.sqrt(r.map(function(t){return(t.fitness-o)*(t.fitness-o)}).reduce(function(t,e){return t+e},0)/r.length),a={maximum:r[0].fitness,minimum:r[r.length-1].fitness,mean:o,stdev:i},s=!this.generation||this.generation(r.slice(0,this.configuration.maxResults),t,a),c=void 0!==s&&!s||t==this.configuration.iterations-1;if(this.notification&&(c||0==this.configuration.skip||t%this.configuration.skip==0)&&this.sendNotification(r.slice(0,this.configuration.maxResults),t,a,c),!c){var u=[];for(this.configuration.fittestAlwaysSurvives&&u.push(r[0].entity);u.length<e.configuration.size;)if(this.crossover&&Math.random()<=this.configuration.crossover&&u.length+1<e.configuration.size){var f=this.select2(r),l=this.crossover(f[0],f[1]).map(n);u.push(l[0],l[1])}else u.push(n(e.select1(r)));this.entities=u,setTimeout(function(){e.loop(t+1)},1)}},this.sendNotification=function(t,e,n,r){if(this.usingWebWorker){var o={pop:t.map(Serialization.stringify),generation:e,stats:n,isFinished:r};postMessage(o)}else this.notification(t,e,n,r)}}return Genetic.prototype.evolve=function(t,e){var n;for(n in t)this.configuration[n]=t[n];for(n in e)this.userData[n]=e[n];function r(t){return t.replace(/[\\"']/g,"\\$&").replace(/\u0000/g,"\\0")}this.usingWebWorker=this.configuration.webWorkers&&"undefined"!=typeof Blob&&"undefined"!=typeof Worker&&void 0!==window.URL&&void 0!==window.URL.createObjectURL;var o=this;if(this.usingWebWorker){var i="'use strict'\n";i+="var Serialization = {'stringify': "+Serialization.stringify.toString()+", 'parse': "+Serialization.parse.toString()+"};\n",i+="var Clone = "+Clone.toString()+";\n",i+='var Optimize = Serialization.parse("'+r(Serialization.stringify(Optimize))+'");\n',i+='var Select1 = Serialization.parse("'+r(Serialization.stringify(Select1))+'");\n',i+='var Select2 = Serialization.parse("'+r(Serialization.stringify(Select2))+'");\n',i+='var genetic = Serialization.parse("'+r(Serialization.stringify(this))+'");\n',i+="onmessage = function(e) { genetic.start(); }\n";var a=new Blob([i]),s=new Worker(window.URL.createObjectURL(a));s.onmessage=function(t){var e=t.data;o.notification(e.pop.map(Serialization.parse),e.generation,e.stats,e.isFinished)},s.onerror=function(t){alert("ERROR: Line "+t.lineno+" in "+t.filename+": "+t.message)},s.postMessage("")}else o.start()},{create:function(){return new Genetic},Select1:Select1,Select2:Select2,Optimize:Optimize,Clone:Clone}}();module.exports=Genetic},function(t,e,n){var r=n(9),o=n(24),i=n(12);t.exports=function(t){return(i(t)?r:o)(t)}},function(t,e,n){var r=n(5),o=n(45),i=n(82),a=n(90),s=i(function(t){var e=r(t,a);return e.length&&e[0]===t[0]?o(e):[]});t.exports=s},function(t,e){var n=Math.floor,r=Math.random;t.exports=function(t,e){return t+n(r()*(e-t+1))}},function(t,e,n){var r=n(9),o=n(25);t.exports=function(t){return r(o(t))}},function(t,e,n){var r=n(26),o=n(27);t.exports=function(t){return null==t?[]:r(t,o(t))}},function(t,e,n){var r=n(5);t.exports=function(t,e){return r(e,function(e){return t[e]})}},function(t,e,n){var r=n(28),o=n(41),i=n(16);t.exports=function(t){return i(t)?r(t):o(t)}},function(t,e,n){var r=n(29),o=n(30),i=n(12),a=n(35),s=n(37),c=n(38),u=Object.prototype.hasOwnProperty;t.exports=function(t,e){var n=i(t),f=!n&&o(t),l=!n&&!f&&a(t),p=!n&&!f&&!l&&c(t),h=n||f||l||p,v=h?r(t.length,String):[],d=v.length;for(var y in t)!e&&!u.call(t,y)||h&&("length"==y||l&&("offset"==y||"parent"==y)||p&&("buffer"==y||"byteLength"==y||"byteOffset"==y)||s(y,d))||v.push(y);return v}},function(t,e){t.exports=function(t,e){for(var n=-1,r=Array(t);++n<t;)r[n]=e(n);return r}},function(t,e,n){var r=n(31),o=n(1),i=Object.prototype,a=i.hasOwnProperty,s=i.propertyIsEnumerable,c=r(function(){return arguments}())?r:function(t){return o(t)&&a.call(t,"callee")&&!s.call(t,"callee")};t.exports=c},function(t,e,n){var r=n(6),o=n(1),i="[object Arguments]";t.exports=function(t){return o(t)&&r(t)==i}},function(t,e){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(t){"object"==typeof window&&(n=window)}t.exports=n},function(t,e,n){var r=n(10),o=Object.prototype,i=o.hasOwnProperty,a=o.toString,s=r?r.toStringTag:void 0;t.exports=function(t){var e=i.call(t,s),n=t[s];try{t[s]=void 0;var r=!0}catch(t){}var o=a.call(t);return r&&(e?t[s]=n:delete t[s]),o}},function(t,e){var n=Object.prototype.toString;t.exports=function(t){return n.call(t)}},function(t,e,n){(function(t){var r=n(0),o=n(36),i=e&&!e.nodeType&&e,a=i&&"object"==typeof t&&t&&!t.nodeType&&t,s=a&&a.exports===i?r.Buffer:void 0,c=(s?s.isBuffer:void 0)||o;t.exports=c}).call(this,n(13)(t))},function(t,e){t.exports=function(){return!1}},function(t,e){var n=9007199254740991,r=/^(?:0|[1-9]\d*)$/;t.exports=function(t,e){var o=typeof t;return!!(e=null==e?n:e)&&("number"==o||"symbol"!=o&&r.test(t))&&t>-1&&t%1==0&&t<e}},function(t,e,n){var r=n(39),o=n(15),i=n(40),a=i&&i.isTypedArray,s=a?o(a):r;t.exports=s},function(t,e,n){var r=n(6),o=n(14),i=n(1),a={};a["[object Float32Array]"]=a["[object Float64Array]"]=a["[object Int8Array]"]=a["[object Int16Array]"]=a["[object Int32Array]"]=a["[object Uint8Array]"]=a["[object Uint8ClampedArray]"]=a["[object Uint16Array]"]=a["[object Uint32Array]"]=!0,a["[object Arguments]"]=a["[object Array]"]=a["[object ArrayBuffer]"]=a["[object Boolean]"]=a["[object DataView]"]=a["[object Date]"]=a["[object Error]"]=a["[object Function]"]=a["[object Map]"]=a["[object Number]"]=a["[object Object]"]=a["[object RegExp]"]=a["[object Set]"]=a["[object String]"]=a["[object WeakMap]"]=!1,t.exports=function(t){return i(t)&&o(t.length)&&!!a[r(t)]}},function(t,e,n){(function(t){var r=n(11),o=e&&!e.nodeType&&e,i=o&&"object"==typeof t&&t&&!t.nodeType&&t,a=i&&i.exports===o&&r.process,s=function(){try{var t=i&&i.require&&i.require("util").types;return t||a&&a.binding&&a.binding("util")}catch(t){}}();t.exports=s}).call(this,n(13)(t))},function(t,e,n){var r=n(42),o=n(43),i=Object.prototype.hasOwnProperty;t.exports=function(t){if(!r(t))return o(t);var e=[];for(var n in Object(t))i.call(t,n)&&"constructor"!=n&&e.push(n);return e}},function(t,e){var n=Object.prototype;t.exports=function(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||n)}},function(t,e,n){var r=n(44)(Object.keys,Object);t.exports=r},function(t,e){t.exports=function(t,e){return function(n){return t(e(n))}}},function(t,e,n){var r=n(46),o=n(75),i=n(80),a=n(5),s=n(15),c=n(81),u=Math.min;t.exports=function(t,e,n){for(var f=n?i:o,l=t[0].length,p=t.length,h=p,v=Array(p),d=1/0,y=[];h--;){var m=t[h];h&&e&&(m=a(m,s(e))),d=u(m.length,d),v[h]=!n&&(e||l>=120&&m.length>=120)?new r(h&&m):void 0}m=t[0];var g=-1,b=v[0];t:for(;++g<l&&y.length<d;){var _=m[g],x=e?e(_):_;if(_=n||0!==_?_:0,!(b?c(b,x):f(y,x,n))){for(h=p;--h;){var S=v[h];if(!(S?c(S,x):f(t[h],x,n)))continue t}b&&b.push(x),y.push(_)}}return y}},function(t,e,n){var r=n(47),o=n(73),i=n(74);function a(t){var e=-1,n=null==t?0:t.length;for(this.__data__=new r;++e<n;)this.add(t[e])}a.prototype.add=a.prototype.push=o,a.prototype.has=i,t.exports=a},function(t,e,n){var r=n(48),o=n(68),i=n(70),a=n(71),s=n(72);function c(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}c.prototype.clear=r,c.prototype.delete=o,c.prototype.get=i,c.prototype.has=a,c.prototype.set=s,t.exports=c},function(t,e,n){var r=n(49),o=n(60),i=n(67);t.exports=function(){this.size=0,this.__data__={hash:new r,map:new(i||o),string:new r}}},function(t,e,n){var r=n(50),o=n(56),i=n(57),a=n(58),s=n(59);function c(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}c.prototype.clear=r,c.prototype.delete=o,c.prototype.get=i,c.prototype.has=a,c.prototype.set=s,t.exports=c},function(t,e,n){var r=n(2);t.exports=function(){this.__data__=r?r(null):{},this.size=0}},function(t,e,n){var r=n(17),o=n(52),i=n(18),a=n(54),s=/^\[object .+?Constructor\]$/,c=Function.prototype,u=Object.prototype,f=c.toString,l=u.hasOwnProperty,p=RegExp("^"+f.call(l).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");t.exports=function(t){return!(!i(t)||o(t))&&(r(t)?p:s).test(a(t))}},function(t,e,n){var r,o=n(53),i=(r=/[^.]+$/.exec(o&&o.keys&&o.keys.IE_PROTO||""))?"Symbol(src)_1."+r:"";t.exports=function(t){return!!i&&i in t}},function(t,e,n){var r=n(0)["__core-js_shared__"];t.exports=r},function(t,e){var n=Function.prototype.toString;t.exports=function(t){if(null!=t){try{return n.call(t)}catch(t){}try{return t+""}catch(t){}}return""}},function(t,e){t.exports=function(t,e){return null==t?void 0:t[e]}},function(t,e){t.exports=function(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e}},function(t,e,n){var r=n(2),o="__lodash_hash_undefined__",i=Object.prototype.hasOwnProperty;t.exports=function(t){var e=this.__data__;if(r){var n=e[t];return n===o?void 0:n}return i.call(e,t)?e[t]:void 0}},function(t,e,n){var r=n(2),o=Object.prototype.hasOwnProperty;t.exports=function(t){var e=this.__data__;return r?void 0!==e[t]:o.call(e,t)}},function(t,e,n){var r=n(2),o="__lodash_hash_undefined__";t.exports=function(t,e){var n=this.__data__;return this.size+=this.has(t)?0:1,n[t]=r&&void 0===e?o:e,this}},function(t,e,n){var r=n(61),o=n(62),i=n(64),a=n(65),s=n(66);function c(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}c.prototype.clear=r,c.prototype.delete=o,c.prototype.get=i,c.prototype.has=a,c.prototype.set=s,t.exports=c},function(t,e){t.exports=function(){this.__data__=[],this.size=0}},function(t,e,n){var r=n(3),o=Array.prototype.splice;t.exports=function(t){var e=this.__data__,n=r(e,t);return!(n<0||(n==e.length-1?e.pop():o.call(e,n,1),--this.size,0))}},function(t,e){t.exports=function(t,e){return t===e||t!=t&&e!=e}},function(t,e,n){var r=n(3);t.exports=function(t){var e=this.__data__,n=r(e,t);return n<0?void 0:e[n][1]}},function(t,e,n){var r=n(3);t.exports=function(t){return r(this.__data__,t)>-1}},function(t,e,n){var r=n(3);t.exports=function(t,e){var n=this.__data__,o=r(n,t);return o<0?(++this.size,n.push([t,e])):n[o][1]=e,this}},function(t,e,n){var r=n(7)(n(0),"Map");t.exports=r},function(t,e,n){var r=n(4);t.exports=function(t){var e=r(this,t).delete(t);return this.size-=e?1:0,e}},function(t,e){t.exports=function(t){var e=typeof t;return"string"==e||"number"==e||"symbol"==e||"boolean"==e?"__proto__"!==t:null===t}},function(t,e,n){var r=n(4);t.exports=function(t){return r(this,t).get(t)}},function(t,e,n){var r=n(4);t.exports=function(t){return r(this,t).has(t)}},function(t,e,n){var r=n(4);t.exports=function(t,e){var n=r(this,t),o=n.size;return n.set(t,e),this.size+=n.size==o?0:1,this}},function(t,e){var n="__lodash_hash_undefined__";t.exports=function(t){return this.__data__.set(t,n),this}},function(t,e){t.exports=function(t){return this.__data__.has(t)}},function(t,e,n){var r=n(76);t.exports=function(t,e){return!(null==t||!t.length)&&r(t,e,0)>-1}},function(t,e,n){var r=n(77),o=n(78),i=n(79);t.exports=function(t,e,n){return e==e?i(t,e,n):r(t,o,n)}},function(t,e){t.exports=function(t,e,n,r){for(var o=t.length,i=n+(r?1:-1);r?i--:++i<o;)if(e(t[i],i,t))return i;return-1}},function(t,e){t.exports=function(t){return t!=t}},function(t,e){t.exports=function(t,e,n){for(var r=n-1,o=t.length;++r<o;)if(t[r]===e)return r;return-1}},function(t,e){t.exports=function(t,e,n){for(var r=-1,o=null==t?0:t.length;++r<o;)if(n(e,t[r]))return!0;return!1}},function(t,e){t.exports=function(t,e){return t.has(e)}},function(t,e,n){var r=n(19),o=n(83),i=n(85);t.exports=function(t,e){return i(o(t,e,r),t+"")}},function(t,e,n){var r=n(84),o=Math.max;t.exports=function(t,e,n){return e=o(void 0===e?t.length-1:e,0),function(){for(var i=arguments,a=-1,s=o(i.length-e,0),c=Array(s);++a<s;)c[a]=i[e+a];a=-1;for(var u=Array(e+1);++a<e;)u[a]=i[a];return u[e]=n(c),r(t,this,u)}}},function(t,e){t.exports=function(t,e,n){switch(n.length){case 0:return t.call(e);case 1:return t.call(e,n[0]);case 2:return t.call(e,n[0],n[1]);case 3:return t.call(e,n[0],n[1],n[2])}return t.apply(e,n)}},function(t,e,n){var r=n(86),o=n(89)(r);t.exports=o},function(t,e,n){var r=n(87),o=n(88),i=n(19),a=o?function(t,e){return o(t,"toString",{configurable:!0,enumerable:!1,value:r(e),writable:!0})}:i;t.exports=a},function(t,e){t.exports=function(t){return function(){return t}}},function(t,e,n){var r=n(7),o=function(){try{var t=r(Object,"defineProperty");return t({},"",{}),t}catch(t){}}();t.exports=o},function(t,e){var n=800,r=16,o=Date.now;t.exports=function(t){var e=0,i=0;return function(){var a=o(),s=r-(a-i);if(i=a,s>0){if(++e>=n)return arguments[0]}else e=0;return t.apply(void 0,arguments)}}},function(t,e,n){var r=n(91);t.exports=function(t){return r(t)?t:[]}},function(t,e,n){var r=n(16),o=n(1);t.exports=function(t){return o(t)&&r(t)}},function(t,e){var n,r,o=t.exports={};function i(){throw new Error("setTimeout has not been defined")}function a(){throw new Error("clearTimeout has not been defined")}function s(t){if(n===setTimeout)return setTimeout(t,0);if((n===i||!n)&&setTimeout)return n=setTimeout,setTimeout(t,0);try{return n(t,0)}catch(e){try{return n.call(null,t,0)}catch(e){return n.call(this,t,0)}}}!function(){try{n="function"==typeof setTimeout?setTimeout:i}catch(t){n=i}try{r="function"==typeof clearTimeout?clearTimeout:a}catch(t){r=a}}();var c,u=[],f=!1,l=-1;function p(){f&&c&&(f=!1,c.length?u=c.concat(u):l=-1,u.length&&h())}function h(){if(!f){var t=s(p);f=!0;for(var e=u.length;e;){for(c=u,u=[];++l<e;)c&&c[l].run();l=-1,e=u.length}c=null,f=!1,function(t){if(r===clearTimeout)return clearTimeout(t);if((r===a||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(t);try{r(t)}catch(e){try{return r.call(null,t)}catch(e){return r.call(this,t)}}}(t)}}function v(t,e){this.fun=t,this.array=e}function d(){}o.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];u.push(new v(t,e)),1!==u.length||f||s(h)},v.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=d,o.addListener=d,o.once=d,o.off=d,o.removeListener=d,o.removeAllListeners=d,o.emit=d,o.prependListener=d,o.prependOnceListener=d,o.listeners=function(t){return[]},o.binding=function(t){throw new Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(t){throw new Error("process.chdir is not supported")},o.umask=function(){return 0}},function(t,e,n){"use strict";n.r(e);var r=n(20),o=n.n(r),i=n(21),a=n.n(i),s=n(22),c=n.n(s);var u=n(8);class f{constructor(t,e,n,r){const{heroPool:o,ratios:i}=r,s=n.create();s.optimize=n.Optimize.Maximize,s.select1=n.Select1.Tournament2,s.select2=n.Select2.Tournament2,s.draftInfo=e,s.data=Object(u.b)(t,e,i),s.TEAM_SIZE=5,s.acceptableCompositions=Object(u.a)(t,e);const f=e.unavailable.concat(e.blueTeam,e.redTeam);s.heroes=[];for(const e in t.heroes)f.includes(e)||s.heroes.push(e);s.seed=()=>{if(s.draftInfo.blueTeam.length>=s.TEAM_SIZE)return s.draftInfo.blueTeam;let t=0;for(;;){let e=0===s.draftInfo.blueTeam.length?0:s.draftInfo.blueTeam.length-1;const n=s.draftInfo.blueTeam.slice(0);for(;n.length<s.TEAM_SIZE;){const t=c()(o[e]||[],s.heroes);n.push(a()(0===t.length?s.heroes:t)),e+=1}if(new Set(n).size===s.TEAM_SIZE&&(t+=1,s.isAcceptableComposition(n)||t>50))return n}},s.isGoodComposition=t=>{const e=t.map(t=>s.data[t].subrole).sort();return s.acceptableCompositions.some(t=>e.every((e,n)=>e===t[n]))},s.isAcceptableComposition=t=>{const e=new Set(t.map(t=>s.data[t].role));return e.has("Warrior")&&e.has("Assassin")&&e.has("Support")},s.myCache={},s.fitness=t=>{let e=s.myCache[t.sort()]||0;if(0!==e)return e;s.isGoodComposition(t)?e+=100*i.composition:s.isAcceptableComposition(t)&&(e+=50*i.composition),e+=t.reduce((t,e)=>t+s.data[e].preCalculated,0)/s.TEAM_SIZE;const n=new Set;t.forEach(t=>s.data[t].synergies.forEach(t=>n.add(t))),e+=t.reduce((t,e)=>t+(n.has(e)?30:0),0)*i.synergies;const r=new Set;t.forEach(t=>s.data[t].countered_by.forEach(t=>r.add(t))),e+=s.draftInfo.redTeam.reduce((t,e)=>t+(r.has(e)?-30:0),0)*i.counters;const o=new Set;return s.draftInfo.redTeam.forEach(t=>s.data[t].countered_by.forEach(t=>o.add(t))),e+=t.reduce((t,e)=>t+(o.has(e)?30:0),0)*i.opposingCounters,s.myCache[t.sort()]=e,e},s.crossover=(t,e)=>{const n=s.draftInfo.blueTeam.length,r=t.length-n;if(0===r)return[t,e];let i=t.slice(0,n),a=e.slice(0,n);if(1===r)return i=i.concat([e[s.TEAM_SIZE-1]]),a=a.concat([t[s.TEAM_SIZE-1]]),new Set(i).size===s.TEAM_SIZE&&new Set(a).size===s.TEAM_SIZE?[i,a]:[t,e];let c=0;for(;;){if(10===(c+=1))return[t,e];let u=0,f=0;for(;u===f||u>=f;)u=Math.floor(Math.random()*r),f=Math.floor(Math.random()*r);if(u+=n,f+=n+1,i=i.concat(e.slice(n,u)).concat(t.slice(u,f)).concat(e.slice(f,r)),a=a.concat(t.slice(n,u)).concat(e.slice(u,f)).concat(t.slice(f,r)),i=Array.from(new Set(i)),a=Array.from(new Set(a)),i.length===s.TEAM_SIZE&&a.length===s.TEAM_SIZE){if(i.every((t,e)=>o[e]&&o[e].includes(i[e])&&o[e].includes(a[e])))return[i,a]}}},this.genetic=s}solve(t){const e=Object.assign({},{size:275,crossover:1,maxResults:1,iterations:25,webWorkers:!1},t),n=this.genetic.data;return new Promise((t,r)=>{this.genetic.notification=(e,r,o,i)=>{if(i){const o={team:e[0].entity.sort((t,e)=>(function(t,e,n){const r=n[t].role,o=n[e].role;return r===o?t===e?0:t>e?1:-1:"Warrior"===r?-1:"Warrior"===o?1:"Assassin"===r?-1:"Assassin"===o?1:"Specialist"===r?-1:"Specialist"===o?1:"Multiclass"===r?-1:"Multiclass"===o?1:"Support"===r?-1:"Support"===o?1:void 0})(t,e,n)),fitness:e[0].fitness,generation:r};t(o)}},this.genetic.evolve(e,{})})}}async function l(t,e,n,r){let i,a=0;for(;20!==a;){const s=new f(e,n,o.a,r),c=await s.solve();(!i||i.fitness<c.fitness)&&(postMessage({result:c,isFinished:!1,forBlueTeam:t}),a=0,i=c),a+=1}postMessage({result:i,isFinished:!0,forBlueTeam:t})}onmessage=async t=>{const[e,n,r]=t.data;l(!0,e,n,r);const o=JSON.parse(JSON.stringify(n));Object.assign(o,{redTeam:o.blueTeam,blueTeam:o.redTeam}),l(!1,e,o,r)}}]);