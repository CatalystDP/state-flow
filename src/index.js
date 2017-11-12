
var util = {
    is: function (obj, type) {
        return Object.prototype.toString.call(obj).replace(/\[|\]/g, '').substr(7).toLowerCase() === type;
    },
    isObject: function (obj) {
        return util.is(obj, 'object');
    },
    isArray: function (obj) {
        return util.is(obj, 'array');
    },
    isFunction: function (obj) {
        return util.is(obj, 'function');
    },
    extend: function (source) {
        for (var i = 1; i <= arguments.length; i++) {
            for (var key in arguments[i]) {
                source[key] = arguments[i][key];
            }
        }
        return source;
    }
};
function StateFlow(opts) {
    opts = opts || {};
    this.opts = opts;
    this._states = {};
    this._compute = {};
    this._computeDeps={};
    this._reducers = {};
    this._deps = {};
    this._listeners = [];
    this._isDispatching = false;
}
StateFlow.prototype = {
    constructor: StateFlow,
    getState: function (name) {
        if (!name) {
            return this._states;
        } else {
            return this._states[name] || {};
        }
    },
    _addDeps: function (deps, stateName) {
        //根据deps 添加到stateName的映射关系
        deps = deps || [];
        stateName = stateName || '';
        deps.forEach(function (dep) {
            if (this._states[dep]) {
                this._deps[dep].push(stateName);
            }
        }, this);
    },
    addStateDeps: function (stateName, deps) {
        this._addDeps(deps, stateName);
    },
    addState: function (name, reducer) {
        if (!name) return;
        if (this._states[name]) return;
        if (!util.isFunction(reducer)) return;
        this._reducers[name] = reducer;
        var initData = reducer.call(this,'init') || {};
        this._states[name] = initData;
        this._deps[name] = [];
    },
    compute:function(name,deps,reducer){
        if(!util.isArray(deps)||deps.length==0) return;
        if(!util.isFunction(reducer)) return;
        var _compute=this._compute[name]=this._compute[name]||{};
        _compute.deps=deps;
        _compute.reducer=reducer;
        return function uncompute() {
            delete this._compute[name];
        }.bind(this);
    },
    uncompute:function(name){
        
    },
    setState: function (name, data) {
        data = data || {};
        this._states[name] = util.extend({}, this._states[name], data);
    },
    subscribe(listener) {
        this._listeners.push(listener);
        return function unsubscribe() {
            var index = this._listeners.index(listener);
            if (index > -1) {
                this._listeners.splice(index, 1);
            }
        }.bind(this);
    },
    dispatch: function (name, data) {
        if (this._isDispatching) throw new Error('can not dispatch while dispatching');
        if (!this._states[name]) return;
        this._isDispatching = true;
        var map = {};
        this.setState(name, data);
        map[name] = true;
        //记录解析过的依赖防止环形依赖
        var records = {};//记录改变的状态
        var _parseDeps = function _parseDeps(key, deps) {
            deps.forEach(function (dep) {
                if (map[dep]) return;
                if (util.isFunction(this._reducers[dep])) {
                    this.setState(dep, this._reducers[dep].call(this, key));
                }
                map[dep] = true;
                _parseDeps.call(this, dep, this._deps[dep] || []);
            }, this);
        }.bind(this);
        _parseDeps(name, this._deps[name] || []);
        //通过record去触发计算状态
        var computeCollection=[];
        for(var c in this._compute){
            var _cDeps=this._compute[c].deps;
            for(var i=0,len=_cDeps.length;i<len;++i){
                if(map[_cDeps[i]]){
                    computeCollection.push(c);
                    break;
                }
            }
        }
        for(var i=0,len=computeCollection.length;i<len;++i){
            this._compute[computeCollection[i]].reducer.apply(this,
                (this._compute[computeCollection[i]].deps||[]).map(function(dep){
                    return this.getState(dep);
                },this)
            );     
        }
        for (var i = 0, len = this._listeners.length; i < len; ++i) {
            var listener = this._listeners[i];
            listener();
        }
        this._isDispatching = false;
    }
};
module.exports = StateFlow;