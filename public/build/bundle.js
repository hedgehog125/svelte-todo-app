var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function s(t){return"function"==typeof t}function r(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function l(t,e,n,o){return t[1]&&o?function(t,e){for(const n in e)t[n]=e[n];return t}(n.ctx.slice(),t[1](o(e))):n.ctx}function c(t,e){t.appendChild(e)}function u(t,e,n){t.insertBefore(e,n||null)}function i(t){t.parentNode.removeChild(t)}function d(t){return document.createElement(t)}function a(t){return document.createTextNode(t)}function f(){return a(" ")}function m(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function p(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function $(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function g(t,e){t.value=null==e?"":e}let h;function y(t){h=t}const k=[],b=[],x=[],I=[],v=Promise.resolve();let w=!1;function C(t){x.push(t)}const _=new Set;let E=0;function S(){const t=h;do{for(;E<k.length;){const t=k[E];E++,y(t),M(t.$$)}for(y(null),k.length=0,E=0;b.length;)b.pop()();for(let t=0;t<x.length;t+=1){const e=x[t];_.has(e)||(_.add(e),e())}x.length=0}while(k.length);for(;I.length;)I.pop()();w=!1,_.clear(),y(t)}function M(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(C)}}const A=new Set;let N;function O(){N={r:0,c:[],p:N}}function j(){N.r||o(N.c),N=N.p}function z(t,e){t&&t.i&&(A.delete(t),t.i(e))}function T(t,e,n,o){if(t&&t.o){if(A.has(t))return;A.add(t),N.c.push((()=>{A.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}}function D(t,e){T(t,1,1,(()=>{e.delete(t.key)}))}function J(t){t&&t.c()}function L(t,n,r,l){const{fragment:c,on_mount:u,on_destroy:i,after_update:d}=t.$$;c&&c.m(n,r),l||C((()=>{const n=u.map(e).filter(s);i?i.push(...n):o(n),t.$$.on_mount=[]})),d.forEach(C)}function q(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function B(t,e){-1===t.$$.dirty[0]&&(k.push(t),w||(w=!0,v.then(S)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function P(e,s,r,l,c,u,d,a=[-1]){const f=h;y(e);const m=e.$$={fragment:null,ctx:null,props:u,update:t,not_equal:c,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(s.context||(f?f.$$.context:[])),callbacks:n(),dirty:a,skip_bound:!1,root:s.target||f.$$.root};d&&d(m.root);let p=!1;if(m.ctx=r?r(e,s.props||{},((t,n,...o)=>{const s=o.length?o[0]:n;return m.ctx&&c(m.ctx[t],m.ctx[t]=s)&&(!m.skip_bound&&m.bound[t]&&m.bound[t](s),p&&B(e,t)),n})):[],m.update(),p=!0,o(m.before_update),m.fragment=!!l&&l(m.ctx),s.target){if(s.hydrate){const t=function(t){return Array.from(t.childNodes)}(s.target);m.fragment&&m.fragment.l(t),t.forEach(i)}else m.fragment&&m.fragment.c();s.intro&&z(e.$$.fragment),L(e,s.target,s.anchor,s.customElement),S()}y(f)}class W{$destroy(){q(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function Y(e){let n,o,s,r,l,g,h,y,k=e[0].name+"";return{c(){n=d("main"),o=d("li"),s=a(k),r=f(),l=d("input"),p(l,"type","checkbox"),l.checked=g=e[0].done,p(l,"aria-label","If the task has been completed or not. Tick it when it's done"),p(l,"class","svelte-1btwg3z"),p(o,"class","svelte-1btwg3z")},m(t,i){u(t,n,i),c(n,o),c(o,s),c(o,r),c(o,l),h||(y=m(l,"change",e[1]),h=!0)},p(t,[e]){1&e&&k!==(k=t[0].name+"")&&$(s,k),1&e&&g!==(g=t[0].done)&&(l.checked=g)},i:t,o:t,d(t){t&&i(n),h=!1,y()}}}function F(t,e,n){let o,{todoItems:s}=e,{index:r}=e,{toggleItem:l}=e;return t.$$set=t=>{"todoItems"in t&&n(2,s=t.todoItems),"index"in t&&n(3,r=t.index),"toggleItem"in t&&n(4,l=t.toggleItem)},t.$$.update=()=>{12&t.$$.dirty&&n(0,o=s[r])},[o,t=>{l(r)},s,r,l]}class G extends W{constructor(t){super(),P(this,t,F,Y,r,{todoItems:2,index:3,toggleItem:4})}}function H(t,e,n){const o=t.slice();return o[2]=e[n],o[4]=n,o}function K(t){let e,n,o=[],s=new Map,r=t[0];const l=t=>t[2].id;for(let e=0;e<r.length;e+=1){let n=H(t,r,e),c=l(n);s.set(c,o[e]=R(c,n))}return{c(){e=d("ul");for(let t=0;t<o.length;t+=1)o[t].c();p(e,"class","svelte-3uk4zh")},m(t,s){u(t,e,s);for(let t=0;t<o.length;t+=1)o[t].m(e,null);n=!0},p(t,n){3&n&&(r=t[0],O(),o=function(t,e,n,o,s,r,l,c,u,i,d,a){let f=t.length,m=r.length,p=f;const $={};for(;p--;)$[t[p].key]=p;const g=[],h=new Map,y=new Map;for(p=m;p--;){const t=a(s,r,p),c=n(t);let u=l.get(c);u?o&&u.p(t,e):(u=i(c,t),u.c()),h.set(c,g[p]=u),c in $&&y.set(c,Math.abs(p-$[c]))}const k=new Set,b=new Set;function x(t){z(t,1),t.m(c,d),l.set(t.key,t),d=t.first,m--}for(;f&&m;){const e=g[m-1],n=t[f-1],o=e.key,s=n.key;e===n?(d=e.first,f--,m--):h.has(s)?!l.has(o)||k.has(o)?x(e):b.has(s)?f--:y.get(o)>y.get(s)?(b.add(o),x(e)):(k.add(s),f--):(u(n,l),f--)}for(;f--;){const e=t[f];h.has(e.key)||u(e,l)}for(;m;)x(g[m-1]);return g}(o,n,l,1,t,r,s,e,D,R,null,H),j())},i(t){if(!n){for(let t=0;t<r.length;t+=1)z(o[t]);n=!0}},o(t){for(let t=0;t<o.length;t+=1)T(o[t]);n=!1},d(t){t&&i(e);for(let t=0;t<o.length;t+=1)o[t].d()}}}function Q(e){let n;return{c(){n=a("You haven't got anything else left to do")},m(t,e){u(t,n,e)},p:t,i:t,o:t,d(t){t&&i(n)}}}function R(t,e){let n,o,s;return o=new G({props:{todoItems:e[0],index:e[4],toggleItem:e[1]}}),{key:t,first:null,c(){n=a(""),J(o.$$.fragment),this.first=n},m(t,e){u(t,n,e),L(o,t,e),s=!0},p(t,n){e=t;const s={};1&n&&(s.todoItems=e[0]),1&n&&(s.index=e[4]),2&n&&(s.toggleItem=e[1]),o.$set(s)},i(t){s||(z(o.$$.fragment,t),s=!0)},o(t){T(o.$$.fragment,t),s=!1},d(t){t&&i(n),q(o,t)}}}function U(t){let e,n,o,s,r;const l=[Q,K],a=[];function f(t,e){return 0==t[0].length?0:1}return o=f(t),s=a[o]=l[o](t),{c(){e=d("main"),n=d("div"),s.c(),p(n,"class","svelte-3uk4zh")},m(t,s){u(t,e,s),c(e,n),a[o].m(n,null),r=!0},p(t,[e]){let r=o;o=f(t),o===r?a[o].p(t,e):(O(),T(a[r],1,1,(()=>{a[r]=null})),j(),s=a[o],s?s.p(t,e):(s=a[o]=l[o](t),s.c()),z(s,1),s.m(n,null))},i(t){r||(z(s),r=!0)},o(t){T(s),r=!1},d(t){t&&i(e),a[o].d()}}}function V(t,e,n){let{todoItems:o,toggleItem:s}=e;return t.$$set=t=>{"todoItems"in t&&n(0,o=t.todoItems),"toggleItem"in t&&n(1,s=t.toggleItem)},[o,s]}class X extends W{constructor(t){super(),P(this,t,V,U,r,{todoItems:0,toggleItem:1})}}function Z(e){let n,r,l,h,y,k,b,x,I,v,w,C,_,E,S,M,A,N,O,j,z=1==e[3]?"":"s";return{c(){n=d("main"),r=d("div"),l=d("form"),h=d("input"),y=f(),k=d("button"),b=a("Add"),x=f(),I=d("button"),v=a("Delete completed"),C=f(),_=d("br"),E=f(),S=a(e[3]),M=a(" task"),A=a(z),N=a(" left"),p(h,"type","text"),p(h,"placeholder","What do you need to do?"),p(h,"aria-label","The task you want to add to your to do list"),p(h,"class","svelte-selpyk"),p(k,"type","submit"),k.disabled=e[4],p(k,"class","svelte-selpyk"),p(I,"type","button"),I.disabled=w=0==e[1],p(I,"class","svelte-selpyk"),p(l,"class","svelte-selpyk"),p(_,"class","svelte-selpyk"),p(r,"class","svelte-selpyk"),p(n,"class","svelte-selpyk")},m(t,o){var i;u(t,n,o),c(n,r),c(r,l),c(l,h),g(h,e[2]),c(l,y),c(l,k),c(k,b),c(l,x),c(l,I),c(I,v),c(r,C),c(r,_),c(r,E),c(r,S),c(r,M),c(r,A),c(r,N),O||(j=[m(h,"input",e[8]),m(k,"click",e[5]),m(I,"click",(function(){s(e[0])&&e[0].apply(this,arguments)})),m(l,"submit",(i=e[5],function(t){return t.preventDefault(),i.call(this,t)}))],O=!0)},p(t,[n]){e=t,4&n&&h.value!==e[2]&&g(h,e[2]),16&n&&(k.disabled=e[4]),2&n&&w!==(w=0==e[1])&&(I.disabled=w),8&n&&$(S,e[3]),8&n&&z!==(z=1==e[3]?"":"s")&&$(A,z)},i:t,o:t,d(t){t&&i(n),O=!1,o(j)}}}function tt(t,e,n){let o,s,{addItem:r}=e,{deleteCompleted:l}=e,{completedCount:c}=e,{taskCount:u}=e,i="";return t.$$set=t=>{"addItem"in t&&n(6,r=t.addItem),"deleteCompleted"in t&&n(0,l=t.deleteCompleted),"completedCount"in t&&n(1,c=t.completedCount),"taskCount"in t&&n(7,u=t.taskCount)},t.$$.update=()=>{4&t.$$.dirty&&n(4,o=""==i),130&t.$$.dirty&&n(3,s=u-c)},[l,c,i,s,o,t=>{r(i),n(2,i="")},r,u,function(){i=this.value,n(2,i)}]}class et extends W{constructor(t){super(),P(this,t,tt,Z,r,{addItem:6,deleteCompleted:0,completedCount:1,taskCount:7})}}function nt(t){let e,n,o;const s=t[1].default,r=function(t,e,n,o){if(t){const s=l(t,e,n,o);return t[0](s)}}(s,t,t[0],null);return{c(){e=d("main"),n=d("div"),r&&r.c(),p(n,"class","svelte-vkt6")},m(t,s){u(t,e,s),c(e,n),r&&r.m(n,null),o=!0},p(t,[e]){r&&r.p&&(!o||1&e)&&function(t,e,n,o,s,r){if(s){const c=l(e,n,o,r);t.p(c,s)}}(r,s,t,t[0],o?function(t,e,n,o){if(t[2]&&o){const s=t[2](o(n));if(void 0===e.dirty)return s;if("object"==typeof s){const t=[],n=Math.max(e.dirty.length,s.length);for(let o=0;o<n;o+=1)t[o]=e.dirty[o]|s[o];return t}return e.dirty|s}return e.dirty}(s,t[0],e,null):function(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let t=0;t<n;t++)e[t]=-1;return e}return-1}(t[0]),null)},i(t){o||(z(r,t),o=!0)},o(t){T(r,t),o=!1},d(t){t&&i(e),r&&r.d(t)}}}function ot(t,e,n){let{$$slots:o={},$$scope:s}=e;return t.$$set=t=>{"$$scope"in t&&n(0,s=t.$$scope)},[s,o]}class st extends W{constructor(t){super(),P(this,t,ot,nt,r,{})}}const rt=t=>{let e=0;for(;;){if(!t.some((t=>t==e||t?.id==e)))return e;e++}};function lt(t){let e,n,o,s,r,l;return e=new X({props:{todoItems:t[0],toggleItem:t[4]}}),r=new et({props:{addItem:t[2],deleteCompleted:t[3],completedCount:t[1].length,taskCount:t[0].length}}),{c(){J(e.$$.fragment),n=f(),o=d("br"),s=f(),J(r.$$.fragment)},m(t,c){L(e,t,c),u(t,n,c),u(t,o,c),u(t,s,c),L(r,t,c),l=!0},p(t,n){const o={};1&n&&(o.todoItems=t[0]),e.$set(o);const s={};2&n&&(s.completedCount=t[1].length),1&n&&(s.taskCount=t[0].length),r.$set(s)},i(t){l||(z(e.$$.fragment,t),z(r.$$.fragment,t),l=!0)},o(t){T(e.$$.fragment,t),T(r.$$.fragment,t),l=!1},d(t){q(e,t),t&&i(n),t&&i(o),t&&i(s),q(r,t)}}}function ct(t){let e,n,o;return n=new st({props:{$$slots:{default:[lt]},$$scope:{ctx:t}}}),{c(){e=d("main"),J(n.$$.fragment)},m(t,s){u(t,e,s),L(n,e,null),o=!0},p(t,[e]){const o={};35&e&&(o.$$scope={dirty:e,ctx:t}),n.$set(o)},i(t){o||(z(n.$$.fragment,t),o=!0)},o(t){T(n.$$.fragment,t),o=!1},d(t){t&&i(e),q(n)}}}const ut="todoItems";function it(t,e,n){let o,s=JSON.parse(localStorage.getItem(ut))??[];return t.$$.update=()=>{1&t.$$.dirty&&n(1,o=s.filter((t=>t.done))),1&t.$$.dirty&&localStorage.setItem(ut,JSON.stringify(s))},[s,o,t=>{s.push({name:t,done:!1,id:rt(s)}),n(0,s)},t=>{n(0,s=s.filter((t=>!t.done)))},t=>{let e=s[t];n(0,s[t]={...e,done:!e.done},s)}]}return new class extends W{constructor(t){super(),P(this,t,it,ct,r,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
