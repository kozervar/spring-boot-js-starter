'use strict';

module.exports = {
    mainModuleNames: ['RoutingLine'],
    target: {
        dir : 'src/main/resources/static'
    },
    templates: {
        tempDir: 'build/grunt',
        dir:   'src/main/js/pagetemplates',
        target: 'src/main/resources/static'
    },
    release: {
        dir: 'src/main/resources/static'
    },
    appFiles: {
        js: [
            'src/main/js/application/**/<%= mainModuleNames %>.module.js',
            'src/main/js/application/**/<%= mainModuleNames %>.constants.js',
            'src/main/js/application/**/*.module.js',
            'src/main/js/application/**/*.controller.js',
            'src/main/js/application/**/*.js',
            '!src/main/js/application/**/*.spec.js'
        ],
        tests: [
            'src/main/js/application/**/*.spec.js'
        ],
        less: [
            'src/main/js/less/main.less'
        ],
        lessSrc: [
            'src/main/js/less/*.less'
        ],
        viewTemplates: [
            'src/main/js/application/**/*.tpl.html'
        ],
        resources: [
            'src/main/js/resources/**/*'
        ]
    },
    appVendorFiles: {
        js: [
            'src/main/js/vendor/es5-shim/es5-shim.min.js',
            'src/main/js/vendor/es5-shim/es5-sham.min.js',
            'src/main/js/vendor/jquery/dist/jquery.js',
            'src/main/js/vendor/angular/angular.js',
            'src/main/js/vendor/angular-bootstrap/ui-bootstrap.js',
            'src/main/js/vendor/angular-bootstrap/ui-bootstrap-tpls.js',
            'src/main/js/vendor/angular-ui-router/release/angular-ui-router.js',
            'src/main/js/vendor/angular-translate/angular-translate.js',
            'src/main/js/vendor/ag-grid/dist/angular-grid.js',
            'src/main/js/vendor/ng-lodash/build/ng-lodash.js',
            'src/main/js/vendor/moment/moment.js',
            'src/main/js/vendor/angular-moment/angular-moment.js'
        ],
        tests: [
            'src/main/js/vendor/angular-mocks/angular-mocks.js',
            '!src/main/js/vendor/ag-grid/dist/angular-grid.js'
        ],
        css: [

        ],
        resources: [
            'src/main/js/vendor/font-awesome/fonts/**/*',
            'src/main/js/vendor/angular-ui-grid/ui-grid.eot',
            'src/main/js/vendor/angular-ui-grid/ui-grid.ttf',
            'src/main/js/vendor/angular-ui-grid/ui-grid.woff',
            'src/main/js/vendor/angular-ui-grid/ui-grid.svg'
        ]
    }
};
