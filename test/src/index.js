var stateFlow = new StateFlow();
window.stateFlow = stateFlow;

stateFlow.addState('size', function (name) {
    var state = {
        val: '',
        defines: [{
            name: 'L'
        }, {
            name: 'XL'
        }, {
            name: 'XXL'
        }]
    };
    if (name != 'init') {
        state.val = this.getState('size').val;
    }
    if (name == 'color') {
        var color = this.getState('color');
        if (color.val == 'blue') {
            state.defines[2].disable = true;
            if (state.val == state.defines[2].name) state.val = '';
        }
    }
    return state;
});
stateFlow.addState('color', function (name) {
    console.log(name);
    var state = {
        val: '',
        defines: [{
            name: 'red'
        }, {
            name: 'green'
        }, {
            name: 'blue'
        }]
    };
    if (name != 'init') {
        state.val = this.getState('color').val;
    }
    if (name == 'size') {
        var size = this.getState(name);
        if (size.val == 'XL') {
            state.defines[1].disable = true;
            if (state.val == state.defines[1].name) state.val = '';
        }
    }
    return state;
});
stateFlow.addState('style', function (name) {
    var state = {
        val: '',
        defines: [{
            name: 'short'
        }, {
            name: 'long'
        }]
    }
    if (name == 'init') {
        return state;
    }
    var size = this.getState('size'),
        color = this.getState('color');

    state.val = this.getState('style').val;
    state.defines.forEach((item) => {
        if (size.val == 'L' && color.val == 'green') {
            if (item.name == 'short') {
                if (state.val == 'short') state.val = '';
                item.disable = true;
            }
        }
    });
    return state;
});
stateFlow.addStateDeps('size', ['color']);
stateFlow.addStateDeps('color', ['size']);
stateFlow.addStateDeps('style', ['color', 'size']);
class Size extends React.Component {
    constructor(props) {
        super(props);
        this.unlistener = stateFlow.subscribe(this._onChange.bind(this));
        this.state = this.getState();
    }
    getState() {
        return stateFlow.getState('size');
    }
    handleClick(e) {
        let name = e.target.name;
        stateFlow.dispatch('size', {
            val: name
        })
    }
    _onChange() {
        this.setState(this.getState());
    }
    render() {
        return <div className="mdui-row-xs-4">
            <form className="">
                {this.state.defines.map(item => {
                    return <div className="mdui-col">
                        <label className="mdui-radio">
                            <input type="radio" name={item.name} disabled={item.disable} checked={this.state.val == item.name} onChange={this.handleClick.bind(this)} />
                            <i className="mdui-radio-icon"></i>
                            {item.name}
                        </label>
                    </div>
                    // let cls = ['mdui-btn'];
                    // if (this.state.val == item.name) {
                    //     cls.push('mdui-btn-active')
                    // }
                    // return <button className={cls.join(' ')} disabled={item.disable} name={item.name} onClick={this.handleClick.bind(this)}>{item.name}</button>
                })}
            </form>
        </div>
    }
};
class Color extends React.Component {
    constructor(props) {
        super(props);
        this.unlistener = stateFlow.subscribe(this._onChange.bind(this));
        this.state = this.getState();
    }
    getState() {
        return stateFlow.getState('color');
    }
    _onChange() {
        this.setState(this.getState());
    }
    componentWillUnmount() {
        this.unlistener();
        this.unlistener = null;
    }
    handleClick(e) {
        let name = e.target.name;
        stateFlow.dispatch('color', {
            val: name
        })
    }
    render() {
        return <div className="mdui-row-xs-4">
            <form className="">
                {this.state.defines.map(item => {
                    return <div className="mdui-col">
                        <label className="mdui-radio">
                            <input type="radio" name={item.name} disabled={item.disable} checked={this.state.val == item.name} onChange={this.handleClick.bind(this)} />
                            <i className="mdui-radio-icon"></i>
                            {item.name}
                        </label>
                    </div>
                    // let cls = ['mdui-btn'];
                    // if (this.state.val == item.name) {
                    //     cls.push('mdui-btn-active')
                    // }
                    // return <button className={cls.join(' ')} disabled={item.disable} name={item.name} onClick={this.handleClick.bind(this)}>{item.name}</button>
                })}
            </form>
        </div>
    }
}
class Style extends React.Component {
    constructor(props) {
        super(props);
        this.unlistener = stateFlow.subscribe(this._onChange.bind(this));
        this.state = this.getState();
    }
    getState() {
        return stateFlow.getState('style');
    }
    _onChange() {
        this.setState(this.getState());
    }
    componentWillUnmount() {
        this.unlistener();
        this.unlistener = null;
    }
    handleClick(e) {
        let name = e.target.name;
        stateFlow.dispatch('style', {
            val: name
        })
    }
    render() {
        return <div className="mdui-row-xs-4">
            <form className="">
                {this.state.defines.map(item => {
                    return <div className="mdui-col">
                        <label className="mdui-radio">
                            <input type="radio" name={item.name} disabled={item.disable} checked={this.state.val == item.name} onChange={this.handleClick.bind(this)} />
                            <i className="mdui-radio-icon"></i>
                            {item.name}
                        </label>
                    </div>
                    // let cls = ['mdui-btn'];
                    // if (this.state.val == item.name) {
                    //     cls.push('mdui-btn-active')
                    // }
                    // return <button className={cls.join(' ')} disabled={item.disable} name={item.name} onClick={this.handleClick.bind(this)}>{item.name}</button>
                })}
            </form>
        </div>
    }
}
class Price extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            price: 0
        };
        this.cancelPriceCompute = stateFlow.compute('price', ['size', 'color', 'style'], (size, color, style) => {
            setTimeout(() => {
                if (size.val && color.val && style.val) {
                    let price = 100;
                    if (size.val == 'L' && color.val == 'blue' && style.val == 'short') {
                        price = 80;
                    }
                    this.setState({
                        price
                    });
                } else {
                    this.setState({
                        price: 0
                    })
                }
            }, 1000);
        });
    }
    componentWillUnmount() {
        this.cancelPriceCompute();
    }
    render() {
        return (
            <div className="mdui-row">
                <div className="mdui-col-xs-3 mdui-col-offset-xs-7">
                    <div className="mdui-chip">
                        <span className="mdui-chip-title">{this.state.price}元</span>
                    </div>
                </div>
            </div>
        );
    }
};
class Pannel extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div className="mdui-container">
            <Size />
            <Color />
            <Style />
            <Price />
        </div>
    }
}
stateFlow.subscribe(() => {
    console.log('all states ', stateFlow.getState());
});
ReactDOM.render(<Pannel />, document.getElementById('root'));