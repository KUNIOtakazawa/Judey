"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Judey = /*#__PURE__*/_createClass( /**対象要素 */

function Judey(Selecter, SeachType, ans) {
  var _this = this;
  _classCallCheck(this, Judey);
  _defineProperty(this, "_Data", null);
  _defineProperty(this, "_Length", null);
  _defineProperty(this, "_Parent", null);
  _defineProperty(this, "_ChildCount", 0);
  _defineProperty(this, "_DataCheck", function (value) {
    return typeof value === "string" && _this._Length >= 0 ? true : false;
  });
  _defineProperty(this, "_Touch", function ($Target, Method, X, Y, LifeTime, IsCompleteRem) {
    var Mode = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
    $Target.Event("touchstart", work);
    function work() {
      var Move_X = 0;
      var Move_Y = 0;
      var IsComplete = false;
      var LifeStart = Date.now();
      var LifeEnd = LifeStart + LifeTime;
      var IsActive_move = true;
      var IsActive_end = true;
      var IsScrollX = X === 0 ? false : X > 0 ? "up" : "down";
      var IsScrollY = Y === 0 ? false : Y > 0 ? "up" : "down";
      var CompMoveValue_X = 0,
        CompMoveValue_Y = 0;

      //初期位置設定
      $Target.OnceEvent("touchmove", function (e) {
        e.preventDefault();
        Move_X = Math.trunc(e.targetTouches[0].screenX);
        Move_Y = Math.trunc(e.targetTouches[0].screenY);
      });
      $Target.OnceEvent("touchmove", MoveEvent);
      $Target.OnceEvent("touchend", EndEvent);
      setTimeout(RemMove, LifeTime);
      setTimeout(RemEnd, LifeTime);
      function CheckMove(event) {
        var Scrolls = event.targetTouches[0];
        var NowMove_X = Scrolls.screenX - Move_X;
        var NowMove_Y = Scrolls.screenY - Move_Y;
        var Row = function () {
          return IsScrollX === false ? true : IsScrollX === "up" ? NowMove_X > X ? true : false : IsScrollX === "down" ? NowMove_X < X ? true : false : false;
        }();
        var Column = function () {
          return IsScrollY === false ? true : IsScrollY === "up" ? NowMove_Y > Y ? true : false : IsScrollY === "down" ? NowMove_Y < Y ? true : false : false;
        }();
        if (Row === true && Column === true) {
          CompMoveValue_X = Mode === null ? Math.floor(NowMove_X) : Math.floor(NowMove_X) - CompMoveValue_X;
          CompMoveValue_Y = Mode === null ? Math.floor(NowMove_Y) : Math.floor(NowMove_Y) - CompMoveValue_Y;
          return true;
        }
        return false;
      }
      function MoveEvent(e) {
        IsActive_move = false;
        var NowLife = LifeEnd - Date.now();
        if (NowLife < 1) return;
        if (CheckMove(e)) {
          //Moveモード時は指定以上の移動後は毎回変化量を返却する。
          if (Mode === "Move") {
            Method($Target.Elem(), CompMoveValue_X, CompMoveValue_Y);
            $Target.OnceEvent("touchmove", MoveEvent);
          }
          if (Mode === null || IsComplete === false) {
            IsComplete = true;
            setTimeout(RemEnd, NowLife); //LifeTimeまで
          }

          return;
        } else {
          IsActive_move = true;
          setTimeout(function () {
            return $Target.OnceEvent("touchmove", MoveEvent);
          }, 50);
        }
      }
      function EndEvent() {
        IsActive_end = false;
        RemMove();
        //完了かつMoveモードでないこと。
        if (IsComplete && Mode === null) {
          Method($Target.Elem(), CompMoveValue_X, CompMoveValue_Y);
          IsComplete = false;
          return;
        }
      }
      //Moveイベントの削除
      function RemMove() {
        if (IsActive_move) {
          $Target.RemEvent("touchmove", MoveEvent);
          IsActive_move = false;
        }
      }
      //Endイベントの削除
      function RemEnd() {
        if (IsActive_end) {
          $Target.RemEvent("touchend", EndEvent);
          if (IsCompleteRem) $Target.RemEvent("touchstart", work);
          IsActive_end = false;
        }
      }
    }
  });
  switch (SeachType) {
    case 1:
      this._Data = document.getElementById(Selecter);
      this._Length = !this._Data ? -1 : 0;
      break;
    case 2:
      this._Data = document.getElementsByClassName(Selecter);
      break;
    case 3:
      this._Data = document.getElementsByTagName(Selecter);
      break;
    case 4:
      this._Data = document.querySelectorAll(Selecter);
      break;
    case 0:
      this._Data = Selecter;
      if (Selecter.tagName !== undefined) {
        this._Length = 0;
      } else {
        SeachType = 2;
      }
      break;
    default:
      return;
  }
  if (SeachType > 1) this._Length = this._Data.length - 1;

  //取得要素が1つの場合は単一扱い
  if (SeachType > 1 && this._Length === 0) this._Data = this._Data[0];

  //false時は取得要素を返却して終了。
  if (ans === false) return this._Data;

  /**要素に対して繰り返し処理を行う。 */
  this._each = function (func) {
    if (_this._Length === 0) {
      func(_this._Data, 0);
      return;
    }
    for (var i = 0; i <= _this._Length; i++) func(_this._Data[i], i);
    return;
  };
  //ID設定
  this.Id = function (value) {
    if (!_this._DataCheck(value) || value === "") return _this;
    _this._each(function (elem, i) {
      return elem.id = i === 0 ? value : value + (i + 1);
    });
    return _this;
  };
  //クラス設定
  this.Class = function (value) {
    if (!_this._DataCheck(value) || value === "") return _this;
    var ans = value.split(",");
    _this._each(function (elem) {
      return ans.forEach(function (v) {
        return elem.classList.add(v);
      });
    });
    return _this;
  };
  //クラス設定(toggle)
  this.Toggle = function (value) {
    if (!_this._DataCheck(value)) return _this;
    _this._each(function (elem) {
      return elem.classList.toggle(value);
    });
    return _this;
  };
  //属性値設定
  this.Attr = function (ans, value) {
    if (_this._Length < 0) return _this;
    if ([ans, value].filter(function (v) {
      return typeof v === "string";
    }).length === 2) _this._each(function (elem) {
      return elem.setAttribute(ans, value);
    });else try {
      Object.keys(ans).forEach(function (key) {
        return _this._each(function (elem) {
          return elem.setAttribute(key, ans[key]);
        });
      });
    } catch (error) {
      console.log(error);
    }
    return _this;
  };
  //スタイル設定
  this.Style = function (value) {
    if (!_this._DataCheck(value)) return _this;
    _this._each(function (elem) {
      return elem.style = value;
    });
    return _this;
  };
  //対象セレクタ直下に要素挿入
  //構文はJudey版insertAdjacent～
  //セレクタ移行は行わない。
  this.Append = function (Element, PosisionName) {
    var _Element$constructor;
    if (Element == false || _this._Length !== 0) return _this;
    (Element === null || Element === void 0 ? void 0 : (_Element$constructor = Element.constructor) === null || _Element$constructor === void 0 ? void 0 : _Element$constructor.name) === "Judey" ? _this._Data.insertAdjacentElement(PosisionName, Element.Elem()) : Element.localName ? _this._Data.insertAdjacentElement(PosisionName, Element) : _this._Data.insertAdjacentHTML(PosisionName, Element);
    return _this;
  };
  //子要素挿入、対象にセレクタ移行
  this.Child = function (tag) {
    var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var cls = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
    if (!_this._DataCheck(tag) && _this._Length !== 0) return _this;
    if (_this._Parent === null) _this._Parent = _this._Data;
    var elem = document.createElement(tag);
    _this._Data.appendChild(elem);
    _this._Data = null;
    _this._ChildCount += 1;
    _this._Data = elem;
    return _this.Id(id).Class(cls);
  };
  //参照セレクタを対象子要素全てに設定する。
  this.$Children = function () {
    if (_this._Length === 0) {
      _this._Data = _this._Data.children;
    } else {
      var Collection = [];
      for (var i = 0; i <= _this._Length; i++) Collection.push.apply(Collection, _toConsumableArray(_this._Data[i].children));
      _this._Data = Collection;
    }
    _this._Length = _this._Data.length - 1;
    _this._Parent = null;
    _this._ChildCount = 0;
    return _this;
  };
  //連続した子要素挿入、セレクタ移行は行わない。
  this.ChildCreate = function (tag, id, cls, text, childcount) {
    if (!_this._DataCheck(tag) && _this._Length !== 0) return _this;
    if (_this._Parent === null) {
      _this._Parent = _this._Data;
    }
    for (var i = 0; i < childcount; i++) {
      var elem = document.createElement(tag);
      elem.id = _typeof(id) !== "object" ? id + (i + Number(1)) : id[i];
      elem.classList.add(_typeof(cls) !== "object" ? cls : cls[i]);
      if (["div", "span", "li", "td", "th", "label", "p"].find(function (v) {
        return v === tag;
      })) {
        elem.innerText = _typeof(text) !== "object" ? text : text[i];
      } else {
        elem.value = _typeof(text) !== "object" ? text : text[i];
      }
      _this._Data.appendChild(elem);
    }
    return _this;
  };
  //参照セレクタの階層を指定位置の親に戻す。
  this.Breaker = function () {
    var BackCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    if (_this._Length !== 0) return _this;
    if (_this._ChildCount - BackCount < 1) {
      _this._Data = _this._Parent;
      _this._ChildCount = 0;
    } else {
      for (var i = 0; i < BackCount; i++) {
        _this._Data = _this._Data.parentElement;
        _this._ChildCount -= 1;
      }
    }
    return _this;
  };
  //InnerText
  this.Text = function (value) {
    if (!_this._DataCheck(value)) return _this;
    _this._each(function (elem, i) {
      if (elem.innerText !== (_typeof(value) === "object" ? value[i] : value)) elem.innerText = _typeof(value) === "object" ? value[i] : value;
    });
    return _this;
  };
  //設定したプロパティ値を取得
  this.RetText = function (PropartyName) {
    if (!_this._DataCheck(PropartyName)) return null;
    var e = [];
    _this._each(function (elem) {
      return e.push(elem[PropartyName]);
    });
    return e.length === 1 ? e[0] : e.length > 1 ? e : null;
  };
  //InnerHTML
  this.Html = function (value) {
    if (!_this._DataCheck(value)) return _this;
    if (_this._Length === 0) _this._Data.innerHTML = value;
    return _this;
  };
  //イベント生成
  this.Event = function (e, act) {
    if (!_this._DataCheck(e) || typeof act !== "function") return _this;
    var ans = e.split(",");
    _this._each(function (elem) {
      return ans.forEach(function (Event) {
        return elem.addEventListener(Event, act, false);
      });
    });
    return _this;
  };
  //イベント生成
  this.OnceEvent = function (e, act) {
    if (!_this._DataCheck(e) || typeof act !== "function") return _this;
    var ans = e.split(",");
    _this._each(function (elem) {
      return ans.forEach(function (Event) {
        return elem.addEventListener(Event, act, {
          once: true
        });
      });
    });
    return _this;
  };
  this.Dispatch = function (EventName) {
    if (!_this._DataCheck(EventName)) return _this;
    _this._each(function (elem) {
      return elem.dispatchEvent(new Event(EventName));
    });
    return _this;
  };
  //フリック的なイベント
  this.FlickGo = function (GoMethod) {
    var Scroll_X = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var Scroll_Y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var Lifetime = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1000;
    var IsCompleteRem = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    return _this.FlickBase(GoMethod, Scroll_X, Scroll_Y, Lifetime, IsCompleteRem, null);
  };
  //フリック的なイベント(move)
  this.FlickMove = function (GoMethod) {
    var Scroll_X = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var Scroll_Y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var Lifetime = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1000;
    var IsCompleteRem = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    return _this.FlickBase(GoMethod, Scroll_X, Scroll_Y, Lifetime, IsCompleteRem, "Move");
  };
  this.FlickBase = function (GoMethod, X, Y, Lifetime, IsCompleteRem, Mode) {
    if (typeof GoMethod !== "function") return _this;
    _this._each(function (elem) {
      return _this._Touch(Judey.$elem(elem), GoMethod, X, Y, Lifetime, IsCompleteRem, Mode);
    });
    return _this;
  };
  //イベント削除
  this.RemEvent = function (e, act) {
    if (!_this._DataCheck(e) || typeof act !== "function") return _this;
    var ans = e.split(",");
    _this._each(function (elem) {
      ans.forEach(function (Event) {
        elem.removeEventListener(Event, act, false);
        elem.removeEventListener(Event, act, {
          once: true
        });
      });
    });
    return _this;
  };
  //自要素削除
  this.Rem = function () {
    if (_this._Length < 0) return _this;
    if (_this._Length === 0) _this._each(function (elem) {
      return elem.remove();
    });
    while (_this._Data.length > 0) _this._Data[0].remove();
  };
  //指定クラス削除
  this.RemClass = function (value) {
    if (!_this._DataCheck(value)) return _this;
    var ans = value.split(",");
    _this._each(function (elem) {
      return ans.forEach(function (v) {
        return elem.classList.remove(v);
      });
    });
    return _this;
  };
  //属性値削除
  this.RemAttr = function (key) {
    if (!_this._DataCheck(key)) return _this;
    var ans = key.split(",");
    _this._each(function (elem) {
      return ans.forEach(function (v) {
        return elem.removeAttribute(v);
      });
    });
    return _this;
  };
  //格納エレメント返却
  this.Elem = function () {
    return _this._Data;
  };

  //子要素の一致するクラスをセレクタに設定する。
  this.Search = function (value) {
    if (!_this._DataCheck(value) && _this._Length === 0) return _this;
    var ary = [];
    var parent = _this._Data.children;
    for (var i = 0; i < parent.length; i++) if (parent[i].classList.contains(value)) ary.push(cld);
    if (ary.length === 1) {
      _this._Data = ary[0];
      _this._Length = 0;
      _this._ChildCount = -1;
    } else {
      _this._Data = ary;
      _this._Length = ary.length - 1;
    }
    return _this;
  };
  //子要素を全て削除する、セレクターが単一要素時のみ。
  this.RemChild = function () {
    if (_this._Length !== 0) return _this;
    _this.Html("");
    return _this;
  };
  //InputのValue値を取得または設定
  this.InpText = function () {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (_this._Length < 0) return _this;
    var ary = [];
    _this._each(function (elem, i) {
      if (value === null) ary.push(elem.value);else {
        if (_typeof(value) !== "object") elem.value = value;else elem.value = value[i];
      }
    });
    return value !== null ? _this : ary.length === 1 ? ary[0] : ary;
  };
  return this;
}
//値が適性かチェック
);
_defineProperty(Judey, "$id", function (Selecter) {
  return new Judey(Selecter, 1, true);
});
_defineProperty(Judey, "$cls", function (Selecter) {
  return new Judey(Selecter, 2, true);
});
_defineProperty(Judey, "$tag", function (Selecter) {
  return new Judey(Selecter, 3, true);
});
_defineProperty(Judey, "$query", function (Selecter) {
  return new Judey(Selecter, 4, true);
});
_defineProperty(Judey, "$elem", function (Selecter) {
  return new Judey(Selecter, 0, true);
});
_defineProperty(Judey, "id", function (Selecter) {
  return new Judey(Selecter, 1, false);
});
_defineProperty(Judey, "cls", function (Selecter) {
  return new Judey(Selecter, 2, false);
});
_defineProperty(Judey, "tag", function (Selecter) {
  return new Judey(Selecter, 3, false);
});
_defineProperty(Judey, "query", function (Selecter) {
  return new Judey(Selecter, 4, false);
});
_defineProperty(Judey, "$Element", function (Tag) {
  var Id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var Class = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
  var elem = document.createElement(Tag);
  var func = Judey.$elem(elem);
  return func.Id(Id).Class(Class);
});
_defineProperty(Judey, "Element", function (Tag) {
  var Id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var Class = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
  return Judey.$Element(Tag, Id, Class).Elem();
});
_defineProperty(Judey, "Before", "beforeBegin");
_defineProperty(Judey, "InsertFirst", "afterBegin");
_defineProperty(Judey, "InsertLast", "beforeEnd");
_defineProperty(Judey, "After", "afterEnd");
