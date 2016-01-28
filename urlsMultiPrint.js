/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-01-14 19:39:04
 * @version $Id$
 */

// var links = [
//     'http://localhost:8080/wxshu/auto-print-tl-printJump.html?bookId=8a28c8b05153b092015153bee9d90007',
//     'http://localhost:8080/wxshu/auto-print-printJump.html?bookId=ff80808151ebc1b20151ebcb319200ad',
//     'http://localhost:8080/wxshu/auto-print-tl-printJump.html?bookId=ff808081523444520152344e7a45027d',
//     'http://localhost:8080/wxshu/auto-print-tl-printJump.html?bookId=ff808081524329600152432b7beb0012'
// ];
// 'http://localhost:8080/wxshu/auto-print-pt-print20X20.html?bookId=8af5535b523788dd01523973a7b6056c'
// 'http://localhost:8080/wxshu/auto-print-tl-printByPageIndex.html?bookId=8af5535b52599c9901525ccec6eb1bc5', 
// 'http://localhost:8080/wxshu/auto-print-printByPageIndex.html?bookId=8af5535b52625561015262a5992b3c7a'
var links = ['http://localhost:8080/wxshu/auto-print-printByPageIndex.html?bookId=8af5535b52625561015262a5992b3c7a','http://localhost:8080/wxshu/auto-print-tl-printByPageIndex.html?bookId=8af5535b52599c9901525ccec6eb1bc5', 'http://localhost:8080/wxshu/auto-print-jn-printByPageIndex.html?bookId=8af5535b52579be00152598d90373988'];
var casper = require("casper").create({
    verbose: true
});

casper.on("printpage.loaded", function(index, sptIndex) {
    this.echo(index + '-' + sptIndex +  this.getHTML('.nick-name') + "===网页准备完成，开始生成pdf====" + new Date());
    this.capture(index + '-' + sptIndex +  this.getHTML('.nick-name')+ new Date() + '.pdf');
    this.echo(index + '-' + sptIndex + this.getHTML('.nick-name') + "===pdf生成完成=====" + new Date());
});



casper.start().each(links, function(self, link, i) {
    casper.page.viewportSize = {
        width: 796,
        height: 1126
    };
    casper.page.paperSize = {
        format: 'A5',
        orientation: 'portrait',
        margin: '0'

    };

    casper.echo((i + 1) + '===开始加载分页打印主页=======' + new Date()+"==="+link);
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
                this.echo("打开分页打印子页面" + this.getHTML('h2.feiye-name') + "===" + blink);
                this.emit("printpage.loaded", (i + 1), (bindex + 1));

            });
        });




    });
});



casper.run();