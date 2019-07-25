webpackJsonp([4],{

/***/ 206:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(210)
}
var normalizeComponent = __webpack_require__(85)
/* script */
var __vue_script__ = __webpack_require__(213)
/* template */
var __vue_template__ = __webpack_require__(214)
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
Component.options.__file = "resources/assets/js/components/Main.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2e13bc20", Component.options)
  } else {
    hotAPI.reload("data-v-2e13bc20", Component.options)
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

/***/ 210:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(211);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(208)("33d285c2", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2e13bc20\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/_less-loader@5.0.0@less-loader/dist/cjs.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Main.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2e13bc20\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/_less-loader@5.0.0@less-loader/dist/cjs.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Main.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 211:
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(54);
exports = module.exports = __webpack_require__(53)(false);
// imports


// module
exports.push([module.i, "/*全局样式*/\n.main {\n  margin: 0 20px 20px;\n}\n.content {\n  padding: 20px;\n  background: #ffffff;\n}\n.logo {\n  background-color: #ff9900;\n  padding: 14px 0;\n}\n.header-avatar {\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  background: #f0ab49;\n  display: -webkit-inline-box;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  position: relative;\n  top: 0;\n  right: 10px;\n  background: url(" + escape(__webpack_require__(212)) + ");\n  background-size: 100%;\n}\n.el-header {\n  color: #333;\n  line-height: 60px;\n  background: #fff;\n  -webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);\n          box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);\n}\n.el-aside {\n  color: #333;\n  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);\n  -webkit-box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);\n}\n.el-menu {\n  border-right: none;\n}\n.side-menu .el-menu-item {\n  border-bottom-color: #ff9900;\n  background-color: #414858 !important;\n}\n.side-menu .menu-icon {\n  -webkit-transition: all 0.3s;\n  transition: all 0.3s;\n}\n.side-menu:not(.el-menu--collapse) {\n  width: 200px;\n  min-height: 400px;\n}\n.rotate-icon {\n  -webkit-transform: rotate(-90deg);\n  transform: rotate(-90deg);\n}\n/*创建订单、查看订单、重发订单输入框左侧菜单样式*/\n.icon-button {\n  line-height: 32px;\n  font-size: 22px;\n  height: 32px;\n}\n/*上传图片超过限制时隐藏增加图片按钮*/\n.exceed .el-upload {\n  display: none;\n}\n/*预览图片*/\n.preview-image {\n  width: auto;\n  max-width: 800px;\n  background-color: transparent;\n  border: none;\n  box-shadow: 0 0 0 0;\n  -webkit-box-shadow: 0 0 0 0;\n}\n/*限制预览图片的最大宽度*/\n.preview-image img {\n  max-width: 800px;\n}\n/*全局重写*/\n.el-main {\n  padding: 0;\n}\n.el-cascader,\n.el-select {\n  width: 100%;\n}\n.el-message {\n  top: 8px;\n}\n.el-form-item.is-success .el-input__inner,\n.el-form-item.is-success .el-input__inner:focus,\n.el-form-item.is-success .el-textarea__inner,\n.el-form-item.is-success .el-textarea__inner:focus {\n  border-color: #DCDFE6;\n}\n/*搜索表单样式*/\n.search-form-inline .el-select,\n.search-form-inline .el-date-editor--daterange.el-input__inner,\n.search-form-inline .el-form-item {\n  width: 100%;\n}\n.search-form-inline .el-range-separator {\n  width: 10%;\n}\n.search-form-inline .el-form-item__content {\n  width: 80%;\n}\n", ""]);

// exports


/***/ }),

/***/ 212:
/***/ (function(module, exports) {

module.exports = "/images/user_logo.jpeg?270a725f2178e822b337d267cb136385";

/***/ }),

/***/ 213:
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
    name: "Main",
    data: function data() {
        return {
            merchant_name: '',
            collapse: false,
            menus: null,
            openMenu: ['1'],
            menuMinHeight: '400px',
            contentContainerStyle: {
                minHeight: ''
            },
            breadcrumbList: []
        };
    },

    computed: {
        rotateIcon: function rotateIcon() {
            return ['menu-icon', this.collapse ? 'rotate-icon' : ''];
        }
    },
    created: function created() {
        this.handleMerchantName();
        window.addEventListener('resize', this.handleContentContainerStyle);
        this.handleContentContainerStyle();
        this.handleBreadcrumb();
    },

    methods: {
        handleMerchantName: function handleMerchantName() {
            this.merchant_name = sessionStorage.getItem('name');
        },
        handleCollapse: function handleCollapse() {
            if (this.collapse) {
                this.collapse = false;
                sessionStorage.setItem('collapse', '0');
            } else {
                this.collapse = true;
                sessionStorage.setItem('collapse', '1');
            }
        },
        handleContentContainerStyle: function handleContentContainerStyle() {
            window.fullHeight = document.documentElement.clientHeight;
            this.menuMinHeight = window.fullHeight + 'px';
            return this.contentContainerStyle.minHeight = window.fullHeight - 80 + 'px';
        },
        handleSelect: function handleSelect(key, keyPath) {
            sessionStorage.setItem('openMenu', keyPath[0]);
        },
        handleBreadcrumb: function handleBreadcrumb() {
            var matched = this.$route.matched;
            var currentThis = this;
            currentThis.breadcrumbList = [];
            matched.forEach(function (it) {
                currentThis.breadcrumbList.push({
                    name: it.meta.title,
                    path: it.path
                });
            });
        },
        handleLogout: function handleLogout() {
            var _this = this;

            this.$confirm('确认要退出?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                _this.$api.logout().then(function (res) {
                    sessionStorage.setItem('login', '');
                    window.location.href = '/login';
                });
            }).catch(function () {});
        }
    },
    beforeMount: function beforeMount() {
        this.openMenu[0] = sessionStorage.getItem('openMenu');
    },
    mounted: function mounted() {
        this.collapse = sessionStorage.getItem('collapse') == 1 ? true : false;
        this.menus = this.$router.options.routes;
    },

    watch: {
        $route: function $route() {
            this.handleBreadcrumb();
        }
    },
    destroyed: function destroyed() {
        window.removeEventListener('resize', this.handleContentContainerStyle);
    }
});

/***/ }),

/***/ 214:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "container" },
    [
      _c(
        "el-container",
        [
          _c(
            "el-aside",
            {
              style: {
                width: _vm.collapse ? "64px" : "200px",
                "background-color": "#515a6e"
              }
            },
            [
              _c("div", {
                staticClass: "logo",
                staticStyle: { height: "31px" },
                style: { width: _vm.collapse ? "64px" : "200px" }
              }),
              _vm._v(" "),
              _c(
                "el-menu",
                {
                  staticClass: "side-menu",
                  attrs: {
                    "default-openeds": _vm.openMenu,
                    "unique-opened": true,
                    "collapse-transition": false,
                    router: true,
                    "default-active": _vm.$route.path,
                    "background-color": "#515a6e",
                    "min-height": _vm.menuMinHeight,
                    "text-color": "#fff",
                    "active-text-color": "#ffd04b",
                    collapse: _vm.collapse
                  },
                  on: { select: _vm.handleSelect }
                },
                _vm._l(_vm.menus, function(item) {
                  return item.menu === true
                    ? _c(
                        "el-submenu",
                        {
                          key: item.id,
                          attrs: {
                            "show-timeout": 100,
                            "hide-timeout": 100,
                            index: item.path
                          }
                        },
                        [
                          _c("template", { slot: "title" }, [
                            _c("i", { class: item.icon }),
                            _vm._v(" "),
                            _c(
                              "span",
                              { attrs: { slot: "title" }, slot: "title" },
                              [_vm._v(_vm._s(item.meta.title))]
                            )
                          ]),
                          _vm._v(" "),
                          _vm._l(item.children, function(submenu) {
                            return submenu.menu === true
                              ? _c(
                                  "el-menu-item",
                                  {
                                    key: submenu.id,
                                    staticStyle: { "padding-left": "60px" },
                                    attrs: { index: item.path + submenu.path }
                                  },
                                  [
                                    _vm._v(
                                      "\n                        " +
                                        _vm._s(submenu.meta.title) +
                                        "\n                    "
                                    )
                                  ]
                                )
                              : _vm._e()
                          })
                        ],
                        2
                      )
                    : _vm._e()
                }),
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-container",
            [
              _c(
                "el-header",
                {
                  staticStyle: {
                    "font-size": "30px",
                    height: "60px",
                    "line-height": "60px"
                  }
                },
                [
                  _c("i", {
                    staticClass: "icon-ios-menu",
                    class: _vm.rotateIcon,
                    on: { click: _vm.handleCollapse }
                  }),
                  _vm._v(" "),
                  _c(
                    "el-menu",
                    {
                      staticClass: "el-menu-demo",
                      staticStyle: { float: "right" },
                      attrs: { mode: "horizontal" }
                    },
                    [
                      _c("el-menu-item", { attrs: { index: "1" } }, [
                        _c("i", { staticClass: "el-icon-bell" })
                      ]),
                      _vm._v(" "),
                      _c(
                        "el-submenu",
                        { attrs: { index: "2" } },
                        [
                          _c("template", { slot: "title" }, [
                            _c("span", { staticClass: "header-avatar" }),
                            _vm._v(
                              "\n                            欢迎，" +
                                _vm._s(_vm.merchant_name) +
                                "\n                        "
                            )
                          ]),
                          _vm._v(" "),
                          _c("el-menu-item", { attrs: { index: "2-1" } }, [
                            _vm._v("修改密码")
                          ]),
                          _vm._v(" "),
                          _c(
                            "el-menu-item",
                            {
                              attrs: { index: "2-2" },
                              on: { click: _vm.handleLogout }
                            },
                            [_vm._v("退出")]
                          )
                        ],
                        2
                      )
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c("el-main", [
                _c(
                  "div",
                  { style: _vm.contentContainerStyle },
                  [
                    _c(
                      "el-breadcrumb",
                      {
                        staticStyle: {
                          height: "45px",
                          "line-height": "45px",
                          "margin-left": "20px"
                        }
                      },
                      [
                        _c(
                          "el-breadcrumb-item",
                          { attrs: { to: { path: "/" } } },
                          [_vm._v("首页")]
                        ),
                        _vm._v(" "),
                        _vm._l(_vm.breadcrumbList, function(item) {
                          return _c(
                            "el-breadcrumb-item",
                            { key: item.path, attrs: { to: item.path } },
                            [
                              _vm._v(
                                "\n                            " +
                                  _vm._s(item.name) +
                                  "\n                        "
                              )
                            ]
                          )
                        })
                      ],
                      2
                    ),
                    _vm._v(" "),
                    _c("router-view")
                  ],
                  1
                )
              ])
            ],
            1
          )
        ],
        1
      )
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
    require("vue-hot-reload-api")      .rerender("data-v-2e13bc20", module.exports)
  }
}

/***/ })

});