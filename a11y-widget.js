!function() {
    if (!window.isA11yModuleInited) { // FIX MODULE BUILDER RUN TWICE!!!
        window.isA11yModuleInited = true;
        
        const currentScript = document.currentScript;
        $(document).ready(function() {
            $(currentScript).siblings('input').remove();
        });
        
        const wrap = $(currentScript).siblings('.a11y-menu-wrap');
        const box = $('.a11y-menu-box', wrap);
        const btn = $('.a11y-menu-btn', wrap);
        const close = $('.a11y-menu-box-close', wrap);
        
        btn.on('click', function() {
            box.addClass('box-active');
        });
        
        close.on('click', function() {
            box.removeClass('box-active');
        });
        
    } // mb fix end if
}();
