requirejs.config({
    baseUrl: '../js',
    paths: {
        knockout: '../../libs/knockout'
    }
});

require(["KoBindings/main"], function (main) {

});