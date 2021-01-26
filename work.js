class BilibiliRecommender {
    constructor(num, url) {
        // parameter
        this.RCMD_API_URL = url || 'https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=3';
        this.generateNum = num && num >= 10 && num % 10 === 0 ? num : 60;
        // style
        console.log(`RCMD_API_URL: ${this.RCMD_API_URL}`);
        console.log(`generateNum: ${this.generateNum}`);
        if (document.querySelector('#reportFirst1')) {
            document.querySelector('#reportFirst1').remove();
        }
        document.querySelector('.rcmd-box').style.width
            = document.querySelector('.rcmd-box').style.height = 'auto';
        let titleHeader = document.createElement('header');
        titleHeader.className = 'storey-title';
        titleHeader.innerHTML = '<div class="l-con"><svg aria-hidden="true" class="svg-icon"><use xlink:href="#bili-live"></use></svg><a href="#" target="_blank" class="name">推荐视频</a></div>';
        document.querySelector('.rcmd-box-wrap').prepend(titleHeader);
        // add more cards for recommended videos
        let currentCardNum = document.querySelectorAll('.video-card-reco').length;
        for (currentCardNum = 10; currentCardNum < this.generateNum + 10; ++currentCardNum) {
            document.querySelector(".rcmd-box").append(document.querySelector(".video-card-reco").cloneNode(true));
        }
        for (let i of Array.from(document.querySelectorAll(".video-card-reco"))) {
            i.style.display='block';
        }

        this.replaceRcmdVideo();
        document.querySelector('.change-btn').addEventListener('click', () => this.replaceRcmdVideo());
    }
    // TODO
    changeTotalVideoNum() {

    }
    async replaceRcmdVideo() {
        // TODO: unique
        let current = 10;
        for (let i = 0; i < this.generateNum / 10; ++i) {
            let videoJsonList = await this.getVideosList(1);
            let itemList = [];
            for (let i in videoJsonList) {
                itemList = itemList.concat(videoJsonList[i].data.item);
            }

            this.modifyRcmdBox(itemList, current, 10);
            current += 10;
        }
    }
    // fetch 10 videos everytime
    async getVideosList(times) {
        let allVideoList = [];
        for (let i = 0; i < times; ++i) {
            let currentVideoList = fetch(this.RCMD_API_URL, { method: "GET", credentials: "include" }).then(
                successResponse => {
                    if (successResponse.status != 200) {
                        return null;
                    } else {
                        return successResponse.json();
                    }
                },
                failResponse => {
                    return null;
                }
            );
            allVideoList.push(currentVideoList);
        }
        let results = await Promise.all(allVideoList);
        return results;
    }
    modifyRcmdBox(itemList, from, count) {
        let rcmdVideoCardList = document.querySelectorAll('.video-card-reco > .info-box');
        let current = 0;
        for (let i = from; current < count; ++current, ++i) {
            rcmdVideoCardList[i].querySelector('a').href = itemList[current].uri;
            rcmdVideoCardList[i].querySelector('img').src = itemList[current].pic.slice(5);
            rcmdVideoCardList[i].querySelector('img').alt
                = rcmdVideoCardList[i].querySelector('.info > p').title
                = rcmdVideoCardList[i].querySelector('.info > p').innerHTML
                = itemList[current].title;
            rcmdVideoCardList[i].querySelector('.info > p.up').innerHTML = '<i class="bilifont bili-icon_xinxi_UPzhu"></i>' + itemList[current].owner.name;
            rcmdVideoCardList[i].querySelector('.info > p.play').innerHTML = itemList[current].stat.view + '播放';
        }
    }
    static getInstance(num, url) {
        if (!this.instance) {
            this.instance = new BilibiliRecommender(num, url);
        }
        return this.instance;
    }
}

let blrd = BilibiliRecommender.getInstance();