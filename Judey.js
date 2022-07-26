"use strict";
class Judey {
  #Data = null;
  #Length = null;
  #Parent = null;
  #ChildCount = 0;

  static $id = function (Selecter, ans = true) {
    return new Judey(Selecter, 1, ans);
  };
  static $cls = function (Selecter, ans = true) {
    return new Judey(Selecter, 2, ans);
  };
  static $tag = function (Selecter, ans = true) {
    return new Judey(Selecter, 3, ans);
  };
  static $elem = function (Selecter) {
    return new Judey(Selecter, 4, true);
  };
  constructor(Selecter, SeachType, ans) {
    switch (SeachType) {
      case 1:
        this.#Data = document.getElementById(Selecter);
        this.#Length = !this.#Data ? -1 : 0;
        break;
      case 2:
        this.#Data = document.getElementsByClassName(Selecter);
        break;
      case 3:
        this.#Data = document.getElementsByTagName(Selecter);
        break;
      case 4:
        this.#Data = Selecter;
        this.#Length = !this.#Data ? -1 : 0;
        break;
      default:
        return;
    }
    if (SeachType !== 1) this.#Length = this.#Data.length - 1;
    if (this.#Data.length === 0) return;
    if (SeachType > 1 && this.#Length === 0) {
      this.#Data = this.#Data[0];
    }
    if (ans === false) return this.#Data; //false時は取得要素を返却して終了。
    //ID設定
    this.Id = (value) => {
      if (!this.#DataCheck(value)) return this;
      if (this.#Length === 0) this.#Data.id = value;
      else {
        for (let i = 0; i <= this.#Length; i++) {
          this.#Data[i].id = value + (i + 1);
        }
      }
      return this;
    };
    //クラス設定
    this.Class = (value) => {
      if (!this.#DataCheck(value)) return this;
      if (this.#Length === 0) this.#Data.classList.add(value);
      else {
        for (let i = 0; i <= this.#Length; i++) {
          this.#Data[i].classList.add(value);
        }
      }
      return this;
    };
    //属性値設定
    this.Attr = (key, value) => {
      if (!this.#DataCheck(key) || typeof value !== "string") return this;
      if (this.#Length === 0) this.#Data.setAttribute(key, value);
      else {
        for (let i = 0; i <= this.#Length; i++) {
          this.#Data[i].setAttribute(key, value);
        }
      }
      return this;
    };
    //子要素挿入、対象にセレクタ移行
    this.Child = (tag) => {
      if (!this.#DataCheck(tag) && length !== 0) return this;
      if (this.#Parent === null) {
        this.#Parent = this.#Data;
      }
      const elem = document.createElement(tag);
      this.#Data.appendChild(elem);
      this.#Data = null;
      this.#ChildCount += 1;
      this.#Data = elem;
      return this;
    };
    //連続した子要素挿入、セレクタ移行は行わない。
    this.ChildCreate = (tag, id, cls, text, childcont) => {
      if (!this.#DataCheck(tag) && length !== 0) return this;
      if (this.#Parent === null) {
        this.#Parent = this.#Data;
      }
      for (let i = 0; i < childcont; i++) {
        const elem = document.createElement(tag);
        elem.id = typeof id !== "object" ? id + (i + Number(1)) : id[i];
        elem.classList.add(typeof cls !== "object" ? cls : cls[i]);
        if (
          tag == "div" ||
          tag == "span" ||
          tag == "li" ||
          tag == "td" ||
          tag == "th" ||
          tag == "label" ||
          tag == "p"
        ) {
          elem.innerText = typeof text !== "object" ? text : text[i];
        } else {
          elem.value = typeof text !== "object" ? text : text[i];
        }
        this.#Data.appendChild(elem);
      }
      return this;
    };
    //参照セレクタの階層をひとつ戻す。単一要素以外では機能しない。
    this.Breaker = () => {
      if (this.#ChildCount === -1) {
        this.#Data = this.#Parent;
        this.#ChildCount = 0;
        return this;
      }
      if (this.#ChildCount === 0 || this.#Length !== 0) return this;
      if (this.#ChildCount === 1 || this.#ChildCount === -1) {
        this.#Data = this.#Parent;
        this.#ChildCount = 0;
      } else {
        this.#Data = this.#Data.parentElement;
        this.#ChildCount -= 1;
      }
      return this;
    };
    //InnerText
    this.Text = (value) => {
      if (!this.#DataCheck(value)) return this;
      if (this.#Length === 0) this.#Data.innerText = value;
      else {
        for (let i = 0; i <= this.#Length; i++) {
          this.#Data[i].innerText =
            typeof value === "object" ? value[i] : value;
        }
      }
      return this;
    };
    //設定したプロパティ値を取得
    this.RetText = (PropartyName) => {
      if (!this.#DataCheck(PropartyName)) return null;
      if (this.#Length === 0) return this.#Data[PropartyName];
      else {
        let e = new Array();
        for (let i = 0; i <= this.#Length; i++) {
          e.push(this.#Data[i][PropartyName]);
        }
        return e.length !== 0 ? e : null;
      }
    };
    //InnerHTML
    this.Html = (value) => {
      if (!this.#DataCheck(value)) return this;
      if (this.#Length === 0) this.#Data.innerHTML = value;
      else {
        for (let i = 0; i <= this.#Length; i++) {
          this.#Data[i].innerHTML =
            typeof value === "object" ? value[i] : value;
        }
      }
      return this;
    };
    //イベント生成
    this.Event = (e, act) => {
      if (!this.#DataCheck(e) || typeof act !== "function") return this;
      if (this.#Length === 0) this.#Data.addEventListener(e, act, false);
      else {
        for (let i = 0; i <= this.#Length; i++) {
          this.#Data[i].addEventListener(e, act, false);
        }
      }
      return this;
    };
    //イベント削除
    this.RemEvent = (e, act) => {
      if (!this.#DataCheck(e) || typeof act !== "function") return this;
      if (this.#Length === 0) this.#Data.removeEventListener(e, act, false);
      else {
        for (let i = 0; i <= this.#Length; i++) {
          this.#Data[i].removeEventListener(e, act, false);
        }
      }
      return this;
      //クラス削除
    };
    //自要素削除
    this.Rem = ()=>this.#Data.remove();
    //指定クラス削除
    this.RemClass = (value) => {
      if (!this.#DataCheck(value)) return this;
      if (this.#Length === 0) this.#Data.classList.remove(value);
      else {
        for (let i = 0; i <= this.#Length; i++) {
          this.#Data[i].classList.remove(value);
        }
      }
      return this;
    };
    //属性値削除
    this.RemAttr = (key) => {
      if (!this.#DataCheck(key)) return this;
      if (this.#Length === 0) this.#Data.removeAttribute(key);
      else {
        for (let i = 0; i <= this.#Length; i++) {
          this.#Data[i].removeAttribute(key);
        }
      }
      return this;
    };
    //格納エレメント返却
    this.Elem = () => {
      return this.#Data;
    };
    //子要素の一致するクラスをセレクタに設定する。
    this.Search = (value) => {
      if (!this.#DataCheck(value) && this.#Length === 0) return this;
      let ary = new Array();
      const parent = this.#Data.children;
      for (let i = 0; i < parent.length; i++) {
        const cld = parent[i];
        if (cld.classList.contains(value) === true) {
          ary = ary.concat(cld);
        }
      }
      if (ary.length === 1) {
        this.#Data = ary[0];
        this.#Length = 0;
        this.#ChildCount = -1;
      } else {
        this.#Data = ary;
        this.#Length = ary.length - 1;
      }
      return this;
    };
    //子要素を全て削除する、セレクターが単一要素時のみ。
    this.RemChild = () => {
      if (this.#Length !== 0) return this;
      let remelem = this.#Data.firstChild;
      while (!!remelem) {
        remelem.remove();
        remelem = this.#Data.firstChild;
      }
      return this;
    };
    //InputのValue値を取得または設定
    this.InpText = (value) => {
      if (this.#Length < 0) return this;
      if (this.#Length === 0) {
        !value
          ? (value = this.#Data.value)
          : typeof value !== "object"
          ? (this.#Data.value = value)
          : (this.#Data.value = value[0]);
      } else {
        let ary = new Array();
        for (let i = 0; i <= this.#Length; i++) {
          !value
            ? ary.push(this.#Data[i].value)
            : (this.#Data[i].value =
                typeof value !== "object" ? value : value[i]);
        }
        return !value ? ary : this;
      }
    };
    return this;
  }
  //値が適性かチェック
  #DataCheck = (value) => {
    return typeof value === "string" && this.#Length >= 0 ? true : false;
  }
  //要素生成(parentなし)
  static Element=(Tag,Id="",Class="")=>{
    const elem = document.createElement(Tag);
    const func = this.$elem(elem);
    return func.Id(Id).Class(Class);
  }
  //for代行
  static For=(Count,func)=>{
    for(let i =0;i<Count;i++){
      func();
    }
  }
}
