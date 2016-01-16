/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-01-14 19:39:04
 * @version $Id$
 */

var casper = require("casper").create();

casper.on("printpage.loaded", function(title) {
    this.echo(new Date() + "===网页加载完成，开始生成pdf=====昵称:" + this.getHTML('h2.feiye-name') + "=========网页title是 " + title);
    this.capture(this.getHTML('h2.feiye-name') + new Date() + '.pdf');
    this.echo(new Date() + "===pdf生成完成=====");
});

casper.echo(new Date() + '===开始加载网页=======');
casper.start("http://localhost:8080/wxshu/auto-print-tl-printBookNoPageNumber.html?bookId=8a28c8b05153b092015153bee9d90007", function() {
    //设置viwPort和papersize
    casper.page.viewportSize = {
        width: 796,
        height: 1126
    };
    casper.page.paperSize = {
        format: 'A5',
        orientation: 'portrait',
        margin: '0'

    };

    this.emit("printpage.loaded", this.getTitle());

});

casper.run();