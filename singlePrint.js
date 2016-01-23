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
var links = [];
var casper = require("casper").create({
    verbose: true
});

casper.on("printpage.loaded", function(index) {
    this.echo(index + this.getHTML('h2.feiye-name') + "===网页准备完成，开始生成pdf====" + new Date());
    this.capture(index + this.getHTML('h2.feiye-name') + new Date() + '.pdf');
    this.echo(index + this.getHTML('h2.feiye-name') + "===pdf生成完成=====" + new Date());
});

casper.on("printEach", function() {

    casper.each(links, function(self, link, i) {
        casper.echo((i + 1) + '===开始加载网页=======' + new Date());
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

casper.start('http://whiletime.com/auto-print/admin.html#/route1', function() {
   // 减去逗号
    var urlsFromWebString = this.getHTML('#print-urls-single-book').replace(/&amp;/g, "&");
    urlsFromWebString = urlsFromWebString.substring(0, urlsFromWebString.length - 1);
    var urlsFromWeb = urlsFromWebString.split(',');
    links = urlsFromWeb;

 

    this.emit("printEach");

});

casper.run();