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

var domainName="www.whiletime.com";
// var domainName = "localhost:8080";
// 简约风格台历
var links = [];
// 木质台历
// var links = ['http://localhost:8080/wxshu/auto-print-cl-print.html?bookId=8af5535b5252f83f01525782179070d6'];
var casper = require("casper").create({
    verbose: true
});

casper.on("calendar.loaded", function(index) {
    // var author= document.querySelector("#author").value;// "Google"
    // this.echo(author);
    this.echo(index +"="+ this.getElementAttribute("#author", 'value')+"===网页加载完成，开始生成pdf====" + new Date());
    this.capture(index +this.getElementAttribute("#author", 'value')+"=="+ '.pdf');
    this.echo("<<<<<<<<<<<<叮咚" + index +this.getElementAttribute("#author", 'value') +"===pdf生成完成=====" + new Date());
});


casper.on("calendar.each", function(index) {

    casper.each(links, function(self, link, i) {
        casper.echo((i + 1) + '===开始加载台历网页=======' + new Date());
         casper.echo((i+1)+link);
        // 会把任务放在一个队里里
        self.thenOpen(link, function() {
            casper.page.viewportSize = {
                height: 1000,
                width: 1326
            };
            casper.page.paperSize = {
                format: 'A5',
                orientation: 'landscape',
                margin: '0'

            };

            this.emit("calendar.loaded", (i + 1));



        });
    });
});






// 一个用户一本书
casper.start('http://' + domainName + '/auto-print/admin.html#/route1', function() {

    // 减去逗号
    var urlsFromWebString = this.getHTML('#print-calendars').replace(/&amp;/g, "&");
    urlsFromWebString = urlsFromWebString.substring(0, urlsFromWebString.length - 1);
    var urlsFromWeb = urlsFromWebString.split(',');
    links = urlsFromWeb;

    this.echo("~~~~~~~~~~~~~~~~~~~~台历用户,共" + links.length + '个用户');


    this.emit("calendar.each");

});





casper.run();