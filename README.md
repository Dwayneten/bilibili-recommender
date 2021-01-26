# bilibili-recommender
bilibili 最近首页更新后出现了像移动端那样的视频推送

此脚本可以让 bilibil web 端主页生成更多推荐视频

![Result](bilibili.jpg)

## Usage

* 打开控制台

* 复制粘贴 work.js 里的代码

* 回车

```javascript
let blrd = BilibiliRecommender.getInstance([num]); // 可选参数 num: 增加显示的视频数，默认为 60，需为 10 的整数倍
```

