"use strict";
/**DOM操作を補助する。 */
class Judey {
  /**対象要素 */
  _Data = null;
  /**0始まりの要素カウント */
  _Length = null;
  _Parent = null;
  _ChildCount = 0;
  
  /**id検索で一致した要素をJudeyに取り込む */
  static $id = function (Selecter) {
    return new Judey(Selecter, 1, true);
  };
  /**クラス検索で一致した要素をJudey要素に取り込む */
  static $cls = function (Selecter) {
    return new Judey(Selecter, 2, true);
  };
  /**タグ検索で一致した要素をJudey要素に取り込む */
  static $tag = function (Selecter) {
    return new Judey(Selecter, 3, true);
  };
  /**クエリ検索で一致した要素をJudey要素に取り込む */
  static $query = function(Selecter) {
    return new Judey(Selecter, 4, true);
  };
  /**入力要素をJudey要素に取り込む */
  static $elem = function (Selecter) {
    return new Judey(Selecter, 0, true);
  };
  /**Judey構文　getElementById */
  static id = function (Selecter) {
    return new Judey(Selecter, 1, false);
  };
  /**Judey構文　getElementsByClassName */
  static cls = function (Selecter) {
    return new Judey(Selecter, 2, false);
  };
  /**Judey構文　getElementsByTagName */
  static tag = function (Selecter) {
    return new Judey(Selecter, 3, false);
  };
  /**Judey構文　querySelectorAll */
  static query = function(Selecter) {
    return new Judey(Selecter, 4, false);
  };
  constructor(Selecter, SeachType, ans) {
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
    if (SeachType > 1)
      this._Length = this._Data.length - 1;
    
    //取得要素が1つの場合は単一扱い
    if (SeachType > 1 && this._Length === 0) 
      this._Data = this._Data[0];
    
    //false時は取得要素を返却して終了。
    if (ans === false) return this._Data; 
    
    /**要素に対して繰り返し処理を行う。 */
    this.EachElem = (func) => {
      if (this._Length === 0) {
        func(this._Data, 0);
        return;
      } 
      for (let i = 0; i <= this._Length; i++)
        func(this._Data[i], i);
      return;
    }
    //ID設定
    this.Id = (value) => {
      if (!this._DataCheck(value) || value === "") return this;
      this.EachElem((elem,i) => elem.id = i === 0 ? value : value + (i + 1));
      return this;
    };
    //クラス設定
    this.Class = (value) => {
      if (!this._DataCheck(value) || value === "") return this;
      const ans = value.split(",");
      this.EachElem(elem => ans.forEach(v => elem.classList.add(v)));
      return this;
    };
    //クラス設定(toggle)
    this.Toggle = (value) => {
      if (!this._DataCheck(value)) return this;
      this.EachElem(elem => elem.classList.toggle(value));
      return this;
    };
    //属性値設定
    this.Attr = (ans, value) => {
      if (this._Length < 0) return this;
      if ([ans, value].filter(v => typeof v === "string").length === 2)
        this.EachElem(elem => elem.setAttribute(ans, value));
      else
        try {
         Object.keys(ans)
          .forEach(key => this.EachElem(elem => elem.setAttribute(key, ans[key])));         
        } catch (error) {
          console.log(error);
        }
      return this;
    };
    //スタイル設定
    this.Style = (value) => {
      if (!this._DataCheck(value)) return this;
      this.EachElem(elem => elem.style = value);
      return this;
    };
    //対象セレクタ直下に要素挿入
    //構文はJudey版insertAdjacent～
    //セレクタ移行は行わない。
    this.Append = (Element, PosisionName) => {
      if (Element == false || this._Length !== 0) return this;
      Element?.constructor?.name === "Judey"
        ? this._Data.insertAdjacentElement(PosisionName, Element.Elem())
        : Element.localName
          ? this._Data.insertAdjacentElement(PosisionName, Element)
          : this._Data.insertAdjacentHTML(PosisionName, Element);
      return this;
    }
    //子要素挿入、対象にセレクタ移行
    this.Child = (tag , id = "", cls = "") => {
      if (!this._DataCheck(tag) && this._Length !== 0) return this;
      if (this._Parent === null) this._Parent = this._Data;
      
      const elem = document.createElement(tag);
      this._Data.appendChild(elem);
      this._Data = null;
      this._ChildCount += 1;
      this._Data = elem;
      return this.Id(id).Class(cls);
    };
    //参照セレクタを対象子要素全てに設定する。
    this.$Children = () => {
      if (this._Length === 0) {
        this._Data = this._Data.children;
      } else {
        let Collection = [];
        for (let i = 0; i <= this._Length; i++) 
          Collection.push(...this._Data[i].children);
        this._Data = Collection;
      }
      this._Length = this._Data.length - 1;
      this._Parent = null;
      this._ChildCount = 0;
      return this;
    }
    //連続した子要素挿入、セレクタ移行は行わない。
    this.ChildCreate = (tag, id, cls, text, childcount) => {
      if (!this._DataCheck(tag) && this._Length !== 0) return this;
      if (this._Parent === null) {
        this._Parent = this._Data;
      }
      for (let i = 0; i < childcount; i++) {
        const elem = document.createElement(tag);
        elem.id = typeof id !== "object" ? id + (i + Number(1)) : id[i];
        elem.classList.add(typeof cls !== "object" ? cls : cls[i]);
        if (["div", "span", "li", "td", "th", "label", "p"].find(v => v === tag)) {
          elem.innerText = typeof text !== "object" ? text : text[i];
        } else {
          elem.value = typeof text !== "object" ? text : text[i];
        }
        this._Data.appendChild(elem);
      }
      return this;
    };
    //参照セレクタの階層を指定位置の親に戻す。
    this.Breaker = (BackCount = 1) => {
      if (this._Length !== 0) return this;
      if ((this._ChildCount - BackCount) < 1) {
        this._Data = this._Parent;
        this._ChildCount = 0;
      } else {
        for (let i = 0; i < BackCount; i++) {
          this._Data = this._Data.parentElement;
          this._ChildCount -= 1;
        }
      }
      return this;
    };
    //InnerText
    this.Text = (value) => {
      if (!this._DataCheck(value)) return this;
      this.EachElem((elem, i) => {
        if (elem.innerText !== (typeof value === "object" ? value[i] : value))
          elem.innerText = typeof value === "object" ? value[i] : value;
      })
      return this;
    };
    //設定したプロパティ値を取得
    this.RetText = (PropartyName) => {
      if (!this._DataCheck(PropartyName)) return null;
      let e = [];
      this.EachElem(elem => e.push(elem[PropartyName]));
      return e.length === 1 ? e[0] : e.length > 1 ? e : null;
    };
    //InnerHTML
    this.Html = (value) => {
      if (!this._DataCheck(value)) return this;
      if (this._Length === 0) this._Data.innerHTML = value;
      return this;
    };
    //イベント生成
    this.Event = (e, act) => {
      if (!this._DataCheck(e) || typeof act !== "function") return this;
      const ans = e.split(",");
      this.EachElem(elem =>
        ans.forEach(Event => elem.addEventListener(Event, act, false)));
      return this;
    };
    //イベント生成
    this.OnceEvent = (e, act) => {
      if (!this._DataCheck(e) || typeof act !== "function") return this;
      const ans = e.split(",");
      this.EachElem(elem =>
        ans.forEach(Event => elem.addEventListener(Event, act, { once: true })));
      return this;
    };
    this.Dispatch = (EventName) => {
      if (!this._DataCheck(EventName)) return this;
      this.EachElem(elem => elem.dispatchEvent(new Event(EventName)));
      return this;
    };
    //フリック的なイベント
    this.FlickGo = (GoMethod, Scroll_X = 0, Scroll_Y = 0, Lifetime = 1000, IsCompleteRem = false) =>
      this.FlickBase(GoMethod, Scroll_X, Scroll_Y, Lifetime, IsCompleteRem, null);
    //フリック的なイベント(move)
    this.FlickMove = (GoMethod, Scroll_X = 0, Scroll_Y = 0, Lifetime = 1000, IsCompleteRem = false) =>
        this.FlickBase(GoMethod, Scroll_X, Scroll_Y, Lifetime, IsCompleteRem, "Move");
    this.FlickBase = (GoMethod, X, Y, Lifetime, IsCompleteRem, Mode) => {
      if (typeof GoMethod !== "function") return this;
      this.EachElem(elem => this._Touch(Judey.$elem(elem), GoMethod, X, Y, Lifetime, IsCompleteRem, Mode));
      return this;
    }
    //イベント削除
    this.RemEvent = (e, act) => {
      if (!this._DataCheck(e) || typeof act !== "function") return this;
      const ans = e.split(",");
      this.EachElem(elem => {
        ans.forEach(Event => {
          elem.removeEventListener(Event, act, false);
          elem.removeEventListener(Event, act, { once: true });
        });
      })
      return this;
    };
    //自要素削除
    this.Rem = () => {
      if (this._Length < 0) return this;
      if (this._Length === 0) this.EachElem(elem => elem.remove());
      while (this._Data.length > 0)
        this._Data[0].remove();
    };
    //指定クラス削除
    this.RemClass = (value) => {
      if (!this._DataCheck(value)) return this;
      const ans = value.split(",");
      this.EachElem(elem => ans.forEach(v => elem.classList.remove(v)));
      return this;
    };
    //属性値削除
    this.RemAttr = (key) => {
      if (!this._DataCheck(key)) return this;
      const ans = key.split(",");
      this.EachElem(elem => ans.forEach(v => elem.removeAttribute(v)));
      return this;
    };
    //格納エレメント返却
    this.Elem = () => this._Data;

    //子要素の一致するクラスをセレクタに設定する。
    this.Search = (value) => {
      if (!this._DataCheck(value) && this._Length === 0) return this;
      let ary = [];
      const parent = this._Data.children;
      for (let i = 0; i < parent.length; i++) 
        if (parent[i].classList.contains(value)) ary.push(cld);
      
      if (ary.length === 1) {
        this._Data = ary[0];
        this._Length = 0;
        this._ChildCount = -1;
      } else {
        this._Data = ary;
        this._Length = ary.length - 1;
      }
      return this;
    };
    //子要素を全て削除する、セレクターが単一要素時のみ。
    this.RemChild = () => {
      if (this._Length !== 0) return this;
      this.Html("");
      return this;
    };
    //InputのValue値を取得または設定
    this.InpText = (value = null) => {
      if (this._Length < 0) return this;
      let ary = [];
      this.EachElem((elem, i) => {
        if (value === null) ary.push(elem.value)
        else {
          if (typeof value !== "object") elem.value = value
          else elem.value = value[i];
        }
      })
      return value !== null ? this : ary.length === 1 ? ary[0] : ary;
    };
    return this;
  }

  //値が適性かチェック
  _DataCheck = (value) => {
    return typeof value === "string" && this._Length >= 0 ? true : false;
  };
  //生成要素をJudeyParentとして扱う
  static $Element = (Tag, Id = "", Class = "") => {
    const elem = document.createElement(Tag);
    const func = this.$elem(elem);
    return func.Id(Id).Class(Class);
  };
  //要素生成
  static Element = (Tag, Id = "", Class = "") => {
    return Judey.$Element(Tag, Id, Class).Elem();
  };
  /**指定：要素の直前に挿入 */
  static Before = "beforeBegin";
  /**指定：要素内の一番最初に挿入 */
  static InsertFirst = "afterBegin";
  /**指定：要素内の最後尾に挿入 */
  static InsertLast = "beforeEnd";
  /**指定：要素の直後に挿入 */
  static After = "afterEnd";
  //イベント実行部分
  _Touch = ($Target, Method, X, Y, LifeTime, IsCompleteRem, Mode = null) => {
    $Target.Event("touchstart", work);
    function work(){
      
      let Move_X = 0;
      let Move_Y = 0;
      let IsComplete = false;
      const LifeStart = Date.now();
      const LifeEnd = LifeStart + LifeTime;
      let IsActive_move = true;
      let IsActive_end = true;
      const IsScrollX = X === 0 ? false : X > 0 ? "up" : "down";
      const IsScrollY = Y === 0 ? false : Y > 0 ? "up" : "down";
      let CompMoveValue_X = 0, CompMoveValue_Y = 0;

      //初期位置設定
      $Target.OnceEvent("touchmove", (e) => {
        e.preventDefault();
        Move_X = Math.trunc(e.targetTouches[0].screenX);
        Move_Y = Math.trunc(e.targetTouches[0].screenY);
      })
      
      $Target.OnceEvent("touchmove", MoveEvent);
      $Target.OnceEvent("touchend", EndEvent);

      setTimeout(RemMove, LifeTime);
      setTimeout(RemEnd, LifeTime);
            
      function CheckMove(event) {
        const Scrolls = event.targetTouches[0];
        const NowMove_X = Scrolls.screenX - Move_X;
        const NowMove_Y = Scrolls.screenY - Move_Y;
        
        const Row = (() => {
          return (IsScrollX === false ? true
            : (IsScrollX === "up")
              ? ( NowMove_X > X) ? true : false
              : (IsScrollX === "down")
                ? ( NowMove_X < X) ? true : false
                : false
          )
        })();
        const Column = (() => {
          return (IsScrollY === false ? true
            : (IsScrollY === "up")
              ? ( NowMove_Y > Y) ? true : false
              : (IsScrollY === "down")
                ? ( NowMove_Y < Y) ? true : false
                : false
          )
        })();
        if (Row === true && Column === true) {
          CompMoveValue_X = Mode === null ? Math.floor(NowMove_X)
            : Math.floor(NowMove_X) - CompMoveValue_X;
          CompMoveValue_Y = Mode === null ? Math.floor(NowMove_Y)
            : Math.floor(NowMove_Y) - CompMoveValue_Y;
          return true;
        }
        return false;
      }
      function MoveEvent(e) {
        IsActive_move = false;
        const NowLife = LifeEnd - Date.now();

        if (NowLife < 1) return;

        if (CheckMove(e)) {
          //Moveモード時は指定以上の移動後は毎回変化量を返却する。
          if (Mode === "Move") {
            Method($Target.Elem(), CompMoveValue_X, CompMoveValue_Y);
            $Target.OnceEvent("touchmove", MoveEvent);
          }
          if (Mode === null || IsComplete === false) {
            IsComplete = true;
            setTimeout(RemEnd, NowLife);//LifeTimeまで
          }
          return;
        } else {
          IsActive_move = true;
          setTimeout(() => $Target.OnceEvent("touchmove", MoveEvent), 50);
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
  }
}
