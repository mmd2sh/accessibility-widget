!function() {
    if (!window.isA11yModuleInited) { // FIX MODULE BUILDER RUN TWICE!!!
    window.isA11yModuleInited = true;
        
        // get current script tag to select siblings
        const currentScript = document.currentScript;
        $(document).ready(function() {
            $(currentScript).siblings('input').remove();
        });
        
        // define elements
        const parent = $(currentScript).parent();
        const wrap = $('.a11y-menu-wrap', parent);
        const box = $('.a11y-menu-box', wrap);
        const btn = $('.a11y-menu-btn', wrap);
        const close = $('.a11y-menu-box-close', wrap);
        // options
        const options = $('.a11y-options', wrap);
        const widgetPos = $('#a11y-widgetPos', options).val();
        const cornerMargin = $('#a11y-cornerMargin', options).val();
        const themeColor = $('#a11y-themeColor', options).val();
        const detailUrl = $('#a11y-detailUrl', options).val();
        const moduleId = $('#a11y-moduleId', options).val();
        
        if (detailUrl) {
            const pattern = /\/fa-IR\/([^\/]+)\/(\d+)\/ModuleViewer\/view\/(\d+)\/(\d+)/;
            const editUrl = detailUrl.replace(pattern, '/fa-IR/$1/$2/$3/Modules/ModuleViewer/Edit/$4');
            $('.a11y-menu-box-header', wrap).prepend(`<a class="a11y-menu-settings" href="${editUrl}"><i class="fal fa-cogs"></i></a>`);
        }

        // open & close box
        btn.on('click', () => box.toggleClass('box-active') );
        close.on('click', () => box.removeClass('box-active') );
        
        // set options
        wrap.addClass(`a11y-${widgetPos}`);
        wrap.css('--cornerMargin', cornerMargin + 'px');
        wrap.css('--themeColor', themeColor);
        
        // START A11Y CLASS FUNCTIONS 
        class A11yClass {
            constructor() {
                this.index = 0;
                this.modes = {
                    dark:   { fg: 'white',  bg: 'black' },
                    yellow: { fg: 'yellow', bg: 'black' },
                    cyan:   { fg: 'cyan',   bg: 'black' },
                    light:  { fg: 'black',  bg: 'white' }
                };
                this.styles = function(mode) {
                    return {
                        'color': mode?.fg ?? '',
                        'border-color': mode?.fg ?? '',
                        'background': mode?.bg ?? '',
                        'text-shadow': 'none',
                        'box-shadow': 'none'
                    }
                };
            }
            
            // store default props
            storeDefaultProps = (el) => {
                let { styles } = this;
                if (!el.defaultProps) el.defaultProps = {};
                
                Object.entries(styles()).forEach(([key, val]) => {
                    const prop = el.style.getPropertyValue(key);
                    
                    if (prop) {
                        el.defaultProps[key] = prop;
                    }
                })
            }
            
            contrast() {
                let { index, modes, styles, storeDefaultProps } = this;
                let modeKeys = Object.keys(modes);
                
                // Toggle class on <html> element for different contrast modes
                $('html').each(function() {
                    $(this).removeClass(modeKeys.map(m => `a11y-contrast-${m}`).join(' '));
                    
                    if (index >= 0) {
                        const key = modeKeys[index]
                        const cls = index === modeKeys.length ? '' : key;
                        cls && $(this).addClass(`a11y-contrast-${cls}`);
                    }
                });
                
                // Apply styles to all elements and store original styles if needed
                $('*').each(function(_, node) {
                    if (!node.defaultProps) storeDefaultProps(node);
                    
                    // Apply contrast styles
                    if (modes[modeKeys[index]]) {
                        let mode = modes[modeKeys[index]];

                        Object.entries(styles(mode))
                        .forEach(([key, val]) => {
                            node.style.setProperty(key, val, 'important');
                        });
                        
                    } else {
                        // Restore default styles
                        Object.keys(styles()).forEach((key) => {
                            let val = node.defaultProps[key];
                            
                            if (val) {
                                node.style.setProperty(key, val);
                            } else {
                                node.style.setProperty(key, '');
                            }
                        });
                        
                    }
                });
                
                // Cycle index to the next contrast mode
                this.index = (this.index + 1 === modeKeys.length) ? -1 : this.index + 1;
            }
        }
        
        window.a11y = new A11yClass();
        
    } // mb fix end if
}();
