## 生成均匀分布的贝塞尔曲线
------
```javascript
    uniformBezierPath(
        [[1,2]]//控制点
        1,//速度|每个点之间的间隔
        0.01//生成曲线的平滑程度[0,1]
    )
```

### 使用
------
### 1. ESModule
  ```javascript
    import {uniformBezierPath} from 'uniform-bezier.esm.js'
    function bezierStore() {
        const pos = points.map((p) => [p.x, p.y]);
        return uniformBezierPath(pos,1);//generator function
    }
    const p = store.next();
    //p:{value:{x:number,y:number},done:boolean}
  ```
### 2. browser
```html
    <script src='uniform-bezier.iife.js'>
    <script>
        var { uniformBezierPath } = uniformBezier;

    </script>
```