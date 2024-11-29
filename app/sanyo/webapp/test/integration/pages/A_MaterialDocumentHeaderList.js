sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'sanyo',
            componentId: 'A_MaterialDocumentHeaderList',
            contextPath: '/A_MaterialDocumentHeader'
        },
        CustomPageDefinitions
    );
});