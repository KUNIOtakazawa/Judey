'use strict'
class Judey{
    #Data = null;
    #Length = null;
    #Parent = null;
    #ChildCount = 0;

    static $id= function(Selecter){return new Judey(Selecter, 1)} 
    static $cls=function(Selecter){return new Judey(Selecter, 2)} 
    static $tag=function(Selecter){return new Judey(Selecter, 3)} 

    constructor(Selecter,SeachType){
        switch(SeachType){
            case 1 :
                this.#Data = document.getElementById(Selecter);
                this.#Length = !this.#Data ? -1 : 0;
                break;
            case 2 :
                this.#Data = document.getElementsByClassName(Selecter);
                break;
            case 3 :
                this.#Data = document.getElementsByTagName(Selecter);
                break;
            default : return;
        }
        if(SeachType !==1)this.#Length = this.#Data.length - 1;
        if(this.#Data.length === 0) return;
        if(SeachType > 1 && this.#Length == 0){
            this.#Data = this.#Data[0];
        }
        //ID設定 
        this.Id = (value)=>{
            if(!this.#DataCheck(value)) return this;
            if(this.#Length ===0)this.#Data.id = value 
            else{for(let i = 0;i <= this.#Length;i++){
                    this.#Data[i].id = value + (i+1);
                }
            }
            return this;
        }
        //クラス設定
        this.Class=(value)=>{
            if(!this.#DataCheck(value)) return this;
            if(this.#Length ===0)this.#Data.classList.add(value);
            else{for(let i = 0;i <= this.#Length;i ++){
                    this.#Data[i].classList.add(value);
                }
            }
            return this;
        }
        //属性値設定
        this.Attr=(key,value)=>{
            if(!this.#DataCheck(key) || typeof value !== "string") return this;
            if(this.#Length === 0)this.#Data.seAttribute(key,value)
            else{for(let i = 0;i <= this.#Length;i ++){
                    this.#Data[i].setAttribute(key,value);
                }
            }
            return this;
        }
        //子要素挿入、対象にセレクタ移行
        this.Child=(tag)=>{
            if(!this.#DataCheck(tag) && length !==0) return this;
            if(this.#Parent ===null){
                this.#Parent =this.#Data;
            }
            const elem = document.createElement(tag);
            this.#Data.appendChild(elem);
            this.#Data=null;
            this.#ChildCount +=1;
            this.#Data=elem;
            return this;
        }
        //参照セレクタの階層をひとつ戻す。単一要素以外では機能しない。
        this.Breaker=()=>{
            if(this.#ChildCount===0 || this.#Length!==0) return this;
            if(this.#ChildCount===1 || this.#ChildCount ===-1){
                this.#Data = this.#Parent;
                this.#ChildCount =0;
            }else{
                this.#Data = this.#Data.parentElement;
                this.#ChildCount -=1;
            }
            return this;
        }
        //InnerText
        this.Text=(value)=>{
            if(!this.#DataCheck(value)) return this;
            if(this.#Length === 0)this.#Data.innerText = value;
            else{for(let i = 0;i <= this.#Length;i ++){
                    this.#Data[i].innerText = value;
                }
            }
            return this;
        }
        //InnerHTML
        this.Html=(value)=>{
            if(!this.#DataCheck(value)) return this;
            if(this.#Length === 0)this.#Data.innerHTML = value;
            else{for(let i = 0;i <= this.#Length;i ++){
                    this.#Data[i].innerHTML = value;
                }
            }
            return this;
        }
        //イベント生成
        this.Event=(e,act)=>{
            if(!this.#DataCheck(e) || typeof act !=="function") return this;
            if(this.#Length === 0)this.#Data.addEventListener(e.act,false);
            else{for(let i = 0;i <= this.#Length;i ++){
                    this.#Data[i].addEventListener(e.act,false);
                }
            }
            return this;
        }
        //イベント削除
        this.RemEvent=(e,act)=>{
            if(!this.#DataCheck(e) || typeof act !=="function") return this;
            if(this.#Length === 0)this.#Data.removeEventListener(e.act,false);
            else{for(let i = 0;i <= this.#Length;i ++){
                    this.#Data[i].removeEventListener(e.act,false);
                }
            }
            return this;
        //クラス削除
        }
        //指定クラス削除
        this.RemClass=(value)=>{
            if(!this.#DataCheck(value)) return this;
            if(this.#Length ===0)this.#Data.classList.remove(value);
            else{for(let i = 0;i <= this.#Length;i ++){
                    this.#Data[i].classList.remove(value);
                }
            }
            return this;
        }
        //属性値削除
        this.RemAttr=(key)=>{
            if(!this.#DataCheck(key)) return this;
            if(this.#Length === 0)this.#Data.removeAttribute(key);
            else{for(let i = 0;i <= this.#Length;i ++){
                    this.#Data[i].removeAttribute(key);
                }
            }
            return this;
        }
        //格納エレメント返却
        this.Elem=()=>{return this.#Data};
        //子要素の一致するクラスをセレクタに設定する。
        this.Search=(value)=>{
            if(!this.#DataCheck(value) && this.#Length===0 ) return this;
            let ary = new Array();
            const parent = this.#Data.children;
            for(let i=0;i<parent.length;i++){
                const cld=parent[i];
                if(cld.classList.contains(value) ===true){
                    ary = ary.concat(cld);
                }
            }
            if(ary.length ===1){
                this.#Data =ary[0];
                this.#Length=0;
                this.#ChildCount=-1;
            }else{
                this.#Data = ary;
                this.#Length=ary.length-1;
            }
            return this;
        }
        return this;
    }
    //値が適性かチェック
    #DataCheck=(value)=>{
        return typeof value === "string" && 
            this.#Length >= 0 ? true : false ;
    }
}
