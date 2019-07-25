webpackJsonp([1],{

/***/ 207:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(215)
}
var normalizeComponent = __webpack_require__(85)
/* script */
var __vue_script__ = __webpack_require__(217)
/* template */
var __vue_template__ = __webpack_require__(218)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/auth/Login.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-dca5370e", Component.options)
  } else {
    hotAPI.reload("data-v-dca5370e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 208:
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(209)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ 209:
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),

/***/ 215:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(216);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(208)("66a0ac07", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-dca5370e\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/_less-loader@5.0.0@less-loader/dist/cjs.js!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Login.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-dca5370e\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../node_modules/_less-loader@5.0.0@less-loader/dist/cjs.js!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Login.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 216:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(53)(false);
// imports


// module
exports.push([module.i, "\n.geetest_holder.geetest_mobile.geetest_ant .geetest_slider .geetest_slider_track .geetest_slider_tip.geetest_multi_slide {\n  word-wrap: break-word !important;\n  white-space: normal !important;\n  text-align: left !important;\n  font-size: 12px !important;\n  line-height: 40px !important;\n}\n.geetest_holder.geetest_mobile.geetest_ant .geetest_panel .geetest_copyright .geetest_logo {\n  width: 0 !important;\n}\n.geetest_holder.geetest_mobile.geetest_ant .geetest_panel .geetest_copyright .geetest_copyright_tip {\n  margin: 0 !important;\n}\n.login-register {\n  /*@keyframes move_wave {*/\n  /*0% {*/\n  /*transform: translateX(0) translateZ(0) scaleY(1)*/\n  /*}*/\n  /*50% {*/\n  /*transform: translateX(-25%) translateZ(0) scaleY(0.55)*/\n  /*}*/\n  /*100% {*/\n  /*transform: translateX(-50%) translateZ(0) scaleY(1)*/\n  /*}*/\n  /*}*/\n  /*.waveWrapper {*/\n  /*overflow: hidden;*/\n  /*position: absolute;*/\n  /*left: 0;*/\n  /*right: 0;*/\n  /*!*bottom: 0;*!*/\n  /*top: 0;*/\n  /*margin: auto;*/\n  /*width: 1000px;*/\n  /*height: 100px;*/\n  /*}*/\n  /*.waveWrapperInner {*/\n  /*position: absolute;*/\n  /*width: 100%;*/\n  /*overflow: hidden;*/\n  /*height: 100%;*/\n  /*bottom: -1px;*/\n  /*background-image: linear-gradient(to top, #fd6019 20%, #fd6019 80%);*/\n  /*}*/\n  /*.bgTop {*/\n  /*z-index: 15;*/\n  /*opacity: 0.5;*/\n  /*}*/\n  /*.bgMiddle {*/\n  /*z-index: 10;*/\n  /*opacity: 0.75;*/\n  /*}*/\n  /*.bgBottom {*/\n  /*z-index: 5;*/\n  /*}*/\n  /*.wave {*/\n  /*position: absolute;*/\n  /*left: 0;*/\n  /*width: 200%;*/\n  /*height: 100%;*/\n  /*background-repeat: repeat no-repeat;*/\n  /*background-position: 0 bottom;*/\n  /*transform-origin: center bottom;*/\n  /*}*/\n  /*.waveTop {*/\n  /*background-size: 50% 100px;*/\n  /*}*/\n  /*.waveAnimation .waveTop {*/\n  /*animation: move-wave 3s;*/\n  /*-webkit-animation: move-wave 3s;*/\n  /*-webkit-animation-delay: 1s;*/\n  /*animation-delay: 1s;*/\n  /*}*/\n  /*.waveMiddle {*/\n  /*background-size: 50% 120px;*/\n  /*}*/\n  /*.waveAnimation .waveMiddle {*/\n  /*animation: move_wave 10s linear infinite;*/\n  /*}*/\n  /*.waveBottom {*/\n  /*background-size: 50% 100px;*/\n  /*}*/\n  /*.waveAnimation .waveBottom {*/\n  /*animation: move_wave 15s linear infinite;*/\n  /*}*/\n}\n.login-register .el-input__inner {\n  border: none;\n  border-radius: 0;\n  border-bottom: 1px solid #f0f2f5;\n}\n.login-register .el-input__prefix .el-input__icon {\n  font-size: 26px;\n}\n.login-register .icon-youxiang {\n  font-size: 20px;\n}\n", ""]);

// exports


/***/ }),

/***/ 217:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    name: "Login",
    computed: {
        active: {
            get: function get() {
                return this.$route.path;
            },
            set: function set() {}
        }
    },
    data: function data() {
        var _this = this;

        var validatePass = function validatePass(rule, value, callback) {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== _this.formRegister.password) {
                callback(new Error('密码确认错误!'));
            } else {
                callback();
            }
        };
        return {
            loginPasswordErrorMessage: '',
            formLogin: {
                name: '',
                password: ''
            },
            formLoginRules: {
                name: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            },
            formRegisterRules: {
                name: [{ required: true, message: '请输入', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                password_confirmation: [{ validator: validatePass, trigger: 'blur' }]
            }
        };
    },

    methods: {
        handleTabClick: function handleTabClick(tab, event) {
            sessionStorage.setItem('loginRegisterActive', tab.name);
            this.$router.push(tab.name);
        },

        // 提交登录表单
        handleSubmitLoginForm: function handleSubmitLoginForm() {
            var _this2 = this;

            this.$refs.formLogin.validate(function (valid) {
                if (valid) {
                    _this2.loginPasswordErrorMessage = '';
                    // this.formLogin.password = encrypt(this.formLogin.password);
                    _this2.$api.login(_this2.formLogin).then(function (res) {
                        if (res.status === 1) {
                            console.log(res.data);
                            // sessionStorage.setItem('token', res.data.token);
                            // sessionStorage.setItem('success', 'success');
                            sessionStorage.setItem('name', res.data);
                            _this2.$router.push({ name: 'index', query: {} });
                        } else {
                            _this2.$message.error(res.message);
                            // this.loginPasswordErrorMessage = res.message;
                            _this2.formLogin.password = '';
                        }
                    }).catch(function (error) {
                        _this2.formLogin.password = '';
                    });
                }
            });
        }
    },
    created: function created() {
        // this.initLoginCaptcha();
        // this.initRegisterCaptcha();
    }
});

/***/ }),

/***/ 218:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "login-register",
      staticStyle: {
        width: "950px",
        margin: "100px auto 0 auto",
        background: "#ffffff",
        overflow: "hidden",
        border: "1px solid #fff",
        "border-radius": "10px"
      }
    },
    [
      _c("el-container", [
        _c(
          "div",
          { staticStyle: { width: "500px", padding: "50px 50px 0 50px" } },
          [
            _c(
              "el-tabs",
              {
                attrs: { id: "form" },
                on: { "tab-click": _vm.handleTabClick },
                model: {
                  value: _vm.active,
                  callback: function($$v) {
                    _vm.active = $$v
                  },
                  expression: "active"
                }
              },
              [
                _c(
                  "el-tab-pane",
                  { attrs: { label: "登录", name: "/login" } },
                  [
                    _c(
                      "el-form",
                      {
                        ref: "formLogin",
                        staticClass: "demo-ruleForm",
                        attrs: {
                          model: _vm.formLogin,
                          "status-icon": "",
                          rules: _vm.formLoginRules
                        }
                      },
                      [
                        _c(
                          "div",
                          { staticStyle: { "margin-top": "30px" } },
                          [
                            _c(
                              "el-form-item",
                              { attrs: { prop: "phone" } },
                              [
                                _c("el-input", {
                                  attrs: {
                                    placeholder: "请输入账号",
                                    "prefix-icon": "icon-user-o"
                                  },
                                  model: {
                                    value: _vm.formLogin.name,
                                    callback: function($$v) {
                                      _vm.$set(_vm.formLogin, "name", $$v)
                                    },
                                    expression: "formLogin.name"
                                  }
                                })
                              ],
                              1
                            ),
                            _vm._v(" "),
                            _c(
                              "el-form-item",
                              {
                                attrs: {
                                  error: _vm.loginPasswordErrorMessage,
                                  prop: "password"
                                }
                              },
                              [
                                _c("el-input", {
                                  attrs: {
                                    type: "password",
                                    placeholder: "请输入密码",
                                    "prefix-icon": "icon-lock-o"
                                  },
                                  model: {
                                    value: _vm.formLogin.password,
                                    callback: function($$v) {
                                      _vm.$set(_vm.formLogin, "password", $$v)
                                    },
                                    expression: "formLogin.password"
                                  }
                                })
                              ],
                              1
                            ),
                            _vm._v(" "),
                            _c(
                              "el-form-item",
                              [
                                _c(
                                  "el-row",
                                  { attrs: { gutter: 20 } },
                                  [
                                    _c(
                                      "el-col",
                                      { attrs: { span: 12 } },
                                      [
                                        _c(
                                          "el-button",
                                          {
                                            staticStyle: { width: "100%" },
                                            attrs: { type: "primary" },
                                            on: {
                                              click: function($event) {
                                                return _vm.handleSubmitLoginForm(
                                                  "form"
                                                )
                                              }
                                            }
                                          },
                                          [
                                            _vm._v(
                                              "\n                                            确认\n                                        "
                                            )
                                          ]
                                        )
                                      ],
                                      1
                                    )
                                  ],
                                  1
                                )
                              ],
                              1
                            )
                          ],
                          1
                        )
                      ]
                    )
                  ],
                  1
                )
              ],
              1
            )
          ],
          1
        ),
        _vm._v(" "),
        _c("div", [
          _c("img", {
            staticStyle: { height: "350px", display: "block" },
            attrs: { src: "", alt: "" }
          })
        ])
      ])
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-dca5370e", module.exports)
  }
}

/***/ })

});