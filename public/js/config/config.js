seajs.config({
    alias: {
        'jquery': 'modules/sea-jquery',
        'datatable': 'modules/sea-jquery-datatable',
        'easing': 'modules/sea-jquery-easing',
        'blog': 'modules/blog',
        'common':'modules/common',
        'admin':'modules/bg',
        'bootstrap':'bootstrap.min'
    },
    preload:['jquery']
});