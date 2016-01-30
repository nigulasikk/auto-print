/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-01-14 19:39:04
 * @version $Id$
 */

// 本地，线上打印配置
// var domainName="www.whiletime.com";
var domainName = "localhost:8080";
var printIndex = 0;
var links = [];
var casper = require("casper").create({
    verbose: true
});

casper.on("photo.loaded", function(index) {


    this.echo(index + this.getHTML('.text-cover') + "===网页准备完成，开始生成pdf====" + new Date());
    this.capture(index + this.getHTML('.text-cover') + '.pdf');
    this.echo("<<<<<<<<<<<<叮咚" + index + this.getHTML('.text-cover') + "===照片书pdf生成完成=====" + new Date());
});

// 遍历单本照片书打印逻辑
casper.on("photo.each", function() {
    casper.each(links, function(self, link, i) {
        casper.echo((i + 1) + '===开始加载网页=======' + new Date()+link);
        // 会把任务放在一个队里里
        self.thenOpen(link, function() {
            casper.page.viewportSize = {
                width: 796,
                height: 1126
            };
            casper.page.paperSize = {
                format: 'A4',
                orientation: 'portrait',
                margin: '0'
            };
            this.emit("photo.loaded", (i + 1));
            this.echo("等待60秒进入照片书打印。");
            this.wait(60000, function() {
                this.emit("photo.loaded", (i + 1));

            });

        });
    });


});



// 一个用户一本书
casper.start('http://' + domainName + '/auto-print/admin.html#/route1', function() {

    // 减去逗号
    var urlsFromWebString = this.getHTML('#print-photos').replace(/&amp;/g, "&");
    urlsFromWebString = urlsFromWebString.substring(0, urlsFromWebString.length - 1);
    var urlsFromWeb = urlsFromWebString.split(',');
    links = urlsFromWeb;

    this.echo("~~~~~~~~~~~~~~~~~~~~照片书,共" + links.length + '个用户');


    this.emit("photo.each");

});



casper.run();