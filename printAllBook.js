/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-01-14 19:39:04
 * @version $Id$
 */

// 本地，线上打印配置
var domainName="www.whiletime.com";
// var domainName = "localhost:8080";
var printIndex = 0;
var links = [];
var casper = require("casper").create({
    verbose: true
});
// 单本打印
casper.on("printpage.loaded", function(index) {
    this.echo(index + this.getHTML('h2.feiye-name') + "===网页准备完成，开始生成pdf===" + new Date());
    this.capture(index + this.getHTML('h2.feiye-name') + new Date() + '.pdf');
    this.echo('<<<<<<<<<<<<叮咚'+index + this.getHTML('h2.feiye-name') + "===pdf生成完成===" + new Date());
});
// 多本打印
casper.on("printpage.loaded.multi", function(index, sptIndex) {
    this.echo(index + '-' + sptIndex + this.getHTML('h2.feiye-name') + "===网页准备完成，开始生成pdf====" + new Date());
    this.capture(index + '-' + sptIndex + this.getHTML('h2.feiye-name') + new Date() + '.pdf');
    this.echo('<<<<<<<<<<<<叮咚'+index + '-' + sptIndex + this.getHTML('h2.feiye-name') + "===pdf生成完成=====" + new Date());
});


casper.on("printEach", function() {

    casper.each(links, function(self, link, i) {
        casper.echo((i + 1) + '开始加载网页' + new Date());
        // 会把任务放在一个队里里
        self.thenOpen(link, function() {
            casper.page.viewportSize = {
                width: 796,
                height: 1126
            };
            casper.page.paperSize = {
                format: 'A5',
                orientation: 'portrait',
                margin: '0'

            };

            this.emit("printpage.loaded", (i + 1));
        });
    });

});


//遍历 一堆分页打印主页的链接
casper.on("startRoute", function() {
    casper.each(links, function(self, link, i) {
        // 一个用户分页打印多本书
        casper.page.viewportSize = {
            width: 796,
            height: 1126
        };
        casper.page.paperSize = {
            format: 'A5',
            orientation: 'portrait',
            margin: '0'

        };

        casper.echo((i + 1) + '..开始加载分页打印主页' + new Date() + "===" );
        // casper.echo((i + 1) + '开始加载分页打印主页' + new Date() + "===" + link);
        // 会把任务放在一个队里里
        // 单个分页打印主页
        self.thenOpen(link, function() {

            // this.capture('outLook.png');

            //一个用户 多本书 分页打印链接数组
            //去除末尾逗号
            var htmlStr = this.getHTML('.pageLinks').replace(/&amp;/g, "&");
            htmlStr = htmlStr.substring(0, htmlStr.length - 1);
            var splitPageLink = htmlStr.split(',');
            // 迭代每个分页打印的子页面
            casper.each(splitPageLink, function(bself, blink, bindex) {
                bself.thenOpen(blink, function() {
                    // this.echo("--打开分页打印子页面"+ "第" + blink+'个，' + this.getHTML('h2.feiye-name') );
                    this.echo("--打开分页打印子页面-" + this.getHTML('h2.feiye-name') );
                    this.emit("printpage.loaded.multi", (i + 1), (bindex + 1));

                });
            });

        });
    });

});

// 一个用户一本书
casper.start('http://' + domainName + '/auto-print/admin.html#/route1', function() {

    // 减去逗号
    var urlsFromWebString = this.getHTML('#print-urls-single-book').replace(/&amp;/g, "&");
    urlsFromWebString = urlsFromWebString.substring(0, urlsFromWebString.length - 1);
    var urlsFromWeb = urlsFromWebString.split(',');
    links = urlsFromWeb;

    this.echo("~~~~~~~~~~~~~~~~~~~~单用户单本书,共"+links.length+'个用户');


    this.emit("printEach");

});

// 一个用户多本书
casper.thenOpen('http://' + domainName + '/auto-print/admin.html#/route1', function() {

    // var urlsFromWeb = this.getHTML('#print-urls').split(',');
    // 减去逗号
    var urlsFromWebString = this.getHTML('#print-urls-multi-fenye-books').replace(/&amp;/g, "&");
    urlsFromWebString = urlsFromWebString.substring(0, urlsFromWebString.length - 1);
    var urlsFromWeb = urlsFromWebString.split(',');
    // var urlsFromWeb = this.getHTML('#print-urls').split(',');
    links = urlsFromWeb;
    this.echo("~~~~~~~~~~~~~~~~~~~~单用户多本书,共"+links.length+'个用户');

    this.emit("startRoute");

});


casper.run();