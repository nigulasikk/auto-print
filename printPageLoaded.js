/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-01-14 19:39:04
 * @version $Id$
 */

var casper = require("casper").create();

// //the clipRect is the portion of the page you are taking a screenshot of
// page.clipRect = { top: 0, left: 0, width: 1024, height: 768 };


// phantom.page.viewportSize = { width: 796, height: 5125 };

// listening to a custom event
casper.on("printpage.loaded", function(title) {
    this.echo("page title is " + title);
    this.capture('casper' + new Date() + '.pdf');


});

casper.start("http://localhost:8080/wxshu/printBookBackend.html?bookId=ff80808151ebc1b20151ebcb319200ad", function() {

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


    this.scrollToBottom();
    // casper.waitFor(function check() {
    //     return this.evaluate(function() {
    //         return document.querySelectorAll('title')[0].innerHTML == "下载完成";
    //     });
    // }, function then() { // step to execute when check() is ok
    //     this.emit("printpage.loaded", this.getTitle());

    // }, function timeout() { // step to execute if check has failed
    //     this.echo("I can't haz my screenshot.").exit();
    // });

});


casper.run();