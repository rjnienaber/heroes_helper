!function(e){var t={};function n(i){if(t[i])return t[i].exports;var r=t[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:i})},n.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=3)}([function(e,t,n){"use strict";(function(e){n.d(t,"a",function(){return i});class i{constructor(t,n,i){const r=i.create();r.optimize=i.Optimize.Maximize,r.select1=i.Select1.Tournament2,r.select2=i.Select2.Tournament2,r.draftInfo=n,r.data=function(t,n){const i={};let r=100,o=0;for(const e in t.heroes){const n=t.heroes[e];r=Math.min(r,n.win_percent),o=Math.max(o,n.win_percent)}const s=o-r,{grubby:a,icyVeins:c,tenTon:u}=t.tiers;for(const o of Object.keys(t.heroes)){const l=t.heroes[o];let f=0;f=(a[l.grubby_tier]+c[l.icy_veins_tier]+u[l.ten_ton_tier])/3,f+=(l.win_percent-r)/s*100,l.maps.strong.includes(n.map)?f+=50:l.maps.weak.includes(n.map)&&(f-=50),Number.isNaN(f)&&(console.log(`NaN precalculated for ${o}`),console.log(l),e.exit(1)),i[o]={preCalculated:f,role:l.role,subrole:l.subrole,synergies:l.synergies,counters:l.counters}}return i}(t,n),r.TEAM_SIZE=5,r.acceptableCompositions=function(e,t){let n=e.map_stats[t.map];return n||(n=e.map_stats["All Maps"]),n.map(e=>e.roles.sort())}(t,n);const o=[n.unavailable,n.blueTeamBans,n.blueTeam,n.redTeamBans,n.redTeam].reduce((e,t)=>e.concat(t),[]);r.heroes=[];for(const e in t.heroes)o.includes(e)||r.heroes.push(e);r.seed=(()=>{if(r.draftInfo.blueTeam.length>=5)return r.draftInfo.blueTeam;let e=0;for(;;){const t=r.draftInfo.blueTeam.slice(0);for(;t.length<5;)t.push(r.randomHero());if(new Set(t).size===r.TEAM_SIZE&&(e+=1,r.isAcceptableComposition(t)||e>50))return t}}),r.isGoodComposition=(e=>{const t=e.map(e=>r.data[e].subrole).sort();return r.acceptableCompositions.some(e=>t.every((t,n)=>t===e[n]))}),r.isAcceptableComposition=(e=>{const t=new Set(e.map(e=>r.data[e].role));return t.has("Warrior")&&t.has("Assassin")&&t.has("Support")}),r.myCache={},r.fitness=(e=>{let t=r.myCache[e.sort()]||0;if(0!==t)return t;r.isGoodComposition(e)?t+=100:r.isAcceptableComposition(e)&&(t+=50),t+=e.reduce((e,t)=>e+r.data[t].preCalculated,0)/5;const n=new Set;e.forEach(e=>r.data[e].synergies.forEach(e=>n.add(e))),t+=e.reduce((e,t)=>e+(n.has(t)?30:0),0);const i=new Set;e.forEach(e=>r.data[e].counters.forEach(e=>i.add(e))),t+=r.draftInfo.redTeam.reduce((e,t)=>e+(i.has(t)?-30:0),0);const o=new Set;return r.draftInfo.redTeam.forEach(e=>r.data[e].counters.forEach(e=>o.add(e))),t+=e.reduce((e,t)=>e+(o.has(t)?30:0),0),r.myCache[e.sort()]=t,t}),r.crossover=((e,t)=>{const n=r.draftInfo.blueTeam.length,i=e.length-n;if(0===i)return[e,t];let o=e.slice(0,n),s=t.slice(0,n);if(1===i)return o=o.concat([t[r.TEAM_SIZE-1]]),s=s.concat([e[r.TEAM_SIZE-1]]),new Set(o).size===r.TEAM_SIZE&&new Set(s).size===r.TEAM_SIZE?[o,s]:[e,t];let a=0;for(;;){if(10===(a+=1))return[e,t];let c=0,u=0;for(;c===u||c>=u;)c=Math.floor(Math.random()*i),u=Math.floor(Math.random()*i);if(c+=n,u+=n+1,o=o.concat(t.slice(n,c)).concat(e.slice(c,u)).concat(t.slice(u,i)),s=s.concat(e.slice(n,c)).concat(t.slice(c,u)).concat(e.slice(u,i)),new Set(o).size===r.TEAM_SIZE&&new Set(s).size===r.TEAM_SIZE&&o.length===r.TEAM_SIZE&&s.length===r.TEAM_SIZE)return[o,s]}}),r.randomHero=(()=>{const e=Math.floor(Math.random()*r.heroes.length);return r.heroes[e]}),this.genetic=r}solve(e){const t=Object.assign({},{size:275,crossover:1,maxResults:1,iterations:25},e),n=this.genetic.data;return new Promise((e,i)=>{this.genetic.notification=((t,i,r,o)=>{if(o){const r={team:t[0].entity.sort((e,t)=>{const i=n[e].role,r=n[t].role;return i===r?e===t?0:e>t?1:-1:"Warrior"===i?-1:"Warrior"===r?1:"Assassin"===i?-1:"Assassin"===r?1:"Specialist"===i?-1:"Specialist"===r?1:"Support"===i?-1:"Support"===r?1:void 0}),fitness:t[0].fitness,generation:i};e(r)}}),this.genetic.evolve(t,{})})}}}).call(this,n(2))},function(module,exports,__webpack_require__){var Genetic=Genetic||function(){"use strict";var Serialization={stringify:function(e){return JSON.stringify(e,function(e,t){return t instanceof Function||"function"==typeof t?"__func__:"+t.toString():t instanceof RegExp?"__regex__:"+t:t})},parse:function(str){return JSON.parse(str,function(key,value){return"string"!=typeof value?value:0===value.lastIndexOf("__func__:",0)?eval("("+value.slice(9)+")"):0===value.lastIndexOf("__regex__:",0)?eval("("+value.slice(10)+")"):value})}},Clone=function(e){return null==e||"object"!=typeof e?e:JSON.parse(JSON.stringify(e))},Optimize={Maximize:function(e,t){return e>=t},Minimize:function(e,t){return e<t}},Select1={Tournament2:function(e){var t=e.length,n=e[Math.floor(Math.random()*t)],i=e[Math.floor(Math.random()*t)];return this.optimize(n.fitness,i.fitness)?n.entity:i.entity},Tournament3:function(e){var t=e.length,n=e[Math.floor(Math.random()*t)],i=e[Math.floor(Math.random()*t)],r=e[Math.floor(Math.random()*t)],o=this.optimize(n.fitness,i.fitness)?n:i;return(o=this.optimize(o.fitness,r.fitness)?o:r).entity},Fittest:function(e){return e[0].entity},Random:function(e){return e[Math.floor(Math.random()*e.length)].entity},RandomLinearRank:function(e){return this.internalGenState.rlr=this.internalGenState.rlr||0,e[Math.floor(Math.random()*Math.min(e.length,this.internalGenState.rlr++))].entity},Sequential:function(e){return this.internalGenState.seq=this.internalGenState.seq||0,e[this.internalGenState.seq++%e.length].entity}},Select2={Tournament2:function(e){return[Select1.Tournament2.call(this,e),Select1.Tournament2.call(this,e)]},Tournament3:function(e){return[Select1.Tournament3.call(this,e),Select1.Tournament3.call(this,e)]},Random:function(e){return[Select1.Random.call(this,e),Select1.Random.call(this,e)]},RandomLinearRank:function(e){return[Select1.RandomLinearRank.call(this,e),Select1.RandomLinearRank.call(this,e)]},Sequential:function(e){return[Select1.Sequential.call(this,e),Select1.Sequential.call(this,e)]},FittestRandom:function(e){return[Select1.Fittest.call(this,e),Select1.Random.call(this,e)]}};function Genetic(){this.fitness=null,this.seed=null,this.mutate=null,this.crossover=null,this.select1=null,this.select2=null,this.optimize=null,this.generation=null,this.notification=null,this.configuration={size:250,crossover:.9,mutation:.2,iterations:100,fittestAlwaysSurvives:!0,maxResults:100,webWorkers:!0,skip:0},this.userData={},this.internalGenState={},this.entities=[],this.usingWebWorker=!1,this.start=function(){var e;for(e=0;e<this.configuration.size;++e)this.entities.push(this.seed());this.loop(0)},this.loop=function(e){var t=this;function n(e){return Math.random()<=t.configuration.mutation&&t.mutate?t.mutate(e):e}this.internalGenState={};var i=this.entities.map(function(e){return{fitness:t.fitness(e),entity:e}}).sort(function(e,n){return t.optimize(e.fitness,n.fitness)?-1:1}),r=i.reduce(function(e,t){return e+t.fitness},0)/i.length,o=Math.sqrt(i.map(function(e){return(e.fitness-r)*(e.fitness-r)}).reduce(function(e,t){return e+t},0)/i.length),s={maximum:i[0].fitness,minimum:i[i.length-1].fitness,mean:r,stdev:o},a=!this.generation||this.generation(i.slice(0,this.configuration.maxResults),e,s),c=void 0!==a&&!a||e==this.configuration.iterations-1;if(this.notification&&(c||0==this.configuration.skip||e%this.configuration.skip==0)&&this.sendNotification(i.slice(0,this.configuration.maxResults),e,s,c),!c){var u=[];for(this.configuration.fittestAlwaysSurvives&&u.push(i[0].entity);u.length<t.configuration.size;)if(this.crossover&&Math.random()<=this.configuration.crossover&&u.length+1<t.configuration.size){var l=this.select2(i),f=this.crossover(l[0],l[1]).map(n);u.push(f[0],f[1])}else u.push(n(t.select1(i)));this.entities=u,setTimeout(function(){t.loop(e+1)},1)}},this.sendNotification=function(e,t,n,i){if(this.usingWebWorker){var r={pop:e.map(Serialization.stringify),generation:t,stats:n,isFinished:i};postMessage(r)}else this.notification(e,t,n,i)}}return Genetic.prototype.evolve=function(e,t){var n;for(n in e)this.configuration[n]=e[n];for(n in t)this.userData[n]=t[n];function i(e){return e.replace(/[\\"']/g,"\\$&").replace(/\u0000/g,"\\0")}this.usingWebWorker=this.configuration.webWorkers&&"undefined"!=typeof Blob&&"undefined"!=typeof Worker&&void 0!==window.URL&&void 0!==window.URL.createObjectURL;var r=this;if(this.usingWebWorker){var o="'use strict'\n";o+="var Serialization = {'stringify': "+Serialization.stringify.toString()+", 'parse': "+Serialization.parse.toString()+"};\n",o+="var Clone = "+Clone.toString()+";\n",o+='var Optimize = Serialization.parse("'+i(Serialization.stringify(Optimize))+'");\n',o+='var Select1 = Serialization.parse("'+i(Serialization.stringify(Select1))+'");\n',o+='var Select2 = Serialization.parse("'+i(Serialization.stringify(Select2))+'");\n',o+='var genetic = Serialization.parse("'+i(Serialization.stringify(this))+'");\n',o+="onmessage = function(e) { genetic.start(); }\n";var s=new Blob([o]),a=new Worker(window.URL.createObjectURL(s));a.onmessage=function(e){var t=e.data;r.notification(t.pop.map(Serialization.parse),t.generation,t.stats,t.isFinished)},a.onerror=function(e){alert("ERROR: Line "+e.lineno+" in "+e.filename+": "+e.message)},a.postMessage("")}else r.start()},{create:function(){return new Genetic},Select1:Select1,Select2:Select2,Optimize:Optimize,Clone:Clone}}();module.exports=Genetic},function(e,t){var n,i,r=e.exports={};function o(){throw new Error("setTimeout has not been defined")}function s(){throw new Error("clearTimeout has not been defined")}function a(e){if(n===setTimeout)return setTimeout(e,0);if((n===o||!n)&&setTimeout)return n=setTimeout,setTimeout(e,0);try{return n(e,0)}catch(t){try{return n.call(null,e,0)}catch(t){return n.call(this,e,0)}}}!function(){try{n="function"==typeof setTimeout?setTimeout:o}catch(e){n=o}try{i="function"==typeof clearTimeout?clearTimeout:s}catch(e){i=s}}();var c,u=[],l=!1,f=-1;function h(){l&&c&&(l=!1,c.length?u=c.concat(u):f=-1,u.length&&m())}function m(){if(!l){var e=a(h);l=!0;for(var t=u.length;t;){for(c=u,u=[];++f<t;)c&&c[f].run();f=-1,t=u.length}c=null,l=!1,function(e){if(i===clearTimeout)return clearTimeout(e);if((i===s||!i)&&clearTimeout)return i=clearTimeout,clearTimeout(e);try{i(e)}catch(t){try{return i.call(null,e)}catch(t){return i.call(this,e)}}}(e)}}function p(e,t){this.fun=e,this.array=t}function d(){}r.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];u.push(new p(e,t)),1!==u.length||l||a(m)},p.prototype.run=function(){this.fun.apply(null,this.array)},r.title="browser",r.browser=!0,r.env={},r.argv=[],r.version="",r.versions={},r.on=d,r.addListener=d,r.once=d,r.off=d,r.removeListener=d,r.removeAllListeners=d,r.emit=d,r.prependListener=d,r.prependOnceListener=d,r.listeners=function(e){return[]},r.binding=function(e){throw new Error("process.binding is not supported")},r.cwd=function(){return"/"},r.chdir=function(e){throw new Error("process.chdir is not supported")},r.umask=function(){return 0}},function(e,t,n){"use strict";n.r(t);var i=n(1),r=n.n(i),o=n(0);async function s(e,t,n){let i,s=0;for(;20!==s;){const a=new o.a(t,n,r.a),c=await a.solve();(!i||i.fitness<c.fitness)&&(postMessage({result:c,isFinished:!1,forBlueTeam:e}),s=0,i=c),s+=1}postMessage({result:i,isFinished:!0,forBlueTeam:e})}onmessage=(async e=>{const[t,n]=e.data;s(!0,t,n);const i=JSON.parse(JSON.stringify(n));Object.assign(i,{redTeam:i.blueTeam,blueTeam:i.redTeam}),s(!1,t,i)})}]);