/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-01-14 19:39:04
 * @version $Id$
 */

var links = [
    'http://localhost:8080/wxshu/auto-print-tl-printBookNoPageNumber.html?bookId=8a28c8b05153b092015153bee9d90007',
    'http://localhost:8080/wxshu/auto-print-printBook.html?bookId=ff80808151ebc1b20151ebcb319200ad',
    'http://localhost:8080/wxshu/auto-print-tl-printBook.html?bookId=ff808081523444520152344e7a45027d',
    'http://localhost:8080/wxshu/auto-print-tl-printBook.html?bookId=ff808081524329600152432b7beb0012'
];
var casper = require("casper").create({
    verbose: true
});

casper.on("printpage.loaded", function(title) {
    this.echo(this.getHTML('h2.feiye-name') + "===网页加载完成，开始生成pdf===="+new Date() );
    this.capture(this.getHTML('h2.feiye-name') + new Date() + '.pdf');
    this.echo(this.getHTML('h2.feiye-name')+ "===pdf生成完成====="+new Date());
});

casper.start().each(links, function(self, link) {
    casper.echo( '===开始加载网页======='+new Date());

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

        this.emit("printpage.loaded", this.getTitle());
    });
});

casper.run();