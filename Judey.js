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
  static $id = (Selector) => new Judey(Selector, 1, true);
  /**クラス検索で一致した要素をJudey要素に取り込む */
  static $cls = (Selector) => new Judey(Selector, 2, true);
  /**タグ検索で一致した要素をJudey要素に取り込む */
  static $tag = (Selector) => new Judey(Selector, 3, true);
  /**クエリ検索で一致した要素をJudey要素に取り込む */
  static $query = (Selector) => new Judey(Selector, 4, true);
  /**入力要素をJudey要素に取り込む */
  static $elem = (Selector) => new Judey(Selector, 0, true);
  /**Judey構文　getElementById */
  static id = (Selector) => new Judey(Selector, 1, false);
  /**Judey構文　getElementsByClassName */
  static cls = (Selector) => new Judey(Selector, 2, false);
  /**Judey構文　getElementsByTagName */
  static tag = (Selector) => new Judey(Selector, 3, false);
  /**Judey構文　querySelectorAll */
  static query = (Selector) => new Judey(Selector, 4, false);
  //生成要素をJudeyParentとして扱う
  static $Element = (Tag, Id = "", Class = "") => {
    const elem = document.createElement(Tag);
    const func = this.$elem(elem);
    return func.Id(Id).Class(Class);
  };
  //要素生成
  static Element = (Tag, Id = "", Class = "") => Judey.$Element(Tag, Id, Class).Elem();

  constructor(Selector, SearchType, ans) {
    const SetElement = (Target, ElemSelector, SearchTypeNum, IsReturnElem) => {
      try {
        let Length = 0;
        const Elem = (() => {
          switch (SearchTypeNum) {
            case 1: return Target.getElementById(ElemSelector);
            case 2: return Target.getElementsByClassName(ElemSelector);
            case 3: return Target.getElementsByTagName(ElemSelector);
            case 4: return Target.querySelectorAll(ElemSelector);
            case 0:
              if (ElemSelector?.tagName !== undefined) {
                Length = 0;
              } else {
                SearchTypeNum = 2;
              }
              return Selector;
          }
        })();

        if (SearchTypeNum < 2) {
          Length = Elem ? 0 : -1;
        } else {
          Length = Elem.length - 1;
        }

        if (IsReturnElem) {
          if (SearchTypeNum > 1 && Length === 0) return Elem[0];
          return Length > 0 ? Elem : null;
        }
                
        this._Data = (SearchTypeNum > 1 && Length === 0)
          ? Elem[0]
          : Elem;

        this._Length = Length;

        return this;
      } catch (e) {

        console.error(e);

        if (IsReturnElem) return null;

        this._Data = null;
        this._Length = -1;
        return this;
      }      
    } 
    
    const SetChildElement = (Selector, SearchTypeNum, ReturnElem) => {
      if (!DataCheck(Selector) || this._Length !== 0) return this;
      return SetElement(this._Data, Selector, SearchTypeNum,ReturnElem);   
    }

    /** valueが文字列型であるとこ、要素が1つ以上あること */
    const DataCheck  = (value) => {
      return typeof value === "string" && this._Length >= 0 ? true : false;
    };
    
    const ListnerOption = (EventName, Once = false, Capture = false) => {
      const IsTouch = EventName.includes("touch");
      const Result = {};
      if (Once) Result.once = true;
      if (IsTouch) Result.passive = true;
      if (Capture) Result.capture = true;
      return Result;
    };
    
    const EventBase = (EventName, Act, Option) => {
      if (!DataCheck(EventName) || typeof Act !== "function") return this;
      const ans = EventName.split(",");
      this.EachElem(elem =>
        ans.forEach(Event => elem.addEventListener(Event, Act, Option)));
      return this;
    }

    SetElement(document, Selector, SearchType, false);

    //false時は取得要素を返却して終了。
    if (ans === false) return this._Data;  
    
    this.$id = (Selector, ReturnElem = false) => SetChildElement(Selector, 1, ReturnElem);
    this.$cls = (Selector, ReturnElem = false) => SetChildElement(Selector, 2, ReturnElem);
    this.$tag = (Selector, ReturnElem = false) => SetChildElement(Selector, 3, ReturnElem);
    this.$query = (Selector, ReturnElem = false) => SetChildElement(Selector, 4, ReturnElem);
    this.$Nid = (Selector) => Judey.$elem(this.$id(Selector, true));
    this.$Ncls = (Selector) => Judey.$elem(this.$cls(Selector, true));
    this.$Ntag = (Selector) => Judey.$elem(this.$tag(Selector, true));
    this.$Nquery = (Selector) => Judey.$elem(this.$query(Selector, true));

    this.$Parent = (Selector, ReturnElem = false) => {
      if (!DataCheck(Selector) || this._Length !== 0) return this;
      return SetElement(null, this._Data.closest(Selector), 0, ReturnElem);
    }
    this.$NewParent = (Selector) => Judey.$elem(this.$Parent(Selector));

    /**要素に対して繰り返し処理を行う。 */
    this.EachElem = (func) => {
      if (this._Length === 0) {
        func(this._Data, 0);
        return true;
      } 
      for (let i = 0; i <= this._Length; i++){
        if (func(this._Data[i], i) === "Exit") return false;
      }
      return true;
    }
    //ID設定
    this.Id = (value) => {
      if (!DataCheck(value) || value === "") return this;
      this.EachElem((elem,i) => elem.id = i === 0 ? value : value + (i + 1));
      return this;
    };
    //クラス設定
    this.Class = (value) => {
      if (!DataCheck(value) || value === "") return this;
      const ans = value.split(",");
      this.EachElem(elem => ans.forEach(v => elem.classList.add(v)));
      return this;
    };
    //クラス設定(toggle)
    this.Toggle = (value) => {
      if (!DataCheck(value)) return this;
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
          console.error(error);
        }
      return this;
    };
    //スタイル設定
    this.Style = (value) => {
      if (!DataCheck(value)) return this;
      this.EachElem(elem => elem.style = value);
      return this;
    };
    //対象セレクタ直下に要素挿入
    //構文はJudey版insertAdjacent～
    //セレクタ移行は行わない。
    this.Append = (Element, PosisionName) => {
      if (Element == false || this._Length !== 0) return this;

      const SetArrayElem = (element) => {
        if (element?.constructor?.name === "HTMLCollection") {
          const TotalLen = element.length;
          for (let i = 0; i < TotalLen; i++)
            this._Data.insertAdjacentElement(PosisionName, element[0]);
        }
        if (element?.constructor?.name === "NodeList") {
          for (let i = 0; i <  element.length; i++)
            this._Data.insertAdjacentElement(PosisionName, element[i]);
        }
      }
      if (Element?.constructor?.name === "Judey") {
        if (Element._Length === 0) {
          this._Data.insertAdjacentElement(PosisionName, Element.Elem());
        }
        if (Element._Length > 0) {
          const Elem = Element.Elem();
          SetArrayElem(Elem);
        }
        return this;
      }
      if (["HTMLCollection", "NodeList"].includes(Element?.constructor?.name)) {
        SetArrayElem(Element);
      } else {
        Element.localName
          ? this._Data.insertAdjacentElement(PosisionName, Element)
          : this._Data.insertAdjacentHTML(PosisionName, Element);        
      }
      return this;
    }
    this.AppendLast = (Element) => this.Append(Element, Judey.InsertLast);
    this.AppendFirst = (Element) => this.Append(Element, Judey.InsertFirst);
    this.AppendBefore = (Element) => this.Append(Element, Judey.Before);
    this.AppendAfter = (Element) => this.Append(Element, Judey.After);

    //子要素挿入、対象にセレクタ移行
    this.Child = (tag , id = "", cls = "") => {
      if (!DataCheck(tag) && this._Length !== 0) return this;
      if (this._Parent === null) this._Parent = this._Data;
      
      const elem = document.createElement(tag);
      this._Data.appendChild(elem);
      this._Data = null;
      this._ChildCount += 1;
      this._Data = elem;
      return this.Id(id).Class(cls);
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
      if (value !== "") {
        this.EachElem((elem, i) => {
          if (elem.innerText !== (typeof value === "object" ? value[i] : value))
            elem.innerText = typeof value === "object" ? value[i] : value;
        })
      } else {
        if (this._Length > 0) {
          const Result = [];
          this.EachElem(elem => Result.push(elem.innerText));
          return Result;
        } else {
          return this._Data.innerText;
        }
      }
      return this;
    };
    //設定したプロパティ値を取得
    this.RetText = (PropartyName) => {
      if (!DataCheck(PropartyName)) return null;
      let e = [];
      this.EachElem(elem => e.push(elem[PropartyName]));
      return e.length === 1 ? e[0] : e.length > 1 ? e : null;
    };
    //InnerHTML
    this.Html = (value) => {
      if (!DataCheck(value)) return this;
      if (this._Length === 0) this._Data.innerHTML = value;
      return this;
    };
    /**フォーカスを設定する。 */
    this.Forcus = () => {
      try {
        if (this._Length !== 0) return this;
        this._Data.forcus();
        return this;
      } catch (error) {
        return this;
      }
    };
    /**フォーカスを取り除く */
    this.Blur = () => {
      try {
        if (this._Length !== 0) return this;
        this._Data.blur();
        return this;
      } catch (error) {
        return this;
      }
    };
    //イベント生成
    this.Event = (e, act) => EventBase(e, act, ListnerOption(e, false, false));
    this.OnceEvent = (e, act) => EventBase(e, act, ListnerOption(e, true, false));
    this.CaptureEvent = (e, act) => EventBase(e, act, ListnerOption(e, false, true));
    this.OnceCaptureEvent = (e, act) => EventBase(e, act, ListnerOption(e, true, true));

    this.Dispatch = (EventName) => {
      if (!DataCheck(EventName)) return this;
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
      if (!DataCheck(e) || typeof act !== "function") return this;
      const ans = e.split(",");
      this.EachElem(elem => {
        ans.forEach(Event => {
          elem.removeEventListener(Event, act, false);
          elem.removeEventListener(Event, act, { capture: true });
        });
      })
      return this;
    };
    //自要素削除
    this.Rem = () => {
      if (this._Length < 0) return this;
      if (this._Length === 0) this.EachElem(elem => elem.remove());
      if (this._Data?.constructor?.name === "NodeList") 
        for (let i = 0; i <= this._Length; i++) this._Data[i].remove();
      else
        while (this._Data.length > 0) this._Data[0].remove();
    };
    //指定クラス削除
    this.RemClass = (value) => {
      if (!DataCheck(value)) return this;
      const ans = value.split(",");
      this.EachElem(elem => ans.forEach(v => elem.classList.remove(v)));
      return this;
    };
    //属性値削除
    this.RemAttr = (key) => {
      if (!DataCheck(key)) return this;
      const ans = key.split(",");
      this.EachElem(elem => ans.forEach(v => elem.removeAttribute(v)));
      return this;
    };
    //格納エレメント返却
    this.Elem = () => this._Data;
    //length
    this.Len = () => this._Length;

    //子要素を全て削除する
    this.RemChild = () => {
      this.EachElem(elem => elem.innerHTML = "");
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
