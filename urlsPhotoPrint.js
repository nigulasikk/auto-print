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
var links = ['http://localhost:8080/wxshu/auto-print-pt-print20X20.html?bookId=8af5535b5289edef01529b935c1c7994','http://localhost:8080/wxshu/auto-print-pt-print20X20.html?bookId=8a28ce935289ee750152984374ac0af9'];
var casper = require("casper").create({
    verbose: true,
    loadImages:true
});

casper.on("photo.loaded", function(index) {
    

    this.echo(index +this.getHTML('.text-cover')+ "===网页准备完成，开始生成pdf====" + new Date());
    this.capture(index +  this.getHTML('.nick-name')+ '.pdf');
    
    this.echo("<<<<<<<<<<<<叮咚" +index +this.getHTML('.text-cover')+ "===照片书pdf生成完成=====" + new Date());
});



casper.start().each(links, function(self, link, i) {
    casper.echo((i + 1) + '===开始加载网页=======' + new Date());
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
        console.log(this.getTitle());
        this.emit("photo.loaded", (i + 1));
        this.echo("等待20秒进入照片书打印。");
        this.wait(60000, function() {
        this.emit("photo.loaded", (i + 1));

    });


        // waitfor start
        // console.log(this.getTitle());
        //  casper.waitFor(function check() {
        //       return this.evaluate(function() {
        //           return this.getTitle() == "下载完成";
        //       });
        //   }, function then() { // step to execute when check() is ok
        //       this.emit("photo.loaded", (i + 1));

        //   }, function timeout() { // step to execute if check has failed
        //       this.echo("1分钟，没有等到下载完成").exit();
        //   },10000);

        // waitfor end
    });
});



casper.run();