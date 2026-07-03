const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./v3.PdSYDZbJ.js","./v3.BEdaQIEn.js","./v3.By51OA88.js","./v3.Cvebvz_H.js","./v3.DcjEWhlg.js"])))=>i.map(i=>d[i]);
import{av as h,d as Ct,e as T,a6 as B,an as Dt,bd as ve,am as w,b as _,aS as fe,ak as he,aq as $e,t as g,be as Mt,y as be,bf as It,bg as v,b2 as ge,k as st,aK as Ot,a8 as N,au as _t,ae as ye,bh as xe,w as Se,aR as Pt,bi as W,h as F,bj as we,s as Te,a5 as Lt,aw as ke,v as I,aP as Ae,aA as Ce,ap as De,aM as Nt,l as Y,aG as Me,bk as Ie,bl as Oe,bm as _e,aN as Gt}from"./v3.BEdaQIEn.js";import{A as P,T as Pe,D as St,x as o,L as Bt}from"./v3.Doe4k4hL.js";import{i as Le}from"./app.v3.BSpC6cVc.js";import"./v3.By51OA88.js";import"./v3.Cvebvz_H.js";import"./v3.DcjEWhlg.js";/* empty css           *//* empty css           */import"./v3.CG9CZ2vd.js";(function(){try{var t=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{};t.SENTRY_RELEASE={id:"baa058883d0e09f530eb558885f57970b58d5bd0"};var e=new t.Error().stack;e&&(t._sentryDebugIds=t._sentryDebugIds||{},t._sentryDebugIds[e]="58032445-820f-4b22-9df3-199d06e32ce2",t._sentryDebugIdIdentifier="sentry-dbid-58032445-820f-4b22-9df3-199d06e32ce2")}catch{}})();const Ne=t=>t.strings===void 0,Ge={},Be=(t,e=Ge)=>t._$AH=e;const K={ATTRIBUTE:1,CHILD:2,BOOLEAN_ATTRIBUTE:4},H=t=>(...e)=>({_$litDirective$:t,values:e});let nt=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,s,n){this._$Ct=e,this._$AM=s,this._$Ci=n}_$AS(e,s){return this.update(e,s)}update(e,s){return this.render(...s)}};const G=(t,e)=>{var s,n;const i=t._$AN;if(i===void 0)return!1;for(const l of i)(n=(s=l)._$AO)===null||n===void 0||n.call(s,e,!1),G(l,e);return!0},z=t=>{let e,s;do{if((e=t._$AM)===void 0)break;s=e._$AN,s.delete(t),t=e}while(s?.size===0)},Vt=t=>{for(let e;e=t._$AM;t=e){let s=e._$AN;if(s===void 0)e._$AN=s=new Set;else if(s.has(t))break;s.add(t),Ee(e)}};function Ve(t){this._$AN!==void 0?(z(this),this._$AM=t,Vt(this)):this._$AM=t}function Fe(t,e=!1,s=0){const n=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(e)if(Array.isArray(n))for(let l=s;l<n.length;l++)G(n[l],!1),z(n[l]);else n!=null&&(G(n,!1),z(n));else G(this,t)}const Ee=t=>{var e,s,n,i;t.type==K.CHILD&&((e=(n=t)._$AP)!==null&&e!==void 0||(n._$AP=Fe),(s=(i=t)._$AQ)!==null&&s!==void 0||(i._$AQ=Ve))};class Ft extends nt{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,s,n){super._$AT(e,s,n),Vt(this),this.isConnected=e._$AU}_$AO(e,s=!0){var n,i;e!==this.isConnected&&(this.isConnected=e,e?(n=this.reconnected)===null||n===void 0||n.call(this):(i=this.disconnected)===null||i===void 0||i.call(this)),s&&(G(this,e),z(this))}setValue(e){if(Ne(this._$Ct))this._$Ct._$AI(e,this);else{const s=[...this._$Ct._$AH];s[this._$Ci]=e,this._$Ct._$AI(s,this,0)}}disconnected(){}reconnected(){}}const it=t=>t??P;class tt extends nt{constructor(e){if(super(e),this.et=P,e.type!==K.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===P||e==null)return this.ft=void 0,this.et=e;if(e===Pe)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.et)return this.ft;this.et=e;const s=[e];return s.raw=s,this.ft={_$litType$:this.constructor.resultType,strings:s,values:[]}}}tt.directiveName="unsafeHTML",tt.resultType=1;class et extends tt{}et.directiveName="unsafeSVG",et.resultType=2;const Re=H(et);var We=class extends Ft{#t=null;#e=!1;#s=null;constructor(t){super(t),this.#e=t.type===K.ATTRIBUTE||t.type===K.BOOLEAN_ATTRIBUTE}render(t){return t!==this.#t&&(this.disconnected(),this.#t=t,this.isConnected&&this.#n()),this.#t?this.#i(Ct(this.#t)):P}reconnected(){this.#n()}disconnected(){this.#s?.(),this.#s=null}#n(){this.#t&&(this.#s=T(this.#o.bind(this)))}#i(t){return this.#e?it(t):t}#a(t){this.setValue(this.#i(t))}#o(){this.#a(this.#t?.())}};function a(t){return H(We)(h(t))}var Et=class{#t;#e;elements=new Set;constructor(t,e){this.#t=t,this.#e=e}connect(){this.#n();const t=new MutationObserver(this.#s);for(const e of this.#t)t.observe(e,{childList:!0,subtree:!0});B(()=>t.disconnect()),B(this.disconnect.bind(this))}disconnect(){this.elements.clear()}assign(t,e){ve(t)?(e.textContent="",e.append(t)):(St(null,e),St(t,e)),e.style.display||(e.style.display="contents");const s=e.firstElementChild;if(!s)return;const n=e.getAttribute("data-class");n&&s.classList.add(...n.split(" "))}#s=Dt(this.#n.bind(this));#n(t){if(t&&!t.some(n=>n.addedNodes.length))return;let e=!1,s=this.#t.flatMap(n=>[...n.querySelectorAll("slot")]);for(const n of s)!n.hasAttribute("name")||this.elements.has(n)||(this.elements.add(n),e=!0);e&&this.#e(this.elements)}};let Ke=0,R="data-slot-id";var Rt=class{#t;slots;constructor(t){this.#t=t,this.slots=new Et(t,this.#s.bind(this))}connect(){this.slots.connect(),this.#s();const t=new MutationObserver(this.#e);for(const e of this.#t)t.observe(e,{childList:!0});B(()=>t.disconnect())}#e=Dt(this.#s.bind(this));#s(){for(const t of this.#t)for(const e of t.children){if(e.nodeType!==1)continue;const s=e.getAttribute("slot");if(!s)continue;e.style.display="none";let n=e.getAttribute(R);n||e.setAttribute(R,n=++Ke+"");for(const i of this.slots.elements){if(i.getAttribute("name")!==s||i.getAttribute(R)===n)continue;const l=document.importNode(e,!0);s.includes("-icon")&&l.classList.add("vds-icon"),l.style.display="",l.removeAttribute("slot"),this.slots.assign(l,i),i.setAttribute(R,n)}}}};function ze({name:t,class:e,state:s,paths:n,viewBox:i="0 0 32 32"}){return o`<svg
    class="${"vds-icon"+(e?` ${e}`:"")}"
    viewBox="${i}"
    fill="none"
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
    data-icon=${it(t??s)}
  >
    ${_(n)?Re(n):a(n)}
  </svg>`}var He=class{#t={};#e=!1;slots;constructor(t){this.slots=new Et(t,this.#n.bind(this))}connect(){this.slots.connect()}load(){this.loadIcons().then(t=>{this.#t=t,this.#e=!0,this.#n()})}*#s(){for(const t of Object.keys(this.#t)){const e=`${t}-icon`;for(const s of this.slots.elements)s.name===e&&(yield{icon:this.#t[t],slot:s})}}#n(){if(this.#e)for(const{icon:t,slot:e}of this.#s())this.slots.assign(t,e)}},Ue=class extends He{connect(){super.connect();const{player:t}=w();if(!t.el)return;let e,s=new IntersectionObserver(n=>{n[0]?.isIntersecting&&(e?.(),e=void 0,this.load())});s.observe(t.el),e=B(()=>s.disconnect())}};const Z=new WeakMap,U=H(class extends Ft{render(t){return P}update(t,[e]){var s;const n=e!==this.G;return n&&this.G!==void 0&&this.ot(void 0),(n||this.rt!==this.lt)&&(this.G=e,this.dt=(s=t.options)===null||s===void 0?void 0:s.host,this.ot(this.lt=t.element)),P}ot(t){var e;if(typeof this.G=="function"){const s=(e=this.dt)!==null&&e!==void 0?e:globalThis;let n=Z.get(s);n===void 0&&(n=new WeakMap,Z.set(s,n)),n.get(this.G)!==void 0&&this.G.call(this.dt,void 0),n.set(this.G,t),t!==void 0&&this.G.call(this.dt,t)}else this.G.value=t}get rt(){var t,e,s;return typeof this.G=="function"?(e=Z.get((t=this.dt)!==null&&t!==void 0?t:globalThis))===null||e===void 0?void 0:e.get(this.G):(s=this.G)===null||s===void 0?void 0:s.value}disconnected(){this.rt===this.lt&&this.ot(void 0)}reconnected(){this.ot(this.lt)}}),Wt=ge();function r(){return fe(Wt)}const je={colorScheme:"system",download:null,customIcons:!1,disableTimeSlider:!1,menuContainer:null,menuGroup:"bottom",noAudioGain:!1,noGestures:!1,noKeyboardAnimations:!1,noModal:!1,noScrubGesture:!1,playbackRates:{min:0,max:2,step:.25},audioGains:{min:0,max:300,step:25},seekStep:10,sliderChaptersMinWidth:325,hideQualityBitrate:!1,smallWhen:!1,thumbnails:null,translations:null,when:!1};var at=class extends he{static props=je;#t;#e=h(()=>{const t=this.$props.when();return this.#n(t)});#s=h(()=>{const t=this.$props.smallWhen();return this.#n(t)});get isMatch(){return this.#e()}get isSmallLayout(){return this.#s()}onSetup(){this.#t=w(),this.setAttributes({"data-match":this.#e,"data-sm":()=>this.#s()?"":null,"data-lg":()=>this.#s()?null:"","data-size":()=>this.#s()?"sm":"lg","data-no-scrub-gesture":this.$props.noScrubGesture}),$e(Wt,{...this.$props,when:this.#e,smallWhen:this.#s,userPrefersAnnouncements:g(!0),userPrefersKeyboardAnimations:g(!0),menuPortal:g(null)})}onAttach(t){Mt(t,this.$props.colorScheme)}#n(t){return t!=="never"&&(be(t)?t:h(()=>t(this.#t.player.state))())}};const Kt=at.prototype;Ot(Kt,"isMatch");Ot(Kt,"isSmallLayout");function zt(t,e){T(()=>{const{player:s}=w(),n=s.el;return n&&N(n,"data-layout",e()&&t),()=>n?.removeAttribute("data-layout")})}function y(t,e){return t()?.[e]??e}function ot(){return a(()=>{const{translations:t,userPrefersAnnouncements:e}=r();return e()?o`<media-announcer .translations=${a(t)}></media-announcer>`:null})}function S(t,e=""){return o`<slot
    name=${`${t}-icon`}
    data-class=${`vds-icon vds-${t}-icon${e?` ${e}`:""}`}
  ></slot>`}function E(t){return t.map(e=>S(e))}function u(t,e){return a(()=>y(t,e))}function lt({tooltip:t}){const{translations:e}=r(),{remotePlaybackState:s}=v(),n=a(()=>`${y(e,"AirPlay")} ${_t(s())}`),i=u(e,"AirPlay");return o`
    <media-tooltip class="vds-airplay-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-airplay-button class="vds-airplay-button vds-button" aria-label=${n}>
          ${S("airplay")}
        </media-airplay-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${t}>
        <span class="vds-airplay-tooltip-text">${i}</span>
      </media-tooltip-content>
    </media-tooltip>
  `}function Ht({tooltip:t}){const{translations:e}=r(),{remotePlaybackState:s}=v(),n=a(()=>`${y(e,"Google Cast")} ${_t(s())}`),i=u(e,"Google Cast");return o`
    <media-tooltip class="vds-google-cast-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-google-cast-button class="vds-google-cast-button vds-button" aria-label=${n}>
          ${S("google-cast")}
        </media-google-cast-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${t}>
        <span class="vds-google-cast-tooltip-text">${i}</span>
      </media-tooltip-content>
    </media-tooltip>
  `}function j({tooltip:t}){const{translations:e}=r(),s=u(e,"Play"),n=u(e,"Pause");return o`
    <media-tooltip class="vds-play-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-play-button
          class="vds-play-button vds-button"
          aria-label=${u(e,"Play")}
        >
          ${E(["play","pause","replay"])}
        </media-play-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${t}>
        <span class="vds-play-tooltip-text">${s}</span>
        <span class="vds-pause-tooltip-text">${n}</span>
      </media-tooltip-content>
    </media-tooltip>
  `}function wt({tooltip:t,ref:e=ke}){const{translations:s}=r(),n=u(s,"Mute"),i=u(s,"Unmute");return o`
    <media-tooltip class="vds-mute-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-mute-button
          class="vds-mute-button vds-button"
          aria-label=${u(s,"Mute")}
          ${U(e)}
        >
          ${E(["mute","volume-low","volume-high"])}
        </media-mute-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${t}>
        <span class="vds-mute-tooltip-text">${i}</span>
        <span class="vds-unmute-tooltip-text">${n}</span>
      </media-tooltip-content>
    </media-tooltip>
  `}function rt({tooltip:t}){const{translations:e}=r(),s=u(e,"Closed-Captions On"),n=u(e,"Closed-Captions Off");return o`
    <media-tooltip class="vds-caption-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-caption-button
          class="vds-caption-button vds-button"
          aria-label=${u(e,"Captions")}
        >
          ${E(["cc-on","cc-off"])}
        </media-caption-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${t}>
        <span class="vds-cc-on-tooltip-text">${n}</span>
        <span class="vds-cc-off-tooltip-text">${s}</span>
      </media-tooltip-content>
    </media-tooltip>
  `}function qe(){const{translations:t}=r(),e=u(t,"Enter PiP"),s=u(t,"Exit PiP");return o`
    <media-tooltip class="vds-pip-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-pip-button
          class="vds-pip-button vds-button"
          aria-label=${u(t,"PiP")}
        >
          ${E(["pip-enter","pip-exit"])}
        </media-pip-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content">
        <span class="vds-pip-enter-tooltip-text">${e}</span>
        <span class="vds-pip-exit-tooltip-text">${s}</span>
      </media-tooltip-content>
    </media-tooltip>
  `}function Ut({tooltip:t}){const{translations:e}=r(),s=u(e,"Enter Fullscreen"),n=u(e,"Exit Fullscreen");return o`
    <media-tooltip class="vds-fullscreen-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-fullscreen-button
          class="vds-fullscreen-button vds-button"
          aria-label=${u(e,"Fullscreen")}
        >
          ${E(["fs-enter","fs-exit"])}
        </media-fullscreen-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${t}>
        <span class="vds-fs-enter-tooltip-text">${s}</span>
        <span class="vds-fs-exit-tooltip-text">${n}</span>
      </media-tooltip-content>
    </media-tooltip>
  `}function Tt({backward:t,tooltip:e}){const{translations:s,seekStep:n}=r(),i=t?"Seek Backward":"Seek Forward",l=u(s,i);return o`
    <media-tooltip class="vds-seek-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-seek-button
          class="vds-seek-button vds-button"
          seconds=${a(()=>(t?-1:1)*n())}
          aria-label=${l}
        >
          ${S(t?"seek-backward":"seek-forward")}
        </media-seek-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${e}>
        ${u(s,i)}
      </media-tooltip-content>
    </media-tooltip>
  `}function jt(){const{translations:t}=r(),{live:e}=v(),s=u(t,"Skip To Live"),n=u(t,"LIVE");return e()?o`
        <media-live-button class="vds-live-button" aria-label=${s}>
          <span class="vds-live-button-text">${n}</span>
        </media-live-button>
      `:null}function ut(){return a(()=>{const{download:t,translations:e}=r(),s=t();if(ye(s))return null;const{source:n,title:i}=v(),l=n(),d=xe({title:i(),src:l,download:s});return _(d?.url)?o`
          <media-tooltip class="vds-download-tooltip vds-tooltip">
            <media-tooltip-trigger>
              <a
                role="button"
                class="vds-download-button vds-button"
                aria-label=${u(e,"Download")}
                href=${Se(d.url,{download:d.name})}
                download=${d.name}
                target="_blank"
              >
                <slot name="download-icon" data-class="vds-icon" />
              </a>
            </media-tooltip-trigger>
            <media-tooltip-content class="vds-tooltip-content" placement="top">
              ${u(e,"Download")}
            </media-tooltip-content>
          </media-tooltip>
        `:null})}function dt(){const{translations:t}=r();return o`
    <media-captions
      class="vds-captions"
      .exampleText=${u(t,"Captions look like this")}
    ></media-captions>
  `}function C(){return o`<div class="vds-controls-spacer"></div>`}function qt(t,e){return o`
    <media-menu-portal .container=${a(t)} disabled="fullscreen">
      ${e}
    </media-menu-portal>
  `}function Qt(t,e,s,n){let i=_(e)?document.querySelector(e):e;i||(i=t?.closest("dialog")),i||(i=document.body);const l=document.createElement("div");l.style.display="contents",l.classList.add(s),i.append(l),T(()=>{if(!l)return;const{viewType:m}=v(),p=n();N(l,"data-view-type",m()),N(l,"data-sm",p),N(l,"data-lg",!p),N(l,"data-size",p?"sm":"lg")});const{colorScheme:d}=r();return Mt(l,d),l}function Yt({placement:t,tooltip:e,portal:s}){const{textTracks:n}=w(),{viewType:i,seekableStart:l,seekableEnd:d}=v(),{translations:m,thumbnails:p,menuPortal:x,noModal:c,menuGroup:f,smallWhen:b}=r();if(h(()=>{const pe=l(),me=d(),yt=g(null);return Pt(n,"chapters",yt.set),!yt()?.cues.filter(xt=>xt.startTime<=me&&xt.endTime>=pe)?.length})())return null;const $=h(()=>c()?W(t):b()?null:W(t)),k=h(()=>!b()&&f()==="bottom"&&i()==="video"?26:0),L=g(!1);function Q(){L.set(!0)}function de(){L.set(!1)}const ce=o`
    <media-menu-items
      class="vds-chapters-menu-items vds-menu-items"
      placement=${a($)}
      offset=${a(k)}
    >
      ${a(()=>L()?o`
          <media-chapters-radio-group
            class="vds-chapters-radio-group vds-radio-group"
            .thumbnails=${a(p)}
          >
            <template>
              <media-radio class="vds-chapter-radio vds-radio">
                <media-thumbnail class="vds-thumbnail"></media-thumbnail>
                <div class="vds-chapter-radio-content">
                  <span class="vds-chapter-radio-label" data-part="label"></span>
                  <span class="vds-chapter-radio-start-time" data-part="start-time"></span>
                  <span class="vds-chapter-radio-duration" data-part="duration"></span>
                </div>
              </media-radio>
            </template>
          </media-chapters-radio-group>
        `:null)}
    </media-menu-items>
  `;return o`
    <media-menu class="vds-chapters-menu vds-menu" @open=${Q} @close=${de}>
      <media-tooltip class="vds-tooltip">
        <media-tooltip-trigger>
          <media-menu-button
            class="vds-menu-button vds-button"
            aria-label=${u(m,"Chapters")}
          >
            ${S("menu-chapters")}
          </media-menu-button>
        </media-tooltip-trigger>
        <media-tooltip-content
          class="vds-tooltip-content"
          placement=${st(e)?a(e):e}
        >
          ${u(m,"Chapters")}
        </media-tooltip-content>
      </media-tooltip>
      ${qt(x,ce)}
    </media-menu>
  `}function X(t){const{style:e}=new Option;return e.color=t,e.color.match(/\((.*?)\)/)[1].replace(/,/g," ")}const ct={type:"color"},Qe={type:"radio",values:{"Monospaced Serif":"mono-serif","Proportional Serif":"pro-serif","Monospaced Sans-Serif":"mono-sans","Proportional Sans-Serif":"pro-sans",Casual:"casual",Cursive:"cursive","Small Capitals":"capitals"}},Ye={type:"slider",min:0,max:400,step:25,upIcon:null,downIcon:null},Ze={type:"slider",min:0,max:100,step:5,upIcon:null,downIcon:null},Xe={type:"radio",values:["None","Drop Shadow","Raised","Depressed","Outline"]},V={fontFamily:"pro-sans",fontSize:"100%",textColor:"#ffffff",textOpacity:"100%",textShadow:"none",textBg:"#000000",textBgOpacity:"100%",displayBg:"#000000",displayBgOpacity:"0%"},D=Object.keys(V).reduce((t,e)=>({...t,[e]:g(V[e])}),{});for(const t of Object.keys(D)){const e=localStorage.getItem(`vds-player:${F(t)}`);_(e)&&D[t].set(e)}function Je(){for(const t of Object.keys(D)){const e=V[t];D[t].set(e)}}let kt=!1,J=new Set;function ts(){const{player:t}=w();J.add(t),es(t),B(()=>J.delete(t)),kt||(Te(()=>{for(const e of Lt(D)){const s=D[e],n=V[e],i=`vds-player:${F(e)}`;T(()=>{const l=s(),d=l===n;for(const m of J)Zt(m,e,l);d?localStorage.removeItem(i):localStorage.setItem(i,l)})}},null),kt=!0)}function es(t){for(const e of Lt(D))Zt(t,e,D[e]())}function Zt(t,e,s){const n=V[e],i=`--media-user-${F(e)}`,l=s!==n?ss(e,s):null;if(e==="fontFamily"){const d=s==="capitals"?"small-caps":null;t.el?.style.setProperty("--media-user-font-variant",d)}t.el?.style.setProperty(i,l)}function ss(t,e){switch(t){case"fontFamily":return is(e);case"fontSize":case"textOpacity":case"textBgOpacity":case"displayBgOpacity":return ns(e);case"textColor":return`rgb(${X(e)} / var(--media-user-text-opacity, 1))`;case"textShadow":return as(e);case"textBg":return`rgb(${X(e)} / var(--media-user-text-bg-opacity, 1))`;case"displayBg":return`rgb(${X(e)} / var(--media-user-display-bg-opacity, 1))`}}function ns(t){return(parseInt(t)/100).toString()}function is(t){switch(t){case"mono-serif":return'"Courier New", Courier, "Nimbus Mono L", "Cutive Mono", monospace';case"mono-sans":return'"Deja Vu Sans Mono", "Lucida Console", Monaco, Consolas, "PT Mono", monospace';case"pro-sans":return'Roboto, "Arial Unicode Ms", Arial, Helvetica, Verdana, "PT Sans Caption", sans-serif';case"casual":return'"Comic Sans MS", Impact, Handlee, fantasy';case"cursive":return'"Monotype Corsiva", "URW Chancery L", "Apple Chancery", "Dancing Script", cursive';case"capitals":return'"Arial Unicode Ms", Arial, Helvetica, Verdana, "Marcellus SC", sans-serif + font-variant=small-caps';default:return'"Times New Roman", Times, Georgia, Cambria, "PT Serif Caption", serif'}}function as(t){switch(t){case"drop shadow":return"rgb(34, 34, 34) 1.86389px 1.86389px 2.79583px, rgb(34, 34, 34) 1.86389px 1.86389px 3.72778px, rgb(34, 34, 34) 1.86389px 1.86389px 4.65972px";case"raised":return"rgb(34, 34, 34) 1px 1px, rgb(34, 34, 34) 2px 2px";case"depressed":return"rgb(204, 204, 204) 1px 1px, rgb(34, 34, 34) -1px -1px";case"outline":return"rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px";default:return""}}let os=0;function A({label:t="",value:e="",children:s}){if(!t)return o`
      <div class="vds-menu-section">
        <div class="vds-menu-section-body">${s}</div>
      </div>
    `;const n=`vds-menu-section-${++os}`;return o`
    <section class="vds-menu-section" role="group" aria-labelledby=${n}>
      <div class="vds-menu-section-title">
        <header id=${n}>${t}</header>
        ${e?o`<div class="vds-menu-section-value">${e}</div>`:null}
      </div>
      <div class="vds-menu-section-body">${s}</div>
    </section>
  `}function pt({label:t,children:e}){return o`
    <div class="vds-menu-item">
      <div class="vds-menu-item-label">${t}</div>
      ${e}
    </div>
  `}function O({label:t,icon:e,hint:s}){return o`
    <media-menu-button class="vds-menu-item">
      ${S("menu-arrow-left","vds-menu-close-icon")}
      ${e?S(e,"vds-menu-item-icon"):null}
      <span class="vds-menu-item-label">${a(t)}</span>
      <span class="vds-menu-item-hint" data-part="hint">${s?a(s):null} </span>
      ${S("menu-arrow-right","vds-menu-open-icon")}
    </media-menu-button>
  `}function ls({value:t=null,options:e,hideLabel:s=!1,children:n=null,onChange:i=null}){function l(d){const{value:m,label:p}=d;return o`
      <media-radio class="vds-radio" value=${m}>
        ${S("menu-radio-check")}
        ${s?null:o`
              <span class="vds-radio-label" data-part="label">
                ${_(p)?p:a(p)}
              </span>
            `}
        ${st(n)?n(d):n}
      </media-radio>
    `}return o`
    <media-radio-group
      class="vds-radio-group"
      value=${_(t)?t:t?a(t):""}
      @change=${i}
    >
      ${I(e)?e.map(l):a(()=>e().map(l))}
    </media-radio-group>
  `}function rs(t){return I(t)?t.map(e=>({label:e,value:e.toLowerCase()})):Object.keys(t).map(e=>({label:e,value:t[e]}))}function mt(){return o`
    <div class="vds-slider-track"></div>
    <div class="vds-slider-track-fill vds-slider-track"></div>
    <div class="vds-slider-thumb"></div>
  `}function vt(){return o`
    <media-slider-steps class="vds-slider-steps">
      <template>
        <div class="vds-slider-step"></div>
      </template>
    </media-slider-steps>
  `}function ft({label:t=null,value:e=null,upIcon:s="",downIcon:n="",children:i,isMin:l,isMax:d}){const m=t||e,p=[n?S(n,"down"):null,i,s?S(s,"up"):null];return o`
    <div
      class=${`vds-menu-item vds-menu-slider-item${m?" group":""}`}
      data-min=${a(()=>l()?"":null)}
      data-max=${a(()=>d()?"":null)}
    >
      ${m?o`
            <div class="vds-menu-slider-title">
              ${[t?o`<div>${t}</div>`:null,e?o`<div>${e}</div>`:null]}
            </div>
            <div class="vds-menu-slider-body">${p}</div>
          `:p}
    </div>
  `}const us={...Ye,upIcon:"menu-opacity-up",downIcon:"menu-opacity-down"},ht={...Ze,upIcon:"menu-opacity-up",downIcon:"menu-opacity-down"};function ds(){return a(()=>{const{hasCaptions:t}=v(),{translations:e}=r();return t()?o`
      <media-menu class="vds-font-menu vds-menu">
        ${O({label:()=>y(e,"Caption Styles")})}
        <media-menu-items class="vds-menu-items">
          ${[A({label:u(e,"Font"),children:[cs(),ps()]}),A({label:u(e,"Text"),children:[ms(),fs(),vs()]}),A({label:u(e,"Text Background"),children:[hs(),$s()]}),A({label:u(e,"Display Background"),children:[bs(),gs()]}),A({children:[ys()]})]}
        </media-menu-items>
      </media-menu>
    `:null})}function cs(){return M({label:"Family",option:Qe,type:"fontFamily"})}function ps(){return M({label:"Size",option:us,type:"fontSize"})}function ms(){return M({label:"Color",option:ct,type:"textColor"})}function vs(){return M({label:"Opacity",option:ht,type:"textOpacity"})}function fs(){return M({label:"Shadow",option:Xe,type:"textShadow"})}function hs(){return M({label:"Color",option:ct,type:"textBg"})}function $s(){return M({label:"Opacity",option:ht,type:"textBgOpacity"})}function bs(){return M({label:"Color",option:ct,type:"displayBg"})}function gs(){return M({label:"Opacity",option:ht,type:"displayBgOpacity"})}function ys(){const{translations:t}=r();return o`
    <button class="vds-menu-item" role="menuitem" @click=${Je}>
      <span class="vds-menu-item-label">${a(()=>y(t,"Reset"))}</span>
    </button>
  `}function M({label:t,option:e,type:s}){const{player:n}=w(),{translations:i}=r(),l=D[s],d=()=>y(i,t);function m(){De(),n.dispatchEvent(new Event("vds-font-change"))}if(e.type==="color"){let c=function(f){l.set(f.target.value),m()};return pt({label:a(d),children:o`
        <input
          class="vds-color-picker"
          type="color"
          .value=${a(l)}
          @input=${c}
        />
      `})}if(e.type==="slider"){let L=function(Q){l.set(Q.detail+"%"),m()};const{min:c,max:f,step:b,upIcon:$,downIcon:k}=e;return ft({label:a(d),value:a(l),upIcon:$,downIcon:k,isMin:()=>l()===c+"%",isMax:()=>l()===f+"%",children:o`
        <media-slider
          class="vds-slider"
          min=${c}
          max=${f}
          step=${b}
          key-step=${b}
          .value=${a(()=>parseInt(l()))}
          aria-label=${a(d)}
          @value-change=${L}
          @drag-value-change=${L}
        >
          ${mt()}${vt()}
        </media-slider>
      `})}const p=rs(e.values),x=()=>{const c=l(),f=p.find(b=>b.value===c)?.label||"";return y(i,_(f)?f:f())};return o`
    <media-menu class=${`vds-${F(s)}-menu vds-menu`}>
      ${O({label:d,hint:x})}
      <media-menu-items class="vds-menu-items">
        ${ls({value:l,options:p,onChange({detail:c}){l.set(c),m()}})}
      </media-menu-items>
    </media-menu>
  `}function Xt({label:t,checked:e,defaultChecked:s=!1,storageKey:n,onChange:i}){const{translations:l}=r(),d=g(!!((n?localStorage.getItem(n):null)??s)),m=g(!1),p=a(Ae(d)),x=u(l,t);n&&i(Ct(d)),e&&T(()=>{d.set(e())});function c($){$?.button!==1&&(d.set(k=>!k),n&&localStorage.setItem(n,d()?"1":""),i(d(),$),m.set(!1))}function f($){Ce($)&&c()}function b($){$.button===0&&m.set(!0)}return o`
    <div
      class="vds-menu-checkbox"
      role="menuitemcheckbox"
      tabindex="0"
      aria-label=${x}
      aria-checked=${p}
      data-active=${a(()=>m()?"":null)}
      @pointerup=${c}
      @pointerdown=${b}
      @keydown=${f}
    ></div>
  `}function xs(){return a(()=>{const{translations:t}=r();return o`
      <media-menu class="vds-accessibility-menu vds-menu">
        ${O({label:()=>y(t,"Accessibility"),icon:"menu-accessibility"})}
        <media-menu-items class="vds-menu-items">
          ${[A({children:[Ss(),ws()]}),A({children:[ds()]})]}
        </media-menu-items>
      </media-menu>
    `})}function Ss(){const{userPrefersAnnouncements:t,translations:e}=r(),s="Announcements";return pt({label:u(e,s),children:Xt({label:s,storageKey:"vds-player::announcements",onChange(n){t.set(n)}})})}function ws(){return a(()=>{const{translations:t,userPrefersKeyboardAnimations:e,noKeyboardAnimations:s}=r(),{viewType:n}=v();if(h(()=>n()!=="video"||s())())return null;const i="Keyboard Animations";return pt({label:u(t,i),children:Xt({label:i,defaultChecked:!0,storageKey:"vds-player::keyboard-animations",onChange(l){e.set(l)}})})})}function Ts(){return a(()=>{const{noAudioGain:t,translations:e}=r(),{audioTrack:s,audioTracks:n,canSetAudioGain:i}=v();return h(()=>!(i()&&!t())&&n().length<=1)()?null:o`
      <media-menu class="vds-audio-menu vds-menu">
        ${O({label:()=>y(e,"Audio"),icon:"menu-audio",hint:()=>s()?.label??""})}
        <media-menu-items class="vds-menu-items">
          ${[ks(),As()]}
        </media-menu-items>
      </media-menu>
    `})}function ks(){return a(()=>{const{translations:t}=r(),{audioTracks:e}=v(),s=u(t,"Default");return h(()=>e().length<=1)()?null:A({children:o`
        <media-menu class="vds-audio-tracks-menu vds-menu">
          ${O({label:()=>y(t,"Track")})}
          <media-menu-items class="vds-menu-items">
            <media-audio-radio-group
              class="vds-audio-track-radio-group vds-radio-group"
              empty-label=${s}
            >
              <template>
                <media-radio class="vds-audio-track-radio vds-radio">
                  <slot name="menu-radio-check-icon" data-class="vds-icon"></slot>
                  <span class="vds-radio-label" data-part="label"></span>
                </media-radio>
              </template>
            </media-audio-radio-group>
          </media-menu-items>
        </media-menu>
      `})})}function As(){return a(()=>{const{noAudioGain:t,translations:e}=r(),{canSetAudioGain:s}=v();if(h(()=>!s()||t())())return null;const{audioGain:n}=v();return A({label:u(e,"Boost"),value:a(()=>Math.round(((n()??1)-1)*100)+"%"),children:[ft({upIcon:"menu-audio-boost-up",downIcon:"menu-audio-boost-down",children:Cs(),isMin:()=>((n()??1)-1)*100<=Jt(),isMax:()=>((n()??1)-1)*100===te()})]})})}function Cs(){const{translations:t}=r(),e=u(t,"Boost"),s=Jt,n=te,i=Ds;return o`
    <media-audio-gain-slider
      class="vds-audio-gain-slider vds-slider"
      aria-label=${e}
      min=${a(s)}
      max=${a(n)}
      step=${a(i)}
      key-step=${a(i)}
    >
      ${mt()}${vt()}
    </media-audio-gain-slider>
  `}function Jt(){const{audioGains:t}=r(),e=t();return I(e)?e[0]??0:e.min}function te(){const{audioGains:t}=r(),e=t();return I(e)?e[e.length-1]??300:e.max}function Ds(){const{audioGains:t}=r(),e=t();return I(e)?e[1]-e[0]||25:e.step}function Ms(){return a(()=>{const{translations:t}=r(),{hasCaptions:e}=v(),s=u(t,"Off");return e()?o`
      <media-menu class="vds-captions-menu vds-menu">
        ${O({label:()=>y(t,"Captions"),icon:"menu-captions"})}
        <media-menu-items class="vds-menu-items">
          <media-captions-radio-group
            class="vds-captions-radio-group vds-radio-group"
            off-label=${s}
          >
            <template>
              <media-radio class="vds-caption-radio vds-radio">
                <slot name="menu-radio-check-icon" data-class="vds-icon"></slot>
                <span class="vds-radio-label" data-part="label"></span>
              </media-radio>
            </template>
          </media-captions-radio-group>
        </media-menu-items>
      </media-menu>
    `:null})}function Is(){return a(()=>{const{hideQualityBitrate:t,translations:e}=r(),{canSetQuality:s,qualities:n}=v();if(!s()||n().length<=1)return null;const i=u(e,"Auto");return o`
      <media-menu class="vds-quality-menu vds-menu">
        ${O({label:()=>y(e,"Quality"),icon:"menu-quality-up"})}
        <media-menu-items class="vds-menu-items">
          <media-quality-radio-group
            class="vds-quality-radio-group vds-radio-group"
            auto-label=${i}
            ?hide-bitrate=${a(t)}
          >
            <template>
              <media-radio class="vds-quality-radio vds-radio">
                <slot name="menu-radio-check-icon" data-class="vds-icon"></slot>
                <span class="vds-radio-label" data-part="label"></span>
                <span class="vds-radio-hint" data-part="bitrate"></span>
              </media-radio>
            </template>
          </media-quality-radio-group>
        </media-menu-items>
      </media-menu>
    `})}function Os(){return a(()=>{const{translations:t}=r(),{canSetPlaybackRate:e,playbackRate:s}=v();return e()?o`
      <media-menu class="vds-speed-menu vds-menu">
        ${O({label:()=>y(t,"Speed"),icon:"menu-speed-up",hint:()=>s()===1?y(t,"Normal"):s()+"x"})}
        <media-menu-items class="vds-menu-items">
          ${A({label:u(t,"Speed"),value:a(()=>s()===1?y(t,"Normal"):s()+"x"),children:ft({upIcon:"menu-font-size-up",downIcon:"menu-font-size-down",children:Ps(),isMin:()=>s()===ee(),isMax:()=>s()===se()})})}
        </media-menu-items>
      </media-menu>
    `:null})}function ee(){const{playbackRates:t}=r(),e=t();return I(e)?e[0]??0:e.min}function se(){const{playbackRates:t}=r(),e=t();return I(e)?e[e.length-1]??2:e.max}function _s(){const{playbackRates:t}=r(),e=t();return I(e)?e[1]-e[0]||.25:e.step}function Ps(){const{translations:t}=r(),e=u(t,"Speed"),s=ee,n=se,i=_s;return o`
    <media-speed-slider
      class="vds-speed-slider vds-slider"
      aria-label=${e}
      min=${a(s)}
      max=${a(n)}
      step=${a(i)}
      key-step=${a(i)}
    >
      ${mt()}${vt()}
    </media-speed-slider>
  `}function ne({placement:t,portal:e,tooltip:s}){return a(()=>{const{viewType:n}=v(),{translations:i,menuPortal:l,noModal:d,menuGroup:m,smallWhen:p}=r(),x=h(()=>d()?W(t):p()?null:W(t)),c=h(()=>!p()&&m()==="bottom"&&n()==="video"?26:0),f=g(!1);ts();function b(){f.set(!0)}function $(){f.set(!1)}const k=o`
      <media-menu-items
        class="vds-settings-menu-items vds-menu-items"
        placement=${a(x)}
        offset=${a(c)}
      >
        ${a(()=>f()?[Os(),Is(),xs(),Ts(),Ms()]:null)}
      </media-menu-items>
    `;return o`
      <media-menu class="vds-settings-menu vds-menu" @open=${b} @close=${$}>
        <media-tooltip class="vds-tooltip">
          <media-tooltip-trigger>
            <media-menu-button
              class="vds-menu-button vds-button"
              aria-label=${u(i,"Settings")}
            >
              ${S("menu-settings","vds-rotate-icon")}
            </media-menu-button>
          </media-tooltip-trigger>
          <media-tooltip-content
            class="vds-tooltip-content"
            placement=${st(s)?a(s):s}
          >
            ${u(i,"Settings")}
          </media-tooltip-content>
        </media-tooltip>
        ${qt(l,k)}
      </media-menu>
    `})}function $t({orientation:t,tooltip:e}){return a(()=>{const{pointer:s,muted:n,canSetVolume:i}=v();if(s()==="coarse"&&!n())return null;if(!i())return wt({tooltip:e});const l=g(void 0);return o`
      <div class="vds-volume" ?data-active=${a(we(l))} ${U(l.set)}>
        ${wt({tooltip:e})}
        <div class="vds-volume-popup">${Ls({orientation:t})}</div>
      </div>
    `})}function Ls({orientation:t}={}){const{translations:e}=r();return o`
    <media-volume-slider
      class="vds-volume-slider vds-slider"
      aria-label=${u(e,"Volume")}
      orientation=${it(t)}
    >
      <div class="vds-slider-track"></div>
      <div class="vds-slider-track-fill vds-slider-track"></div>
      <media-slider-preview class="vds-slider-preview" no-clamp>
        <media-slider-value class="vds-slider-value"></media-slider-value>
      </media-slider-preview>
      <div class="vds-slider-thumb"></div>
    </media-volume-slider>
  `}function bt(){const t=g(void 0),e=g(0),{thumbnails:s,translations:n,sliderChaptersMinWidth:i,disableTimeSlider:l,seekStep:d,noScrubGesture:m}=r(),p=u(n,"Seek"),x=a(l),c=a(()=>e()<i()),f=a(s);return It(t,()=>{const b=t();b&&e.set(b.clientWidth)}),o`
    <media-time-slider
      class="vds-time-slider vds-slider"
      aria-label=${p}
      key-step=${a(d)}
      ?disabled=${x}
      ?no-swipe-gesture=${a(m)}
      ${U(t.set)}
    >
      <media-slider-chapters class="vds-slider-chapters" ?disabled=${c}>
        <template>
          <div class="vds-slider-chapter">
            <div class="vds-slider-track"></div>
            <div class="vds-slider-track-fill vds-slider-track"></div>
            <div class="vds-slider-progress vds-slider-track"></div>
          </div>
        </template>
      </media-slider-chapters>
      <div class="vds-slider-thumb"></div>
      <media-slider-preview class="vds-slider-preview">
        <media-slider-thumbnail
          class="vds-slider-thumbnail vds-thumbnail"
          .src=${f}
        ></media-slider-thumbnail>
        <div class="vds-slider-chapter-title" data-part="chapter-title"></div>
        <media-slider-value class="vds-slider-value"></media-slider-value>
      </media-slider-preview>
    </media-time-slider>
  `}function Ns(){return o`
    <div class="vds-time-group">
      ${a(()=>{const{duration:t}=v();return t()?[o`<media-time class="vds-time" type="current"></media-time>`,o`<div class="vds-time-divider">/</div>`,o`<media-time class="vds-time" type="duration"></media-time>`]:null})}
    </div>
  `}function Gs(){return a(()=>{const{live:t,duration:e}=v();return t()?jt():e()?o`<media-time class="vds-time" type="current" toggle remainder></media-time>`:null})}function ie(){return a(()=>{const{live:t}=v();return t()?jt():Ns()})}function ae(){return a(()=>{const{textTracks:t}=w(),{title:e,started:s}=v(),n=g(null);return Pt(t,"chapters",n.set),n()&&(s()||!e())?oe():o`<media-title class="vds-chapter-title"></media-title>`})}function oe(){return o`<media-chapter-title class="vds-chapter-title"></media-chapter-title>`}var le=class extends Ue{async loadIcons(){const t=(await Le(async()=>{const{icons:s}=await import("./v3.PdSYDZbJ.js");return{icons:s}},__vite__mapDeps([0,1,2,3,4]),import.meta.url)).icons,e={};for(const s of Object.keys(t))e[s]=ze({name:s,paths:t[s]});return e}},Bs=class extends at{static props={...super.props,when:({viewType:t})=>t==="audio",smallWhen:({width:t})=>t<576}};function Vs(){return[ot(),dt(),o`
      <media-controls class="vds-controls">
        <media-controls-group class="vds-controls-group">
          ${[Tt({backward:!0,tooltip:"top start"}),j({tooltip:"top"}),Tt({tooltip:"top"}),Fs(),bt(),Gs(),$t({orientation:"vertical",tooltip:"top"}),rt({tooltip:"top"}),ut(),lt({tooltip:"top"}),Es()]}
        </media-controls-group>
      </media-controls>
    `]}function Fs(){return a(()=>{let t=g(void 0),e=g(!1),s=w(),{title:n,started:i,currentTime:l,ended:d}=v(),{translations:m}=r(),p=Ie(t),x=()=>i()||l()>0;const c=()=>`${y(m,d()?"Replay":x()?"Continue":"Play")}: ${n()}`;T(()=>{p()&&document.activeElement===document.body&&s.player.el?.focus({preventScroll:!0})});function f(){const $=t(),k=!!$&&!p()&&$.clientWidth<$.children[0].clientWidth;$&&Oe($,"vds-marquee",k),e.set(k)}function b(){return o`
        <span class="vds-title-text">
          ${a(c)}${a(()=>x()?oe():null)}
        </span>
      `}return It(t,f),n()?o`
          <span class="vds-title" title=${a(c)} ${U(t.set)}>
            ${[b(),a(()=>e()&&!p()?b():null)]}
          </span>
        `:C()})}function Es(){const t="top end";return[Yt({tooltip:"top",placement:t,portal:!0}),ne({tooltip:"top end",placement:t,portal:!0})]}var Rs=class extends Nt(Bt,Bs){static tagName="media-audio-layout";static attrs={smallWhen:{converter(t){return t!=="never"&&!!t}}};#t;#e=g(!1);onSetup(){this.forwardKeepAlive=!1,this.#t=w(),this.#n(),this.#a()}onConnect(){this.#n(),zt("audio",()=>this.isMatch),this.#i()}render(){return a(this.#s.bind(this))}#s(){return this.isMatch?Vs():null}#n(){this.classList.add("vds-audio-layout")}#i(){const{menuPortal:t}=r();T(()=>{if(!this.isMatch)return;const e=Qt(this,this.menuContainer,"vds-audio-layout",()=>this.isSmallLayout),s=e?[this,e]:[this];return(this.$props.customIcons()?new Rt(s):new le(s)).connect(),t.set(e),()=>{e.remove(),t.set(null)}})}#a(){const{pointer:t}=this.#t.$state;T(()=>{t()==="coarse"&&T(this.#o.bind(this))})}#o(){if(!this.#e()){Y(this,"pointerdown",this.#l.bind(this),{capture:!0});return}Y(this,"pointerdown",t=>t.stopPropagation()),Y(window,"pointerdown",this.#r.bind(this))}#l(t){const{target:e}=t;Me(e)&&e.closest(".vds-time-slider")&&(t.stopImmediatePropagation(),this.setAttribute("data-scrubbing",""),this.#e.set(!0))}#r(){this.#e.set(!1),this.removeAttribute("data-scrubbing")}};const Ws=H(class extends nt{constructor(){super(...arguments),this.key=P}render(t,e){return this.key=t,e}update(t,[e,s]){return e!==this.key&&(Be(t),this.key=e),s}});var Ks=class extends at{static props={...super.props,when:({viewType:t})=>t==="video",smallWhen:({width:t,height:e})=>t<576||e<380}};function re(){return a(()=>{const t=w(),{noKeyboardAnimations:e,userPrefersKeyboardAnimations:s}=r();if(h(()=>e()||!s())())return null;const n=g(!1),{lastKeyboardAction:i}=t.$state;T(()=>{n.set(!!i());const c=setTimeout(()=>n.set(!1),500);return()=>{n.set(!1),window.clearTimeout(c)}});const l=h(()=>{const c=i()?.action;return c&&n()?F(c):null}),d=h(()=>`vds-kb-action${n()?"":" hidden"}`),m=h(zs),p=h(()=>{const c=Hs();return c?_e(c):null});function x(){const c=p();return c?o`
        <div class="vds-kb-bezel">
          <div class="vds-kb-icon">${c}</div>
        </div>
      `:null}return o`
      <div class=${a(d)} data-action=${a(l)}>
        <div class="vds-kb-text-wrapper">
          <div class="vds-kb-text">${a(m)}</div>
        </div>
        ${a(()=>Ws(i(),x()))}
      </div>
    `})}function zs(){const{$state:t}=w(),e=t.lastKeyboardAction()?.action,s=t.audioGain()??1;switch(e){case"toggleMuted":return t.muted()?"0%":At(t.volume(),s);case"volumeUp":case"volumeDown":return At(t.volume(),s);default:return""}}function At(t,e){return`${Math.round(t*e*100)}%`}function Hs(){const{$state:t}=w();switch(t.lastKeyboardAction()?.action){case"togglePaused":return t.paused()?"kb-pause-icon":"kb-play-icon";case"toggleMuted":return t.muted()||t.volume()===0?"kb-mute-icon":t.volume()>=.5?"kb-volume-up-icon":"kb-volume-down-icon";case"toggleFullscreen":return`kb-fs-${t.fullscreen()?"enter":"exit"}-icon`;case"togglePictureInPicture":return`kb-pip-${t.pictureInPicture()?"enter":"exit"}-icon`;case"toggleCaptions":return t.hasCaptions()?`kb-cc-${t.textTrack()?"on":"off"}-icon`:null;case"volumeUp":return"kb-volume-up-icon";case"volumeDown":return"kb-volume-down-icon";case"seekForward":return"kb-seek-forward-icon";case"seekBackward":return"kb-seek-backward-icon";default:return null}}function Us(){return[ot(),ue(),q(),re(),dt(),o`<div class="vds-scrim"></div>`,o`
      <media-controls class="vds-controls">
        ${[qs(),C(),o`<media-controls-group class="vds-controls-group"></media-controls-group>`,C(),o`
            <media-controls-group class="vds-controls-group">
              ${bt()}
            </media-controls-group>
          `,o`
            <media-controls-group class="vds-controls-group">
              ${[j({tooltip:"top start"}),$t({orientation:"horizontal",tooltip:"top"}),ie(),ae(),rt({tooltip:"top"}),js(),lt({tooltip:"top"}),Ht({tooltip:"top"}),ut(),qe(),Ut({tooltip:"top end"})]}
            </media-controls-group>
          `]}
      </media-controls>
    `]}function js(){return a(()=>{const{menuGroup:t}=r();return t()==="bottom"?gt():null})}function qs(){return o`
    <media-controls-group class="vds-controls-group">
      ${a(()=>{const{menuGroup:t}=r();return t()==="top"?[C(),gt()]:null})}
    </media-controls-group>
  `}function Qs(){return[ot(),ue(),q(),dt(),re(),o`<div class="vds-scrim"></div>`,o`
      <media-controls class="vds-controls">
        <media-controls-group class="vds-controls-group">
          ${[lt({tooltip:"top start"}),Ht({tooltip:"bottom start"}),C(),rt({tooltip:"bottom"}),ut(),gt(),$t({orientation:"vertical",tooltip:"bottom end"})]}
        </media-controls-group>

        ${C()}

        <media-controls-group class="vds-controls-group" style="pointer-events: none;">
          ${[C(),j({tooltip:"top"}),C()]}
        </media-controls-group>

        ${C()}

        <media-controls-group class="vds-controls-group">
          ${[ie(),ae(),Ut({tooltip:"top end"})]}
        </media-controls-group>

        <media-controls-group class="vds-controls-group">
          ${bt()}
        </media-controls-group>
      </media-controls>
    `,Zs()]}function Ys(){return o`
    <div class="vds-load-container">
      ${[q(),j({tooltip:"top"})]}
    </div>
  `}function Zs(){return a(()=>{const{duration:t}=v();return t()===0?null:o`
      <div class="vds-start-duration">
        <media-time class="vds-time" type="duration"></media-time>
      </div>
    `})}function q(){return o`
    <div class="vds-buffering-indicator">
      <media-spinner class="vds-buffering-spinner"></media-spinner>
    </div>
  `}function gt(){const{menuGroup:t,smallWhen:e}=r(),s=()=>t()==="top"||e()?"bottom":"top",n=h(()=>`${s()} ${t()==="top"?"end":"center"}`),i=h(()=>`${s()} end`);return[Yt({tooltip:n,placement:i,portal:!0}),ne({tooltip:n,placement:i,portal:!0})]}function ue(){return a(()=>{const{noGestures:t}=r();return t()?null:o`
      <div class="vds-gestures">
        <media-gesture class="vds-gesture" event="pointerup" action="toggle:paused"></media-gesture>
        <media-gesture
          class="vds-gesture"
          event="pointerup"
          action="toggle:controls"
        ></media-gesture>
        <media-gesture
          class="vds-gesture"
          event="dblpointerup"
          action="toggle:fullscreen"
        ></media-gesture>
        <media-gesture class="vds-gesture" event="dblpointerup" action="seek:-10"></media-gesture>
        <media-gesture class="vds-gesture" event="dblpointerup" action="seek:10"></media-gesture>
      </div>
    `})}var Xs=class extends Nt(Bt,Ks){static tagName="media-video-layout";static attrs={smallWhen:{converter(t){return t!=="never"&&!!t}}};#t;onSetup(){this.forwardKeepAlive=!1,this.#t=w(),this.#e()}onConnect(){this.#e(),zt("video",()=>this.isMatch),this.#s()}render(){return a(this.#n.bind(this))}#e(){this.classList.add("vds-video-layout")}#s(){const{menuPortal:t}=r();T(()=>{if(!this.isMatch)return;const e=Qt(this,this.menuContainer,"vds-video-layout",()=>this.isSmallLayout),s=e?[this,e]:[this];return(this.$props.customIcons()?new Rt(s):new le(s)).connect(),t.set(e),()=>{e.remove(),t.set(null)}})}#n(){const{load:t}=this.#t.$props,{canLoad:e,streamType:s,nativeControls:n}=this.#t.$state;return!n()&&this.isMatch?t()==="play"&&!e()?Ys():s()==="unknown"?q():this.isSmallLayout?Qs():Us():null}};Gt(Rs);Gt(Xs);
