# Install

```js
npm install complexity2 -D
```

# Use

```js
const Complexity = require('complexity2');

// 3 为最大复杂度
const complex = new Complexity(3);

complex.calculate().then(res => {
  console.log({ res });
  // 3000 是端口号
  complex.showReports(3000);
});
```

【注意：谷歌浏览器配合JSON Viewer 查看结果】
